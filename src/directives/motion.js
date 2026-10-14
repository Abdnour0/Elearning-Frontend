/* Motion directives
   - v-reveal: fade/slide an element in when it scrolls into view (staggerable)
   - v-tilt:   subtle 3D pointer tilt for cards (feels alive, adds depth)
   Both no-op gracefully when the user prefers reduced motion. */

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── v-reveal ──────────────────────────────────────────────────────
   Usage:  v-reveal            (immediate)
           v-reveal="120"      (delay in ms)
           v-reveal="{ delay: 120 }"
*/
export const reveal = {
  mounted(el, binding) {
    const show = () => el.classList.add('is-revealed');

    // No animation path: reduced motion, no observer support, or a background
    // tab (where IntersectionObserver may never fire). Always show the content.
    if (prefersReducedMotion() || !('IntersectionObserver' in window) || document.hidden) {
      show();
      return;
    }

    const value = binding.value;
    const delay = typeof value === 'number' ? value : (value && value.delay) || 0;

    el.classList.add('reveal');
    if (delay) el.style.transitionDelay = `${delay}ms`;

    // Already in the viewport on mount -> reveal right away (after a paint so
    // the entrance transition still plays).
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      requestAnimationFrame(() => requestAnimationFrame(show));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show();
            io.disconnect();
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    );

    io.observe(el);
    el._revealObserver = io;

    // Failsafe: never leave content hidden if the observer never fires.
    el._revealTimer = window.setTimeout(() => {
      show();
      io.disconnect();
    }, 4000);
  },
  unmounted(el) {
    el._revealObserver?.disconnect();
    if (el._revealTimer) window.clearTimeout(el._revealTimer);
  },
};

/* ── v-tilt ────────────────────────────────────────────────────────
   Usage:  v-tilt
           v-tilt="{ max: 6, scale: 1.02 }"
*/
export const tilt = {
  mounted(el, binding) {
    if (prefersReducedMotion()) return;
    if (window.matchMedia && !window.matchMedia('(hover: hover)').matches) return;

    const max = (binding.value && binding.value.max) || 5;
    const scale = (binding.value && binding.value.scale) || 1.02;

    el.classList.add('el-tilted');

    let raf = null;

    const onMove = (event) => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform =
          `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) ` +
          `rotateY(${(px * max).toFixed(2)}deg) scale(${scale})`;
      });
    };

    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    el._tilt = { onMove, onLeave };
  },
  unmounted(el) {
    if (el._tilt) {
      el.removeEventListener('pointermove', el._tilt.onMove);
      el.removeEventListener('pointerleave', el._tilt.onLeave);
    }
  },
};

export function registerMotionDirectives(app) {
  app.directive('reveal', reveal);
  app.directive('tilt', tilt);
}
