(() => {
  const ic = window.ic;
  const $ = (s, r = document) => r.querySelector(s);
  const nf = (n, d = 0) => n.toLocaleString('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d });
  const sum = (a) => a.reduce((t, v) => t + (v || 0), 0);
  const compact = (v) => (v >= 1e9 ? nf(v / 1e9, 2) + ' tỷ' : v >= 1e6 ? nf(v / 1e6, 2) + ' tr' : v >= 1e4 ? nf(v / 1e3, 1) + 'k' : nf(v, v % 1 ? 2 : 0));

  /* ---------- mock data (Cấp nước Chợ Lớn) ---------- */
  const Y = 2026, KY = 10;
  const SEAS = [0.9, 0.82, 0.95, 1.04, 1.12, 1.1, 1.06, 1.03, 0.97, 1, 0.93, 0.96];
  const wob = (i, m) => 1 + (((i * 37 + m * 11) % 9) - 4) / 220;
  const SL25 = SEAS.map((s, i) => Math.round(3.08e6 * s * wob(i, 1)));
  const SL26 = SEAS.map((s, i) => (i < KY ? Math.round(3.21e6 * s * wob(i, 2)) : null));
  const P25 = SEAS.map((_, i) => 11790 + ((i * 5) % 7) * 18);
  const P26 = SEAS.map((_, i) => (i < KY ? 12010 + ((i * 3) % 7) * 17 : null));
  const DT25 = SL25.map((v, i) => v * P25[i]);
  const DT26 = SL26.map((v, i) => (v == null ? null : v * P26[i]));
  const KYS = SEAS.map((_, i) => i + 1);
  const WARDS = [['Chợ Lớn', 13420], ['An Đông', 11876], ['Chợ Quán', 10954], ['Bình Tây', 12108], ['Bình Tiên', 11230], ['Bình Phú', 10642], ['Phú Lâm', 10987], ['Phú Định', 9221]];
  const KH = sum(WARDS.map((w) => w[1]));
  const SIZES = [[15, 84120, 0.7], [25, 4360, 0.09], [40, 1180, 0.07], [50, 512, 0.06], [80, 186, 0.05], [100, 80, 0.03]];
  const GBS = [[11, 0.82, 0.62], [21, 0.035, 0.11], [31, 0.012, 0.05], [41, 0.12, 0.19], [51, 0.013, 0.03]];
  const KT = { total: 30773, done: 29486 };
  const KT_ROWS = { 0: [['Kiểm tra ĐHN', 58], ['Kiểm tra định mức', 41], ['Bấm chì', 33], ['Đổi giá biểu', 27], ['Sang tên hợp đồng', 19], ['Kiểm tra rò rỉ sau ĐHN', 12], ['Khiếu nại chỉ số', 8]], 1: [['Kiểm tra ĐHN', 742], ['Kiểm tra định mức', 518], ['Bấm chì', 436], ['Đổi giá biểu', 301], ['Sang tên hợp đồng', 264], ['Kiểm tra rò rỉ sau ĐHN', 187], ['Khiếu nại chỉ số', 122]] };
  const PLAN = { sl: 38.4e6, dt: 462e9, gbbq: 12000 };
  const BLUES = ['#3B66D6', '#0C2F55', '#0171CC', '#04ABED', '#92DFFF', '#3B95DC'];
  const HEAT = ['#EAF4FD', '#C7E3F8', '#9CCEF2', '#5FB0E8', '#1296E0', '#0171CC', '#054D8E', '#0C2F55'];

  const st = { chip: 1, tab: 0, ct: 1, seg: 0 };
  const ctf = () => (st.ct === 2 ? 1.012 : 1);
  const gbbq = (dt, sl) => sum(dt) / sum(sl);

  /* ---------- components ---------- */
  const colChart = (cats, series, o = {}) => {
    const all = series.flatMap((s) => s.data).filter((v) => v != null);
    const max = Math.max(...all), base = o.zoom ? Math.min(...all) * 0.985 : 0;
    const fmt = o.fmt || compact;
    const label = series.length === 1 && cats.length <= 8;
    return `<div class="cc"><div class="cc-tip">Chạm vào cột để xem số liệu</div><div class="cc-plot">${cats.map((c, i) => {
      const tip = `${o.cat || ''}${c} · ` + series.map((s) => `${s.name}: ${s.data[i] == null ? '--' : fmt(s.data[i])}`).join(' · ');
      return `<div class="cc-g" data-tip="${tip}"><div class="cc-b">${series.map((s) => (s.data[i] == null ? '<i style="--h:0%"></i>' : `<i style="--h:${(((s.data[i] - base) / (max - base)) * 100).toFixed(1)}%;--c:${s.color};--j:${i}" ${label ? `data-v="${fmt(s.data[i])}"` : ''}></i>`)).join('')}</div><span>${c}</span></div>`;
    }).join('')}</div>${series.length > 1 && o.leg !== false ? `<div class="cc-leg">${series.map((s) => `<span><i style="background:${s.color}"></i>${s.leg || s.name}</span>`).join('')}</div>` : ''}</div>`;
  };

  const dc = (v, fmt = nf) => (v == null ? '--' : v >= 0 ? `${fmt(v)} <em class="up">▲</em>` : `${fmt(v)} <em class="dn">▼</em>`);
  const tbl = (heads, rows, total) => `<table class="tb"><thead><tr>${heads.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>${total ? `<tfoot><tr>${total.map((c) => `<td>${c}</td>`).join('')}</tr></tfoot>` : ''}</table>`;

  const tcard = (title, sub, chart, table) => `<div class="tc"><div class="tc-h"><b>${title}</b><small>${sub}</small></div>
    <div class="tg"><button class="on" data-tg="c">${ic('bar-chart-3')}Biểu đồ</button><button data-tg="t">${ic('table')}Bảng</button></div>
    <div class="tc-c">${chart}</div><div class="tc-t">${table}</div></div>`;

  const donut = (slices, label, fmt = nf) => {
    const total = sum(slices.map((s) => s.v));
    let acc = 0;
    const arcs = slices.map((s) => { const p = (s.v / total) * 100; const c = `<circle r="15.915" cx="21" cy="21" stroke="${s.c}" stroke-dasharray="${p} ${100 - p}" stroke-dashoffset="${25 - acc}"/>`; acc += p; return c; }).join('');
    return `<div class="dnt"><svg viewBox="0 0 42 42">${arcs}<text x="21" y="20.5">${fmt(total)}</text><text x="21" y="25" class="s">${label}</text></svg>
      <div class="dnt-l">${slices.map((s) => `<span><i style="background:${s.c}"></i>${s.l}<b>${fmt(s.v)}</b><em>${nf((s.v / total) * 100, 1)}%</em></span>`).join('')}</div></div>`;
  };
  const donutTable = (slices, first, fmt = nf) => { const t = sum(slices.map((s) => s.v)); return tbl([first, 'Số lượng', 'Tỷ lệ %'], slices.map((s) => [s.l, fmt(s.v), nf((s.v / t) * 100, 1) + '%']), ['Tổng', fmt(t), '100%']); };

  const kpi = (c, l1, v1, l2, v2, rl, rv, pct, bar = '#fff') => `<div class="kp" style="background:${c}"><div class="kp-r"><div><small>${l1}</small><b>${v1}</b></div><div class="r"><small>${l2}</small><b>${v2}</b></div></div>
    <div class="kp-r s"><span>${rl}</span><span>${rv}</span></div><div class="pb"><i style="--w:${Math.min(100, pct).toFixed(1)}%;background:${bar}"></i></div></div>`;
  const ctToggle = () => `<div class="tg wide"><button class="${st.ct === 1 ? 'on' : ''}" data-ct="1">Chuẩn thu 1 (không TT)</button><button class="${st.ct === 2 ? 'on' : ''}" data-ct="2">Chuẩn thu 2 (có TT)</button></div>`;
  const acc = (t, s) => `<div class="ac"><i></i><div><b>${t}</b><small>${s}</small></div></div>`;

  /* ---------- tabs ---------- */
  const tabKH = () => {
    const half = (name, list) => { const t = sum(list.map((w) => w[1])); return `<div class="qg"><h5><i></i>${name}</h5>${[...list].sort((a, b) => b[1] - a[1]).map(([n, v]) => `<p><b>${n}</b><span>${nf(v)}</span></p>`).join('')}<div class="qt"><b>${nf(t)}</b><span>${nf((t / KH) * 100, 1)}%</span></div><div class="pb t"><i style="--w:${(t / KH) * 100}%;background:#3B66D6"></i></div></div>`; };
    const sizes = SIZES.map(([mm, v], i) => ({ l: mm + 'mm', v, c: BLUES[i] }));
    const heat = WARDS.map(([n, v], wi) => [n, GBS.map(([, share], gi) => Math.round(v * share * wob(wi, gi)))]);
    const hmax = Math.max(...heat.flatMap((r) => r[1]));
    const cell = (v) => { const r = Math.sqrt(v / hmax), k = Math.min(7, Math.floor(r * 8)); return `<td style="background:${HEAT[k]};color:${k > 3 ? '#fff' : '#0C2F55'}" title="Số KH: ${nf(v)}">${v >= 1000 ? nf(v / 1000, 1) + 'N' : v}</td>`; };
    return `<div class="tc"><div class="tc-h row"><b>KHÁCH HÀNG THEO PHƯỜNG</b><b>${nf(KH)} KH</b></div><div class="qgs">${half('QLGT 1', WARDS.slice(0, 4))}${half('QLGT 2', WARDS.slice(4))}</div></div>
      ${tcard('Khách hàng theo cỡ ĐHN', `Kỳ ${KY} - Tất cả phường - Năm ${Y}`, donut(sizes, 'Tổng'), donutTable(sizes, 'Cỡ ĐHN'))}
      ${tcard('Khách hàng theo giá biểu', `Kỳ ${KY} - Tất cả phường - Năm ${Y}`, `<table class="hm"><thead><tr><th></th>${GBS.map(([g]) => `<th>GB ${g}</th>`).join('')}</tr></thead><tbody>${heat.map(([n, r]) => `<tr><th>${n}</th>${r.map(cell).join('')}</tr>`).join('')}</tbody></table><div class="hm-s"><span>Ít</span><i></i><span>Nhiều</span></div>`,
        tbl(['Phường', ...GBS.map(([g]) => 'GB ' + g)], heat.map(([n, r]) => [n, ...r.map((v) => nf(v))]), ['TC', ...GBS.map((_, gi) => nf(sum(heat.map((r) => r[1][gi]))))]))}`;
  };

  const yearSeries = (a25, a26, unit) => [{ name: Y - 1, leg: `Năm ${Y - 1}${unit}`, color: '#3B66D6', data: a25 }, { name: Y, leg: `Năm ${Y}${unit}`, color: '#0C2F55', data: a26 }];
  const yearTable = (a25, a26, fmt, first = 'Kỳ', totalLabel = 'TC', total) => tbl([first, Y - 1, Y, '+/-'], KYS.map((k, i) => [k, fmt(a25[i]), a26[i] == null ? '--' : fmt(a26[i]), a26[i] == null ? '--' : dc(a26[i] - a25[i], fmt)]), total || [totalLabel, fmt(sum(a25)), fmt(sum(a26)), '']);

  const tabSL = () => {
    const a25 = SL25.map((v) => v * ctf()), a26 = SL26.map((v) => (v == null ? null : v * ctf()));
    const t = sum(a26), t25 = sum(a25.slice(0, KY));
    const split = (rows, key) => rows.map((r) => [r[0], t25 * r[key], t * r[key] * 1.004]);
    const two = (rows, label, w) => { const s = [{ name: Y - 1, leg: `Năm ${Y - 1} (m³)`, color: '#3B66D6', data: rows.map((r) => r[1]) }, { name: Y, leg: `Năm ${Y} (m³)`, color: '#0C2F55', data: rows.map((r) => r[2]) }]; return [colChart(rows.map((r) => r[0]), s, { cat: label + ' ' }), tbl([w, Y - 1, Y], rows.map((r) => [r[0], nf(Math.round(r[1])), nf(Math.round(r[2]))]))]; };
    const gb = two(split(GBS, 2), 'GB', 'GB'), co = two(split(SIZES, 2), 'Cỡ', 'Cỡ');
    const f = (v) => nf(Math.round(v));
    return `${kpi('#3B66D6', `Tổng sản lượng ${Y} (m³)`, f(t), 'Tỷ lệ đạt', nf((t / PLAN.sl) * 100, 2) + '%', 'Kế hoạch (m³)', f(PLAN.sl), (t / PLAN.sl) * 100, '#DDA134')}${ctToggle()}
      ${acc('TỔNG HỢP THEO NĂM', 'So sánh sản lượng các kỳ')}
      ${tcard('Tổng hợp theo năm', `${Y - 1} vs ${Y} (m³)`, colChart(KYS, yearSeries(a25, a26, ' (m³)'), { cat: 'Kỳ ' }), yearTable(a25, a26, f))}
      ${tcard('Sản lượng theo giá biểu', `${Y - 1} vs ${Y} (m³) · lũy kế ${KY} kỳ`, gb[0], gb[1])}
      ${tcard('Sản lượng theo cỡ đồng hồ nước', `${Y - 1} vs ${Y} (m³) · lũy kế ${KY} kỳ`, co[0], co[1])}`;
  };

  const dotData = (cur, prevYear, prevPeriod, n = 8) => Array.from({ length: n }, (_, i) => { const w = (0.9 + ((i * 5) % 7) * 0.035) / n / 1.005; return [i + 1, prevYear * w * wob(i, 3), cur * w * wob(i, 5), prevPeriod * w * wob(i, 7)]; });
  const dotCard = (title, rows, fmt, colors, zoom, totalLabel, avg) => {
    const names = [`${KY}/${Y - 1}`, `${KY}/${Y}`, `${KY - 1}/${Y}`];
    const s = [1, 2, 3].map((c, x) => ({ name: names[x], color: colors[x], data: rows.map((r) => r[c]) }));
    const tot = (c) => (avg ? sum(rows.map((r) => r[c])) / rows.length : sum(rows.map((r) => r[c])));
    return tcard(title, `Kỳ ${KY} - Năm ${Y} - Tất cả phường`, colChart(rows.map((r) => r[0]), s, { cat: 'Đợt ', fmt, zoom }),
      tbl(['Đợt', '+/- Năm', names[0], names[1], names[2], '+/- Kỳ'], rows.map((r) => [r[0], dc(r[2] - r[1], fmt), fmt(r[1]), fmt(r[2]), fmt(r[3]), dc(r[2] - r[3], fmt)]), [totalLabel, '', fmt(tot(1)), fmt(tot(2)), fmt(tot(3)), '']));
  };

  const tabDT = () => {
    const a25 = DT25.map((v) => v * ctf()), a26 = DT26.map((v) => (v == null ? null : v * ctf()));
    const t = sum(a26), f = (v) => nf(v / 1e9, 2);
    return `${kpi('#00AD26', `Tổng doanh thu ${Y} (VNĐ)`, nf(Math.round(t)), 'Tỷ lệ thực hiện', nf((t / PLAN.dt) * 100, 2) + '%', `Kế hoạch ${Y} (VNĐ)`, nf(PLAN.dt), (t / PLAN.dt) * 100)}${ctToggle()}
      ${tcard('Doanh thu theo kỳ', `${Y - 1} vs ${Y} (tỷ)`, colChart(KYS, yearSeries(a25, a26, ''), { cat: 'Kỳ ', fmt: (v) => f(v) + ' tỷ' }), yearTable(a25, a26, f))}
      ${dotCard('Doanh thu theo đợt', dotData(a26[KY - 1], a25[KY - 1], a26[KY - 2]), f, ['#0C2F55', '#0171CC', '#3B66D6'], false, 'TC')}`;
  };

  const tabGB = () => {
    const adj = st.ct === 2 ? 38 : 0;
    const a25 = P25.map((v) => v + adj), a26 = P26.map((v) => (v == null ? null : v + adj));
    const g = gbbq(DT26, SL26) + adj, f = (v) => nf(Math.round(v));
    const avg = (a) => sum(a) / a.filter((v) => v != null).length;
    const rows = Array.from({ length: 8 }, (_, i) => [i + 1, a25[KY - 1] + ((i * 3) % 5) * 21 - 40, a26[KY - 1] + ((i * 4) % 5) * 19 - 36, a26[KY - 2] + ((i * 2) % 5) * 23 - 44]);
    return `${kpi('#3FCFA1', 'Giá bán bình quân (VNĐ/m³)', nf(g, 2), 'Tỷ lệ thực hiện', nf((g / PLAN.gbbq) * 100, 2) + '%', 'Kế hoạch (VNĐ/m³)', nf(PLAN.gbbq), (g / PLAN.gbbq) * 100)}${ctToggle()}
      ${tcard('Giá bán bình quân theo kỳ', `So sánh ${Y} vs ${Y - 1} — đơn vị: VNĐ/m³`, colChart(KYS, [{ name: Y - 1, leg: `${Y - 1} (đ/m³)`, color: '#0C2F55', data: a25 }, { name: Y, leg: `${Y} (đ/m³)`, color: '#0171CC', data: a26 }], { cat: 'Kỳ ', fmt: f, zoom: true }), yearTable(a25, a26, f, 'Kỳ', 'TB', ['TB', f(avg(a25)), f(avg(a26)), '']))}
      ${dotCard('Giá bán bình quân theo đợt', rows, f, ['#0C2F55', '#0171CC', '#1FC5F0'], true, 'TB', true)}`;
  };

  const ktList = () => {
    const rows = KT_ROWS[st.seg], t = sum(rows.map((r) => r[1])), c = st.seg ? '#3B66D6' : '#D70000';
    return `<div class="tc" id="ktList"><div class="tg wide"><button class="${st.seg ? '' : 'on'}" data-seg="0">Chưa xử lý</button><button class="${st.seg ? 'on' : ''}" data-seg="1">Đã xử lý</button></div>
      <div class="tc-h"><b>${st.seg ? 'Đã xử lý' : 'Chưa xử lý'}</b><small>01/10/${Y} – 31/10/${Y}</small></div>
      <div class="tg"><button class="on" data-tg="c">${ic('bar-chart-3')}Biểu đồ</button><button data-tg="t">${ic('table')}Bảng</button></div>
      <div class="tc-c">${rows.map(([n, v], i) => `<div class="rk"><i class="${i < 3 ? 'top' : ''}" style="--c:${c}">${i + 1}</i><b>${n}</b><span>${nf(v)}</span><em style="color:${c}">${nf((v / t) * 100, 1)}%</em><div class="pb t"><i style="--w:${(v / rows[0][1]) * 100}%;background:${c};--j:${i}"></i></div></div>`).join('')}<div class="rk tot"><b>Tổng</b><span>${nf(t)}</span><em>100%</em></div></div>
      <div class="tc-t">${tbl(['#', 'Nội dung', 'SL', 'Tỷ lệ'], rows.map(([n, v], i) => [i + 1, n, nf(v), nf((v / t) * 100, 1) + '%']), ['', 'Tổng', nf(t), '100%'])}</div></div>`;
  };
  const tabKT = () => {
    const p = (KT.done / KT.total) * 100, sl = [{ l: 'Đã xử lý', v: KT.done, c: '#3B66D6' }, { l: 'Chưa xử lý', v: KT.total - KT.done, c: '#D70000' }];
    return `${kpi('#5AA0FE', 'Tổng hồ sơ KTKS', nf(KT.total), 'Tỷ lệ xử lý', nf(p, 1) + '%', 'Đã xử lý', `${nf(KT.done)} (${nf(p, 1)}%)`, p, '#2fd573')}
      ${tcard('Tỷ lệ xử lý hồ sơ', `${nf(KT.total)} hồ sơ`, donut(sl, 'Hồ sơ'), donutTable(sl, 'Tình trạng'))}${ktList()}`;
  };

  const TABS = [['Khách hàng', tabKH], ['Sản lượng', tabSL], ['Doanh thu', tabDT], ['Giá bán bình quân', tabGB], ['Hồ sơ KTKS', tabKT]];

  /* ---------- main screen ---------- */
  const MODES = [
    { name: 'Doanh thu', unit: 'Tỷ VNĐ', a: DT25, b: DT26, k: 1e9, total: (a) => nf(sum(a) / 1e9, 2) + ' tỷ' },
    { name: 'Giá bán bình quân', unit: 'Nghìn VNĐ/m³', a: P25, b: P26, k: 1e3, zoom: true, total: (a, x) => nf((x ? gbbq(DT26, SL26) : gbbq(DT25, SL25)) / 1e3, 2) + ' nghìn' },
    { name: 'Sản lượng', unit: 'Triệu m³', a: SL25, b: SL26, k: 1e6, total: (a) => nf(sum(a) / 1e6, 2) + ' triệu' }];
  const mainChart = () => {
    const m = MODES[st.chip], f = (v) => nf(v / m.k, 2);
    return `<h4 class="rp-t">BÁO CÁO SO SÁNH THEO NĂM</h4>
      <div class="chs">${MODES.map((x, i) => `<button class="${i === st.chip ? 'on' : ''}" data-chip="${i}">${x.name}</button>`).join('')}</div>
      <p class="unit">Đơn vị: ${m.unit}</p>
      ${colChart(KYS, [{ name: Y - 1, color: '#0171CC', data: m.a }, { name: Y, color: '#0C2F55', data: m.b }], { cat: 'Kỳ ', fmt: f, zoom: m.zoom, leg: false })}
      <div class="cc-leg big"><span><i style="background:#0171CC"></i>Năm ${Y - 1}: <b>${m.total(m.a, 0)}</b></span><span><i style="background:#0C2F55"></i>Năm ${Y}: <b>${m.total(m.b, 1)}</b></span></div>`;
  };
  const CARDS = () => [
    ['Khách hàng', nf(KH), 'Số lượng khách hàng', '#D2AC6C', 'users', 0],
    ['Sản lượng', nf(sum(SL26)), `Tổng sản lượng ${Y} (m³)`, '#00C0DA', 'droplet', 1],
    ['Doanh thu', nf(sum(DT26) / 1e9, 2) + ' tỷ', `Tổng doanh thu ${Y} (VNĐ)`, '#00AD26', 'bar-chart-3', 2],
    ['Tỷ lệ thực thu', '99,66%', `Tỷ lệ thực thu ${Y}`, '#007257', 'banknote', 2],
    ['Thất thoát nước', '7,19', 'Tỷ lệ thất thoát nước (%)', '#D70000', 'droplets'],
    ['Giá bán bình quân', nf(gbbq(DT26, SL26), 2), 'Giá bán bình quân', '#11B482', 'tag', 3],
    ['Thu hộ tiền nước', '352,41 tỷ', `Tổng thu hộ ${Y}`, '#1A7FC1', 'banknote'],
    ['Định danh CCCD', '81.642', 'Số lượng định danh CCCD', '#6A5ACD', 'users'],
    ['Gắn mới ĐHN', '1.034', 'Số lượng gắn mới ĐHN', '#F39200', 'plus-circle'],
    ['Dời ĐHN', '454', 'Số lượng dời ĐHN', '#D86FF3', 'minus-circle'],
    ['Thay ĐHN cỡ nhỏ', '7.302', 'Số lượng thay ĐHN cỡ nhỏ', '#0171CC', 'refresh-cw'],
    ['Thay ĐHN cỡ lớn', '45', 'Số lượng thay ĐHN cỡ lớn', '#054D8E', 'refresh-cw'],
    ['Hồ sơ DVKH', '16.673', 'Số lượng hồ sơ DVKH', '#AC943A', 'file-text'],
    ['Hồ sơ KTKS', nf(KT.total), 'Số lượng hồ sơ KTKS', '#5AA0FE', 'file-text', 4],
    ['Hóa đơn', '', '<span class="hd">0m³<b>4.812</b></span><span class="hd">1→4m³<b>9.376</b></span>', '#2E8B57', 'file-text'],
    ['Hoàn công sửa bể', '1.126', 'Tổng báo bể: 1.208', '#8B4513', 'refresh-cw']];

  const sb = `<div class="sb" style="color:#fff"><span>9:41</span><i>${ic('bar-chart-2')}${ic('zap')}</i></div>`;
  let root;
  const render = () => {
    root.innerHTML = `<div class="app rp">
      <div class="rp-v rp-main"><div class="ah">${sb}<div class="ah-bar"><span></span><span>Báo cáo tổng quan</span><span></span></div></div>
        <div class="rp-s"><div id="rpChart">${mainChart()}</div>
          <div class="kg">${CARDS().map(([t, v, n, c, i, tab], j) => `<${tab == null ? 'div' : 'button'} class="kc" style="background:${c};--j:${j}" ${tab == null ? '' : `data-open="${tab}"`}><h5><i>${ic(i)}</i><span class="${t.length > 10 ? 'sm' : ''}">${t}</span>${tab == null ? '' : ic('chevron-right')}</h5>${v ? `<b>${v}</b>` : ''}<p>${n}</p></${tab == null ? 'div' : 'button'}>`).join('')}</div></div></div>
      <div class="rp-v rp-detail"><div class="ah">${sb}<div class="ah-bar"><button data-back>${ic('chevron-left')}</button><span>Báo cáo tổng quan</span><span style="width:20px"></span></div></div>
        <div class="rp-tabs" id="rpTabs"></div><div class="rp-s" id="rpBody"></div></div></div>`;
  };
  const renderTab = (keep) => {
    const body = $('#rpBody', root), y = body.scrollTop;
    $('#rpTabs', root).innerHTML = TABS.map(([t], i) => `<button class="${i === st.tab ? 'on' : ''}" data-tab="${i}">${t}</button>`).join('');
    body.innerHTML = TABS[st.tab][1]();
    body.scrollTop = keep ? y : 0;
    const on = $('#rpTabs .on', root);
    if (on) $('#rpTabs', root).scrollLeft = on.offsetLeft - 60;
  };

  const tipOf = (g) => { const cc = g.closest('.cc'); cc.querySelectorAll('.sel').forEach((e) => e.classList.remove('sel')); g.classList.add('sel'); $('.cc-tip', cc).textContent = g.dataset.tip; };

  const onClick = (e) => {
    const t = e.target.closest('[data-chip],[data-open],[data-back],[data-tab],[data-tg],[data-ct],[data-seg],.cc-g');
    if (!t) return;
    const d = t.dataset;
    if (d.chip != null) { st.chip = +d.chip; $('#rpChart', root).innerHTML = mainChart(); }
    else if (d.open != null) { st.tab = +d.open; renderTab(); $('.rp', root).classList.add('detail'); }
    else if (d.back != null) $('.rp', root).classList.remove('detail');
    else if (d.tab != null) { st.tab = +d.tab; renderTab(); }
    else if (d.tg) { const c = t.closest('.tc'); c.classList.toggle('tbl', d.tg === 't'); t.parentNode.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b === t)); }
    else if (d.ct) { st.ct = +d.ct; renderTab(true); }
    else if (d.seg != null) { st.seg = +d.seg; $('#ktList', root).outerHTML = ktList(); }
    else tipOf(t);
  };

  /* ---------- demo mode ---------- */
  const layer = $('#demoLayer'), slot = $('#demoSlot'), homeEl = $('#liveHome'), ph = $('#livePhone');
  root = $('#liveScreen');
  if (!root) return;
  render();
  root.addEventListener('click', onClick);
  root.addEventListener('mouseover', (e) => { const g = e.target.closest('.cc-g'); if (g) tipOf(g); });

  const fit = () => ph.style.setProperty('--pk', Math.min((innerHeight - 96) / 820, (innerWidth - 32) / 390, 1.2).toFixed(3));
  const open = () => {
    if (window.DEMO_OPEN) return;
    window.DEMO_OPEN = true;
    Object.assign(st, { chip: 1, tab: 0, ct: 1, seg: 0 });
    render();
    slot.appendChild(ph);
    fit();
    layer.hidden = false;
    document.body.classList.add('demo-on');
  };
  const close = () => {
    if (!window.DEMO_OPEN) return;
    window.DEMO_OPEN = false;
    layer.hidden = true;
    document.body.classList.remove('demo-on');
    homeEl.appendChild(ph);
    ph.style.setProperty('--pk', 0.66);
    render();
  };
  window.closeDemo = close;
  document.addEventListener('click', (e) => { if (e.target.closest('[data-demo-open]')) open(); });
  $('#demoClose').innerHTML = ic('x');
  $('#demoClose').addEventListener('click', close);
  layer.addEventListener('click', (e) => { if (e.target === layer) close(); });
  addEventListener('resize', () => window.DEMO_OPEN && fit());
})();
