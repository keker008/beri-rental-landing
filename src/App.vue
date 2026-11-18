<template>
  <div class="site-shell">
    <header class="site-header">
      <div class="page-container header-inner">
        <a class="wordmark" href="#top" aria-label="Бери — на главную"
          >БЕРИ<span>/</span></a
        >
        <nav class="desktop-nav" aria-label="Основная навигация">
          <a href="#catalog">Каталог</a>
          <a href="#how">Как это работает</a>
          <a href="#pricing">Условия</a>
          <a href="#questions">Вопросы</a>
        </nav>
        <div class="header-actions">
          <button class="account-link" type="button" @click="openAccount">
            Кабинет <span>↗</span>
          </button>
          <a class="header-cta" href="#request"
            >Оставить заявку <span>↗</span></a
          >
        </div>
        <button
          class="menu-toggle"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          @click="menuOpen = !menuOpen"
        >
          {{ menuOpen ? "Закрыть" : "Меню" }}
          <span>{{ menuOpen ? "×" : "☰" }}</span>
        </button>
      </div>
      <nav
        v-if="menuOpen"
        id="mobile-menu"
        class="mobile-nav"
        aria-label="Мобильная навигация"
      >
        <a href="#catalog" @click="menuOpen = false">Каталог</a>
        <a href="#how" @click="menuOpen = false">Как это работает</a>
        <a href="#pricing" @click="menuOpen = false">Условия</a>
        <a href="#questions" @click="menuOpen = false">Вопросы</a>
        <a href="#request" @click="menuOpen = false">Оставить заявку</a>
        <button type="button" @click="openAccount">Личный кабинет ↗</button>
      </nav>
    </header>

    <main id="top">
      <section class="hero-section" aria-labelledby="hero-title">
        <img
          :src="heroImage"
          class="hero-image"
          alt="Велосипед, фотоаппарат и проектор в студии"
        />
        <div class="hero-wash"></div>
        <div class="page-container hero-content">
          <p class="hero-kicker">
            <span class="status-dot"></span> Прокат вещей в Беларуси
            <span class="hero-index">01 / 06</span>
          </p>
          <h1 id="hero-title">Вещи для <em>момента.</em><br />Не для шкафа.</h1>
          <p class="hero-copy">
            Велосипед для маршрута. Проектор для вечера. Камера для истории.
            Берите то, что нужно сейчас.
          </p>
          <a class="action-button" href="#catalog"
            >Найти свою вещь <span>↗</span></a
          >
          <div class="hero-bottom">
            <span>Прокрутите вниз</span><span>↓</span><span>Минск · BY</span>
          </div>
        </div>
      </section>

      <div class="marquee" aria-hidden="true">
        <div>
          БЕРИ МЕНЬШЕ · ЖИВИ БОЛЬШЕ · БЕРИ МЕНЬШЕ · ЖИВИ БОЛЬШЕ · БЕРИ МЕНЬШЕ ·
          ЖИВИ БОЛЬШЕ ·
        </div>
      </div>

      <section id="features" class="manifesto-section section-space">
        <div class="page-container manifesto-grid">
          <div>
            <p class="eyebrow">01 / Подход</p>
            <h2 class="display-heading">
              Не всё хорошее нужно <em>покупать.</em>
            </h2>
          </div>
          <div class="manifesto-right">
            <p class="manifesto-lead">
              Планы меняются. Хорошие вещи пригодятся именно тогда, когда они
              нужны.
            </p>
            <div class="feature-line">
              <span>01</span>
              <div>
                <h3>Выберите вещь</h3>
                <p>Для поездки, ремонта, съемки или встречи.</p>
              </div>
              <span>↗</span>
            </div>
            <div class="feature-line">
              <span>02</span>
              <div>
                <h3>Укажите срок</h3>
                <p>Один день, выходные или целая неделя.</p>
              </div>
              <span>↗</span>
            </div>
            <div class="feature-line">
              <span>03</span>
              <div>
                <h3>Пользуйтесь спокойно</h3>
                <p>Верните вещь, когда планы завершатся.</p>
              </div>
              <span>↗</span>
            </div>
          </div>
        </div>
      </section>

      <section id="catalog" class="catalog-section section-space">
        <div class="page-container">
          <div class="section-head">
            <div>
              <p class="eyebrow">02 / Каталог</p>
              <h2 class="display-heading">Выберите <em>свой план.</em></h2>
            </div>
            <p>Немного вещей, много возможностей. Цена указана за сутки.</p>
          </div>
          <div class="catalog-filters" aria-label="Фильтр каталога">
            <button
              v-for="category in categories"
              :key="category"
              type="button"
              :class="{ active: selectedCategory === category }"
              :aria-pressed="selectedCategory === category"
              @click="selectedCategory = category"
            >
              {{ category }}
              <span v-if="category === 'Все'">{{ items.length }}</span>
            </button>
          </div>
          <div class="catalog-grid">
            <article
              v-for="(item, index) in filteredItems"
              :key="item.id"
              class="catalog-card"
              :class="item.color"
            >
              <div class="card-meta">
                <span>0{{ index + 1 }} / {{ item.category }}</span
                ><span>↗</span>
              </div>
              <div class="item-art" role="img" :aria-label="item.name">
                <span>{{ item.emoji }}</span>
              </div>
              <div class="card-details">
                <div>
                  <h3>{{ item.name }}</h3>
                  <p>{{ item.description }}</p>
                </div>
                <div class="card-bottom">
                  <strong>{{ formatPrice(item.price) }}</strong
                  ><span>/ сутки</span
                  ><button
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

      <section class="ad-section" aria-label="Рекламный блок">
        <div class="page-container"><AdSlot size="banner" /></div>
      </section>

      <section id="how" class="how-section section-space">
        <div class="page-container">
          <div class="how-heading">
            <p class="eyebrow">03 / Процесс</p>
            <h2 class="display-heading">Три шага.<br /><em>Одна идея.</em></h2>
            <p>Нужная вещь появляется в ваших планах без лишней покупки.</p>
          </div>
          <div class="steps-grid">
            <article>
              <span class="step-number">01</span>
              <div class="step-icon">↗</div>
              <h3>Найдите</h3>
              <p>Выберите вещь в каталоге и посмотрите цену за сутки.</p>
            </article>
            <article>
              <span class="step-number">02</span>
              <div class="step-icon">✳</div>
              <h3>Запланируйте</h3>
              <p>Укажите даты и контакты в форме заявки.</p>
            </article>
            <article>
              <span class="step-number">03</span>
              <div class="step-icon">⌁</div>
              <h3>Пользуйтесь</h3>
              <p>Получите вещь на выбранный срок и верните после.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="reviews" class="quote-section section-space">
        <div class="page-container quote-layout">
          <p class="eyebrow">04 / Идеи</p>
          <div>
            <p class="quote-mark">“</p>
            <blockquote>
              Хорошие планы не должны ждать, пока вы купите всё необходимое.
            </blockquote>
            <div class="quote-footer">
              <span>Меньше вещей дома. Больше впечатлений вокруг.</span
              ><a href="#catalog">Смотреть каталог ↗</a>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" class="pricing-section section-space">
        <div class="page-container">
          <div class="section-head">
            <div>
              <p class="eyebrow">05 / Сроки</p>
              <h2 class="display-heading">
                Берите ровно <em>насколько нужно.</em>
              </h2>
            </div>
            <p>
              Стоимость зависит от вещи. В каталоге показана цена за одни сутки.
            </p>
          </div>
          <div class="pricing-grid">
            <article>
              <span>01 / Коротко</span>
              <h3>На день</h3>
              <p>Для съемки, события или одного дела.</p>
              <a href="#request">Выбрать даты <b>↗</b></a>
            </article>
            <article class="featured">
              <span>02 / Популярно</span>
              <h3>На выходные</h3>
              <p>Для поездки, прогулки и спонтанных планов.</p>
              <a href="#request">Выбрать даты <b>↗</b></a>
            </article>
            <article>
              <span>03 / Надолго</span>
              <h3>На неделю</h3>
              <p>Когда времени хочется больше.</p>
              <a href="#request">Выбрать даты <b>↗</b></a>
            </article>
          </div>
        </div>
      </section>

      <section id="request" class="request-section section-space">
        <div class="page-container request-layout">
          <div>
            <p class="eyebrow">06 / Заявка</p>
            <h2 class="display-heading">
              План есть?<br /><em>Вещь найдется.</em>
            </h2>
            <p>
              Оставьте данные и посмотрите, как будет выглядеть ваша заявка.
            </p>
            <div class="request-arrow">↗</div>
          </div>
          <form class="request-form" @submit.prevent="submitRequest">
            <div class="form-top">
              <span>Заявка на прокат</span><span>01 / 01</span>
            </div>
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
            <div class="date-grid">
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
            <p v-if="formError" class="form-error" role="alert">
              {{ formError }}
            </p>
            <button class="action-button" type="submit">
              Показать заявку <span>↗</span>
            </button>
            <p class="form-note">Данные не отправляются на сервер.</p>
          </form>
        </div>
      </section>

      <section id="questions" class="faq-section section-space">
        <div class="page-container faq-layout">
          <div>
            <p class="eyebrow">Небольшой FAQ</p>
            <h2 class="display-heading">Остались <em>вопросы?</em></h2>
          </div>
          <div class="faq-list">
            <details v-for="faq in faqs" :key="faq.question">
              <summary>{{ faq.question }} <span>+</span></summary>
              <p>{{ faq.answer }}</p>
            </details>
          </div>
        </div>
      </section>
    </main>

    <AccountPanel v-if="accountOpen" @close="accountOpen = false" />

    <footer class="site-footer">
      <div class="page-container">
        <div class="footer-top">
          <a href="#top" class="footer-logo">БЕРИ<span>/</span></a>
          <p>Вещи для момента.<br />Не для шкафа.</p>
          <a href="#top">Наверх ↑</a>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Бери. Сервис проката вещей.</span>
          <nav aria-label="Навигация в подвале">
            <a href="#catalog">Каталог</a><a href="#how">Как это работает</a
            ><a href="#request">Заявка</a>
          </nav>
          <span>Сделано для новых планов.</span>
        </div>
      </div>
    </footer>

    <div
      v-if="showResult"
      class="result-backdrop"
      @click.self="showResult = false"
    >
      <div
        class="result-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          class="result-close"
          type="button"
          aria-label="Закрыть"
          @click="showResult = false"
        >
          ×</button
        ><span class="result-icon">✓</span>
        <p class="eyebrow">Заявка</p>
        <h2 id="modal-title">Всё заполнено.</h2>
        <p>Так выглядела бы ваша заявка на прокат:</p>
        <dl>
          <div>
            <dt>Имя</dt>
            <dd>{{ form.name }}</dd>
          </div>
          <div>
            <dt>Телефон</dt>
            <dd>{{ form.phone }}</dd>
          </div>
          <div>
            <dt>Вещь</dt>
            <dd>{{ form.item }}</dd>
          </div>
          <div>
            <dt>Даты</dt>
            <dd>{{ formatDate(form.start) }} — {{ formatDate(form.end) }}</dd>
          </div>
        </dl>
        <p class="form-note">Заявка не отправлена.</p>
        <button class="action-button" type="button" @click="showResult = false">
          Понятно <span>↗</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AdSlot from "./components/AdSlot.vue";
import AccountPanel from "./components/AccountPanel.vue";
import heroImage from "./assets/hero-still-life.png";

export default {
  components: { AdSlot, AccountPanel },
  data() {
    return {
      heroImage,
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
