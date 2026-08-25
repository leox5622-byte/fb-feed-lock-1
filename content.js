/* FB Feed Lock — blanks out the home feed + blocks scrolling on the home page.
   Top bar, sidebars, Messenger, profile, groups all stay normal.
   Made by Rl — github.com/leox12x */

(() => {
  const FEED_SEL = 'div[role="feed"]';

  // Home = the main post feed page only.
  const isHome = () => {
    const p = location.pathname;
    return p === '/' || p === '/home.php' || p === '/index.php';
  };

  // Block whole-page scrolling while on home.
  const blockScroll = () => {
    document.documentElement.classList.add('fbl-locked');
    document.body && document.body.classList.add('fbl-locked');
  };
  const unblockScroll = () => {
    document.documentElement.classList.remove('fbl-locked');
    document.body && document.body.classList.remove('fbl-locked');
  };

  const swallow = (e) => {
    if (!isHome()) return;
    e.preventDefault();
    e.stopPropagation();
  };
  window.addEventListener('wheel', swallow, { passive: false });
  window.addEventListener('touchmove', swallow, { passive: false });
  window.addEventListener('keydown', (e) => {
    if (!isHome()) return;
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Space'].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  // Blank the feed column: hide the posts, drop a small note in its place.
  const blankFeed = () => {
    if (!isHome()) return;
    const feed = document.querySelector(FEED_SEL);
    if (!feed || feed.dataset.fblBlanked === '1') return;
    feed.dataset.fblBlanked = '1';
    feed.style.display = 'none';

    const col = feed.parentElement || feed;
    let note = document.getElementById('fbl-note');
    if (!note) {
      note = document.createElement('div');
      note.id = 'fbl-note';
      note.innerHTML = 'Feed hidden · made by <a href="https://github.com/leox12x" target="_blank" rel="noopener">Rl</a>';
      col.appendChild(note);
    }
  };

  const cleanup = () => {
    document.documentElement.classList.remove('fbl-locked');
    document.body && document.body.classList.remove('fbl-locked');
    document.getElementById('fbl-note')?.remove();
    const f = document.querySelector(FEED_SEL);
    if (f) { f.dataset.fblBlanked = ''; f.style.display = ''; }
  };

  const apply = () => {
    if (isHome()) {
      blockScroll();
      blankFeed();
    } else {
      cleanup();
    }
  };

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
    const obs = new MutationObserver(() => blankFeed());
    obs.observe(document.documentElement, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
