<template>
  <section class="section-space bg-stone-50" id="account">
    <div class="page-container">
      <div class="mb-8 flex items-start justify-between gap-4">
        <div>
          <p class="eyebrow">Личный кабинет</p>
          <h2 class="section-title">Управление прокатом</h2>
        </div>
        <button class="btn-outline" type="button" @click="$emit('close')">
          Закрыть
        </button>
      </div>

      <p
        v-if="browserDemo"
        class="mb-5 rounded-lg bg-amber-100 p-3 text-sm text-amber-900"
      >
        Демо-режим: данные хранятся только в этом браузере на этом устройстве.
      </p>

      <p
        v-if="message"
        class="mb-5 rounded-lg bg-green-100 p-3 text-sm text-brand"
        role="status"
      >
        {{ message }}
      </p>
      <p
        v-if="error"
        class="mb-5 rounded-lg bg-red-100 p-3 text-sm text-red-800"
        role="alert"
      >
        {{ error }}
      </p>

      <div
        v-if="!user"
        class="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-sm"
      >
        <div class="mb-5 flex flex-wrap gap-2">
          <button
            v-for="tab in authTabs"
            :key="tab.id"
            class="filter-button"
            :class="{ 'filter-active': authTab === tab.id }"
            type="button"
            @click="authTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
        <form class="space-y-3" @submit.prevent="submitAuth">
          <label class="form-label" for="account-email">Email</label>
          <input
            id="account-email"
            v-model.trim="email"
            class="form-field"
            type="email"
            autocomplete="email"
            required
          />
          <label
            v-if="authTab === 'recover'"
            class="form-label"
            for="recovery-code"
            >Код восстановления</label
          >
          <input
            v-if="authTab === 'recover'"
            id="recovery-code"
            v-model.trim="recoveryCode"
            class="form-field"
            required
          />
          <label class="form-label" for="account-password">{{
            authTab === "recover" ? "Новый пароль" : "Пароль"
          }}</label>
          <input
            id="account-password"
            v-model="password"
            class="form-field"
            type="password"
            minlength="8"
            required
          />
          <button class="btn-primary w-full" type="submit">
            {{
              authTab === "login"
                ? "Войти"
                : authTab === "register"
                  ? "Зарегистрироваться"
                  : "Сменить пароль"
            }}
          </button>
        </form>
        <p class="mt-4 text-sm text-stone-600">
          Первый зарегистрированный пользователь становится администратором.
          После регистрации сохраните код восстановления.
        </p>
      </div>

      <div v-else>
        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p class="text-sm">
            Вы вошли как <strong>{{ user.email }}</strong> ·
            {{ user.role === "admin" ? "администратор" : "пользователь" }}
          </p>
          <button
            class="text-sm font-bold text-brand underline"
            type="button"
            @click="logout"
          >
            Выйти
          </button>
        </div>

        <div class="mb-6 flex flex-wrap gap-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="filter-button"
            :class="{ 'filter-active': currentTab === tab.id }"
            type="button"
            @click="openTab(tab.id)"
          >
            {{ tab.name }}
          </button>
        </div>

        <div
          v-if="currentTab === 'items'"
          class="rounded-2xl bg-white p-5 shadow-sm"
        >
          <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h3 class="text-xl font-bold">Таблица вещей</h3>
            <button class="btn-primary" type="button" @click="openEditor()">
              Добавить вещь
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse text-left text-sm">
              <thead class="bg-cream">
                <tr>
                  <th class="p-3">Название</th>
                  <th class="p-3">Категория</th>
                  <th class="p-3">Цена за день</th>
                  <th class="p-3">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in items"
                  :key="item.id"
                  class="border-b border-stone-200"
                >
                  <td class="p-3">{{ item.name }}</td>
                  <td class="p-3">{{ item.category }}</td>
                  <td class="p-3">{{ money(item.price) }}</td>
                  <td class="p-3">
                    <button
                      class="mr-3 text-brand underline"
                      type="button"
                      @click="openEditor(item)"
                    >
                      Изменить</button
                    ><button
                      class="text-red-700 underline"
                      type="button"
                      @click="removeItem(item)"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
                <tr v-if="!items.length">
                  <td class="p-3 text-stone-500" colspan="4">
                    Пока нет записей.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-5 flex flex-wrap gap-3">
            <button
              class="btn-outline"
              type="button"
              :disabled="page === 1"
              @click="loadItems(page - 1)"
            >
              Назад
            </button>
            <span class="self-center text-sm"
              >Страница {{ page }} из {{ pageCount }}</span
            >
            <button
              class="btn-outline"
              type="button"
              :disabled="page >= pageCount"
              @click="loadItems(page + 1)"
            >
              Далее
            </button>
            <button
              class="btn-outline"
              type="button"
              :disabled="items.length >= total"
              @click="loadItems(page + 1, true)"
            >
              Загрузить ещё
            </button>
          </div>
        </div>

        <div
          v-if="currentTab === 'uploads'"
          class="rounded-2xl bg-white p-5 shadow-sm"
        >
          <h3 class="mb-3 text-xl font-bold">Загрузка Excel</h3>
          <p class="mb-4 text-sm text-stone-600">
            Первый лист: название, категория, цена за день. Первая строка —
            заголовки.
          </p>
          <div
            class="rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 p-8 text-center"
            @dragover.prevent
            @drop.prevent="onDrop"
          >
            <p class="mb-4">Перетащите файл .xlsx сюда</p>
            <label class="btn-outline cursor-pointer" for="excel-file"
              >Выбрать файл</label
            >
            <input
              id="excel-file"
              class="sr-only"
              type="file"
              accept=".xlsx"
              @change="onFileChange"
            />
          </div>
          <h4 class="mb-3 mt-7 font-bold">Загруженные файлы</h4>
          <ul class="space-y-2 text-sm">
            <li
              v-for="file in uploads"
              :key="file.id"
              class="flex justify-between gap-3 border-b border-stone-200 pb-2"
            >
              <span>{{ file.name }}</span><button
                class="text-red-700 underline"
                type="button"
                @click="removeUpload(file)"
              >
                Удалить файл
              </button>
            </li>
            <li v-if="!uploads.length" class="text-stone-500">
              Файлов пока нет.
            </li>
          </ul>
        </div>

        <div
          v-if="currentTab === 'logs' && user.role === 'admin'"
          class="rounded-2xl bg-white p-5 shadow-sm"
        >
          <h3 class="mb-4 text-xl font-bold">История действий</h3>
          <div class="mb-4 flex flex-wrap gap-3">
            <label
              >С
              <input v-model="logFrom" class="form-field" type="date" /></label
            ><label
              >По
              <input v-model="logTo" class="form-field" type="date" /></label
            ><button
              class="btn-outline self-center"
              type="button"
              @click="loadLogs"
            >
              Найти
            </button>
          </div>
          <div
            v-for="entry in logs"
            :key="entry.id"
            class="border-t border-stone-200 py-3 text-sm"
          >
            <p>
              <strong>{{ entry.action }}</strong> · {{ entry.email }} ·
              {{ date(entry.created_at) }}
            </p>
            <details class="mt-2">
              <summary class="cursor-pointer text-brand underline">
                До и после
              </summary>
              <div class="mt-2 grid gap-3 md:grid-cols-2">
                <pre class="overflow-x-auto rounded bg-stone-50 p-3">
