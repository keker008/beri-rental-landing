const key = "beri_demo_data";

function load() {
  const saved = localStorage.getItem(key);
  return saved
    ? JSON.parse(saved)
    : { users: [], sessions: [], items: [], uploads: [], logs: [] };
}

function save(data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function error(message) {
  throw new Error(message);
}

function nextId(list) {
  return Math.max(0, ...list.map((item) => item.id)) + 1;
}

function record(data, user, action, before, after) {
  data.logs.push({
    id: nextId(data.logs),
    user_id: user.id,
    email: user.email,
    action,
    before_data: before ? JSON.stringify(before) : null,
    after_data: after ? JSON.stringify(after) : null,
    created_at: new Date().toISOString(),
  });
}

async function digest(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function publicUser(user) {
  return { id: user.id, email: user.email, role: user.role };
}

function itemData(body) {
  const name = String(body.name || "").trim();
  const category = String(body.category || "").trim();
  const price = Number(body.price);
  if (!name || !category || !Number.isFinite(price) || price < 0) {
    error("Укажите название, категорию и цену.");
  }
  return { name, category, price };
}

export async function demoApi(url, token, options = {}) {
  const data = load();
  const method = options.method || "GET";
  const [route, query] = url.split("?");
  const parts = route.split("/").filter(Boolean);
  const params = new URLSearchParams(query || "");
  const body =
    options.body instanceof FormData
      ? options.body
      : JSON.parse(options.body || "{}");

  if (route === "/register" && method === "POST") {
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    if (
      !/^\S+@\S+\.\S+$/.test(email) ||
      String(body.password || "").length < 8
    ) {
      error("Укажите email и пароль не короче 8 символов.");
    }
    if (data.users.some((person) => person.email === email)) {
      error("Такой email уже зарегистрирован.");
    }
    const recoveryCode = crypto.randomUUID().slice(0, 8);
    const user = {
      id: nextId(data.users),
      email,
      password: await digest(body.password),
      recovery: await digest(recoveryCode),
      role: data.users.length === 0 ? "admin" : "user",
    };
    data.users.push(user);
    const session = crypto.randomUUID();
    data.sessions.push({ token: session, user_id: user.id });
    record(data, user, "register", null, publicUser(user));
    save(data);
    return { token: session, user: publicUser(user), recoveryCode };
  }

  if (route === "/login" && method === "POST") {
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const user = data.users.find((person) => person.email === email);
    if (
      !user ||
      user.password !== (await digest(String(body.password || "")))
    ) {
      error("Неверный email или пароль.");
    }
    const session = crypto.randomUUID();
    data.sessions.push({ token: session, user_id: user.id });
    record(data, user, "login", null, { email });
    save(data);
    return { token: session, user: publicUser(user) };
  }

  if (route === "/recover" && method === "POST") {
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const user = data.users.find((person) => person.email === email);
    if (
      !user ||
      user.recovery !== (await digest(String(body.recoveryCode || ""))) ||
      String(body.password || "").length < 8
    ) {
      error("Проверьте email, код восстановления и новый пароль.");
    }
    user.password = await digest(body.password);
    data.sessions = data.sessions.filter(
      (session) => session.user_id !== user.id,
    );
    record(data, user, "recover", null, { email });
    save(data);
    return { ok: true };
  }

  const session = data.sessions.find((entry) => entry.token === token);
  const user = data.users.find((person) => person.id === session?.user_id);
  if (!user) error("Войдите в аккаунт.");

  if (route === "/me") return publicUser(user);

  if (route === "/logout" && method === "POST") {
    data.sessions = data.sessions.filter((entry) => entry.token !== token);
    save(data);
    return { ok: true };
  }

  if (route === "/items" && method === "GET") {
    const page = Math.max(1, Number(params.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(params.get("limit")) || 10));
    const sorted = [...data.items].reverse();
    return {
      items: sorted.slice((page - 1) * limit, page * limit),
      page,
      total: sorted.length,
    };
  }

  if (route === "/items" && method === "POST") {
    const item = {
      id: nextId(data.items),
      ...itemData(body),
      created_at: new Date().toISOString(),
    };
    data.items.push(item);
    record(data, user, "create_item", null, item);
    save(data);
    return item;
  }

  if (parts[0] === "items" && parts.length === 2) {
    const index = data.items.findIndex((item) => item.id === Number(parts[1]));
    if (index < 0) error("Запись не найдена.");
    const before = { ...data.items[index] };
    if (method === "PUT") {
      data.items[index] = { ...before, ...itemData(body) };
      record(data, user, "update_item", before, data.items[index]);
      save(data);
      return data.items[index];
    }
    if (method === "DELETE") {
      data.items.splice(index, 1);
      record(data, user, "delete_item", before, null);
      save(data);
      return { ok: true };
    }
  }

  if (route === "/uploads" && method === "GET") {
    return [...data.uploads].reverse();
  }

  if (route === "/uploads" && method === "POST") {
    const file = body.get("file");
    if (!file || !file.name.toLowerCase().endsWith(".xlsx")) {
      error("Подходит только файл Excel в формате .xlsx.");
    }
    const { default: readXlsxFile } = await import("read-excel-file/browser");
    let rows;
    try {
      const sheets = await readXlsxFile(file);
      rows = Array.isArray(sheets[0]) ? sheets : sheets[0]?.data || [];
    } catch {
      error("Не удалось прочитать Excel-файл.");
    }
    let added = 0;
    for (const row of rows.slice(1)) {
      try {
        const values = itemData({
          name: row[0],
          category: row[1],
          price: row[2],
        });
        const item = {
          id: nextId(data.items),
          ...values,
          created_at: new Date().toISOString(),
        };
        data.items.push(item);
        record(data, user, "import_item", null, item);
        added++;
      } catch {
        continue;
      }
    }
    data.uploads.push({
      id: nextId(data.uploads),
      name: file.name,
      created_at: new Date().toISOString(),
    });
    save(data);
    return { added };
  }

  if (parts[0] === "uploads" && parts.length === 2 && method === "DELETE") {
    const index = data.uploads.findIndex(
      (file) => file.id === Number(parts[1]),
    );
    if (index < 0) error("Файл не найден.");
    const file = data.uploads.splice(index, 1)[0];
    record(data, user, "delete_upload", file, null);
    save(data);
    return { ok: true };
  }

  if (user.role !== "admin") error("Доступ только для администратора.");

  if (route === "/logs" && method === "GET") {
    const from = params.get("from") || "";
    const to = params.get("to") || "9999-12-31";
    return [...data.logs]
      .reverse()
      .filter((entry) => {
        const day = entry.created_at.slice(0, 10);
        return day >= from && day <= to;
      })
      .slice(0, 20);
  }

  if (route === "/users" && method === "GET") {
    return data.users.map(publicUser);
  }

  if (parts[0] === "users" && parts[2] === "role" && method === "PUT") {
    const person = data.users.find((entry) => entry.id === Number(parts[1]));
    if (!person) error("Пользователь не найден.");
    if (person.id === user.id) error("Нельзя менять свою роль.");
    if (!["user", "admin"].includes(body.role)) error("Неверная роль.");
    const before = publicUser(person);
    person.role = body.role;
    record(data, user, "change_role", before, publicUser(person));
    save(data);
    return publicUser(person);
  }

  error("Адрес не найден.");
}
