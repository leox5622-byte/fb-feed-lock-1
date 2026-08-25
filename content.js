/* FB Feed Lock — hides the home feed and stops scrolling on the Facebook homepage.
   Everything outside the homepage (Messenger, profile, groups) stays usable.
   Made by Rl — github.com/leox12x */

(() => {
  const LOCK_ID = 'fb-feed-lock-overlay';

  // Homepage = root path or classic home.php
  const isHome = () => {
    const p = location.pathname;
    return p === '/' || p === '/home.php' || p === '/index.php';
  };

  const lockScroll = () => {
    document.documentElement.classList.add('fbl-locked');
    document.body && document.body.classList.add('fbl-locked');
  };

  const unlockScroll = () => {
    document.documentElement.classList.remove('fbl-locked');
    document.body && document.body.classList.remove('fbl-locked');
  };

  // Kill wheel / touch / keyboard scrolling while locked (passive:false is required
  // or the browser scrolls anyway before we can cancel).
  const swallow = (e) => {
    if (!isHome()) return;
    e.preventDefault();
    e.stopPropagation();
  };
  window.addEventListener('wheel', swallow, { passive: false });
  window.addEventListener('touchmove', swallow, { passive: false });
  window.addEventListener('keydown', (e) => {
    if (!isHome()) return;
    const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Space'];
    if (keys.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  const showOverlay = () => {
    if (document.getElementById(LOCK_ID)) return;
    const el = document.createElement('div');
    el.id = LOCK_ID;
    el.innerHTML = `
      <div class="fbl-card">
        <div class="fbl-emoji">🔒</div>
        <h2>Feed locked</h2>
        <p>No scrolling here. Messenger, search, and your profile still work.</p>
        <a class="fbl-credit" href="https://github.com/leox12x" target="_blank" rel="noopener">Made by Rl · GitHub</a>
      </div>`;
    document.documentElement.appendChild(el);
  };

  const hideOverlay = () => {
    document.getElementById(LOCK_ID)?.remove();
  };

  const apply = () => {
    if (isHome()) {
      lockScroll();
      showOverlay();
    } else {
      unlockScroll();
      hideOverlay();
    }
  };

  // Facebook is a SPA — pathname changes without a real navigation.
  let lastPath = null;
  const watch = () => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      apply();
    }
    requestAnimationFrame(watch);
  };

  const start = () => {
    apply();
    watch();
    // Also nuke any feed nodes that render before/while locked.
    const observer = new MutationObserver(() => {
      if (!isHome()) return;
      document.querySelectorAll('div[role="feed"]').forEach((f) => {
        f.setAttribute('inert', '');
        f.style.display = 'none';
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