До: {{ pretty(entry.before_data) }}</pre>
                <pre class="overflow-x-auto rounded bg-stone-50 p-3">
После: {{ pretty(entry.after_data) }}</pre>
              </div>
            </details>
          </div>
          <p v-if="!logs.length" class="text-sm text-stone-500">Записей нет.</p>
        </div>

        <div
          v-if="currentTab === 'users' && user.role === 'admin'"
          class="rounded-2xl bg-white p-5 shadow-sm"
        >
          <h3 class="mb-4 text-xl font-bold">Пользователи и роли</h3>
          <div
            v-for="person in users"
            :key="person.id"
            class="flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 py-3 text-sm"
          >
            <span>{{ person.email }}</span><select
              :value="person.role"
              class="form-field !mb-0 w-auto"
              :disabled="person.id === user.id"
              @change="changeRole(person, $event.target.value)"
            >
              <option value="user">Пользователь</option>
              <option value="admin">Администратор</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="editorOpen"
      class="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4"
      @click.self="editorOpen = false"
    >
      <form
        class="w-full max-w-md rounded-2xl bg-white p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Редактор вещи"
        @submit.prevent="saveItem"
      >
        <h3 class="mb-5 text-xl font-bold">
          {{ editId ? "Изменить вещь" : "Добавить вещь" }}
        </h3>
        <label class="form-label" for="edit-name">Название</label
        ><input
          id="edit-name"
          v-model.trim="editForm.name"
          class="form-field"
          required
        />
        <label class="form-label" for="edit-category">Категория</label
        ><input
          id="edit-category"
          v-model.trim="editForm.category"
          class="form-field"
          required
        />
        <label class="form-label" for="edit-price">Цена за день, Br</label
        ><input
          id="edit-price"
          v-model.number="editForm.price"
          class="form-field"
          type="number"
          min="0"
          step="0.01"
          required
        />
        <div class="flex gap-3">
          <button class="btn-primary" type="submit">Сохранить</button
          ><button
            class="btn-outline"
            type="button"
            @click="editorOpen = false"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>

    <div
      v-if="fileError"
      class="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4"
      @click.self="fileError = ''"
    >
      <div
        class="w-full max-w-sm rounded-2xl bg-white p-6"
        role="alertdialog"
        aria-modal="true"
        aria-label="Неверный формат файла"
      >
        <h3 class="text-xl font-bold">Неверный формат</h3>
        <p class="my-4">{{ fileError }}</p>
        <button class="btn-primary" type="button" @click="fileError = ''">
          Понятно
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import { demoApi } from "../demoApi.js";

