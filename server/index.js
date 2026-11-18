import express from "express";
import multer from "multer";
import ExcelJS from "exceljs";
import { DatabaseSync } from "node:sqlite";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdirSync, readFileSync, unlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const storage = path.join(root, "storage");
const uploadDir = path.join(storage, "uploads");
mkdirSync(uploadDir, { recursive: true });

const db = new DatabaseSync(path.join(storage, "beri.sqlite"));
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    recovery TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user'
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS uploads (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    filename TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    before_data TEXT,
    after_data TEXT,
    created_at TEXT NOT NULL
  );
`);

const app = express();
app.use(express.json());

function hash(value, salt = randomBytes(16).toString("hex")) {
  return salt + ":" + scryptSync(value, salt, 64).toString("hex");
}

function matches(value, stored) {
  const [salt, saved] = stored.split(":");
  const actual = scryptSync(value, salt, 64);
  const expected = Buffer.from(saved, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function makeToken() {
  return randomBytes(32).toString("hex");
}

function fail(response, status, message) {
  response.status(status).json({ error: message });
}

function currentUser(request) {
  const token = request.headers.authorization?.replace("Bearer ", "");
  if (!token) return null;
  return db
    .prepare(
      `
    SELECT users.id, users.email, users.role
    FROM sessions JOIN users ON users.id = sessions.user_id
    WHERE sessions.token = ? AND sessions.expires > ?
  `,
    )
    .get(token, new Date().toISOString());
}

function requireUser(request, response, next) {
  request.user = currentUser(request);
  if (!request.user) return fail(response, 401, "Войдите в аккаунт.");
  next();
}

function requireAdmin(request, response, next) {
  if (request.user.role !== "admin")
    return fail(response, 403, "Доступ только для администратора.");
  next();
}

function log(userId, action, before, after) {
  db.prepare(
    `INSERT INTO logs (user_id, action, before_data, after_data, created_at)
    VALUES (?, ?, ?, ?, ?)`,
  ).run(
    userId,
    action,
    before ? JSON.stringify(before) : null,
    after ? JSON.stringify(after) : null,
    new Date().toISOString(),
  );
}

function issueSession(user) {
  const token = makeToken();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  db.prepare(
    "INSERT INTO sessions (token, user_id, expires) VALUES (?, ?, ?)",
  ).run(token, user.id, expires);
  return { token, user: { id: user.id, email: user.email, role: user.role } };
}

app.post("/api/v1/register", (request, response) => {
  const email = String(request.body.email || "")
    .trim()
    .toLowerCase();
  const password = String(request.body.password || "");
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
    return fail(response, 400, "Укажите email и пароль не короче 8 символов.");
  }
  if (db.prepare("SELECT id FROM users WHERE email = ?").get(email)) {
    return fail(response, 409, "Такой email уже зарегистрирован.");
  }
  const recoveryCode = randomBytes(6).toString("hex");
  const count = db.prepare("SELECT COUNT(*) AS total FROM users").get().total;
  const role = count === 0 ? "admin" : "user";
  const result = db
    .prepare(
      "INSERT INTO users (email, password, recovery, role) VALUES (?, ?, ?, ?)",
    )
    .run(email, hash(password), hash(recoveryCode), role);
  const user = { id: Number(result.lastInsertRowid), email, role };
  log(user.id, "register", null, user);
  response.status(201).json({ ...issueSession(user), recoveryCode });
});

app.post("/api/v1/login", (request, response) => {
  const email = String(request.body.email || "")
    .trim()
    .toLowerCase();
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !matches(String(request.body.password || ""), user.password)) {
    return fail(response, 401, "Неверный email или пароль.");
  }
  log(user.id, "login", null, { email });
  response.json(issueSession(user));
});

app.post("/api/v1/recover", (request, response) => {
  const email = String(request.body.email || "")
    .trim()
    .toLowerCase();
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  const password = String(request.body.password || "");
  if (
    !user ||
    !matches(String(request.body.recoveryCode || ""), user.recovery) ||
    password.length < 8
  ) {
    return fail(
      response,
      400,
      "Проверьте email, код восстановления и новый пароль.",
    );
  }
  db.prepare("UPDATE users SET password = ? WHERE id = ?").run(
    hash(password),
    user.id,
  );
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(user.id);
  log(user.id, "recover", null, { email });
  response.json({ ok: true });
});

app.get("/api/v1/me", requireUser, (request, response) =>
  response.json(request.user),
);

app.post("/api/v1/logout", requireUser, (request, response) => {
  const token = request.headers.authorization.replace("Bearer ", "");
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
  response.json({ ok: true });
});

app.get("/api/v1/items", requireUser, (request, response) => {
  const page = Math.max(1, Number(request.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(request.query.limit) || 10));
  const total = db.prepare("SELECT COUNT(*) AS total FROM items").get().total;
  const items = db
    .prepare("SELECT * FROM items ORDER BY id DESC LIMIT ? OFFSET ?")
    .all(limit, (page - 1) * limit);
  response.json({ items, page, total });
});

function validItem(body) {
  const name = String(body.name || "").trim();
  const category = String(body.category || "").trim();
  const price = Number(body.price);
  if (!name || !category || !Number.isFinite(price) || price < 0) return null;
  return { name, category, price };
}

app.post("/api/v1/items", requireUser, (request, response) => {
  const item = validItem(request.body);
  if (!item) return fail(response, 400, "Укажите название, категорию и цену.");
  const result = db
    .prepare(
      "INSERT INTO items (name, category, price, created_at) VALUES (?, ?, ?, ?)",
    )
    .run(item.name, item.category, item.price, new Date().toISOString());
  const saved = db
    .prepare("SELECT * FROM items WHERE id = ?")
    .get(result.lastInsertRowid);
  log(request.user.id, "create_item", null, saved);
  response.status(201).json(saved);
});

app.put("/api/v1/items/:id", requireUser, (request, response) => {
  const before = db
    .prepare("SELECT * FROM items WHERE id = ?")
    .get(request.params.id);
  if (!before) return fail(response, 404, "Запись не найдена.");
  const item = validItem(request.body);
  if (!item) return fail(response, 400, "Укажите название, категорию и цену.");
  db.prepare(
    "UPDATE items SET name = ?, category = ?, price = ? WHERE id = ?",
  ).run(item.name, item.category, item.price, before.id);
  const after = db.prepare("SELECT * FROM items WHERE id = ?").get(before.id);
  log(request.user.id, "update_item", before, after);
  response.json(after);
});

app.delete("/api/v1/items/:id", requireUser, (request, response) => {
  const before = db
    .prepare("SELECT * FROM items WHERE id = ?")
    .get(request.params.id);
  if (!before) return fail(response, 404, "Запись не найдена.");
  db.prepare("DELETE FROM items WHERE id = ?").run(before.id);
  log(request.user.id, "delete_item", before, null);
  response.json({ ok: true });
});

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.post(
  "/api/v1/uploads",
  requireUser,
  upload.single("file"),
  async (request, response) => {
    if (!request.file) return fail(response, 400, "Выберите файл Excel.");
    const name = request.file.originalname;
    if (!/\.xlsx$/i.test(name)) {
      unlinkSync(request.file.path);
      return fail(response, 400, "Подходит только файл .xlsx.");
    }
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(readFileSync(request.file.path));
      const sheet = workbook.worksheets[0];
      if (!sheet) throw new Error("В файле нет листов.");
      let added = 0;
      sheet.eachRow((row, number) => {
        if (number === 1) return;
        const item = validItem({
          name: row.getCell(1).text,
          category: row.getCell(2).text,
          price: row.getCell(3).value,
        });
        if (!item) return;
        const result = db
          .prepare(
            "INSERT INTO items (name, category, price, created_at) VALUES (?, ?, ?, ?)",
          )
          .run(item.name, item.category, item.price, new Date().toISOString());
        log(request.user.id, "import_item", null, {
          id: Number(result.lastInsertRowid),
          ...item,
        });
        added++;
      });
      db.prepare(
        "INSERT INTO uploads (name, filename, created_at) VALUES (?, ?, ?)",
      ).run(name, request.file.filename, new Date().toISOString());
      response.json({ added });
    } catch (error) {
      unlinkSync(request.file.path);
      fail(response, 400, "Не удалось прочитать Excel-файл.");
    }
  },
);

app.get("/api/v1/uploads", requireUser, (request, response) => {
  response.json(
    db
      .prepare("SELECT id, name, created_at FROM uploads ORDER BY id DESC")
      .all(),
  );
});

app.delete("/api/v1/uploads/:id", requireUser, (request, response) => {
  const file = db
    .prepare("SELECT * FROM uploads WHERE id = ?")
    .get(request.params.id);
  if (!file) return fail(response, 404, "Файл не найден.");
  unlinkSync(path.join(uploadDir, file.filename));
  db.prepare("DELETE FROM uploads WHERE id = ?").run(file.id);
  log(request.user.id, "delete_upload", file, null);
  response.json({ ok: true });
});

app.get("/api/v1/logs", requireUser, requireAdmin, (request, response) => {
  const page = Math.max(1, Number(request.query.page) || 1);
  const from = String(request.query.from || "");
  const to = String(request.query.to || "9999-12-31");
  const logs = db
    .prepare(
      `SELECT logs.*, users.email FROM logs
    JOIN users ON users.id = logs.user_id
    WHERE date(logs.created_at) >= ? AND date(logs.created_at) <= ?
    ORDER BY logs.id DESC LIMIT 20 OFFSET ?`,
    )
    .all(from, to, (page - 1) * 20);
  response.json(logs);
});

app.get("/api/v1/users", requireUser, requireAdmin, (request, response) => {
  response.json(
    db.prepare("SELECT id, email, role FROM users ORDER BY id").all(),
  );
});

app.put(
  "/api/v1/users/:id/role",
  requireUser,
  requireAdmin,
  (request, response) => {
    const user = db
      .prepare("SELECT id, email, role FROM users WHERE id = ?")
      .get(request.params.id);
    if (!user) return fail(response, 404, "Пользователь не найден.");
    if (user.id === request.user.id)
      return fail(response, 400, "Нельзя менять свою роль.");
    const role = request.body.role;
    if (!["user", "admin"].includes(role))
      return fail(response, 400, "Неверная роль.");
    db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, user.id);
    log(request.user.id, "change_role", user, { ...user, role });
    response.json({ ...user, role });
  },
);

const port = Number(process.env.PORT) || 3001;
app.use(express.static(path.join(root, "dist")));
app.use((request, response) => {
  if (request.path.startsWith("/api/")) {
    return fail(response, 404, "Адрес API не найден.");
  }
  response.sendFile(path.join(root, "dist", "index.html"));
});
app.listen(port, () => console.log(`API: http://localhost:${port}`));
