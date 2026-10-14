<template>
  <span
    class="brand-logo"
    :class="{ 'brand-logo--textless': !showText }"
    :style="{ '--bl-tile': `${size}px` }"
  >
    <span class="brand-tile" aria-hidden="true">
      <span class="brand-tile-sheen" />
      <svg class="brand-glyph" viewBox="0 0 32 32" fill="none">
        <path
          class="glyph-page glyph-page--left"
          d="M15.7 10C12.5 8 9.2 7.6 6.3 9v14.6c2.9-1.4 6.2-1 9.4.9z"
        />
        <path
          class="glyph-page glyph-page--right"
          d="M16.3 10c3.2-2 6.5-2.4 9.4-1v14.6c-2.9-1.4-6.2-1-9.4.9z"
        />
        <path
          class="glyph-spark"
          d="M25.2 2.6q.72 2.13 2.85 2.85-2.13.72-2.85 2.85-.72-2.13-2.85-2.85 2.13-.72 2.85-2.85z"
        />
      </svg>
    </span>
    <span v-if="showText" class="brand-word">
      E-Learning<span class="brand-word-accent">&nbsp;Hub</span>
    </span>
  </span>
</template>

<script setup>
defineProps({
  size: { type: Number, default: 38 },
  showText: { type: Boolean, default: true },
});
</script>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
}

.brand-tile {
  position: relative;
  flex: 0 0 auto;
  width: var(--bl-tile, 38px);
  height: var(--bl-tile, 38px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 32%;
  overflow: hidden;
  color: #fff9f6;
  background: linear-gradient(135deg, #ff9a63 0%, #ff7448 46%, #f13f07 100%);
  background-size: 180% 180%;
  box-shadow: var(--el-shadow-accent), inset 0 1px 0 rgba(255, 255, 255, 0.35);
  animation: bl-gradient 7s ease-in-out infinite, bl-pop 0.55s var(--el-ease) both;
  transition: transform 0.4s var(--el-ease), box-shadow 0.4s var(--el-ease);
}

.brand-logo:hover .brand-tile {
  transform: translateY(-1px) rotate(-4deg) scale(1.06);
  box-shadow: 0 22px 40px -14px rgba(241, 63, 7, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

@keyframes bl-gradient {
  0%, 100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}

@keyframes bl-pop {
  0%   { opacity: 0; transform: scale(0.6) rotate(-12deg); }
  60%  { opacity: 1; transform: scale(1.08) rotate(4deg); }
  100% { opacity: 1; transform: scale(1) rotate(0); }
}

.brand-tile-sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(112deg, transparent 32%, rgba(255, 255, 255, 0.65) 50%, transparent 68%);
  transform: translateX(-130%);
  animation: bl-sheen 5.5s ease-in-out infinite;
}

@keyframes bl-sheen {
  0%, 55% { transform: translateX(-130%); }
  75%, 100% { transform: translateX(130%); }
}

.brand-glyph {
  position: relative;
  width: 64%;
  height: 64%;
  overflow: visible;
}

.glyph-page {
  fill: currentColor;
  transform-box: fill-box;
  transform-origin: center bottom;
}

.glyph-page--right {
  animation: bl-page 4.5s ease-in-out infinite;
}

@keyframes bl-page {
  0%, 70%, 100% { transform: rotate(0deg); }
  82%           { transform: rotate(-8deg); }
}

.glyph-spark {
  fill: currentColor;
  transform-box: fill-box;
  transform-origin: center;
  animation: bl-spark 2.6s ease-in-out infinite;
}

@keyframes bl-spark {
  0%, 100% { opacity: 0.7; transform: scale(0.85) rotate(0deg); }
  50%      { opacity: 1; transform: scale(1.15) rotate(35deg); }
}

.brand-word {
  font-family: var(--el-font-display);
  font-weight: 600;
  font-size: 1.2rem;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--el-text);
  white-space: nowrap;
}

.brand-word-accent {
  color: var(--el-accent);
}

/* On dark sections the app.css rule `.section-dark .brand-word` makes it light */

@media (prefers-reduced-motion: reduce) {
  .brand-tile,
  .brand-tile-sheen,
  .glyph-page,
  .glyph-spark {
    animation: none !important;
  }
}
</style>
