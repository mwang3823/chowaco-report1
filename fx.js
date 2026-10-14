(() => {
  document.querySelectorAll('.canvas h1').forEach((h) => {
    let wi = 0;
    const walk = (node, g) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((t) => {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.append(' '); return; }
            const w = document.createElement('span');
            w.className = 'w';
            w.innerHTML = `<span class="${g ? 'g' : ''}" style="--wi:${wi++}"></span>`;
            w.firstChild.textContent = t;
            frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n, g || n.tagName === 'EM');
      });
    };
    walk(h, false);
    h.classList.add('split');
  });

  addEventListener('pointermove', (e) => {
    const g = e.target.closest && e.target.closest('.glass');
    if (!g) return;
    const r = g.getBoundingClientRect();
    g.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    g.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  }, { passive: true });

  document.querySelectorAll('[data-gis]').forEach((root) => {
    const info = document.getElementById(root.dataset.gis);
    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-layer]');
      if (b) {
        const on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', on);
        root.classList.toggle('off' + b.dataset.layer, !on);
        return;
      }
      const p = e.target.closest('[data-k]');
      if (!p || !info) return;
      root.querySelectorAll('.sel').forEach((x) => x.classList.remove('sel'));
      p.classList.add('sel');
      info.classList.toggle('o', p.dataset.k[0] === 'i');
      info.innerHTML = window.GIS_INFO(p.dataset.k);
    });
  });

  const cv = document.getElementById('fx');
  if (!cv || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const g = cv.getContext('2d');
  let W = 0, H = 0, pts = [];
  const size = () => {
    const r = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * r; cv.height = H * r;
    g.setTransform(r, 0, 0, r, 0, 0);
    const n = Math.round((W * H) / 26000);
    pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25 }));
  };
  const D = 130;
  const tick = () => {
    g.clearRect(0, 0, W, H);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }
    g.lineWidth = 1;
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < D) {
        g.strokeStyle = `rgba(80,180,255,${(1 - d / D) * 0.35})`;
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
      }
    }
    g.fillStyle = 'rgba(140,215,255,.8)';
    for (const p of pts) { g.beginPath(); g.arc(p.x, p.y, 1.6, 0, 7); g.fill(); }
    if (!document.hidden) requestAnimationFrame(tick);
  };
  document.addEventListener('visibilitychange', () => { if (!document.hidden) requestAnimationFrame(tick); });
  addEventListener('resize', size);
  size();
  requestAnimationFrame(tick);
})();
