(() => {
  const $ = (s) => document.querySelector(s);
  const ic = window.ic;
  const SC = window.SCENES;
  const deck = $('#deck');
  const native = CSS.supports('animation-timeline: view()');

  deck.innerHTML = SC.map((s, i) => `<section class="scene${i ? '' : ' first'}" style="--n:${s.n}"><div class="stage"><div class="canvas ${s.cls || ''}">${s.html}</div></div></section>`).join('');
  const scenes = [...deck.children];
  const steps = SC.flatMap((s, i) => Array.from({ length: s.n }, (_, k) => ({ i, k })));
  const firstStep = SC.map((_, i) => steps.findIndex((s) => s.i === i));

  $('#dots').innerHTML = SC.map((s, i) => `<button data-go="${i}" title="${i + 1}. ${s.name}" aria-label="${s.name}"></button>`).join('');
  const dots = [...$('#dots').children];
  $('#btnPrev').innerHTML = ic('chevron-left');
  $('#btnNext').innerHTML = ic('chevron-right');
  $('#btnNotes').innerHTML = ic('message-square');
  $('#btnFull').innerHTML = ic('maximize');

  let cur = 0, raf = 0, shown = -1, vh = innerHeight;

  const fit = () => {
    vh = innerHeight;
    document.documentElement.style.setProperty('--k', Math.min(innerWidth / 1600, vh / 900).toFixed(4));
  };
  const yOf = (n) => scenes[steps[n].i].offsetTop + steps[n].k * vh;

  const update = () => {
    const mid = scrollY + vh / 2;
    let a = scenes.findIndex((s) => mid < s.offsetTop + s.offsetHeight);
    if (a < 0) a = scenes.length - 1;
    if (a !== shown) {
      shown = a;
      scenes.forEach((s, i) => { s.classList.toggle('active', i === a); s.classList.toggle('far', Math.abs(i - a) > 1); });
      dots.forEach((d, i) => d.classList.toggle('on', i === a));
      $('#hudName').textContent = SC[a].name;
      $('#hudCount').textContent = `${String(a + 1).padStart(2, '0')} / ${SC.length}`;
      history.replaceState(null, '', '#' + (a + 1));
      const n = (window.NOTES || {})[SC[a].pptx];
      $('#notes').innerHTML = n ? n.map((p) => `<p>${p}</p>`).join('') : '<p><em>Cảnh này không có ghi chú trong file PowerPoint.</em></p>';
      $('#notes').scrollTop = 0;
    }
    if (!native) {
      const k = Math.round((scrollY - scenes[a].offsetTop) / vh);
      scenes[a].querySelectorAll('[data-a]').forEach((e) => e.classList.toggle('on', +e.style.getPropertyValue('--s') <= k));
    }
  };

  const go = (n, instant) => {
    n = Math.max(0, Math.min(steps.length - 1, n));
    const from = scrollY, to = yOf(n), jump = steps[n].i !== steps[cur].i;
    cur = n;
    cancelAnimationFrame(raf);
    if (instant || Math.abs(to - from) < 2) { scrollTo(0, to); update(); return; }
    const dur = Math.abs(to - from) > vh * 1.5 ? 1300 : jump ? 1250 : 950, t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      scrollTo(0, from + (to - from) * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  const next = () => go(cur + 1);
  const prev = () => go(cur - 1);

  let ticking = false;
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; update(); }); } }, { passive: true });

  let wheelIdle = true, wheelTimer = 0;
  addEventListener('wheel', (e) => {
    if (window.DEMO_OPEN || e.target.closest('.notes')) return;
    e.preventDefault();
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { wheelIdle = true; }, 160);
    if (!wheelIdle || Math.abs(e.deltaY) < 4) return;
    wheelIdle = false;
    e.deltaY > 0 ? next() : prev();
  }, { passive: false });

  let ty = null;
  addEventListener('touchstart', (e) => { ty = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchmove', (e) => { if (!window.DEMO_OPEN) e.preventDefault(); }, { passive: false });
  addEventListener('touchend', (e) => {
    if (ty == null || window.DEMO_OPEN) return;
    const d = ty - e.changedTouches[0].clientY;
    ty = null;
    if (Math.abs(d) > 40) d > 0 ? next() : prev();
  });

  const toggleNotes = () => { $('#notes').hidden = !$('#notes').hidden; };
  const toggleFull = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());

  addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (window.DEMO_OPEN) {
      if (e.key === 'Escape') window.closeDemo();
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) e.preventDefault();
      return;
    }
    const k = e.key;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev(); }
    else if (k === 'Home') { e.preventDefault(); go(0); }
    else if (k === 'End') { e.preventDefault(); go(steps.length - 1); }
    else if (k === 'n' || k === 'N') toggleNotes();
    else if (k === 'f' || k === 'F') toggleFull();
    else if (k === 'Escape') $('#notes').hidden = true;
  });

  document.addEventListener('click', (e) => {
    const d = e.target.closest('[data-go]');
    if (d) go(firstStep[+d.dataset.go]);
  });
  $('#btnPrev').addEventListener('click', prev);
  $('#btnNext').addEventListener('click', next);
  $('#btnNotes').addEventListener('click', toggleNotes);
  $('#btnFull').addEventListener('click', toggleFull);
  document.querySelectorAll('.hud button, .dots button').forEach((b) => b.addEventListener('keydown', (e) => e.key === ' ' && e.preventDefault()));

  addEventListener('resize', () => { fit(); go(cur, true); });

  history.scrollRestoration = 'manual';
  fit();
  const fromHash = () => {
    const [hs, hk] = location.hash.slice(1).split('.').map((v) => parseInt(v, 10) || 0);
    const start = Math.max(1, Math.min(SC.length, hs || 1)) - 1;
    return firstStep[start] + Math.min(SC[start].n - 1, hk || 0);
  };
  addEventListener('hashchange', () => go(fromHash(), true));
  cur = fromHash();
  requestAnimationFrame(() => go(cur, true));
  update();
})();