export default {
  emits: ["close"],
  data() {
    return {
      token: localStorage.getItem("beri_token") || "",
      browserDemo: location.hostname.endsWith("github.io"),
      user: null,
      authTab: "login",
      currentTab: "items",
      email: "",
      password: "",
      recoveryCode: "",
      error: "",
      message: "",
      fileError: "",
      items: [],
      total: 0,
      page: 1,
      uploads: [],
      logs: [],
      users: [],
      logFrom: "",
      logTo: "",
      editorOpen: false,
      editId: null,
      editForm: { name: "", category: "", price: 0 },
    };
  },
  computed: {
    authTabs() {
      return [
        { id: "login", name: "Вход" },
        { id: "register", name: "Регистрация" },
        { id: "recover", name: "Восстановление" },
      ];
    },
    tabs() {
      const list = [
        { id: "items", name: "Вещи" },
        { id: "uploads", name: "Excel-файлы" },
      ];
      if (this.user?.role === "admin") {
        list.push({ id: "logs", name: "История" });
        list.push({ id: "users", name: "Админка" });
      }
      return list;
    },
    pageCount() {
      return Math.max(1, Math.ceil(this.total / 10));
    },
  },
  async mounted() {
    if (!this.token) return;
    try {
      this.user = await this.api("/me");
      await this.loadItems();
    } catch {
      this.token = "";
      localStorage.removeItem("beri_token");
    }
  },
  methods: {
    async api(url, options = {}) {
      if (this.browserDemo) {
        return demoApi(url, this.token, options);
      }
      const response = await fetch("/api/v1" + url, {
        ...options,
        headers: { Authorization: "Bearer " + this.token, ...options.headers },
      });
      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error(
          "Личный кабинет работает при локальном запуске сервера.",
        );
      }
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Ошибка запроса.");
      return result;
    },
    async submitAuth() {
      this.error = "";
      try {
        const result = await this.api("/" + this.authTab, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            recoveryCode: this.recoveryCode,
          }),
        });
        if (this.authTab === "recover") {
          this.message = "Пароль изменён. Теперь войдите.";
          this.authTab = "login";
          return;
        }
        this.token = result.token;
        this.user = result.user;
        localStorage.setItem("beri_token", this.token);
        this.message = result.recoveryCode
          ? "Ваш код восстановления: " +
            result.recoveryCode +
            ". Сохраните его."
          : "Вы вошли.";
        this.password = "";
        await this.loadItems();
      } catch (error) {
        this.error = error.message;
      }
    },
    async logout() {
      try {
        await this.api("/logout", { method: "POST" });
      } catch {}
      this.token = "";
      this.user = null;
      localStorage.removeItem("beri_token");
      this.message = "Вы вышли.";
    },
    async openTab(tab) {
      this.currentTab = tab;
      if (tab === "items") await this.loadItems();
      if (tab === "uploads") await this.loadUploads();
      if (tab === "logs") await this.loadLogs();
      if (tab === "users") await this.loadUsers();
    },
    async loadItems(page = 1, append = false) {
      try {
        const result = await this.api("/items?page=" + page + "&limit=10");
        this.items = append ? [...this.items, ...result.items] : result.items;
        this.total = result.total;
        this.page = page;
      } catch (error) {
        this.error = error.message;
      }
    },
    openEditor(item = null) {
      this.editId = item?.id || null;
      this.editForm = item
        ? { name: item.name, category: item.category, price: item.price }
        : { name: "", category: "", price: 0 };
      this.editorOpen = true;
    },
    async saveItem() {
      try {
        const url = this.editId ? "/items/" + this.editId : "/items";
        await this.api(url, {
          method: this.editId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.editForm),
        });
        this.editorOpen = false;
        this.message = "Запись сохранена.";
        await this.loadItems();
      } catch (error) {
        this.error = error.message;
      }
    },
    async removeItem(item) {
      if (!confirm("Удалить «" + item.name + "»?")) return;
      try {
        await this.api("/items/" + item.id, { method: "DELETE" });
        await this.loadItems();
      } catch (error) {
        this.error = error.message;
      }
    },
    onDrop(event) {
      this.uploadFile(event.dataTransfer.files[0]);
    },
    onFileChange(event) {
      this.uploadFile(event.target.files[0]);
      event.target.value = "";
    },
    async uploadFile(file) {
      if (!file) return;
      if (!file.name.toLowerCase().endsWith(".xlsx")) {
        this.fileError = "Подходит только файл Excel в формате .xlsx.";
        return;
      }
      const form = new FormData();
      form.append("file", file);
      try {
        const result = await this.api("/uploads", {
          method: "POST",
          body: form,
        });
        this.message = "Добавлено записей: " + result.added;
        await this.loadUploads();
        await this.loadItems();
      } catch (error) {
        this.fileError = error.message;
      }
    },
    async loadUploads() {
      try {
        this.uploads = await this.api("/uploads");
      } catch (error) {
        this.error = error.message;
      }
    },
    async removeUpload(file) {
      if (
        !confirm(
          "Удалить файл «" + file.name + "»? Записи останутся в таблице.",
        )
      )
        return;
      try {
        await this.api("/uploads/" + file.id, { method: "DELETE" });
        await this.loadUploads();
      } catch (error) {
        this.error = error.message;
      }
    },
    async loadLogs() {
      try {
        this.logs = await this.api(
          "/logs?from=" + this.logFrom + "&to=" + this.logTo,
        );
      } catch (error) {
        this.error = error.message;
      }
    },
    async loadUsers() {
      try {
        this.users = await this.api("/users");
      } catch (error) {
        this.error = error.message;
      }
    },
    async changeRole(person, role) {
      try {
        await this.api("/users/" + person.id + "/role", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        });
        await this.loadUsers();
      } catch (error) {
        this.error = error.message;
      }
    },
    pretty(value) {
      return value ? JSON.stringify(JSON.parse(value), null, 2) : "—";
    },
    money(value) {
      return (
        new Intl.NumberFormat("be-BY", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value) + " Br"
      );
    },
    date(value) {
      return new Date(value).toLocaleString("be-BY");
    },
  },
};
</script>
