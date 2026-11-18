<template>
  <aside class="rental-ad" :style="slotStyle" aria-label="Реклама RideClub">
    <div>
      <span class="ad-label">Реклама · RideClub</span>
      <h3>Минск лучше на велосипеде.</h3>
      <p>
        Посмотрите условия проката велосипедов и выберите маршрут для прогулки.
      </p>
    </div>
    <a
      href="https://rideclub.by/prokat-velosipedov/"
      target="_blank"
      rel="sponsored noopener noreferrer"
      >Смотреть прокат <span aria-hidden="true">↗</span></a
    >
  </aside>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  size: { type: String, default: "banner" },
  width: { type: String, default: "" },
  height: { type: String, default: "" },
});

const sizes = {
  banner: { width: "100%", minHeight: "190px" },
  sidebar: { width: "300px", minHeight: "250px" },
};

const slotStyle = computed(() => ({
  width: props.width || (sizes[props.size] || sizes.banner).width,
  minHeight: props.height || (sizes[props.size] || sizes.banner).minHeight,
}));
</script>

<style scoped>
.rental-ad {
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding: 30px 38px;
  background: #dce76d;
  color: #1c2220;
}
.ad-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
h3 {
  margin: 10px 0 5px;
  font:
    800 clamp(27px, 3vw, 43px)/1.1 Manrope,
    sans-serif;
  letter-spacing: -0.06em;
}
p {
  max-width: 520px;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}
a {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  min-width: 180px;
  padding: 15px 18px;
  background: #1c2220;
  color: white;
  font-size: 13px;
  font-weight: 800;
}
@media (max-width: 600px) {
  .rental-ad {
    flex-direction: column;
    align-items: stretch;
    padding: 25px;
  }
  a {
    width: 100%;
  }
}
</style>
