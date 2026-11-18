<template>
  <div>
    <header
      class="sticky top-0 z-50 border-b border-stone-200 bg-white/90 backdrop-blur-md"
    >
      <div
        class="page-container flex min-h-16 items-center justify-between gap-4"
      >
        <a
          href="#top"
          class="flex items-center gap-2 text-2xl font-extrabold tracking-tight"
          aria-label="Бери — на главную"
          ><span
            class="grid h-8 w-8 place-items-center rounded-lg bg-brand text-base text-white"
            >Б</span
          >
          бери<span class="-ml-2 text-coral">.</span></a
        >
        <nav
          class="hidden items-center gap-8 text-sm font-medium md:flex"
          aria-label="Основная навигация"
        >
          <a class="hover:text-leaf" href="#catalog">Каталог</a
          ><a class="hover:text-leaf" href="#features">Преимущества</a
          ><a class="hover:text-leaf" href="#reviews">Отзывы</a
          ><a class="hover:text-leaf" href="#pricing">Тарифы</a
          ><a class="hover:text-leaf" href="#questions">Вопросы</a>
        </nav>
        <div class="hidden items-center gap-3 sm:flex">
          <a class="btn-primary" href="#request">Оставить заявку</a>
          <button class="btn-outline" type="button" @click="openAccount">
            Личный кабинет
          </button>
        </div>
        <button
          class="rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold md:hidden"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          @click="menuOpen = !menuOpen"
        >
          {{ menuOpen ? "Закрыть" : "Меню" }}
        </button>
      </div>
      <nav
        v-if="menuOpen"
        id="mobile-menu"
        class="page-container flex flex-col gap-1 border-t border-stone-200 py-3 text-sm md:hidden"
        aria-label="Мобильная навигация"
      >
        <a
          class="rounded-lg px-2 py-2 hover:bg-cream"
          href="#catalog"
          @click="menuOpen = false"
          >Каталог</a
        ><a
          class="rounded-lg px-2 py-2 hover:bg-cream"
          href="#features"
          @click="menuOpen = false"
          >Преимущества</a
        ><a
          class="rounded-lg px-2 py-2 hover:bg-cream"
          href="#reviews"
          @click="menuOpen = false"
          >Отзывы</a
        ><a
          class="rounded-lg px-2 py-2 hover:bg-cream"
          href="#pricing"
          @click="menuOpen = false"
          >Тарифы</a
        ><a
          class="rounded-lg px-2 py-2 hover:bg-cream"
          href="#questions"
          @click="menuOpen = false"
          >Вопросы</a
        ><a
          class="rounded-lg px-2 py-2 font-bold text-brand hover:bg-cream"
          href="#request"
          @click="menuOpen = false"
          >Оставить заявку</a
        >
        <button
          class="rounded-lg px-2 py-2 text-left font-bold text-brand hover:bg-cream"
          type="button"
          @click="openAccount"
        >
          Личный кабинет
        </button>
      </nav>
    </header>

    <main id="top">
      <section class="overflow-hidden bg-cream">
        <div
          class="page-container grid items-center gap-8 py-16 md:min-h-[560px] md:grid-cols-2 md:py-20"
        >
          <div>
            <p class="eyebrow">Прокат вещей на нужный срок</p>
            <h1
              class="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-stone-900 sm:text-5xl lg:text-6xl"
            >
              Нужная вещь <span class="text-leaf">без лишней покупки</span>
            </h1>
            <p
              class="mt-6 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg"
            >
              Велосипед на выходные, проектор для вечера или инструмент для
              ремонта. Выбирайте и пользуйтесь столько, сколько нужно.
            </p>
            <div class="mt-8 flex flex-wrap gap-3">
              <a class="btn-primary" href="#catalog"
                >Смотреть каталог <span aria-hidden="true">↗</span></a
              ><a class="btn-outline" href="#how"
                >Как это работает <span aria-hidden="true">→</span></a
              >
            </div>
            <p class="mt-8 text-sm text-stone-600">
              <span class="mr-1 font-bold text-leaf">✓</span> Простой выбор и
              понятная цена за день
            </p>
          </div>
          <div
            class="relative mx-auto h-72 w-full max-w-lg sm:h-96"
            role="img"
            aria-label="Велосипед, камера и проектор для проката"
          >
            <div class="hero-orbit"></div>
            <div class="hero-tile tile-bike">🚲</div>
            <div class="hero-tile tile-camera">📷</div>
            <div class="hero-tile tile-projector">📽️</div>
            <div
              class="absolute bottom-4 left-0 -rotate-6 rounded-full bg-coral px-4 py-2 text-xs font-bold text-white sm:left-4"
            >
              Выбирай. Бери. Пользуйся.
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="section-space scroll-mt-20">
        <div class="page-container">
          <p class="eyebrow">Преимущества</p>
          <h2 class="section-title">Прокат для ваших планов</h2>
          <div class="mt-9 grid gap-5 md:grid-cols-3">
            <article class="info-card">
              <div class="mb-5 text-4xl" aria-hidden="true">🧩</div>
              <h3 class="mb-2 text-xl font-bold">Выбор под задачу</h3>
              <p class="text-sm leading-relaxed text-stone-600">
                Берите вещь для конкретного события, поездки или небольшого
                ремонта.
              </p>
            </article>
            <article class="info-card">
              <div class="mb-5 text-4xl" aria-hidden="true">📆</div>
              <h3 class="mb-2 text-xl font-bold">Удобный срок</h3>
              <p class="text-sm leading-relaxed text-stone-600">
                Укажите даты в заявке и пользуйтесь вещью тогда, когда она
                нужна.
              </p>
            </article>
            <article class="info-card">
              <div class="mb-5 text-4xl" aria-hidden="true">💬</div>
              <h3 class="mb-2 text-xl font-bold">Понятные шаги</h3>
              <p class="text-sm leading-relaxed text-stone-600">
                Выберите товар, заполните заявку и договоритесь о получении.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="catalog" class="section-space scroll-mt-20 bg-stone-50">
        <div class="page-container">
          <p class="eyebrow">Каталог</p>
          <div class="flex flex-wrap items-end justify-between gap-4">
            <h2 class="section-title">Популярные вещи</h2>
            <p class="text-sm text-stone-600">
              Для спонтанных планов и больших идей.
            </p>
          </div>
          <div class="mt-8 flex flex-wrap gap-2" aria-label="Фильтр каталога">
            <button
              v-for="category in categories"
              :key="category"
              type="button"
              class="filter-button"
              :class="{ 'filter-active': selectedCategory === category }"
              :aria-pressed="selectedCategory === category"
              @click="selectedCategory = category"
            >
              {{ category }}
            </button>
          </div>
          <div
            class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <article
              v-for="item in filteredItems"
              :key="item.id"
              class="product-card"
            >
              <div
                class="grid aspect-square place-items-center text-7xl"
                :class="item.color"
                role="img"
                :aria-label="item.name"
              >
                {{ item.emoji }}
              </div>
              <div class="p-5">
                <p
                  class="text-xs font-bold uppercase tracking-widest text-leaf"
                >
                  {{ item.category }}
                </p>
                <h3 class="mt-2 text-lg font-bold">{{ item.name }}</h3>
                <p class="mt-2 min-h-10 text-sm leading-relaxed text-stone-600">
                  {{ item.description }}
                </p>
                <div
                  class="mt-5 flex items-center justify-between gap-2 border-t border-stone-200 pt-4"
                >
                  <span class="font-bold"
                    >от {{ formatPrice(item.price) }}
                    <small class="font-normal text-stone-500"
                      >/ день</small
                    ></span
                  ><button
                    class="text-sm font-bold text-brand hover:underline"
                    type="button"
                    :aria-label="'Выбрать ' + item.name"
                    @click="chooseItem(item)"
                  >
                    Выбрать ↗
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="bg-white px-4 py-10 sm:px-6" aria-label="Рекламный блок">
        <AdSlot size="banner" />
      </section>

      <section id="how" class="section-space scroll-mt-20">
        <div class="page-container">
          <p class="eyebrow">Всё просто</p>
          <h2 class="section-title">Как это работает</h2>
          <div class="mt-9 grid gap-5 md:grid-cols-3">
            <article class="info-card">
              <span class="text-sm font-bold text-leaf">01</span>
              <div class="my-4 text-4xl" aria-hidden="true">🔎</div>
              <h3 class="mb-2 text-xl font-bold">Выберите вещь</h3>
              <p class="text-sm leading-relaxed text-stone-600">
                Посмотрите каталог и найдите то, что пригодится для ваших
                планов.
              </p>
            </article>
            <article class="info-card">
              <span class="text-sm font-bold text-leaf">02</span>
              <div class="my-4 text-4xl" aria-hidden="true">📝</div>
              <h3 class="mb-2 text-xl font-bold">Оставьте заявку</h3>
              <p class="text-sm leading-relaxed text-stone-600">
                Укажите вещь, срок проката и контакты в форме.
              </p>
            </article>
            <article class="info-card">
              <span class="text-sm font-bold text-leaf">03</span>
              <div class="my-4 text-4xl" aria-hidden="true">✨</div>
              <h3 class="mb-2 text-xl font-bold">Пользуйтесь</h3>
              <p class="text-sm leading-relaxed text-stone-600">
                Договоритесь о получении вещи и верните её по окончании срока.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="reviews" class="section-space scroll-mt-20 bg-cream">
        <div class="page-container">
          <p class="eyebrow">Отзывы</p>
          <h2 class="section-title">Для разных случаев</h2>
          <p class="mt-3 text-sm text-stone-600">
            Примеры того, когда вещь напрокат оказывается кстати.
          </p>
          <div
            class="mt-9 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5"
          >
            <article
              class="min-w-[85%] snap-center rounded-2xl bg-white p-7 shadow-sm sm:min-w-[45%] lg:min-w-[31%]"
            >
              <div class="mb-5 text-2xl" aria-hidden="true">🚲</div>
              <blockquote class="text-lg font-semibold leading-relaxed">
                «Велосипед на выходные — хорошая идея для прогулки без покупки
                своего».
              </blockquote>
              <p class="mt-5 text-sm text-stone-500">Прогулка по городу</p>
            </article>
            <article
              class="min-w-[85%] snap-center rounded-2xl bg-white p-7 shadow-sm sm:min-w-[45%] lg:min-w-[31%]"
            >
              <div class="mb-5 text-2xl" aria-hidden="true">📽️</div>
              <blockquote class="text-lg font-semibold leading-relaxed">
                «Проектор пригодится для одного уютного вечера с фильмом».
              </blockquote>
              <p class="mt-5 text-sm text-stone-500">Домашний киносеанс</p>
            </article>
            <article
              class="min-w-[85%] snap-center rounded-2xl bg-white p-7 shadow-sm sm:min-w-[45%] lg:min-w-[31%]"
            >
              <div class="mb-5 text-2xl" aria-hidden="true">🛠️</div>
              <blockquote class="text-lg font-semibold leading-relaxed">
                «Инструмент нужен на пару дней, пока идёт небольшой ремонт».
              </blockquote>
              <p class="mt-5 text-sm text-stone-500">Домашние дела</p>
            </article>
          </div>
        </div>
      </section>

      <section id="pricing" class="section-space scroll-mt-20">
        <div class="page-container">
          <p class="eyebrow">Сроки проката</p>
          <h2 class="section-title">Выберите удобный вариант</h2>
          <p class="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">
            Стоимость зависит от выбранной вещи. В каталоге указана цена за
            день.
          </p>
          <div class="mt-9 grid gap-5 md:grid-cols-3">
            <article class="info-card flex flex-col">
              <p class="text-sm font-bold text-leaf">На день</p>
              <h3 class="mt-2 text-2xl font-bold">Для одного события</h3>
              <p class="mt-4 flex-1 text-sm leading-relaxed text-stone-600">
                Попробуйте новую вещь или возьмите её на короткое мероприятие.
              </p>
              <a class="btn-outline mt-6" href="#request">Выбрать даты</a>
            </article>
            <article
              class="flex flex-col rounded-2xl border-2 border-brand bg-cream p-6 shadow-lg md:-translate-y-2"
            >
              <span
                class="mb-3 w-fit rounded-full bg-brand px-3 py-1 text-xs font-bold text-white"
                >Популярный вариант</span
              >
              <p class="text-sm font-bold text-leaf">На выходные</p>
              <h3 class="mt-2 text-2xl font-bold">Для отдыха</h3>
              <p class="mt-4 flex-1 text-sm leading-relaxed text-stone-600">
                Удобно для поездки, прогулки или встречи с друзьями.
              </p>
              <a class="btn-primary mt-6" href="#request">Выбрать даты</a>
            </article>
            <article class="info-card flex flex-col">
              <p class="text-sm font-bold text-leaf">На неделю</p>
              <h3 class="mt-2 text-2xl font-bold">Для долгих планов</h3>
              <p class="mt-4 flex-1 text-sm leading-relaxed text-stone-600">
                Вещь останется с вами на весь срок, который вы укажете.
              </p>
              <a class="btn-outline mt-6" href="#request">Выбрать даты</a>
            </article>
          </div>
        </div>
      </section>

      <section
        id="request"
        class="section-space scroll-mt-20 bg-brand text-white"
      >
        <div
          class="page-container grid items-center gap-10 md:grid-cols-2 lg:gap-20"
        >
          <div>
            <p class="eyebrow !text-green-200">Есть план?</p>
            <h2 class="text-4xl font-bold tracking-tight sm:text-5xl">
              Оставьте заявку на прокат
            </h2>
            <p class="mt-6 max-w-lg leading-relaxed text-green-100">
              Выберите вещь и удобные даты.
            </p>
          </div>
          <form
            class="rounded-2xl bg-white p-6 text-stone-800 shadow-xl sm:p-8"
            @submit.prevent="submitRequest"
          >
            <label class="form-label" for="name">Ваше имя</label
            ><input
              class="form-field"
              id="name"
              v-model.trim="form.name"
              type="text"
              placeholder="Как к вам обращаться"
              required
            /><label class="form-label" for="phone">Телефон</label
            ><input
              class="form-field"
              id="phone"
              v-model.trim="form.phone"
              type="tel"
              inputmode="tel"
              placeholder="+375 (29) 123-45-67"
              pattern="\+375\s?\(?[0-9]{2}\)?\s?[0-9]{3}-?[0-9]{2}-?[0-9]{2}"
              title="Например: +375 (29) 123-45-67"
              required
            /><label class="form-label" for="item">Что хотите взять</label
            ><select class="form-field" id="item" v-model="form.item" required>
              <option value="" disabled>Выберите вещь</option>
              <option v-for="item in items" :key="item.id" :value="item.name">
                {{ item.name }}
              </option>
            </select>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="form-label" for="start">Начало</label
                ><input
                  class="form-field"
                  id="start"
                  v-model="form.start"
                  :min="today"
                  type="date"
                  required
                />
              </div>
              <div>
                <label class="form-label" for="end">Конец</label
                ><input
                  class="form-field"
                  id="end"
                  v-model="form.end"
                  :min="form.start || today"
                  type="date"
                  required
                />
              </div>
            </div>
            <p v-if="formError" class="mb-3 text-sm text-red-700" role="alert">
              {{ formError }}
            </p>
            <button class="btn-primary w-full" type="submit">
              Показать заявку <span aria-hidden="true">→</span>
            </button>
            <p class="mt-3 text-center text-xs text-stone-500">
              Данные не отправляются на сервер.
            </p>
          </form>
        </div>
      </section>

      <section id="questions" class="section-space scroll-mt-20">
        <div
          class="page-container grid gap-8 md:grid-cols-[1fr_1.5fr] lg:gap-20"
        >
          <div>
            <p class="eyebrow">Полезно знать</p>
            <h2 class="section-title">Частые вопросы</h2>
            <p class="mt-4 text-sm leading-relaxed text-stone-600">
              Ответы на вопросы о выборе вещи и заявке.
            </p>
          </div>
          <div class="border-t border-stone-200">
            <details
              v-for="faq in faqs"
              :key="faq.question"
              class="faq-item group"
            >
              <summary
                class="flex items-center justify-between gap-4 font-bold"
              >
                <span>{{ faq.question }}</span
                ><span
                  class="text-2xl font-normal transition-transform group-open:rotate-45"
                  aria-hidden="true"
                  >+</span
                >
              </summary>
              <p class="mt-4 pr-8 text-sm leading-relaxed text-stone-600">
                {{ faq.answer }}
              </p>
            </details>
          </div>
        </div>
      </section>
    </main>

    <AccountPanel v-if="accountOpen" @close="accountOpen = false" />

    <footer class="bg-stone-900 py-12 text-stone-300">
      <div class="page-container grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <a href="#top" class="text-2xl font-extrabold text-white"
            >бери<span class="text-coral">.</span></a
          >
          <p class="mt-4 text-sm leading-relaxed">
            Вещи для планов, которые хочется осуществить.
          </p>
        </div>
        <div>
          <h2 class="mb-4 font-bold text-white">Разделы</h2>
          <ul class="space-y-2 text-sm">
            <li><a class="hover:text-white" href="#catalog">Каталог</a></li>
            <li>
              <a class="hover:text-white" href="#features">Преимущества</a>
            </li>
            <li>
              <a class="hover:text-white" href="#pricing">Сроки проката</a>
            </li>
          </ul>
        </div>
        <div>
          <h2 class="mb-4 font-bold text-white">Информация</h2>
          <ul class="space-y-2 text-sm">
            <li>
              <a class="hover:text-white" href="#how">Как это работает</a>
            </li>
            <li>
              <a class="hover:text-white" href="#reviews">Идеи для проката</a>
            </li>
            <li>
              <a class="hover:text-white" href="#questions">Частые вопросы</a>
            </li>
          </ul>
        </div>
        <div>
          <h2 class="mb-4 font-bold text-white">Заявка</h2>
          <p class="mb-4 text-sm leading-relaxed">
            Выберите вещь и укажите даты проката.
          </p>
          <a class="btn-primary" href="#request">Заполнить форму</a>
        </div>
      </div>
      <div
        class="page-container mt-10 border-t border-stone-700 pt-5 text-xs text-stone-400"
      >
        © 2026 Бери. Сервис проката вещей.
      </div>
    </footer>

    <div
      v-if="showResult"
      class="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4"
      @click.self="showResult = false"
    >
      <div
        class="relative w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          class="absolute right-4 top-3 text-3xl text-stone-500"
          type="button"
          aria-label="Закрыть"
          @click="showResult = false"
        >
          ×
        </button>
        <div
          class="mb-4 grid h-11 w-11 place-items-center rounded-full bg-green-100 text-2xl text-brand"
        >
          ✓
        </div>
        <h2 id="modal-title" class="text-2xl font-bold">Заявка заполнена</h2>
        <p class="mt-2 text-sm text-stone-600">
          Так выглядела бы ваша заявка на прокат:
        </p>
        <dl
          class="my-5 divide-y divide-stone-200 border-y border-stone-200 text-sm"
        >
          <div class="flex justify-between gap-3 py-2">
            <dt class="text-stone-500">Имя</dt>
            <dd class="font-bold">{{ form.name }}</dd>
          </div>
          <div class="flex justify-between gap-3 py-2">
            <dt class="text-stone-500">Телефон</dt>
            <dd class="font-bold">{{ form.phone }}</dd>
          </div>
          <div class="flex justify-between gap-3 py-2">
            <dt class="text-stone-500">Вещь</dt>
            <dd class="font-bold">{{ form.item }}</dd>
          </div>
          <div class="flex justify-between gap-3 py-2">
            <dt class="text-stone-500">Даты</dt>
            <dd class="font-bold">
              {{ formatDate(form.start) }} — {{ formatDate(form.end) }}
            </dd>
          </div>
        </dl>
        <p class="mb-4 text-xs text-stone-500">Заявка не отправлена.</p>
        <button
          class="btn-primary w-full"
          type="button"
          @click="showResult = false"
        >
          Понятно
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AdSlot from "./components/AdSlot.vue";
import AccountPanel from "./components/AccountPanel.vue";

