(() => {
  const ic = window.ic;
  const $ = (s, r = document) => r.querySelector(s);
  const nf = (n, d = 0) => n.toLocaleString('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d });
  const sum = (a) => a.reduce((t, v) => t + (v || 0), 0);
  const avg = (a) => sum(a) / a.filter((v) => v != null).length;
  const compact = (v) => (v >= 1e9 ? nf(v / 1e9, 2) + ' tỷ' : v >= 1e6 ? nf(v / 1e6, 2) + ' tr' : v >= 1e4 ? nf(v / 1e3, 1) + 'k' : nf(v, v % 1 ? 2 : 0));
  const pc = (v, d = 2) => nf(v, d) + '%';
  const p2 = (v) => nf(v, 2);
  const ty = (v, d = 2) => nf(v / 1e9, d) + ' tỷ';

  /* ---------- mock data (Cấp nước Chợ Lớn) ---------- */
  const Y = 2026, KY = 10;
  const SEAS = [0.9, 0.82, 0.95, 1.04, 1.12, 1.1, 1.06, 1.03, 0.97, 1, 0.93, 0.96];
  const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const wob = (i, m) => 1 + (((i * 37 + m * 11) % 9) - 4) / 220;
  const SL25 = SEAS.map((s, i) => Math.round(7.42e6 * s * wob(i, 1)));
  const SL26 = SEAS.map((s, i) => (i < KY ? Math.round(7.71e6 * s * wob(i, 2)) : null));
  const P25 = SEAS.map((_, i) => 11790 + ((i * 5) % 7) * 18);
  const P26 = SEAS.map((_, i) => (i < KY ? 12010 + ((i * 3) % 7) * 17 : null));
  const DT25 = SL25.map((v, i) => v * P25[i]);
  const DT26 = SL26.map((v, i) => (v == null ? null : v * P26[i]));
  const KYS = SEAS.map((_, i) => i + 1);
  const DOI = [['Đội QLĐHN 1', 'Quận 5, 6, 8'], ['Đội QLĐHN 2', 'Bình Tân']];
  const ML = [['Đội QLMLCN 1', 'Quận 5, 6, 8'], ['Đội QLMLCN 2', 'Bình Tân']];
  const WARDS = [['Chợ Quán', 14820, 0], ['An Đông', 16340, 0], ['Chợ Lớn', 17960, 0], ['Bình Tây', 13450, 0], ['Bình Tiên', 15280, 0], ['Bình Phú', 16730, 0], ['Phú Lâm', 17110, 0], ['Chánh Hưng', 24860, 0], ['Phú Định', 22940, 0], ['Bình Đông', 21370, 0],
    ['An Lạc', 21480, 1], ['Bình Tân', 19760, 1], ['Tân Tạo', 17320, 1], ['Bình Trị Đông', 23910, 1], ['Bình Hưng Hòa', 20650, 1]];
  const KH = sum(WARDS.map((w) => w[1]));
  const KHT = [0, 1].map((t) => sum(WARDS.filter((w) => w[2] === t).map((w) => w[1])));
  const SIZES = [[15, 264300, 0.7], [25, 13480, 0.09], [40, 3640, 0.07], [50, 1590, 0.06], [80, 640, 0.05], [100, 330, 0.03]];
  const GBS = [[11, 0.82, 0.62], [21, 0.035, 0.11], [31, 0.012, 0.05], [41, 0.12, 0.19], [51, 0.013, 0.03]];
  const PLAN = { sl: 92.4e6, dt: 1112e9, gbbq: 12000, tt: 14.5, th: 1068e9, gm: 3600, tn: 26000, tl: 180 };
  const BLUES = ['#3B66D6', '#0C2F55', '#0171CC', '#04ABED', '#92DFFF', '#3B95DC'];
  const HEAT = ['#EAF4FD', '#C7E3F8', '#9CCEF2', '#5FB0E8', '#1296E0', '#0171CC', '#054D8E', '#0C2F55'];
  const PAL = ['#0C2F55', '#0171CC', '#3FCFA1', '#E89A2F', '#D04545', '#7A57D8', '#1FC5F0', '#B084DD', '#EC407A', '#A0A02E', '#7AAEDD', '#EE7A5F', '#2E8BC0', '#6D4C41', '#78909C'];
  const BRIGHT = ['#24759B', '#4CD964', '#FFCC00', '#FF3B30', '#5856D6', '#FF9500', '#3A34DC'];
  const RED = ['#D04545', '#FCEEEE'], ORG = ['#C77700', '#FFF6E9'], NAVY = ['#0C2F55', '#EDF1F8'];

  const dist = (total, k, b2 = 1) => { const w = WARDS.map(([, v, t], i) => v * wob(i, k) ** 6 * (t ? b2 : 1)), s = sum(w), r = w.map((x) => Math.round((total * x) / s)); r[0] += total - sum(r); return WARDS.map(([n], i) => [n, r[i]]); };
  const share = (t, cs) => { const r = cs.map(([, s]) => Math.round(t * s)); r[0] += t - sum(r); return cs.map(([n], i) => [n, r[i]]); };

  const TT25 = KYS.map((_, i) => 14.95 - i * 0.07 + ((i * 7) % 5) * 0.06);
  const TT26 = KYS.map((_, i) => (i < KY ? 14.3 - i * 0.06 + ((i * 3) % 5) * 0.05 : null));
  const ttRows = (k = 1) => SL26.slice(0, KY).map((v, i) => { const tong = v / (1 - TT26[i] / 100), ct = v * k, loss = tong - ct, tt = (loss / tong) * 100; return { tong, ct, loss, tt, ngay: loss / DAYS[i], ttNgay: tt * wob(i, 4) }; });
  const luyKe = (r) => (sum(r.map((x) => x.loss)) / sum(r.map((x) => x.tong))) * 100;
  const TTN = luyKe(ttRows());
  const V1 = TT26.map((v, i) => (v == null ? null : v + 0.84 + ((i * 3) % 4) * 0.05));
  const V2 = TT26.map((v, i) => (v == null ? null : v - 1.47 - ((i * 5) % 4) * 0.04));
  const TV25 = TT25.map((v) => v - 0.31);
  const DMA = [['20–25%', 9, '#E5484D'], ['15–20%', 22, '#F08A3C'], ['10–15%', 41, '#F3C544'], ['5–10%', 34, '#52B788'], ['0–5%', 18, '#3E7BD6']];
  const BN26 = KYS.map((_, i) => (i < KY ? 128 + ((i * 7) % 6) * 9 : null));
  const BO26 = KYS.map((_, i) => (i < KY ? 262 + ((i * 5) % 7) * 12 : null));
  const BE26 = BN26.map((v, i) => (v == null ? null : v + BO26[i]));
  const BE25 = KYS.map((_, i) => 430 + ((i * 4) % 7) * 14);
  const NN = [['Bể ngầm', BN26, [['Ống mục, ăn mòn', 0.38], ['Hư đai khởi thủy', 0.27], ['Lún nền, tải trọng xe', 0.21], ['Thi công công trình khác', 0.14]]], ['Bể nổi', BO26, [['Xì răng trước ĐHN', 0.34], ['Hư van cóc, van góc', 0.29], ['Hư ống nhánh', 0.23], ['Tác động bên ngoài', 0.14]]]].map(([l, a, cs]) => [l, sum(a), share(sum(a), cs)]);
  const NNC = ['#4C6EF5', '#F59F00', '#E64980', '#12B886', '#7048E8', '#FA5252', '#82C91E', '#15AABF'];

  const TH = sum(DT26) * 0.962, THK = DT26[KY - 1] * 0.958, HDK = Math.round(KH * 0.953);
  const DV = [['MoMo', 0.192], ['Vietcombank', 0.151], ['ZaloPay', 0.118], ['Agribank', 0.097], ['Viettel Money', 0.089], ['BIDV', 0.078], ['VNPAY', 0.071], ['VietinBank', 0.062], ['Payoo', 0.054], ['Sacombank', 0.041], ['ACB', 0.029], ['Đông Á Bank', 0.018]];
  const PT = [['Ví điện tử', 0.34], ['Mobile / Internet Banking', 0.27], ['Trích nợ tự động', 0.19], ['Quét mã QR', 0.11], ['Quầy giao dịch', 0.06], ['Cửa hàng tiện lợi', 0.03]];

  const DD = WARDS.map(([n, v, t], i) => [n, Math.round(v * (0.83 + ((i * 5) % 9) * 0.014)), v, t]);
  const GM = dist(3120, 3, 1.9), GMC = [[15, 2874], [25, 152], [40, 58], [50, 24], [80, 9], [100, 3]];
  const DOIDHN = dist(1284, 5, 1.2), THAY = [dist(21460, 7, 0.9), dist(148, 9)];
  const APP = dist(121480, 11, 1.1);
  const HS = {
    dv: [[['Gắn mới ĐHN', 312], ['Sang tên hợp đồng', 268], ['Điều chỉnh định mức', 214], ['Nâng, hạ, dời ĐHN', 173], ['Khiếu nại hóa đơn', 141], ['Báo bể, rò rỉ', 118], ['Tạm ngưng / mở nước', 84]],
      [['Sang tên hợp đồng', 11840], ['Điều chỉnh định mức', 9620], ['Gắn mới ĐHN', 8470], ['Báo bể, rò rỉ', 6930], ['Khiếu nại hóa đơn', 4980], ['Nâng, hạ, dời ĐHN', 3410], ['Tạm ngưng / mở nước', 2360]]],
    kt: [[['Kiểm tra ĐHN', 1384], ['Kiểm tra định mức', 962], ['Bấm chì', 801], ['Đổi giá biểu', 655], ['Sang tên hợp đồng', 461], ['Kiểm tra rò rỉ sau ĐHN', 291], ['Khiếu nại chỉ số', 194]],
      [['Kiểm tra ĐHN', 26840], ['Kiểm tra định mức', 18730], ['Bấm chì', 15760], ['Đổi giá biểu', 10890], ['Sang tên hợp đồng', 9540], ['Kiểm tra rò rỉ sau ĐHN', 6760], ['Khiếu nại chỉ số', 4410]]] };
  const hsTotal = (k) => sum(HS[k].flat().map((r) => r[1]));
  const H0 = KYS.map((_, i) => (i < KY ? 14200 + ((i * 5) % 7) * 230 : null));
  const H14 = KYS.map((_, i) => (i < KY ? 27100 + ((i * 3) % 7) * 410 : null));
  const TS = [['Ống phân phối', 'km', '#E89A2F', 742.6, 486.9], ['Ống ngành', 'km', '#6B7280', 518.3, 337.2], ['Ống truyền tải', 'km', '#9CA3AF', 96.4, 58.7], ['Đồng hồ khách hàng', 'cái', '#1E2E4A', ...KHT], ['Thủy đài', 'cái', '#9C27B0', 0, 0], ['Đồng hồ tổng', 'cái', '#5AC8FA', 71, 46],
    ['Mối nối', 'cái', '#8B95A5', 18640, 11820], ['Trụ cứu hỏa', 'cái', '#D04545', 1486, 902], ['Van điều khiển', 'cái', '#E07A5F', 2930, 1870], ['Van hệ thống', 'cái', '#11B482', 412, 268], ['DMA', 'cái', '#E8C33F', 78, 46]];

  const st = { chip: 1, tab: 0, ct: 1, sg: {} };
  const sg = (k) => st.sg[k] || 0;
  const ctf = () => (st.ct === 2 ? 1.012 : 1);
  const gbbq = (dt, sl) => sum(dt) / sum(sl);

  /* ---------- components ---------- */
  const colChart = (cats, series, o = {}) => {
    const all = series.flatMap((s) => s.data).filter((v) => v != null);
    const max = Math.max(...all), min = Math.min(...all), base = o.zoom ? Math.max(0, min - (max - min) * 0.35) : 0;
    const fmt = o.fmt || compact, ln = o.line;
    const label = series.length === 1 && cats.length <= 8;
    let line = '';
    if (ln) {
      const v = ln.data.filter((x) => x != null), lo = Math.min(...v) * 0.9, hi = Math.max(...v) * 1.04;
      const pts = ln.data.map((x, i) => (x == null ? null : `${i + 0.5} ${(100 - ((x - lo) / (hi - lo)) * 100).toFixed(1)}`)).filter(Boolean);
      line = `<svg class="cc-ln" viewBox="0 0 ${cats.length} 100" preserveAspectRatio="none" style="--c:${ln.color}"><path d="M${pts.join('L')}"/>${pts.map((p) => `<path class="d" d="M${p}h.001"/>`).join('')}</svg>`;
    }
    return `<div class="cc"><div class="cc-tip">Chạm vào cột để xem số liệu</div><div class="cc-plot">${cats.map((c, i) => {
      const tip = `${o.cat || ''}${c} · ` + series.map((s) => `${s.name}: ${s.data[i] == null ? '--' : fmt(s.data[i])}`).join(' · ') + (ln ? ` · ${ln.name}: ${ln.data[i] == null ? '--' : ln.fmt(ln.data[i])}` : '');
      return `<div class="cc-g" data-tip="${tip}"><div class="cc-b">${series.map((s) => (s.data[i] == null ? '<i style="--h:0%"></i>' : `<i style="--h:${(((s.data[i] - base) / (max - base || 1)) * 100).toFixed(1)}%;--c:${s.color};--j:${i}" ${label ? `data-v="${fmt(s.data[i])}"` : ''}></i>`)).join('')}</div><span>${c}</span></div>`;
    }).join('')}${line}</div>${(series.length > 1 || ln) && o.leg !== false ? `<div class="cc-leg">${series.map((s) => `<span><i style="background:${s.color}"></i>${s.leg || s.name}</span>`).join('')}${ln ? `<span><i class="ln" style="background:${ln.color}"></i>${ln.name}</span>` : ''}</div>` : ''}</div>`;
  };

  const dc = (v, fmt = nf) => (v == null ? '--' : v >= 0 ? `${fmt(v)} <em class="up">▲</em>` : `${fmt(v)} <em class="dn">▼</em>`);
  const tbl = (heads, rows, total) => `<table class="tb"><thead><tr>${heads.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>${total ? `<tfoot><tr>${total.map((c) => `<td>${c}</td>`).join('')}</tr></tfoot>` : ''}</table>`;

  const tgl = () => `<div class="tg"><button class="on" data-tg="c">${ic('bar-chart-3')}Biểu đồ</button><button data-tg="t">${ic('table')}Bảng</button></div>`;
  const tcard = (title, sub, chart, table) => `<div class="tc"><div class="tc-h"><b>${title}</b><small>${sub}</small></div>${tgl()}<div class="tc-c">${chart}</div><div class="tc-t">${table}</div></div>`;
  const seg = (k, opts, w) => `<div class="tg ${w ? '' : 'wide'}" ${w ? `style="width:${w}px"` : ''}>${opts.map((o, i) => `<button class="${sg(k) === i ? 'on' : ''}" data-sg="${k}" data-v="${i}">${o}</button>`).join('')}</div>`;

  const donut = (slices, label, fmt = nf, o = {}) => {
    const total = sum(slices.map((s) => s.v));
    let acc = 0;
    const arcs = slices.map((s) => { const p = (s.v / total) * 100; const c = `<circle r="15.915" cx="21" cy="21" stroke="${s.c}" stroke-dasharray="${p} ${100 - p}" stroke-dashoffset="${25 - acc}"/>`; acc += p; return c; }).join('');
    return `<div class="dnt"><svg viewBox="0 0 42 42">${arcs}<text x="21" y="20.5">${(o.cfmt || fmt)(total)}</text><text x="21" y="25" class="s">${label}</text></svg>
      <div class="dnt-l ${o.one ? 'one' : ''}">${slices.map((s) => `<span><i style="background:${s.c}"></i><u>${s.l}</u><b>${fmt(s.v)}</b><em>${nf((s.v / total) * 100, 1)}%</em></span>`).join('')}</div></div>`;
  };
  const donutTable = (slices, first, fmt = nf) => { const t = sum(slices.map((s) => s.v)); return tbl([first, 'Số lượng', 'Tỷ lệ %'], slices.map((s) => [s.l, fmt(s.v), nf((s.v / t) * 100, 1) + '%']), ['Tổng', fmt(t), '100%']); };
  const slices = (rows, pal = PAL, sort = true) => (sort ? [...rows].sort((a, b) => b[1] - a[1]) : rows).map(([l, v], i) => ({ l, v, c: pal[i % pal.length] }));
  const wardDonut = (title, sub, rows, label = 'Tổng') => { const s = slices(rows); return tcard(title, sub, donut(s, label, nf, { one: true }), donutTable(s, 'Phường')); };

  const kpi = (c, l1, v1, l2, v2, rl, rv, pct, bar = '#fff') => `<div class="kp" style="background:${c}"><div class="kp-r"><div><small>${l1}</small><b>${v1}</b></div><div class="r"><small>${l2}</small><b>${v2}</b></div></div>
    <div class="kp-r s"><span>${rl}</span><span>${rv}</span></div><div class="pb"><i style="--w:${Math.min(100, pct).toFixed(1)}%;background:${bar}"></i></div></div>`;
  const kpiPlan = (c, label, v, plan) => kpi(c, label, nf(v), 'Kế hoạch', nf(plan), 'Tỷ lệ đạt', pc((v / plan) * 100), (v / plan) * 100, v >= plan ? '#2fd573' : '#fff');
  const s2 = (c, head, tiles) => `<div class="s2"><div class="s2-h" style="--c:${c}">${head}</div><div class="s2-r">${tiles.map(([l, v, tc, n]) => `<div style="--c:${tc}"><small>${l}</small><b>${v}</b>${n ? `<small>${n}</small>` : ''}</div>`).join('')}</div></div>`;
  const mg = (items) => `<div class="mg">${items.map(([l, v, [c, b], f]) => `<div class="${f ? 'f' : ''}" style="--c:${c};--b:${b}"><small>${l}</small><b>${v}</b></div>`).join('')}</div>`;
  const rank = (rows, c, total) => rows.map(([n, v, p, w], i) => `<div class="rk"><i class="${i < 3 ? 'top' : ''}" style="--c:${c}">${i + 1}</i><b>${n}</b><span>${v}</span><em style="color:${c}">${p}</em><div class="pb t"><i style="--w:${w}%;background:${c};--j:${i}"></i></div></div>`).join('') + (total ? `<div class="rk tot"><b>Tổng</b><span>${total[0]}</span><em>${total[1]}</em></div>` : '');
  const ctToggle = () => `<div class="tg wide"><button class="${st.ct === 1 ? 'on' : ''}" data-ct="1">Chuẩn thu 1 (không TT)</button><button class="${st.ct === 2 ? 'on' : ''}" data-ct="2">Chuẩn thu 2 (có TT)</button></div>`;
  const acc = (t, s) => `<div class="ac"><i></i><div><b>${t}</b><small>${s}</small></div></div>`;

  const yearSeries = (a25, a26, unit) => [{ name: Y - 1, leg: `Năm ${Y - 1}${unit}`, color: '#3B66D6', data: a25 }, { name: Y, leg: `Năm ${Y}${unit}`, color: '#0C2F55', data: a26 }];
  const yearTable = (a25, a26, fmt, first = 'Kỳ', totalLabel = 'TC', total) => tbl([first, Y - 1, Y, '+/-'], KYS.map((k, i) => [k, fmt(a25[i]), a26[i] == null ? '--' : fmt(a26[i]), a26[i] == null ? '--' : dc(a26[i] - a25[i], fmt)]), total || [totalLabel, fmt(sum(a25)), fmt(sum(a26)), '']);
  const cmp = (title, sub, a, b, fmt, o = {}) => tcard(title, sub, colChart(KYS, [{ name: Y - 1, leg: `Năm ${Y - 1}`, color: o.c1 || '#3B66D6', data: a }, { name: Y, leg: `Năm ${Y}`, color: o.c2 || '#0C2F55', data: b }], { cat: 'Kỳ ', fmt: o.tf || fmt, zoom: o.zoom }),
    yearTable(a, b, fmt, 'Kỳ', 'TC', o.avg ? ['TB', fmt(avg(a)), fmt(avg(b)), ''] : null));

  /* ---------- tabs ---------- */
  const tabKH = () => {
    const half = (t) => { const list = WARDS.filter((w) => w[2] === t); return `<div class="qg"><h5><i></i>${DOI[t][0]}</h5><small>${DOI[t][1]}</small>${[...list].sort((a, b) => b[1] - a[1]).map(([n, v]) => `<p><b>${n}</b><span>${nf(v)}</span></p>`).join('')}<div class="qt"><b>${nf(KHT[t])}</b><span>${nf((KHT[t] / KH) * 100, 1)}%</span></div><div class="pb t"><i style="--w:${(KHT[t] / KH) * 100}%;background:#3B66D6"></i></div></div>`; };
    const sizes = SIZES.map(([mm, v], i) => ({ l: mm + 'mm', v, c: BLUES[i] }));
    const heat = WARDS.map(([n, v, t], wi) => [n, GBS.map(([, s], gi) => Math.round(v * s * wob(wi, gi))), t]);
    const hmax = Math.max(...heat.flatMap((r) => r[1]));
    const cell = (v) => { const r = Math.sqrt(v / hmax), k = Math.min(7, Math.floor(r * 8)); return `<td style="background:${HEAT[k]};color:${k > 3 ? '#fff' : '#0C2F55'}" title="Số KH: ${nf(v)}">${v >= 1000 ? nf(v / 1000, 1) + 'N' : v}</td>`; };
    const hrows = (t) => `<tr class="hm-g"><th colspan="${GBS.length + 1}">${DOI[t].join(' · ')}</th></tr>${heat.filter((r) => r[2] === t).map(([n, r]) => `<tr><th>${n}</th>${r.map(cell).join('')}</tr>`).join('')}`;
    return `<div class="tc"><div class="tc-h row"><b>KHÁCH HÀNG THEO PHƯỜNG</b><b>${nf(KH)} KH</b></div><div class="qgs">${half(0)}${half(1)}</div></div>
      ${tcard('Khách hàng theo cỡ ĐHN', `Kỳ ${KY} - Tất cả phường - Năm ${Y}`, donut(sizes, 'Tổng'), donutTable(sizes, 'Cỡ ĐHN'))}
      ${tcard('Khách hàng theo giá biểu', `Kỳ ${KY} - Tất cả phường - Năm ${Y}`, `<table class="hm"><thead><tr><th></th>${GBS.map(([g]) => `<th>GB ${g}</th>`).join('')}</tr></thead><tbody>${hrows(0)}${hrows(1)}</tbody></table><div class="hm-s"><span>Ít</span><i></i><span>Nhiều</span></div>`,
        tbl(['Phường', ...GBS.map(([g]) => 'GB ' + g)], heat.map(([n, r]) => [n, ...r.map((v) => nf(v))]), ['TC', ...GBS.map((_, gi) => nf(sum(heat.map((r) => r[1][gi]))))]))}`;
  };

  const tabSL = () => {
    const a25 = SL25.map((v) => v * ctf()), a26 = SL26.map((v) => (v == null ? null : v * ctf()));
    const t = sum(a26), t25 = sum(a25.slice(0, KY));
    const split = (rows, key) => rows.map((r) => [r[0], t25 * r[key], t * r[key] * 1.004]);
    const two = (rows, label, w) => { const s = [{ name: Y - 1, leg: `Năm ${Y - 1} (m³)`, color: '#3B66D6', data: rows.map((r) => r[1]) }, { name: Y, leg: `Năm ${Y} (m³)`, color: '#0C2F55', data: rows.map((r) => r[2]) }]; return [colChart(rows.map((r) => r[0]), s, { cat: label + ' ' }), tbl([w, Y - 1, Y], rows.map((r) => [r[0], nf(Math.round(r[1])), nf(Math.round(r[2]))]))]; };
    const gb = two(split(GBS, 2), 'GB', 'GB'), co = two(split(SIZES, 2), 'Cỡ', 'Cỡ');
    const f = (v) => nf(Math.round(v));
    return `${kpi('#3B66D6', `Tổng sản lượng ${Y} (m³)`, f(t), 'Tỷ lệ đạt', pc((t / PLAN.sl) * 100), 'Kế hoạch (m³)', f(PLAN.sl), (t / PLAN.sl) * 100, '#DDA134')}${ctToggle()}
      ${acc('TỔNG HỢP THEO NĂM', 'So sánh sản lượng các kỳ')}
      ${tcard('Tổng hợp theo năm', `${Y - 1} vs ${Y} (m³)`, colChart(KYS, yearSeries(a25, a26, ' (m³)'), { cat: 'Kỳ ' }), yearTable(a25, a26, f))}
      ${tcard('Sản lượng theo giá biểu', `${Y - 1} vs ${Y} (m³) · lũy kế ${KY} kỳ`, gb[0], gb[1])}
      ${tcard('Sản lượng theo cỡ đồng hồ nước', `${Y - 1} vs ${Y} (m³) · lũy kế ${KY} kỳ`, co[0], co[1])}`;
  };

  const dotData = (cur, prevYear, prevPeriod, n = 8) => Array.from({ length: n }, (_, i) => { const w = (0.9 + ((i * 5) % 7) * 0.035) / n / 1.005; return [i + 1, prevYear * w * wob(i, 3), cur * w * wob(i, 5), prevPeriod * w * wob(i, 7)]; });
  const dotCard = (title, rows, fmt, colors, zoom, totalLabel, mean) => {
    const names = [`${KY}/${Y - 1}`, `${KY}/${Y}`, `${KY - 1}/${Y}`];
    const s = [1, 2, 3].map((c, x) => ({ name: names[x], color: colors[x], data: rows.map((r) => r[c]) }));
    const tot = (c) => (mean ? sum(rows.map((r) => r[c])) / rows.length : sum(rows.map((r) => r[c])));
    return tcard(title, `Kỳ ${KY} - Năm ${Y} - Tất cả phường`, colChart(rows.map((r) => r[0]), s, { cat: 'Đợt ', fmt, zoom }),
      tbl(['Đợt', '+/- Năm', names[0], names[1], names[2], '+/- Kỳ'], rows.map((r) => [r[0], dc(r[2] - r[1], fmt), fmt(r[1]), fmt(r[2]), fmt(r[3]), dc(r[2] - r[3], fmt)]), [totalLabel, '', fmt(tot(1)), fmt(tot(2)), fmt(tot(3)), '']));
  };

  const tabDT = () => {
    const a25 = DT25.map((v) => v * ctf()), a26 = DT26.map((v) => (v == null ? null : v * ctf()));
    const t = sum(a26), f = (v) => nf(v / 1e9, 2);
    return `${kpi('#00AD26', `Tổng doanh thu ${Y} (VNĐ)`, nf(Math.round(t)), 'Tỷ lệ thực hiện', pc((t / PLAN.dt) * 100), `Kế hoạch ${Y} (VNĐ)`, nf(PLAN.dt), (t / PLAN.dt) * 100)}${ctToggle()}
      ${tcard('Doanh thu theo kỳ', `${Y - 1} vs ${Y} (tỷ)`, colChart(KYS, yearSeries(a25, a26, ''), { cat: 'Kỳ ', fmt: (v) => f(v) + ' tỷ' }), yearTable(a25, a26, f))}
      ${dotCard('Doanh thu theo đợt', dotData(a26[KY - 1], a25[KY - 1], a26[KY - 2]), f, ['#0C2F55', '#0171CC', '#3B66D6'], false, 'TC')}`;
  };

  const tabTT = () => {
    const k = ctf(), r1 = ttRows(), r = ttRows(k), lk = luyKe(r), cur = r[KY - 1];
    const ctl = st.ct === 2 ? 'Chuẩn thu 2 (có truy thu)' : 'Chuẩn thu 1 (không truy thu)';
    const adj = (a) => a.map((v) => (v == null ? null : 100 - (100 - v) * k));
    const f = (v) => nf(Math.round(v)), kys = KYS.slice(0, KY);
    const detail = (title, rows, h1, h2) => tcard(title, `Năm ${Y}`,
      colChart(kys, [{ name: 'Tỷ lệ thất thoát', color: '#3B66D6', data: rows.map((x) => x.tt) }, { name: 'Tỷ lệ TT ngày', color: '#04ABED', data: rows.map((x) => x.ttNgay) }], { cat: 'Kỳ ', fmt: pc, zoom: true, line: { name: 'Lượng thất thoát', color: '#F39200', data: rows.map((x) => x.loss), fmt: (v) => f(v) + ' m³' } }),
      tbl(['Kỳ', h1, h2, 'Thất thoát (m³)', 'Tỷ lệ TT (%)', 'TT ngày (m³)', 'Tỷ lệ TT ngày (%)'], rows.map((x, i) => [`Kỳ ${i + 1}`, f(x.tong), f(x.ct), f(x.loss), pc(x.tt), f(x.ngay), pc(x.ttNgay)]),
        ['TC/TB', f(sum(rows.map((x) => x.tong))), f(sum(rows.map((x) => x.ct))), f(sum(rows.map((x) => x.loss))), pc(luyKe(rows)), f(avg(rows.map((x) => x.ngay))), pc(avg(rows.map((x) => x.ttNgay)))]));
    const two = (title, sub, s, heads, total) => tcard(title, sub, colChart(KYS, s, { cat: 'Kỳ ', fmt: s[0].fmt, zoom: s[0].zoom }), tbl(heads, kys.map((_, i) => [`Kỳ ${i + 1}`, ...s.map((x) => x.cell(x.data[i])), ...(s.length > 1 ? [s[0].cell(s.sum ? s.sum[i] : sum(s.map((x) => x.data[i])))] : [])]), total));
    const pct = (name, color, data) => ({ name, color, data, fmt: pc, zoom: true, cell: p2 });
    const pts = (name, color, data) => ({ name, color, data, fmt: (v) => nf(v) + ' điểm', cell: nf });
    const vung = [pct('Đội 1 (Q.5, 6, 8)', '#D04545', V1), pct('Đội 2 (Bình Tân)', '#E89A2F', V2)];
    vung.sum = TT26;
    const dma = DMA.map(([l, v, c]) => ({ l, v, c })), be = [pts('Bể ngầm', '#2C7A7B', BN26), pts('Bể nổi', '#D69E2E', BO26)];
    const nn = NN.flatMap((x) => x[2]).map(([l, v], i) => ({ l, v, c: NNC[i] })), nnT = sum(nn.map((x) => x.v));
    return `${kpi('#D04545', 'Tỷ lệ thất thoát nước', pc(TTN), 'Đạt kế hoạch', pc((PLAN.tt / TTN) * 100), 'Mức kế hoạch tối đa', pc(PLAN.tt), (TTN / PLAN.tt) * 100)}
      ${cmp('Tỷ lệ thất thoát so sánh 2 năm', `So sánh ${Y} vs ${Y - 1} — đơn vị: %`, TT25, TT26, p2, { zoom: true, avg: true, tf: pc })}
      ${detail('Chi tiết sản lượng & lượng nước thất thoát theo kỳ', r1, 'SL Tổng (m³)', 'SL đọc chuẩn 1 (m³)')}
      ${acc('TTN THEO ĐHT MUA BÁN SỈ', ctl)}${ctToggle()}
      <div class="tc"><div class="tc-h"><b>Báo cáo kỳ ${KY}</b><small>Kỳ ${KY}/${Y}</small></div>${mg([[`TTN KỲ ${KY}`, pc(cur.tt), RED], [`TTN KỲ ${KY} THEO NGÀY`, pc(cur.ttNgay), RED], ['TTN LŨY KẾ', pc(lk), ORG], ['TTN LŨY KẾ THEO NGÀY', pc(lk * 1.004), ORG], ['TỶ LỆ THỰC HIỆN', pc((PLAN.tt / lk) * 100), NAVY, 1]])}</div>
      ${cmp(`So sánh 2 năm — ${ctl}`, `So sánh ${Y} vs ${Y - 1} — đơn vị: %`, adj(TT25), adj(TT26), p2, { zoom: true, avg: true, tf: pc })}
      ${detail(`Chi tiết TTN theo kỳ — ${ctl}`, r, 'SL ĐHT (m³)', 'SL chuẩn thu (m³)')}
      ${acc('TTTN THEO ĐHT DMA', ML.map((m) => `${m[0]}: ${m[1]}`).join(' · '))}
      <div class="tc"><div class="tc-h"><b>Kỳ hiện tại</b><small>Kỳ ${KY}/${Y}</small></div>${mg([[`${ML[0][0]} kỳ ${KY}`, pc(V1[KY - 1]), RED], [`${ML[1][0]} kỳ ${KY}`, pc(V2[KY - 1]), ORG], [`Tổng vùng kỳ ${KY}`, pc(TT26[KY - 1]), NAVY, 1]])}</div>
      ${two('TTN Đội 1 và Đội 2 từng kỳ', `Tỷ lệ TTN theo đội QLMLCN — ${Y} — đơn vị: %`, vung, ['Kỳ', 'Đội 1 (%)', 'Đội 2 (%)', 'Tổng (%)'], ['TB', p2(avg(V1)), p2(avg(V2)), p2(avg(TT26))])}
      ${two('TTN Tổng vùng từng kỳ', `Tỷ lệ TTN tổng vùng DMA — ${Y} — đơn vị: %`, [pct('Tổng vùng', '#3E7BD6', TT26)], ['Kỳ', 'Tổng vùng (%)'], ['TB', p2(avg(TT26))])}
      ${cmp(`So sánh Tổng vùng ${Y} vs ${Y - 1}`, 'So sánh theo từng kỳ — đơn vị: %', TV25, TT26, p2, { zoom: true, avg: true, tf: pc, c1: '#5B7CAE', c2: '#1E4C93' })}
      ${tcard('Tỷ lệ TTN DMA', `Kỳ ${KY}/${Y} — Tổng ${sum(DMA.map((d) => d[1]))} DMA`, donut(dma, 'DMA', (v) => v + ' DMA', { cfmt: nf }), donutTable(dma, 'Khoảng', (v) => v + ' DMA'))}
      ${acc('SỐ ĐIỂM BỂ ĐÃ SỬA', `Năm ${Y}`)}
      ${two('Số điểm bể từng kỳ', `Bể ngầm và bể nổi theo từng kỳ — Năm ${Y}`, be, ['Kỳ', 'Bể ngầm', 'Bể nổi', 'Tổng'], ['TC', nf(sum(BN26)), nf(sum(BO26)), nf(sum(BE26))])}
      ${cmp(`So sánh Tổng điểm bể ${Y} vs ${Y - 1}`, 'Tổng số điểm bể theo từng kỳ', BE25, BE26, nf, { c1: '#B794D4', c2: '#6B46C1', tf: (v) => nf(v) + ' điểm' })}
      ${tcard('Thống kê nguyên nhân bể', `Lũy kế ${KY} kỳ ${Y} — Tổng ${nf(nnT)} điểm bể`, donut(nn, 'điểm bể', (v) => nf(v) + ' điểm', { cfmt: nf, one: true }),
        NN.map(([l, t, cs]) => `<p class="st">${l} — ${nf(t)} điểm</p>${tbl(['Nguyên nhân', 'Số lượng', 'Tỷ lệ'], cs.map(([n, v]) => [n, nf(v), pc((v / t) * 100)]), ['Tổng', nf(t), '100%'])}`).join(''))}`;
  };

  const tabGB = () => {
    const adj = st.ct === 2 ? 38 : 0;
    const a25 = P25.map((v) => v + adj), a26 = P26.map((v) => (v == null ? null : v + adj));
    const g = gbbq(DT26, SL26) + adj, f = (v) => nf(Math.round(v));
    const rows = Array.from({ length: 8 }, (_, i) => [i + 1, a25[KY - 1] + ((i * 3) % 5) * 21 - 40, a26[KY - 1] + ((i * 4) % 5) * 19 - 36, a26[KY - 2] + ((i * 2) % 5) * 23 - 44]);
    return `${kpi('#3FCFA1', 'Giá bán bình quân (VNĐ/m³)', nf(g, 2), 'Tỷ lệ thực hiện', pc((g / PLAN.gbbq) * 100), 'Kế hoạch (VNĐ/m³)', nf(PLAN.gbbq), (g / PLAN.gbbq) * 100)}${ctToggle()}
      ${tcard('Giá bán bình quân theo kỳ', `So sánh ${Y} vs ${Y - 1} — đơn vị: VNĐ/m³`, colChart(KYS, [{ name: Y - 1, leg: `${Y - 1} (đ/m³)`, color: '#0C2F55', data: a25 }, { name: Y, leg: `${Y} (đ/m³)`, color: '#0171CC', data: a26 }], { cat: 'Kỳ ', fmt: f, zoom: true }), yearTable(a25, a26, f, 'Kỳ', 'TB', ['TB', f(avg(a25)), f(avg(a26)), '']))}
      ${dotCard('Giá bán bình quân theo đợt', rows, f, ['#0C2F55', '#0171CC', '#1FC5F0'], true, 'TB', true)}`;
  };

  const tabTH = () => {
    const dv = DV.map(([l, s], i) => ({ l, v: TH * s, c: PAL[i], n: Math.round(HDK * KY * 0.97 * s) }));
    const pt = PT.map(([n, s]) => [n, THK * s, Math.round(HDK * s), s * 100]);
    return `${kpi('#1A7FC1', 'Tổng thu hộ tiền nước (VNĐ)', nf(Math.round(TH)), 'Tỷ lệ thực hiện', pc((TH / PLAN.th) * 100), `Kế hoạch ${Y} (VNĐ)`, nf(PLAN.th), (TH / PLAN.th) * 100)}
      <div class="tc"><div class="tc-h"><b>Chi tiết theo kỳ</b><small>Kỳ ${KY}/${Y}</small></div>${mg([['Kỳ', `${KY}/${Y}`, NAVY], ['Tổng cộng', ty(THK), NAVY], ['Số HĐ', nf(HDK), NAVY], ['Tỷ lệ', pc((THK / DT26[KY - 1]) * 100), NAVY]])}</div>
      ${tcard('Phân bổ thu hộ theo đơn vị', `${DV.length} đơn vị · Tổng: ${ty(TH)}`, donut(dv, 'Tổng', ty, { cfmt: (v) => ty(v, 1), one: true }), tbl(['Đơn vị thu', 'Số lượng', 'Doanh thu (VNĐ)', 'Tỷ lệ %'], dv.map((d) => [d.l, nf(d.n), nf(Math.round(d.v)), pc((d.v / TH) * 100)]), ['TC', nf(sum(dv.map((d) => d.n))), nf(Math.round(TH)), '100%']))}
      ${tcard('Xếp hạng phương thức thu', `Kỳ ${KY} - Năm ${Y} · ${PT.length} phương thức`, rank(pt.map(([n, v, , p]) => [n, ty(v), pc(p, 1), (p / pt[0][3]) * 100]), '#1A7FC1'), tbl(['Phương thức', 'Tổng (VNĐ)', 'Số HĐ', 'Tỷ lệ %'], pt.map(([n, v, h, p]) => [n, nf(Math.round(v)), nf(h), pc(p)]), ['TC', nf(Math.round(THK)), nf(sum(pt.map((x) => x[2]))), '100%']))}`;
  };

  const tabDD = () => {
    const s = sg('dd'), val = (r) => (s ? r[2] - r[1] : r[1]), tot = sum(DD.map(val));
    const team = (t) => { const l = DD.filter((r) => r[3] === t), a = sum(l.map(val)); return [`${DOI[t][0]} · ${pc((a / KHT[t]) * 100)}`, nf(a), t ? '#F39200' : '#1FA383', DOI[t][1]]; };
    const rows = DD.map(([n, c, k]) => [n, c, k, (c / k) * 100]).sort((a, b) => b[3] - a[3]);
    return `${seg('dd', ['Đã định danh', 'Chưa định danh'], 260)}
      ${s2(s ? '#D70000' : '#6A5ACD', `<div><small>${s ? 'Tổng danh bộ chưa cập CCCD' : 'Tổng số CCCD'}</small><b>${nf(tot)}</b></div><div class="r"><small>Trên tổng KH</small><b>${pc((tot / KH) * 100)}</b></div>`, [team(0), team(1)])}
      ${s ? wardDonut('Danh bộ chưa cập CCCD theo phường', 'Tỷ trọng trên tổng số danh bộ chưa cập CCCD', DD.map((r) => [r[0], val(r)]), 'Tổng DB')
        : wardDonut('Phân bổ CCCD đã cập nhật theo phường', 'Tỷ trọng trên tổng số CCCD toàn đơn vị', DD, 'Tổng CCCD') + tcard('Tỷ lệ hoàn thành định danh theo phường', 'Xếp hạng theo tỷ lệ CCCD đã cập nhật / tổng số KH', rank(rows.map(([n, c, k, p]) => [n, `${nf(c)} · ${nf(k)}`, pc(p, 0), p]), '#0171CC'),
          tbl(['#', 'Phường', 'SL CCCD', 'SL KH', 'Tỷ lệ %'], rows.map(([n, c, k, p], i) => [i + 1, n, nf(c), nf(k), pc(p, 0)]), ['', 'TC', nf(sum(rows.map((r) => r[1]))), nf(KH), '']))}`;
  };

  const tabGM = () => { const t = sum(GM.map((r) => r[1])), co = slices(GMC.map(([c, v]) => ['Cỡ ' + c, v]), BRIGHT); return `${kpiPlan('#F39200', 'Số lượng gắn mới ĐHN', t, PLAN.gm)}
      ${wardDonut('Phân bổ theo phường', `Năm ${Y}`, GM)}${tcard('Phân bổ theo cỡ ĐHN', `Năm ${Y}`, donut(co, 'Tổng'), donutTable(co, 'Cỡ ĐHN'))}`; };

  const tabDoi = () => `<div class="kp" style="background:#D86FF3"><div class="kp-r"><div><small>Tổng số lượng dời ĐHN theo phường</small><b>${nf(sum(DOIDHN.map((r) => r[1])))}</b></div></div></div>${wardDonut('Dời ĐHN theo phường', `Năm ${Y}`, DOIDHN)}`;

  const tabThay = () => { const s = sg('thay'), name = s ? 'Thay ĐHN cỡ lớn' : 'Thay ĐHN cỡ nhỏ'; return `${seg('thay', ['Cỡ nhỏ', 'Cỡ lớn'], 180)}${kpiPlan(s ? '#054D8E' : '#0171CC', name, sum(THAY[s].map((r) => r[1])), s ? PLAN.tl : PLAN.tn)}${wardDonut(`Phân bổ ${name} theo phường`, `Năm ${Y}`, THAY[s])}`; };

  const hoSo = (k, c, name) => {
    const tot = HS[k].map((r) => sum(r.map((x) => x[1]))), total = sum(tot), p = (tot[1] / total) * 100, s = sg(k), rows = HS[k][s], t = tot[s], col = s ? '#3B66D6' : '#D70000';
    const sl = [{ l: 'Đã xử lý', v: tot[1], c: '#3B66D6' }, { l: 'Chưa xử lý', v: tot[0], c: '#D70000' }];
    return `${kpi(c, `Tổng hồ sơ ${name}`, nf(total), 'Tỷ lệ xử lý', pc(p, 1), 'Đã xử lý', `${nf(tot[1])} (${pc(p, 1)})`, p, '#2fd573')}
      ${tcard('Tỷ lệ xử lý hồ sơ', `${nf(total)} hồ sơ`, donut(sl, 'Tổng'), donutTable(sl, 'Tình trạng'))}
      <div class="tc">${seg(k, ['Chưa xử lý', 'Đã xử lý'])}<div class="tc-h"><b>${s ? 'Đã xử lý' : 'Chưa xử lý'}</b><small>01/01/${Y} – 13/10/${Y}</small></div>${tgl()}
      <div class="tc-c">${rank(rows.map(([n, v]) => [n, nf(v), pc((v / t) * 100, 1), (v / rows[0][1]) * 100]), col, [nf(t), '100%'])}</div>
      <div class="tc-t">${tbl(['#', 'Nội dung', 'SL', 'Tỷ lệ'], rows.map(([n, v], i) => [i + 1, n, nf(v), pc((v / t) * 100)]), ['', 'Tổng', nf(t), '100%'])}</div></div>`;
  };

  const tabHD = () => {
    const t0 = sum(H0), t14 = sum(H14), f = (v) => nf(v) + ' HĐ';
    const one = (title, a, c) => tcard(title, `Năm ${Y}`, colChart(KYS, [{ name: `Năm ${Y}`, color: c, data: a }], { cat: 'Kỳ ', fmt: f, zoom: true }), tbl(['Kỳ đọc số', `Số lượng (${Y})`], a.slice(0, KY).map((v, i) => [`Kỳ ${i + 1}/${Y}`, nf(v)]), ['Tổng', nf(sum(a))]));
    return `${s2('#2E8B57', `<div><small>HÓA ĐƠN THEO LOẠI SẢN LƯỢNG</small><small>Tổng hóa đơn 0-4m³ ${Y}</small><b>${nf(t0 + t14)}</b></div><div class="r"><small>Số kỳ</small><b>${KY}</b></div>`, [['Hóa đơn 0m³', nf(t0), '#1FA383'], ['Hóa đơn 1-4m³', nf(t14), '#F39200']])}
      ${one('Hóa đơn 0m³', H0, '#2E8B57')}${one('Hóa đơn 1-4m³', H14, '#F39200')}
      ${tcard('Hóa đơn 0-4m³', `Năm ${Y}`, colChart(KYS, [{ name: '0m³', color: '#2E8B57', data: H0 }, { name: '1-4m³', color: '#F39200', data: H14 }], { cat: 'Kỳ ', fmt: f }), tbl(['Kỳ', '0m³', '1-4m³', 'Tổng'], H0.slice(0, KY).map((v, i) => [`Kỳ ${i + 1}`, nf(v), nf(H14[i]), nf(v + H14[i])]), ['TC', nf(t0), nf(t14), nf(t0 + t14)]))}`;
  };

  const tabApp = () => { const t = sum(APP.map((r) => r[1])), p = (t / KH) * 100; return `<div class="sw"><div class="sw-h"><i>${ic('smartphone')}</i><div><small>Khách hàng đã tải app Chowaco</small><b>${nf(t)}</b></div></div>
      <div class="sw-r"><span>Tỷ lệ tải app</span><b>${pc(p)}</b></div><div class="pb"><i style="--w:${p}%;background:#80FFDB"></i></div>
      <div class="sw-s"><div><small>Tổng khách hàng</small><b>${nf(KH)}</b></div><div><small>Chưa tải app</small><b>${nf(KH - t)}</b></div></div></div>${wardDonut('Phân bổ theo phường', `${nf(t)} khách hàng đã tải app`, APP)}`; };

  const tabTS = () => {
    const s = sg('ts'), rows = TS.map(([l, u, c, a, b]) => ({ l, u, c, v: s ? (s === 1 ? a : b) : a + b })), km = (v) => nf(v, 2);
    const part = (u) => rows.filter((r) => r.u === u && r.v > 0);
    return `${seg('ts', ['Tất cả', ...ML.map((m) => m[0])])}
      ${tcard('Tổng quan tài sản', s ? ML[s - 1].join(' · ') : `Toàn mạng lưới · ${ML[0][1]} và ${ML[1][1]}`, `<p class="st">CHIỀU DÀI MẠNG LƯỚI (KM)</p>${donut(part('km'), 'km', km, { one: true })}<p class="st">SỐ LƯỢNG THIẾT BỊ (CÁI)</p>${donut(part('cái'), 'cái', nf, { one: true })}`,
        tbl(['Hạng mục', 'Giá trị', 'Đơn vị'], rows.map((r) => [r.l, r.u === 'km' ? km(r.v) : nf(r.v), r.u])))}`;
  };

  const TABS = [['Khách hàng', tabKH], ['Sản lượng', tabSL], ['Doanh thu', tabDT], ['Thất thoát nước', tabTT], ['Giá bán bình quân', tabGB], ['Thu hộ tiền nước', tabTH], ['Định danh', tabDD], ['Gắn mới ĐHN', tabGM], ['Dời ĐHN', tabDoi], ['Thay ĐHN', tabThay],
    ['Hồ sơ DVKH', () => hoSo('dv', '#AC943A', 'DVKH')], ['Hồ sơ KTKS', () => hoSo('kt', '#5AA0FE', 'KTKS')], ['Hóa đơn', tabHD], ['KH đã tải app Chowaco', tabApp], ['QL Tài sản', tabTS]];

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
  const tot = (rows) => nf(sum(rows.map((r) => r[1])));
  const CARDS = () => [
    ['Khách hàng', nf(KH), 'Số lượng khách hàng', '#D2AC6C', 'users', 0],
    ['Sản lượng', nf(sum(SL26)), `Tổng sản lượng ${Y} (m³)`, '#00C0DA', 'droplet', 1],
    ['Doanh thu', ty(sum(DT26)), `Tổng doanh thu ${Y} (VNĐ)`, '#00AD26', 'bar-chart-3', 2],
    ['Tỷ lệ thực thu', '99,66%', `Tỷ lệ thực thu ${Y}`, '#007257', 'banknote', 2],
    ['Thất thoát nước', p2(TTN), 'Tỷ lệ thất thoát nước (%)', '#D70000', 'droplets', 3],
    ['Giá bán bình quân', nf(gbbq(DT26, SL26), 2), 'Giá bán bình quân', '#11B482', 'tag', 4],
    ['Thu hộ tiền nước', ty(TH), `Tổng thu hộ ${Y}`, '#1A7FC1', 'banknote', 5],
    ['Định danh CCCD', tot(DD), 'Số lượng định danh CCCD', '#6A5ACD', 'users', 6],
    ['Gắn mới ĐHN', tot(GM), 'Số lượng gắn mới ĐHN', '#F39200', 'plus-circle', 7],
    ['Dời ĐHN', tot(DOIDHN), 'Số lượng dời ĐHN', '#D86FF3', 'minus-circle', 8],
    ['Thay ĐHN cỡ nhỏ', tot(THAY[0]), 'Số lượng thay ĐHN cỡ nhỏ', '#0171CC', 'refresh-cw', 9, 'thay:0'],
    ['Thay ĐHN cỡ lớn', tot(THAY[1]), 'Số lượng thay ĐHN cỡ lớn', '#054D8E', 'refresh-cw', 9, 'thay:1'],
    ['Hồ sơ DVKH', nf(hsTotal('dv')), 'Số lượng hồ sơ DVKH', '#AC943A', 'file-text', 10],
    ['Hồ sơ KTKS', nf(hsTotal('kt')), 'Số lượng hồ sơ KTKS', '#5AA0FE', 'file-text', 11],
    ['Hóa đơn', '', `<span class="hd">0m³<b>${nf(H0[KY - 1])}</b></span><span class="hd">1→4m³<b>${nf(H14[KY - 1])}</b></span>`, '#2E8B57', 'file-text', 12],
    ['KH tải app Chowaco', tot(APP), `Tổng KH: ${nf(KH)}`, '#006978', 'users', 13],
    ['Hoàn công sửa bể', nf(sum(BE26)), `Tổng báo bể: ${nf(sum(BE26) + 86)}`, '#8B4513', 'refresh-cw']];

  const sb = `<div class="sb" style="color:#fff"><span>9:41</span><i>${ic('bar-chart-2')}${ic('zap')}</i></div>`;
  let root;
  const render = () => {
    root.innerHTML = `<div class="app rp">
      <div class="rp-v rp-main"><div class="ah">${sb}<div class="ah-bar"><span></span><span>Báo cáo tổng quan</span><span></span></div></div>
        <div class="rp-s"><div id="rpChart">${mainChart()}</div>
          <div class="kg">${CARDS().map(([t, v, n, c, i, tab, arg], j) => `<${tab == null ? 'div' : 'button'} class="kc" style="background:${c};--j:${j}" ${tab == null ? '' : `data-open="${tab}"`} ${arg ? `data-arg="${arg}"` : ''}><h5><i>${ic(i)}</i><span class="${t.length > 10 ? 'sm' : ''}">${t}</span>${tab == null ? '' : ic('chevron-right')}</h5>${v ? `<b>${v}</b>` : ''}<p>${n}</p></${tab == null ? 'div' : 'button'}>`).join('')}</div></div></div>
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
    const t = e.target.closest('[data-chip],[data-open],[data-back],[data-tab],[data-tg],[data-ct],[data-sg],.cc-g');
    if (!t) return;
    const d = t.dataset;
    if (d.chip != null) { st.chip = +d.chip; $('#rpChart', root).innerHTML = mainChart(); }
    else if (d.open != null) { st.tab = +d.open; if (d.arg) { const [k, v] = d.arg.split(':'); st.sg[k] = +v; } renderTab(); $('.rp', root).classList.add('detail'); }
    else if (d.back != null) $('.rp', root).classList.remove('detail');
    else if (d.tab != null) { st.tab = +d.tab; renderTab(); }
    else if (d.tg) { const c = t.closest('.tc'); c.classList.toggle('tbl', d.tg === 't'); t.parentNode.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b === t)); }
    else if (d.ct) { st.ct = +d.ct; renderTab(true); }
    else if (d.sg) { st.sg[d.sg] = +d.v; renderTab(true); }
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
    Object.assign(st, { chip: 1, tab: 0, ct: 1, sg: {} });
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
