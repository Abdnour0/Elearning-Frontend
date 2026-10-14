<template>
  <span ref="root" class="count-up">{{ display }}</span>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  to: { type: Number, required: true },
  from: { type: Number, default: 0 },
  duration: { type: Number, default: 1600 },
  decimals: { type: Number, default: 0 },
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
});

const root = ref(null);
const display = ref('');

const format = (value) =>
  `${props.prefix}${value.toFixed(props.decimals)}${props.suffix}`;

let observer = null;
let raf = null;

function run() {
  const startTime = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - startTime) / props.duration);
    const eased = 1 - Math.pow(1 - t, 3);
    display.value = format(props.from + (props.to - props.from) * eased);
    if (t < 1) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
}

onMounted(() => {
  const reduce =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce || !('IntersectionObserver' in window) || document.hidden) {
    // Reduced motion, no observer support, or a background tab: show the final value.
    display.value = format(props.to);
    return;
  }

  display.value = format(props.from);

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          run();
        }
      });
    },
    { threshold: 0.4 }
  );
  if (root.value) observer.observe(root.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  if (raf) cancelAnimationFrame(raf);
});
</script>

<style scoped>
.count-up {
  font-variant-numeric: tabular-nums;
}
</style>
