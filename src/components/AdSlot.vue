<template>
  <aside
    class="mx-auto flex max-w-full items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 p-5 text-center text-sm text-stone-500"
    :style="slotStyle"
    aria-label="Рекламное место"
  >
    <span>Рекламное место</span>
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
  banner: { width: "100%", height: "120px" },
  sidebar: { width: "300px", height: "250px" },
};

const slotStyle = computed(() => ({
  width: props.width || (sizes[props.size] || sizes.banner).width,
  height: props.height || (sizes[props.size] || sizes.banner).height,
}));
</script>