export default {
  components: { AdSlot, AccountPanel },
  data() {
    return {
      categories: ["Все", "Отдых", "Техника", "Инструменты"],
      selectedCategory: "Все",
      menuOpen: false,
      accountOpen: false,
      items: [
        {
          id: 1,
          name: "Городской велосипед",
          category: "Отдых",
          description: "Для прогулок по городу и парку.",
          price: 35,
          emoji: "🚲",
          color: "peach",
        },
        {
          id: 2,
          name: "Фотоаппарат",
          category: "Техника",
          description: "Чтобы сохранить важные моменты.",
          price: 125,
          emoji: "📷",
          color: "lavender",
        },
        {
          id: 3,
          name: "Проектор",
          category: "Техника",
          description: "Для кино дома или презентации.",
          price: 65,
          emoji: "📽️",
          color: "mint",
        },
        {
          id: 4,
          name: "Шуруповёрт",
          category: "Инструменты",
          description: "Поможет быстро закончить ремонт.",
          price: 15,
          emoji: "🛠️",
          color: "yellow",
        },
        {
          id: 5,
          name: "Палатка",
          category: "Отдых",
          description: "Для поездки на природу с друзьями.",
          price: 20,
          emoji: "⛺",
          color: "mint",
        },
        {
          id: 6,
          name: "Колонка",
          category: "Техника",
          description: "Музыка для встречи или праздника.",
          price: 60,
          emoji: "🔊",
          color: "peach",
        },
      ],
      faqs: [
        {
          question: "На какой срок можно взять вещь?",
          answer:
            "Вы можете выбрать любые даты в форме заявки. Срок и условия проката в реальном сервисе согласовывались бы при подтверждении.",
        },
        {
          question: "Можно ли выбрать сразу несколько вещей?",
          answer:
            "Форма рассчитана на одну вещь. Чтобы выбрать другую, заполните её ещё раз.",
        },
        {
          question: "Заявка действительно отправляется?",
          answer:
            "Нет. Заполненная заявка показывается только в вашем браузере.",
        },
      ],
      form: { name: "", phone: "", item: "", start: "", end: "" },
      formError: "",
      showResult: false,
      today: new Date().toLocaleDateString("en-CA"),
    };
  },
  computed: {
    filteredItems() {
      return this.selectedCategory === "Все"
        ? this.items
        : this.items.filter((item) => item.category === this.selectedCategory);
    },
  },
  methods: {
    openAccount() {
      this.accountOpen = true;
      this.menuOpen = false;
      this.$nextTick(() =>
        document
          .getElementById("account")
          .scrollIntoView({ behavior: "smooth" }),
      );
    },
    formatPrice(value) {
      return (
        new Intl.NumberFormat("be-BY", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value) + " Br"
      );
    },
    chooseItem(item) {
      this.form.item = item.name;
      document.getElementById("request").scrollIntoView({ behavior: "smooth" });
      document.getElementById("name").focus({ preventScroll: true });
    },
    submitRequest() {
      this.formError = "";
      if (this.form.end < this.form.start) {
        this.formError = "Дата окончания не может быть раньше даты начала.";
        return;
      }
      this.showResult = true;
    },
    formatDate(value) {
      return new Date(value + "T00:00:00").toLocaleDateString("be-BY");
    },
  },
};
</script>
