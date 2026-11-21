/* A small dependency-free controller shared by the website and an Android WebView. */
(function (global) {
  'use strict';

  function mount(options = {}) {
    const root = typeof options.root === 'string'
      ? document.querySelector(options.root)
      : options.root || document.querySelector('[data-rft-intro]');
    if (!root || root.dataset.rftIntroMounted === 'true') return null;

    root.dataset.rftIntroMounted = 'true';
    const duration = Math.max(0, Number(options.duration ?? 2800));
    let timer;
    let finished = false;
    const onKeydown = event => {
      if (event.key === 'Escape' && !finished) finish('skip');
    };

    function finish(reason = 'complete') {
      if (finished) return;
      finished = true;
      global.clearTimeout(timer);
      global.removeEventListener('keydown', onKeydown);
      root.classList.add('is-finished');
      root.dispatchEvent(new CustomEvent('rft:intro-finished', { detail: { reason } }));
      if (typeof options.onComplete === 'function') options.onComplete(reason);
    }

    const skip = root.querySelector('[data-rft-intro-skip]');
    const language = (() => {
      try { return global.localStorage.getItem('arcUiLanguage') || document.documentElement.lang || 'de'; }
      catch { return document.documentElement.lang || 'de'; }
    })().toLowerCase().slice(0, 2);
    const skipLabels = { de: 'Überspringen', en: 'Skip', fr: 'Passer', es: 'Omitir', it: 'Salta' };
    if (skip) {
      skip.textContent = skipLabels[language] || skipLabels.de;
      skip.setAttribute('aria-label', skip.textContent);
      skip.addEventListener('click', () => finish('skip'), { once: true });
    }
    root.addEventListener('click', event => {
      if (event.target === root) finish('skip');
    });
    global.addEventListener('keydown', onKeydown);

    if (global.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      finish('reduced-motion');
    } else {
      timer = global.setTimeout(() => finish('complete'), duration);
    }

    return { finish };
  }

  global.RFTStartupAnimation = { mount };
  const root = document.querySelector('[data-rft-intro]');
  if (root?.dataset.rftIntroAuto !== 'false') mount();
})(window);
