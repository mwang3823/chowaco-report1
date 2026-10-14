(() => {
  const ic = (n, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24">${window.ICONS[n] || ''}</svg>`;
  const P = (x, y, w, h) => `left:${x}px;top:${y}px;${w ? `width:${w}px;` : ''}${h ? `height:${h}px;` : ''}`;
  const A = (a, s = 0, i = 0, x = '') => `data-a="${a}" ${s ? '' : 'data-s0'} style="--s:${s};--i:${i};${x}"`;
  const head = ({ k, t, lead, c = '', lw, hs }) => `<header class="head ${c}">
    ${k ? `<span class="kicker" ${A('up')}>${k}</span>` : ''}
    <h1 ${A('wipe', 0, 0, hs ? `font-size:${hs}px` : '')}>${t}</h1>
    ${lead ? `<p class="lead" ${A('up', 0, 2, lw ? `max-width:${lw}px` : '')}>${lead}</p>` : ''}
  </header>`;
  const msg = (t, s, i = 0, icon = 'target', sm) => `<div class="msg" ${sm ? 'data-sm' : ''} ${A('zoom', s, i)}><span class="msg-ic">${ic(icon)}</span><span>${t}</span></div>`;
  const bub = (icon, c = '') => `<span class="ibub ${c}">${ic(icon)}</span>`;
  const pk = (d, dur, b, o = '') => `<circle r="4" class="pk ${o}"><animateMotion dur="${dur}s" begin="${b}s" repeatCount="indefinite" path="${d}"/></circle>`;
  const net = (paths) => `<svg class="wires" viewBox="0 0 1600 900">${paths.map(([d, s, i, n = 1, o = '']) => `<path pathLength="1" d="${d}" ${A('draw', s, i)}/>${n ? `<g ${A('fade', s, i + 3)}>${Array.from({ length: n }, (_, k) => pk(d, 2.4, (-k * 2.4) / n, o)).join('')}</g>` : ''}`).join('')}</svg>`;
  const smooth = (p) => p.map((q, i) => {
    if (!i) return `M${q[0]} ${q[1]}`;
    const p0 = p[i - 2] || p[i - 1], p1 = p[i - 1], p3 = p[i + 1] || q;
    return `C${(p1[0] + (q[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (q[1] - p0[1]) / 6).toFixed(1)} ${(q[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(q[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${q[0]} ${q[1]}`;
  }).join(' ');
  const phone = (screen, k, a = '') => `<div class="abs" ${a}><div class="phone-fit" style="--pk:${k}"><div class="phone"><div class="island"></div><div class="screen">${screen}</div></div></div></div>`;
  const photo = (src, cap, a) => `<div class="photo abs" ${a}><img src="assets/img/${src}.jpg" alt=""><i class="scan"></i>${cap ? `<span class="cap">${cap}</span>` : ''}</div>`;

  /* ---------- GIS map generator ---------- */
  const rng = (s) => () => (s = (s * 16807) % 2147483647) / 2147483647;
  const gis = ({ W, H, cols, rows, seed = 7, pipes = [], pins = [], incs = [], s1 = null, s2 = null, labels = [], rw = 26 }) => {
    const R = rng(seed);
    const sx = W / (cols - 1), sy = H / (rows - 1);
    const N = Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => [
      Math.round(c * sx + (c && c < cols - 1 ? (R() - 0.5) * sx * 0.36 : 0)),
      Math.round(r * sy + (r && r < rows - 1 ? (R() - 0.5) * sy * 0.36 : 0))]));
    const at = (r, c) => N[Math.max(0, Math.min(rows - 1, r))][Math.max(0, Math.min(cols - 1, c))];
    let st = '', blk = '', cp = '';
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const a = N[r][c];
      [[r, c + 1], [r + 1, c]].forEach(([rr, cc]) => {
        if (rr >= rows || cc >= cols) return;
        const b = N[rr][cc];
        st += `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`;
        if (R() < 0.6) {
          const t = 0.3 + R() * 0.4, dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, side = R() < 0.5 ? 7 : -7;
          cp += `<circle class="cp ${R() < 0.3 ? 'dim' : ''}" r="2.6" cx="${(a[0] + dx * t - (dy / l) * side).toFixed(1)}" cy="${(a[1] + dy * t + (dx / l) * side).toFixed(1)}"/>`;
        }
      });
      if (r < rows - 1 && c < cols - 1) {
        const q = [N[r][c], N[r][c + 1], N[r + 1][c + 1], N[r + 1][c]];
        const cx = q.reduce((t, p) => t + p[0], 0) / 4, cy = q.reduce((t, p) => t + p[1], 0) / 4;
        blk += `<polygon class="blk" points="${q.map((p) => `${(cx + (p[0] - cx) * 0.8).toFixed(1)},${(cy + (p[1] - cy) * 0.8).toFixed(1)}`).join(' ')}"/>`;
        for (let k = 0; k < 3; k++) blk += `<rect x="${(cx + (R() - 0.5) * sx * 0.5).toFixed(1)}" y="${(cy + (R() - 0.5) * sy * 0.5).toFixed(1)}" width="${(5 + R() * 9).toFixed(1)}" height="${(5 + R() * 9).toFixed(1)}" fill="rgba(80,150,255,${(0.12 + R() * 0.2).toFixed(2)})"/>`;
      }
    }
    const river = `M-30 ${H * 0.66} C${W * 0.22} ${H * 0.5} ${W * 0.4} ${H * 0.95} ${W * 0.66} ${H * 0.74} S${W * 0.92} ${H * 0.32} ${W + 30} ${H * 0.38}`;
    const pp = pipes.map((pts) => 'M' + pts.map(([r, c]) => at(r, c).join(' ')).join('L'));
    const pin = ([r, c, k, sel]) => { const [x, y] = at(r, c); return `<g class="pin ${sel ? 'sel' : ''}" data-k="${k}" transform="translate(${x} ${y})"><circle class="ring" r="10"/><path d="M0 0C-3-8-13-14-13-25a13 13 0 1 1 26 0C13-14 3-8 0 0Z"/><circle r="5" cy="-25" fill="#06215a"/></g>`; };
    const inc = ([r, c, k]) => {
      const z = [[r - 1, c], [r - 1, c + 1], [r, c + 1], [r + 1, c], [r + 1, c - 1], [r, c - 1]].map(([a, b]) => at(a, b));
      const [x, y] = at(r, c), [cx, cy] = [z.reduce((t, p) => t + p[0], 0) / 6, z.reduce((t, p) => t + p[1], 0) / 6];
      return `<g class="inc" data-k="${k}"><polygon class="zone" points="${z.map((p) => `${(x + (p[0] - cx) * 0.95).toFixed(0)},${(y + (p[1] - cy) * 0.95).toFixed(0)}`).join(' ')}"/><circle class="ring" cx="${x}" cy="${y}" r="15"/><circle class="core" cx="${x}" cy="${y}" r="15"/><text x="${x}" y="${y}">!</text></g>`;
    };
    const L = (cls, s, body) => `<g class="${cls}"><g ${s != null ? A('fade', s, 1) : ''}>${body}</g></g>`;
    const html = `<svg class="gis" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="pinG" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#7fe0ff"/><stop offset="1" stop-color="#0b6cf0"/></linearGradient>
      <linearGradient id="scanG" x1="0" x2="1"><stop stop-color="#38c6ff" stop-opacity="0"/><stop offset=".5" stop-color="#38c6ff" stop-opacity=".12"/><stop offset="1" stop-color="#38c6ff" stop-opacity="0"/></linearGradient></defs>
      ${blk}<path class="river" d="${river}" stroke-width="${rw}"/><path class="river2" d="${river}"/>
      <path class="st" d="${st}"/>
      ${pp.map((d) => `<path class="pipe" d="${d}"/><path class="flow" d="${d}"/>${pk(d, 6, -R() * 6)}${pk(d, 6, -R() * 6)}`).join('')}
      ${labels.map(([x, y, t]) => `<text class="lbl" x="${x}" y="${y}">${t}</text>`).join('')}
      ${L('l1', s1, cp + pins.map(pin).join(''))}
      ${L('l2', s2, incs.map(inc).join(''))}
      <rect class="scan" x="0" y="0" width="${W * 0.3}" height="${H}"/></svg>`;
    return { html, at };
  };

  /* ---------- reused app screens ---------- */
  const sb = (c = '#fff') => `<div class="sb" style="color:${c}"><span>9:41</span><i>${ic('bar-chart-2')}${ic('zap')}</i></div>`;
  const kv = (i, k, v) => `<div class="kv">${ic(i)}<span>${k}</span><b>${v}</b>${ic('chevron-right')}</div>`;
  const profile = () => `<div class="app">
    <div class="ah">${sb()}<div class="ah-bar">${ic('arrow-left')}<span>Hồ sơ khách hàng 360°</span>${ic('more-horizontal')}</div></div>
    <div class="abody" style="padding-top:12px">
      <div class="box"><div class="cust" style="margin-bottom:8px"><span class="ava">${ic('user')}</span><b>Nguyễn Văn An</b><span class="badge">Đang sử dụng</span></div>
        ${kv('contact', 'Mã danh bộ', 'KD01234567')}${kv('map-pin', 'Điểm cấp nước', 'ĐCN-0127 · KV01')}${kv('gauge', 'Đồng hồ', 'AIC · 102365')}${kv('route', 'Lộ trình', 'LT.01-03')}${kv('droplet', 'Trạng thái', '<span class="ok">Đang sử dụng</span>')}</div>
      <div class="box"><div class="stt">Tổng quan</div><div class="stats">
        <div class="stat">${ic('wallet')}<div>Công nợ<b class="bad">1.250.000 đ</b></div></div>
        <div class="stat">${ic('calendar')}<div>Kỳ chưa thanh toán<b class="warn">2 kỳ</b></div></div>
        <div class="stat">${ic('droplet')}<div>Bình quân tiêu thụ<b>18 m³/tháng</b></div></div>
        <div class="stat">${ic('activity')}<div>Kỳ bất thường<b>1 kỳ</b></div></div></div></div>
      <div class="box rowlink">${ic('map')}Xem vị trí trên GIS${ic('chevron-right')}</div>
    </div></div>`;
  const f = (k, v) => `<div><small>${k}</small>${v}</div>`;
  const tech = () => `<div class="app">
    <div class="ah">${sb()}<div class="ah-bar">${ic('chevron-left')}<span>Chi tiết đồng hồ</span>${ic('scan-line')}</div></div>
    <div class="ntabs"><span>Gắn mới</span><span class="on">Thay &amp; lịch sử ĐHN</span><span>Đóng/mở</span></div>
    <div class="abody" style="padding-top:12px">
      <div class="box"><span class="pill">Lịch sử thay</span><div class="fgrid">
        ${f('Loại báo thay', 'Định kỳ')}${f('Ngày thay', '15/03/2026')}${f('Hiệu cũ', 'ARAD')}${f('Hiệu mới', 'AIC')}${f('Số thân cũ', '094537')}${f('Số thân mới', '102365')}${f('Chỉ số gỡ', '1161')}${f('Chỉ số gắn', '0')}</div>
        <small style="display:block;margin-top:10px;color:#0d5fd0;font-weight:700">Ảnh hiện trường</small>
        <div class="pics"><i>${ic('gauge')}</i><i>${ic('image')}</i><i>${ic('camera')}</i></div></div>
      <div class="box rowlink">${ic('map-pin')}Vị trí điểm cấp nước${ic('chevron-right')}</div>
      <div class="box rowlink">${ic('clipboard-check')}Ghi nhận kết quả${ic('chevron-right')}</div>
    </div></div>`;

  /* ---------- interactive GIS data ---------- */
  const CUS = {
    c0: { dcn: 'ĐCN-0127', name: 'Nguyễn Văn An', db: 'KD01234567', addr: '123 Hải Thượng Lãn Ông', meter: 'AIC · 102365 · DN15', use: '18 m³/tháng', debt: '0 đ', st: 'Đang sử dụng' },
    c1: { dcn: 'ĐCN-0342', name: 'Công ty TNHH An Phú', db: 'KD01290033', addr: '88 Châu Văn Liêm', meter: 'Itron · 551204 · DN50', use: '528 m³/tháng', debt: '12.450.000 đ', st: 'Đang sử dụng' },
    c2: { dcn: 'ĐCN-0518', name: 'Trần Thị Bình', db: 'KD01305512', addr: '45 Tản Đà', meter: 'ARAD · 093318 · DN15', use: '14 m³/tháng', debt: '0 đ', st: 'Đang sử dụng' },
    c3: { dcn: 'ĐCN-0763', name: 'Lê Minh Châu', db: 'KD01338871', addr: '210 Trần Hưng Đạo', meter: 'AIC · 100877 · DN20', use: '26 m³/tháng', debt: '410.000 đ', st: 'Tạm ngưng' },
    c4: { dcn: 'ĐCN-0901', name: 'Phạm Quốc Dũng', db: 'KD01352290', addr: '17 Lương Nhữ Học', meter: 'AIC · 104412 · DN15', use: '21 m³/tháng', debt: '0 đ', st: 'Đang sử dụng' },
  };
  const INC = {
    i0: { id: 'SC-2610-018', type: 'Bể ống D150', at: 'Tuyến Nguyễn Trãi', zone: 'DMA-03 · KV Chợ Lớn', time: '08:42 · 14/10/2026', src: 'Khách hàng phản ánh', state: 'Đang xử lý', unit: 'Đội sửa bể 2' },
    i1: { id: 'SC-2610-021', type: 'Áp lực thấp', at: 'Khu dân cư Bãi Sậy', zone: 'DMA-05 · KV Bình Tây', time: '10:15 · 14/10/2026', src: 'Cảnh báo vận hành', state: 'Đang xác minh', unit: 'Phòng Mạng lưới' },
  };
  const row = (i, k, v) => `<div class="row">${ic(i)}<span>${k}</span><b>${v}</b></div>`;
  window.GIS_INFO = (k) => {
    if (INC[k]) {
      const d = INC[k];
      return `<div class="hd fresh">${bub('alert-triangle', 'warn')}<div><small>SỰ CỐ · ${d.id}</small><b>${d.type}</b></div></div>
        <div class="rows fresh">${row('map-pin', 'Vị trí', d.at)}${row('layers', 'Khu vực', d.zone)}${row('clock', 'Thời điểm', d.time)}${row('bell', 'Nguồn ghi nhận', d.src)}${row('activity', 'Tình trạng', `<span style="color:#ffc46b">${d.state}</span>`)}${row('users', 'Đơn vị xử lý', d.unit)}</div>
        <div class="note">Thông tin do hệ thống chuyên môn cung cấp – GIS hiển thị để tra cứu &amp; giám sát.</div>`;
    }
    const d = CUS[k];
    return `<div class="hd fresh">${bub('user')}<div><small>ĐIỂM CẤP NƯỚC · ${d.dcn}</small><b>${d.name}</b></div></div>
      <div class="rows fresh">${row('contact', 'Mã danh bộ', d.db)}${row('map-pin', 'Địa chỉ', d.addr)}${row('gauge', 'Đồng hồ', d.meter)}${row('droplet', 'Tiêu thụ TB', d.use)}${row('wallet', 'Công nợ', d.debt)}${row('badge-check', 'Trạng thái', d.st)}</div>
      <div class="note">${ic('shield-check')} Hiển thị theo quyền truy cập của người xem.</div>`;
  };

  /* ---------- scenes ---------- */
  const S = [];

  /* 1. Cover */
  const caps = [['clipboard-check', 'Nghiệp vụ số'], ['database', 'Dữ liệu liên thông'], ['map', 'Khai thác GIS'], ['smartphone', 'Web &amp; Mobile'], ['cpu', 'Data – BI – AI']];
  S.push({ name: 'Chowaco One', pptx: 1, n: 2, cls: 'cover', html: `
    <div class="cover-photo abs" ${A('fade', 0, 0, P(700, 0, 900, 900))}><img src="assets/img/cover.jpg" alt=""></div>
    <div class="logo-pill abs" ${A('up', 0, 0, P(100, 60))}><img src="assets/logo.png" alt="Chowaco"></div>
    <span class="kicker abs" ${A('up', 0, 1, P(100, 150))}>ĐỀ XUẤT ĐỊNH HƯỚNG GIẢI PHÁP</span>
    <h1 class="abs" ${A('wipe', 0, 1, P(100, 200))}>Chowaco <em>One</em></h1>
    <p class="sub2 abs" ${A('up', 0, 2, P(100, 312, 760))}>Giải pháp vận hành<br><span class="hl">cấp nước liên thông</span></p>
    <div class="hexbar abs" ${A('wipe', 0, 3, P(100, 430))}>${ic('network')}Số hóa nghiệp vụ<i></i>Kết nối dữ liệu<i></i>Khai thác thống nhất</div>
    <p class="proposer abs" ${A('up', 0, 4, P(100, 520, 720))}>Dành cho <b>CÔNG TY CỔ PHẦN CẤP NƯỚC CHỢ LỚN</b><br>Đơn vị đề xuất: <span>WAO</span></p>
    <div class="focus glass tg abs" ${A('flip', 1, 0, P(100, 630, 680, 110))}><span class="nic solid round">${ic('target')}</span><div><b>Không chỉ thêm một phần mềm</b>Kết nối quy trình, dữ liệu khách hàng và dữ liệu mạng lưới để điều hành dựa trên dữ liệu.</div></div>
    ${caps.map(([i, t], x) => `<div class="cap5 glass abs" ${A('right', 1, x + 1, P(1220, 170 + x * 104, 290, 80))}>${bub(i)}<div><em>0${x + 1}</em>${t}</div></div>`).join('')}` });

  /* 2. GIS vision */
  const g2 = gis({ W: 900, H: 560, cols: 9, rows: 7, seed: 11, s1: 1, s2: 2,
    pipes: [[[3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8]], [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4]], [[1, 1], [1, 2], [2, 2], [3, 2]], [[3, 6], [4, 6], [5, 6], [5, 7]]],
    pins: [[2, 2, 'c0', 1], [4, 7, 'c1'], [1, 5, 'c2'], [5, 2, 'c3'], [1, 7, 'c4']], incs: [[4, 5, 'i0']], labels: [[18, 24, 'GIS HIỆN HỮU · LỚP MẠNG LƯỚI'], [700, 545, 'DMA-03']] });
  const [p2x, p2y] = g2.at(2, 2), [i2x, i2y] = g2.at(4, 5);
  S.push({ name: 'Tầm nhìn GIS', pptx: 2, n: 4, html: `
    ${head({ k: 'HÌNH ẢNH ĐÍCH ĐẾN', t: 'Một bản đồ – <em>thấy khách hàng, đồng hồ và sự cố</em>', hs: 46 })}
    <div class="gisf abs" ${A('zoom', 0, 2, P(100, 190, 900, 560))}>${g2.html}</div>
    ${net([[`M${100 + p2x} ${190 + p2y - 25} C${600} ${190 + p2y - 60} 900 300 1040 300`, 1, 0], [`M${100 + i2x} ${190 + i2y} C900 ${190 + i2y} 960 600 1040 600`, 2, 0, 1, 'o']])}
    <div class="gpanel glass tg abs" ${A('right', 1, 1, P(1040, 190, 460, 262))}><div class="hd">${bub('user')}<span class="ttl c">01 · Khách hàng &amp; đồng hồ nước</span></div>
      <ul><li>Định vị điểm cấp nước và đồng hồ ngay trên bản đồ</li><li>Mở nhanh danh bộ, thông tin khách hàng, thông số đồng hồ</li><li>Xem dữ liệu liên quan đúng quyền truy cập</li></ul></div>
    <div class="gpanel glass o abs" ${A('right', 2, 1, P(1040, 476, 460, 274))}><div class="hd">${bub('alert-triangle', 'warn')}<span class="ttl">02 · Sự cố &amp; khu vực mạng lưới</span></div>
      <ul><li>Hiển thị vị trí và phạm vi khu vực đang có sự cố</li><li>Tra cứu loại sự cố, thời điểm, thông tin xử lý</li><li>Gắn với dữ liệu mạng lưới hiện hữu</li></ul></div>
    <div class="badge-x abs" ${A('up', 3, 0, P(118, 690))}>${ic('layers')}Không xây lại GIS – bổ sung lớp dữ liệu nghiệp vụ lên nền tảng sẵn có</div>
    ${msg('Từ GIS <em>quản lý hạ tầng</em> → GIS <em>khai thác dữ liệu cấp nước liên thông</em>', 3, 1, 'map', 1)}` });

  /* 3. Inherit */
  const c3 = [
    ['Kinh doanh &amp; khách hàng', ['contact', 'gauge', 'receipt'], ['Danh bộ', 'Ghi chỉ số', 'Billing', 'Thu tiền', 'CSKH']],
    ['Kỹ thuật &amp; mạng lưới', ['map', 'activity', 'wrench'], ['GIS', 'SCADA', 'DMA', 'Tài sản &amp; dữ liệu mạng lưới']],
    ['Quản trị &amp; điều hành', ['file-text', 'bar-chart-3', 'users'], ['Văn phòng điện tử', 'Báo cáo', 'Hệ thống quản lý liên quan']]];
  S.push({ name: 'Kế thừa nền tảng', pptx: 3, n: 3, html: `
    ${head({ k: 'NHÌN NHẬN HIỆN TRẠNG', t: 'Không bắt đầu lại <em>từ con số 0</em>', lead: 'Chợ Lớn đã đầu tư những nền tảng quan trọng. Hướng đi đúng: giữ cái đang tốt, nối cái đang rời, chỉ bổ sung phần thực sự còn thiếu.', lw: 1400 })}
    ${c3.map(([t, icons, tags], x) => `<div class="col3 glass tg abs" ${A('flip', 0, x + 3, P(100 + x * 480, 222, 440, 300))}><div class="vis">${icons.map((i) => bub(i)).join('')}</div><div class="ttl">${t}</div><div class="tags" style="justify-content:center">${tags.map((g) => `<span>${g}</span>`).join('')}</div></div>`).join('')}
    ${net([['M320 522 C320 590 600 590 762 590', 1, 0], ['M800 522 L800 552', 1, 1, 0], ['M1280 522 C1280 590 1000 590 838 590', 1, 2]])}
    <div class="hub abs" ${A('zoom', 1, 2, P(762, 552, 76, 76))}><div class="disk" style="font-size:32px">${ic('database')}</div></div>
    ${['Đánh giá năng lực hiện có', 'Giữ hệ thống đang đáp ứng tốt', 'Xác định điểm cần liên thông', 'Bổ sung đúng năng lực thiếu'].map((t, x) => `<div class="stepchip glass abs" ${A('up', 2, x, P(100 + x * 357, 664, 330, 70))}><i>${x + 1}</i>${t}</div>`).join('')}
    ${msg('Kế thừa nền tảng hiện hữu – <em>Tăng cường liên thông – Mở rộng giá trị khai thác</em>', 2, 4, 'layers', 1)}` });

  /* 4. Three conditions */
  const gates = [['file-check', 'Dữ liệu đầy đủ', 'Được ghi nhận và cập nhật ngay trong từng quy trình nghiệp vụ.'], ['network', 'Liên kết chính xác', 'Danh bộ, khách hàng, điểm cấp nước, đồng hồ, tài sản mạng lưới có quan hệ rõ ràng.'], ['shield-check', 'Khai thác tin cậy', 'Đúng nguồn, cập nhật phù hợp, đúng phân quyền và có thể đối soát.']];
  S.push({ name: 'Ba điều kiện của dữ liệu', pptx: 4, n: 3, html: `
    ${head({ k: 'ĐIỀU KIỆN TIÊN QUYẾT', t: 'Có dữ liệu <em>≠ khai thác được dữ liệu</em>', lead: 'Bản đồ chỉ phát huy giá trị khi dữ liệu nghiệp vụ phía sau đạt đủ ba điều kiện.' })}
    ${gates.map(([i, t, d], x) => `<div class="gate glass abs" ${A('up', 0, x + 3, P(100 + x * 480, 220, 440, 290))}><span class="num">0${x + 1}</span>${bub(i, 'lg')}<div class="ttl">${t}</div><p class="dsc">${d}</p><span class="ok" ${A('fade', 1, x * 2 + 2)}>${ic('check-circle')}ĐẠT</span><div class="bar"><i ${A('growx', 1, x * 2)}></i></div></div>`).join('')}
    <div class="berg glass abs" ${A('up', 2, 0, P(100, 540, 1400, 210))}>
      <div class="top">${ic('monitor')}Giao diện GIS · Web · Mobile<small>Phần người dùng nhìn thấy</small></div>
      <div class="bot"><div>${ic('workflow')}Quy trình nghiệp vụ</div><div>${ic('database')}Dữ liệu nguồn</div><div>${ic('key-round')}Định danh &amp; quan hệ</div><div>${ic('lock')}Phân quyền &amp; đối soát</div></div>
      <span class="flag abs">CHOWACO ONE BẮT ĐẦU TỪ TẦNG NÀY</span></div>
    ${msg('Muốn khai thác tốt trên GIS – <em>dữ liệu phải được hình thành và liên kết đúng trước</em>', 2, 3, 'target', 1)}` });

  /* 5. Data ecosystem */
  const quads = [
    ['users', 'Khách hàng &amp; kinh doanh', ['Danh bộ', 'Hợp đồng', 'Ghi chỉ số', 'Tiêu thụ', 'Hóa đơn', 'Công nợ', 'CSKH']],
    ['hard-hat', 'Kỹ thuật &amp; hiện trường', ['Gắn mới', 'Thay đồng hồ', 'Kiểm tra', 'Thi công', 'Hoàn công', 'Vật tư']],
    ['map', 'Mạng lưới &amp; vận hành', ['GIS', 'Tuyến ống', 'Van', 'DMA', 'Áp lực', 'Lưu lượng', 'Sự cố']],
    ['briefcase', 'Quản trị doanh nghiệp', ['Tài chính', 'Nhân sự', 'Tài sản', 'Kế hoạch', 'Báo cáo']]];
  const qpos = [[100, 220], [100, 450], [1000, 220], [1000, 450]];
  S.push({ name: 'Hệ sinh thái dữ liệu', pptx: 5, n: 3, html: `
    ${head({ k: 'HỆ SINH THÁI DỮ LIỆU', t: 'Mọi hoạt động cấp nước <em>đều sinh ra dữ liệu</em>' })}
    <div class="ring-d spin-slow abs" style="${P(650, 270, 300, 300)}"></div>
    <div class="ring-d spin-rev abs" style="${P(690, 310, 220, 220)}"></div>
    <div class="hub abs" ${A('zoom', 0, 2, P(715, 335, 170, 170))}><div class="disk" style="font-size:18px;font-weight:800;text-align:center;line-height:1.25">${ic('database')}DỮ LIỆU<br>LIÊN THÔNG</div></div>
    ${net([['M600 320 C650 320 650 380 712 400', 1, 0], ['M600 550 C650 550 650 470 712 445', 1, 1], ['M1000 320 C950 320 950 380 888 400', 1, 2], ['M1000 550 C950 550 950 470 888 445', 1, 3]])}
    ${quads.map(([i, t, tags], x) => `<div class="quad glass abs" ${A(x < 2 ? 'left' : 'right', 1, x, P(qpos[x][0], qpos[x][1], 500, 200))}><div class="hd"><span class="num">0${x + 1}</span>${bub(i)}<span class="ttl">${t}</span></div><div class="tags">${tags.map((g) => `<span>${g}</span>`).join('')}</div></div>`).join('')}
    <div class="ask abs" ${A('zoom', 2, 0, P(470, 676, 660, 60))}>${ic('search')}Vậy dữ liệu được ghi nhận từ đâu, bằng cách nào?</div>
    ${msg('Từ những nguồn chuyên môn riêng lẻ → <em>một hệ sinh thái dữ liệu liên thông</em>', 2, 2, 'network', 1)}` });

  /* 6. Data trail */
  const stg = [['file-text', 'Tiếp nhận'], ['settings', 'Xử lý'], ['clipboard-check', 'Kiểm tra / Phê duyệt'], ['badge-check', 'Hoàn tất']];
  const dt = [['users', 'Ai, đơn vị nào<br>thực hiện'], ['clock', 'Thời điểm &amp;<br>thời gian xử lý'], ['file-check', 'Trạng thái &amp;<br>kết quả nghiệp vụ'], ['image', 'Hồ sơ, hình ảnh,<br>vật tư liên quan'], ['history', 'Lịch sử thay đổi<br>từng bước']];
  const bits = Array.from({ length: 2 }, () => Array.from({ length: 90 }, (_, i) => ((i * 7919) % 3 ? '01' : '10') + ((i * 31) % 5 ? '1' : '0')).join(' ')).join(' ');
  S.push({ name: 'Mỗi bước một dấu vết dữ liệu', pptx: 6, n: 3, html: `
    ${head({ k: 'SỐ HÓA QUY TRÌNH', t: 'Mỗi bước nghiệp vụ – <em>một dấu vết dữ liệu</em>' })}
    ${stg.map(([i, t], x) => `<div class="stg abs" ${A('up', 0, x + 2, P(120 + x * 350, 196, 310, 160))}><span class="disc">${bub(i)}</span><span class="ttl">${t}</span></div>`).join('')}
    ${[0, 1, 2].map((x) => `<div class="chev abs" ${A('fade', 0, x + 3, P(436 + x * 350, 230, 40, 40))}>${ic('chevron-right')}</div>`).join('')}
    ${net(stg.map((_, x) => [`M${275 + x * 350} 360 L${275 + x * 350} 420`, 1, x, 2]))}
    <div class="bus abs" ${A('zoom', 1, 0, P(100, 420, 1400, 70))}><span class="bits">${bits}</span><b>${ic('database')}DỮ LIỆU PHÁT SINH</b></div>
    ${dt.map(([i, t], x) => `<div class="dtile glass abs" ${A('up', 1, x + 2, P(100 + x * 284, 516, 260, 136))}>${bub(i)}<span>${t}</span></div>`).join('')}
    <div class="vs glass dim abs" ${A('left', 2, 0, P(100, 674, 540, 76))}>${ic('file-text')}<span>Hồ sơ giấy: <b>chỉ thấy kết quả cuối cùng</b></span></div>
    <div class="vs glass hi tg abs" ${A('right', 2, 1, P(660, 674, 840, 76))}>${ic('activity')}<span>Quy trình số: <b>thấy ai làm – mất bao lâu – vướng ở đâu – duyệt khi nào</b></span></div>
    ${msg('Số hóa quy trình không chỉ để xử lý việc – <em>mà để hình thành dữ liệu vận hành</em>', 2, 3, 'settings', 1)}` });

  /* 7. New connection example */
  const flow7 = [['file-text', 'Tiếp nhận'], ['map-pin', 'Khảo sát /<br>thiết kế'], ['hard-hat', 'Thi công'], ['clipboard-check', 'Hoàn công'], ['file-check', 'Cập nhật<br>hồ sơ']];
  const outs = [['users', 'Danh bộ / Billing', 'Thông tin khách hàng &amp; điểm sử dụng nước'], ['gauge', 'Đồng hồ nước', 'Thông số, số thân, ngày gắn, lịch sử thiết bị'], ['map', 'GIS / Mạng lưới', 'Vị trí điểm cấp nước &amp; tài sản liên quan'], ['file-stack', 'Vật tư / Kế toán', 'Khối lượng vật tư, hồ sơ hoàn công, chi phí']];
  S.push({ name: 'Ví dụ: hồ sơ gắn mới', pptx: 7, n: 3, html: `
    ${head({ k: 'VÍ DỤ · NGHIỆP VỤ LIÊN THÔNG', t: 'Một hồ sơ gắn mới – <em>nhiều hệ thống cùng có dữ liệu</em>', hs: 46 })}
    ${photo('install', 'HIỆN TRƯỜNG · GẮN MỚI ĐỒNG HỒ', A('left', 0, 2, P(100, 190, 820, 410)))}
    <div class="glass abs" ${A('up', 1, 0, P(100, 620, 820, 130))}><div class="flowc" style="height:100%;justify-content:center">${flow7.map(([i, t], x) => `${x ? ic('chevron-right') : ''}<div class="s">${bub(i)}<span>${t}</span></div>`).join('')}</div></div>
    ${net(outs.map((_, x) => [`M920 400 C990 400 990 ${250 + x * 140} 1060 ${250 + x * 140}`, 2, x]))}
    ${outs.map(([i, t, d], x) => `<div class="out glass abs" ${A('right', 2, x + 1, P(1060, 190 + x * 140, 440, 120))}>${bub(i)}<div><div class="ttl">${t}</div><p class="dsc">${d}</p></div></div>`).join('')}
    ${msg('Một nghiệp vụ hoàn tất – <em>nhiều hệ thống cùng được cập nhật để khai thác</em>', 2, 5, 'git-merge', 1)}` });

  /* 8. Incident to map */
  const g8 = gis({ W: 400, H: 210, cols: 6, rows: 4, seed: 5, rw: 16, pipes: [[[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5]], [[0, 3], [1, 3], [2, 3], [3, 3]]], incs: [[1, 2, 'x']] });
  const vst = ['Ghi nhận', 'Xác minh', 'Phân công &amp; xử lý', 'Hoàn tất', 'Cập nhật kết quả'];
  S.push({ name: 'Ví dụ: sự cố lên bản đồ', pptx: 8, n: 4, html: `
    ${head({ k: 'VÍ DỤ · DỮ LIỆU VẬN HÀNH', t: 'Từ sự cố phát sinh <em>đến thông tin trên bản đồ</em>', hs: 48 })}
    <div class="ccol glass abs" ${A('left', 0, 2, P(100, 196, 370, 554))}><div class="hd">${bub('users')}<div><div class="ttl">Nguồn phát sinh</div><div class="sm3">Sự cố có thể đến từ nhiều phía</div></div></div>
      ${[['user', 'Khách hàng phản ánh'], ['hard-hat', 'Nhân viên ghi nhận tại hiện trường'], ['bell', 'Cảnh báo từ hệ thống vận hành']].map(([i, t]) => `<div class="srcrow">${bub(i, 'sm')}${t}</div>`).join('')}</div>
    <div class="chev abs" ${A('fade', 1, 0, P(476, 452, 44, 44))}>${ic('chevron-right')}</div>
    <div class="ccol glass tg abs" ${A('up', 1, 1, P(526, 196, 480, 554))}><div class="hd">${bub('settings')}<div><div class="ttl">Hệ thống nghiệp vụ chuyên môn</div><div class="sm3">Nơi đủ quy trình xác minh – phân công – xử lý</div></div></div>
      <div style="margin-top:26px">${vst.map((t, x) => `<div class="vstep" ${A('left', 1, x + 2)}><i>${x + 1}</i>${t}</div>`).join('')}</div></div>
    <div class="chev abs" ${A('fade', 2, 0, P(1012, 452, 44, 44))}>${ic('chevron-right')}</div>
    <div class="ccol glass abs" ${A('right', 2, 1, P(1062, 196, 438, 554))}><div class="hd">${bub('map')}<div><div class="ttl">GIS khai thác dữ liệu</div><div class="sm3">Hiển thị để tra cứu &amp; giám sát</div></div></div>
      <div class="gisf" style="height:210px">${g8.html}</div>
      ${[['map-pin', 'Vị trí', 'Tuyến D150 · KV03'], ['layers', 'Khu vực', 'DMA-03'], ['alert-triangle', 'Loại sự cố', 'Bể ống'], ['clock', 'Thời điểm', '08:42 · 14/10'], ['activity', 'Tình trạng', '<span style="color:#ffc46b">Đang xử lý</span>']].map(([i, k, v]) => `<div class="irow">${ic(i)}${k}<b>${v}</b></div>`).join('')}</div>
    ${msg('Nghiệp vụ xử lý ở hệ thống chuyên môn – <em>GIS hiển thị để tra cứu, giám sát</em>', 3, 0, 'map', 1)}` });

  /* 9. Identity */
  const ents = [['users', 'Khách hàng / Danh bộ', 'Thông tin sử dụng dịch vụ', ''], ['gauge', 'Đồng hồ nước', 'Thiết bị đo &amp; lịch sử thay đổi', ''], ['alert-triangle', 'Sự cố / hồ sơ nghiệp vụ', 'Sự kiện &amp; lịch sử phát sinh', 'warn'], ['map', 'Tài sản GIS / DMA', 'Vị trí &amp; quan hệ với mạng lưới', '']];
  const yx = (y) => 200 + (y - 2018) * 128;
  const bars = [
    [6, 'Điểm cấp nước', [[2018, 2026.6, 'ĐCN-0127 · tồn tại xuyên suốt', '#1c7dff']]],
    [50, 'Đồng hồ nước', [[2018, 2023, 'ARAD · 094537', '#2f9bd6'], [2023.05, 2026.6, 'AIC · 102365 (thay 03/2023)', '#38c6ff']]],
    [94, 'Khách hàng', [[2018, 2021, 'Chủ cũ', '#5d6fa8'], [2021.05, 2026.6, 'Sang tên chủ mới (2021)', '#6f8cff']]]];
  S.push({ name: 'Định danh & quan hệ dữ liệu', pptx: 9, n: 4, html: `
    ${head({ k: 'LIÊN KẾT DỮ LIỆU', t: 'Danh bộ – điểm cấp nước – đồng hồ – <em>mạng lưới</em>', hs: 46 })}
    <div class="pcore abs" ${A('zoom', 0, 2, P(640, 180, 320, 240))}><span class="pinbig">${ic('map-pin')}</span><span class="ttl">Điểm cấp nước</span><span class="dsc">Vị trí cung cấp dịch vụ – mắt xích trung tâm</span></div>
    ${net([['M560 240 C620 240 640 290 700 300', 1, 0], ['M560 360 C620 360 640 320 700 315', 1, 1], ['M1040 240 C980 240 960 290 900 300', 1, 2, 1, 'o'], ['M1040 360 C980 360 960 320 900 315', 1, 3]])}
    ${ents.map(([i, t, d, w], x) => `<div class="ent glass ${x > 1 ? 'r' : ''} abs" ${A(x > 1 ? 'right' : 'left', 1, x, P(x > 1 ? 1040 : 100, 190 + (x % 2) * 120, 460, 100))}>${bub(i, w)}<div><div class="ttl">${t}</div><p class="dsc">${d}</p></div></div>`).join('')}
    <div class="tl glass abs" ${A('up', 2, 0, P(100, 434, 1400, 232))}><div class="hd">${bub('history', 'sm')}<span class="ttl">Quan hệ dữ liệu thay đổi theo thời gian</span><small>Ví dụ minh họa</small></div>
      <svg viewBox="0 0 1348 140">${Array.from({ length: 9 }, (_, k) => `<line x1="${yx(2018 + k)}" x2="${yx(2018 + k)}" y1="0" y2="124" stroke="rgba(120,180,255,.16)"/><text class="ax" x="${yx(2018 + k)}" y="140" text-anchor="middle">${2018 + k}</text>`).join('')}
        ${bars.map(([y, lb, segs], r) => `<text x="0" y="${y + 19}">${lb}</text>${segs.map(([a, b, t, c], k) => `<g ${A('growx', 2, r * 2 + k + 1)}><rect class="bar" x="${yx(a)}" y="${y}" width="${yx(b) - yx(a)}" height="28" rx="8" fill="${c}" opacity=".85"/><text x="${yx(a) + 14}" y="${y + 19}" style="fill:#fff">${t}</text></g>`).join('')}`).join('')}</svg></div>
    <div class="prin glass tg abs" ${A('up', 3, 0, P(100, 684, 1400, 74))}><span class="lb">${bub('git-merge', 'sm')}Nguyên tắc liên kết</span>${[['key-round', 'Mã định danh thống nhất'], ['network', 'Quan hệ dữ liệu rõ ràng'], ['history', 'Lưu vết lịch sử thay đổi']].map(([i, t]) => `<span class="it">${ic(i)}${t}</span>`).join('')}</div>
    ${msg('Không chỉ nối phần mềm – <em>phải nối đúng dữ liệu</em>', 3, 2, 'git-merge')}` });

  /* 10. Five capabilities */
  const cap10 = [['clipboard-check', 'Nghiệp vụ số', 'Kế thừa, kết nối và hoàn thiện các quy trình chuyên môn.', 'm1', 'KẾ THỪA + HOÀN THIỆN'], ['database', 'Dữ liệu liên thông', 'Chuẩn hóa, kết nối và chia sẻ dữ liệu giữa các hệ thống.', 'm2', 'TÍCH HỢP'], ['map', 'Khai thác GIS', 'Đặt dữ liệu khách hàng, đồng hồ, sự cố lên không gian.', 'm2', 'TÍCH HỢP GIS HIỆN HỮU'], ['smartphone', 'Web &amp; Mobile', 'Tra cứu, khai thác thông tin theo vai trò và nhu cầu.', 'm1', 'KẾ THỪA + BỔ SUNG'], ['cpu', 'Data – BI – AI', 'Phân tích dữ liệu, hỗ trợ điều hành thông minh.', 'm3', 'THEO LỘ TRÌNH']];
  const cp10 = [[100, 226], [1000, 226], [100, 410], [1000, 410], [560, 604]];
  S.push({ name: 'Năm năng lực Chowaco One', pptx: 10, n: 3, html: `
    ${head({ c: 'center', t: 'Chowaco One – <em>năm năng lực, một định hướng</em>', hs: 46, lead: 'Không phải thêm một app độc lập – mà là các năng lực liên kết, cùng tạo nên môi trường vận hành số.', lw: 1300 })}
    <div class="ring-d spin-slow abs" style="${P(640, 250, 320, 320)}"></div>
    <div class="drop abs" ${A('zoom', 0, 2, P(680, 262, 240, 300))}><svg viewBox="0 0 240 300"><defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#7fe0ff"/><stop offset="1" stop-color="#0b4fd6"/></linearGradient><clipPath id="dclip"><path d="M120 10C120 10 30 120 30 180a90 90 0 0 0 180 0C210 120 120 10 120 10Z"/></clipPath></defs>
      <path d="M120 10C120 10 30 120 30 180a90 90 0 0 0 180 0C210 120 120 10 120 10Z" fill="url(#dg)" opacity=".85" stroke="#bff0ff" stroke-width="2"/>
      <g clip-path="url(#dclip)"><path d="M0 200 Q60 170 120 200 T240 200 V300 H0Z" fill="rgba(255,255,255,.18)"><animateTransform attributeName="transform" type="translate" values="-60 0;0 0;-60 0" dur="6s" repeatCount="indefinite"/></path>
      ${[[80, 150], [150, 120], [120, 200], [170, 210], [70, 230], [120, 90]].map(([x, y], k, a) => `<line x1="${x}" y1="${y}" x2="${a[(k + 2) % a.length][0]}" y2="${a[(k + 2) % a.length][1]}" stroke="#e6f9ff" stroke-opacity=".6"/><circle cx="${x}" cy="${y}" r="4" fill="#fff"/>`).join('')}</g></svg>
      <span class="lbl">CHOWACO <em>ONE</em></span></div>
    ${net([['M600 300 C640 300 650 360 690 380', 1, 0], ['M600 485 C640 485 650 440 690 430', 1, 2], ['M1000 300 C960 300 950 360 910 380', 1, 1], ['M1000 485 C960 485 950 440 910 430', 1, 3], ['M800 604 L800 572', 1, 4]])}
    ${cap10.map(([i, t, d, m, mt], x) => `<div class="capc glass abs" ${A(x === 4 ? 'up' : x % 2 ? 'right' : 'left', 1, x, P(cp10[x][0], cp10[x][1], x === 4 ? 480 : 500, 150))}><span class="num">${x + 1}</span><div><div class="ttl">${ic(i)} ${t}</div><p class="dsc">${d}</p><span class="mode ${m}" ${A('fade', 2, x)}>${mt}</span></div></div>`).join('')}
    ${msg('Năm năng lực ≠ năm hệ thống mới: <em>kế thừa – tích hợp – hoàn thiện theo lộ trình</em>', 2, 5, 'layers', 1)}` });

  /* 11. Architecture */
  const L3 = [['map', 'GIS'], ['monitor', 'Web'], ['smartphone', 'Mobile'], ['pie-chart', 'Dashboard / BI']];
  const L2 = ['API', 'Chuẩn dữ liệu', 'Mã định danh', 'Dịch vụ dữ liệu', 'Đồng bộ', 'Phân quyền'];
  const L1 = [['database', 'Billing /<br>Danh bộ'], ['gauge', 'Ghi số /<br>Thu tiền'], ['headphones', 'CSKH'], ['wrench', 'Kỹ thuật'], ['map', 'GIS / SCADA<br>/ DMA'], ['server', 'Hệ thống<br>liên quan']];
  const lay = (y, h, s, icon, no, t, d, ct, hot) => `<div class="lay glass ${hot ? 'hot' : ''} abs" ${A('up', s, 0, P(100, y, 1400, h))}><div class="lb">${bub(icon)}<div><div class="ttl"><span>Lớp ${no}</span> – ${t}</div><p class="dsc">${d}</p></div></div><div class="ct">${ct}</div></div>`;
  S.push({ name: 'Kiến trúc ba lớp', pptx: 11, n: 5, html: `
    ${head({ k: 'KIẾN TRÚC GIẢI PHÁP', t: 'Ba lớp – <em>kế thừa, liên thông, khai thác</em>' })}
    <svg class="wires" viewBox="0 0 1600 900">${[620, 820, 1020, 1220, 1420].map((x, k) => `<g ${A('fade', 3, k)}><path d="M${x} 610 L${x} 210" stroke-dasharray=".02 .02" pathLength="1" style="stroke-opacity:.5"/>${pk(`M${x} 610 L${x} 210`, 3, -k * 0.7)}${pk(`M${x} 610 L${x} 210`, 3, -k * 0.7 - 1.5)}</g>`).join('')}</svg>
    ${lay(490, 136, 1, 'database', 1, 'Nghiệp vụ &amp; dữ liệu nguồn', 'Các phòng ban tiếp tục làm chuyên môn trên hệ thống của mình', L1.map(([i, t]) => `<div class="tile2">${bub(i)}<span>${t}</span></div>`).join(''))}
    ${lay(340, 126, 2, 'settings', 2, 'Tích hợp &amp; liên thông', 'Kết nối, chuẩn hóa, trao đổi dữ liệu theo quy tắc thống nhất', `<i class="busl"></i>${L2.map((t) => `<span class="fn">${t}</span>`).join('')}`, 1)}
    ${lay(190, 126, 3, 'layers', 3, 'Khai thác dữ liệu', 'Cùng nguồn dữ liệu, nhiều hình thức sử dụng', L3.map(([i, t]) => `<div class="tile2">${bub(i)}<span>${t}</span></div>`).join(''))}
    <div class="prin glass abs" ${A('up', 4, 0, P(100, 646, 1400, 64))}><span class="lb">${bub('git-merge', 'sm')}Nguyên tắc xuyên suốt</span>${[['badge-check', 'Nguồn dữ liệu có chủ quản'], ['shield-check', 'Tích hợp có kiểm soát'], ['server', 'Không thay hệ thống đang chạy tốt']].map(([i, t]) => `<span class="it">${ic(i)}${t}</span>`).join('')}</div>
    <div class="abs" ${A('up', 4, 1, P(100, 722, 1400) + 'display:flex;gap:14px;justify-content:center')}><span class="side-tag">${ic('map')}GIS hiện hữu vừa cấp dữ liệu không gian, vừa là giao diện khai thác – không xây GIS thứ hai</span><span class="side-tag">${ic('database')}Giai đoạn đầu chưa bắt buộc Data Warehouse mới</span></div>
    ${msg('Chowaco One <em>liên kết các thành phần</em> để tạo giá trị khai thác chung', 4, 2, 'layers')}` });

  /* 12. Channels */
  const g12 = gis({ W: 190, H: 224, cols: 4, rows: 5, seed: 19, rw: 14, pipes: [[[2, 0], [2, 1], [2, 2], [2, 3]]], pins: [[1, 1, 'm']], incs: [[3, 2, 'n']] });
  const chn = [
    ['GIS', 'Theo không gian', 'Bắt đầu từ vị trí, điểm cấp nước, đồng hồ hoặc khu vực sự cố.', 'briefcase', 'Ban Giám đốc chọn một khu vực để xem tình hình', `<div class="gisf" style="height:100%;border:0;border-radius:0">${g12.html}</div>`],
    ['Web', 'Theo nghiệp vụ', 'Thực hiện quy trình, quản lý hồ sơ, khai thác dữ liệu chuyên môn.', 'headphones', 'CSKH tìm theo mã danh bộ khi khách hàng liên hệ', `<div class="mweb"><i class="h"></i>${'<i></i>'.repeat(9)}</div>`],
    ['Mobile', 'Theo người dùng', 'Tra cứu nhanh khách hàng và dữ liệu được phân quyền.', 'hard-hat', 'Kỹ thuật xem đồng hồ trước khi ra hiện trường', `<div class="mphone" style="height:100%"><div><i class="h"></i><i></i><i></i><i></i><i></i></div></div>`],
    ['Dashboard', 'Theo chỉ số', 'Tổng hợp, phân tích thông tin phục vụ quản trị.', 'line-chart', 'Quản lý theo dõi các chỉ số tổng hợp', `<div class="mbars">${[60, 85, 45, 100, 70, 90].map((h, k) => `<i style="height:${h}%;animation-delay:${-k * 0.4}s"></i>`).join('')}</div>`]];
  const ch = [[100, 196], [940, 196], [100, 484], [940, 484]];
  S.push({ name: 'Bốn góc nhìn khai thác', pptx: 12, n: 3, html: `
    ${head({ k: 'KHAI THÁC DỮ LIỆU', t: 'Cùng một dữ liệu – <em>bốn góc nhìn sử dụng</em>' })}
    <div class="ring-d spin-slow abs" style="${P(670, 340, 260, 260)}"></div>
    <div class="hub abs" ${A('zoom', 0, 2, P(710, 380, 180, 180))}><div class="disk" style="font-size:20px;font-weight:800;text-align:center;line-height:1.2">${ic('droplet')}CHOWACO<br>ONE</div></div>
    ${net([['M660 330 C700 330 700 400 730 420', 1, 0], ['M940 330 C900 330 900 400 870 420', 1, 1], ['M660 620 C700 620 700 540 730 520', 1, 2], ['M940 620 C900 620 900 540 870 520', 1, 3]])}
    ${chn.map(([t, sub, d, wi, who, mini], x) => `<div class="chn glass abs" ${A(x % 2 ? 'right' : 'left', 1, x, P(ch[x][0], ch[x][1], 560, 266))}><div class="mini">${mini}</div><div><div class="ttl c">${t}<span>${sub}</span></div><p class="dsc">${d}</p><div class="who" ${A('fade', 2, x)}>${ic(wi)}<span>${who}</span></div></div></div>`).join('')}
    ${msg('Một nguồn dữ liệu nhất quán – <em>nhiều giao diện, không thêm “ốc đảo” dữ liệu</em>', 2, 4, 'network', 1)}` });

  /* 13. Digital workflow */
  const bpts = [[100, 520], [275, 488], [625, 466], [975, 466], [1325, 488], [1500, 520]];
  const bd = smooth(bpts);
  const b13 = [['layers', 'Kế thừa', 'Tiếp tục dùng hệ thống chuyên môn đang đáp ứng tốt.'], ['network', 'Kết nối', 'Liên thông dữ liệu giữa các quy trình và hệ thống liên quan.'], ['plus-circle', 'Hoàn thiện', 'Số hóa bổ sung bước còn thủ công hoặc thiếu dữ liệu.'], ['check-circle', 'Chuẩn hóa', 'Thống nhất đầu vào, trạng thái, kết quả và lịch sử xử lý.']];
  S.push({ name: 'Số hóa không trùng lặp', pptx: 13, n: 3, html: `
    ${head({ k: 'NGHIỆP VỤ SỐ', t: 'Số hóa theo hướng liên thông – <em>không đầu tư trùng lặp</em>', hs: 40 })}
    <svg class="wires" viewBox="0 0 1600 900"><path pathLength="1" d="${bd}" style="stroke-width:10;stroke:#0b4fd6;stroke-opacity:.6" ${A('draw', 0, 2)}/><g ${A('fade', 0, 5)}><path class="flow" d="${bd}"/>${pk(bd, 5, 0)}${pk(bd, 5, -2.5)}</g>
      ${bpts.slice(1, 5).map(([x, y], k) => `<g ${A('zoom', 0, k + 3)}><line x1="${x}" x2="${x}" y1="430" y2="${y}" stroke="#49b8ff" stroke-dasharray="4 4"/><circle cx="${x}" cy="${y}" r="13" fill="#062058" stroke="#38c6ff" stroke-width="3"/><circle cx="${x}" cy="${y}" r="5" fill="#bff0ff"/></g>`).join('')}</svg>
    ${b13.map(([i, t, d], x) => `<div class="bstep glass abs" ${A('up', 0, x + 2, P(120 + x * 350, 196, 310, 234))}><span class="nn">${x + 1}</span>${bub(i)}<div class="ttl">${t}</div><p class="dsc">${d}</p></div>`).join('')}
    <div class="fork glass abs" ${A('left', 1, 0, P(100, 560, 680, 180))}>${bub('git-merge', 'lg')}<div><div class="ttl">Đã có hệ thống quản lý phù hợp</div><p class="dsc">Ưu tiên kết nối để khai thác dữ liệu – không làm lại cái đang chạy tốt.</p><span class="tagb m2">→ KẾT NỐI</span></div></div>
    <div class="fork glass abs" ${A('right', 1, 1, P(820, 560, 680, 180))}>${bub('plus-circle', 'lg warn')}<div><div class="ttl">Còn thủ công / thiếu dữ liệu / đứt ở điểm bàn giao</div><p class="dsc">Nghiên cứu số hóa bổ sung theo nhu cầu thực tế sau khảo sát.</p><span class="tagb m3">→ SỐ HÓA BỔ SUNG</span></div></div>
    ${msg('Quy trình thông suốt là nền tảng của <em>dữ liệu vận hành liên thông</em>', 2, 0, 'workflow', 1)}` });

  /* 14. Integration platform */
  const srcs = [['database', 'Billing / Danh bộ'], ['file-stack', 'Hồ sơ nghiệp vụ'], ['wrench', 'Hệ thống kỹ thuật'], ['map', 'GIS / SCADA']];
  const outs14 = [['map', 'GIS'], ['monitor', 'Web'], ['smartphone', 'Mobile'], ['pie-chart', 'Dashboard']];
  const fc = [['git-merge', 'Kết nối hệ thống', 'API và các cơ chế trao đổi dữ liệu phù hợp.', 'Dữ liệu lấy từ đâu?', [370, 200]], ['refresh-cw', 'Đồng bộ &amp; đối soát', 'Cập nhật, kiểm tra chênh lệch, xác định độ mới.', 'Dữ liệu mới đến mức nào?', [900, 200]], ['key-round', 'Quản lý định danh', 'Danh bộ, điểm cấp nước, đồng hồ, tài sản, hồ sơ.', 'Đối tượng nào nối với đối tượng nào?', [370, 590]], ['shield-check', 'Quản trị &amp; bảo mật', 'Phân quyền, nhật ký truy cập, kiểm soát dữ liệu.', 'Ai được phép khai thác?', [900, 590]]];
  S.push({ name: 'Nền tảng liên thông', pptx: 14, n: 4, html: `
    ${head({ k: 'NỀN TẢNG LIÊN THÔNG', t: 'Đúng nguồn – <em>đúng đối tượng – đúng quyền</em>' })}
    ${net(srcs.map((_, x) => [`M330 ${250 + x * 130} C480 ${250 + x * 130} 480 460 630 460`, 1, x]).concat(outs14.map((_, x) => [`M970 460 C1120 460 1120 ${250 + x * 130} 1270 ${250 + x * 130}`, 3, x])))}
    ${srcs.map(([i, t], x) => `<div class="src glass abs" ${A('left', 0, x + 2, P(100, 200 + x * 130, 230, 100))}>${bub(i)}${t}</div>`).join('')}
    <div class="hubc glass tg abs" ${A('zoom', 1, 0, P(630, 330, 340, 260) + 'padding:18px')}><div class="planes"><i></i><i></i><i></i></div><b>Lớp liên thông</b><div class="mech"><span>API</span><span>Dịch vụ dữ liệu</span><span>Bộ nhớ đệm</span><span>Đồng bộ</span><span class="opt">Kho phân tích – khi cần</span></div></div>
    ${fc.map(([i, t, d, q, [x, y]], k) => `<div class="fcard glass abs" ${A('flip', 2, k, P(x, y, 330, 132))}><div class="hd">${bub(i, 'sm')}<span class="ttl">${t}</span></div><p class="dsc">${d}</p><div class="q">${q}</div></div>`).join('')}
    ${outs14.map(([i, t], x) => `<div class="src glass abs" ${A('right', 3, x + 1, P(1270, 200 + x * 130, 230, 100))}>${bub(i)}${t}</div>`).join('')}
    ${msg('Liên thông dữ liệu <em>không phải</em> sao chép toàn bộ dữ liệu về một nơi', 3, 5, 'database', 1)}` });

  /* 15. Interactive GIS */
  const g15 = gis({ W: 1000, H: 560, cols: 10, rows: 7, seed: 23,
    pipes: [[[3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8], [3, 9]], [[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5]], [[1, 1], [1, 2], [2, 2], [3, 2]], [[3, 7], [2, 7], [2, 8], [1, 8]], [[3, 3], [4, 3], [5, 3], [5, 2]]],
    pins: [[2, 2, 'c0', 1], [1, 6, 'c1'], [4, 3, 'c2'], [5, 7, 'c3'], [5, 1, 'c4']], incs: [[4, 6, 'i0'], [1, 8, 'i1']], labels: [[900, 548, 'DMA-05']] });
  S.push({ name: 'Khai thác trên GIS (tương tác)', pptx: 15, n: 3, html: `
    ${head({ k: 'KHAI THÁC TRÊN GIS · DEMO TƯƠNG TÁC', t: 'Dữ liệu khách hàng <em>gặp mạng lưới trên GIS</em>', hs: 48 })}
    <div class="gisx gisf abs" data-gis="ginfo15" ${A('zoom', 0, 2, P(100, 190, 1000, 560))}>
      <div class="gtools"><button data-layer="1" aria-pressed="true">${ic('users')}Lớp 01 · Khách hàng &amp; đồng hồ</button><button class="o" data-layer="2" aria-pressed="true">${ic('alert-triangle')}Lớp 02 · Sự cố mạng lưới</button></div>
      <div class="ghint">${ic('mouse-pointer-click')}Nhấn vào điểm trên bản đồ</div>
      ${g15.html}
      <div class="badge-x o abs" ${A('up', 1, 0, P(16, 498))}>${ic('alert-triangle')}Vùng khách hàng bị ảnh hưởng: bổ sung khi dữ liệu kết nối mạng lưới cho phép</div></div>
    <div class="ginfo glass tg abs" id="ginfo15" ${A('right', 0, 3, P(1130, 190, 370, 560))}>${window.GIS_INFO('c0')}</div>
    ${msg('Từ bản đồ hạ tầng → <em>giao diện khai thác dữ liệu khách hàng và vận hành</em>', 2, 0, 'map', 1)}` });

  /* 16. Customer 360 */
  const l360 = [['contact', 'Danh bộ &amp; hợp đồng', 'Khách hàng, địa chỉ, hợp đồng, trạng thái sử dụng.', 1, 'KD01234567 · Hộ gia đình · Đang sử dụng'], ['gauge', 'Đồng hồ nước', 'Thông số thiết bị, lịch sử thay, kiểm định.', 1, 'AIC · 102365 · DN15 · Kiểm định 02/2026'], ['bar-chart-3', 'Chỉ số &amp; tiêu thụ', 'Chỉ số ghi nhận, sản lượng theo từng kỳ.', 1, 'Kỳ 09/2026: 28 m³ · ▲ 12% so với kỳ trước'], ['receipt', 'Hóa đơn &amp; công nợ', 'Hóa đơn, thanh toán, tình trạng nợ.', 1, 'Công nợ 1.250.000 đ · 2 kỳ chưa thanh toán'], ['wrench', 'Lịch sử kỹ thuật', 'Gắn mới, thay đồng hồ, đóng/mở nước, hồ sơ.', 0, 'Thay ĐHN 15/03/2026 · 3 ảnh hiện trường'], ['headphones', 'Chăm sóc khách hàng', 'Yêu cầu, phản ánh, khiếu nại, tương tác.', 0, '1 yêu cầu đang xử lý · 4 đã hoàn tất']];
  S.push({ name: 'Hồ sơ khách hàng 360°', pptx: 16, n: 3, html: `
    ${head({ k: 'HỒ SƠ KHÁCH HÀNG 360°', t: 'Một khách hàng – <em>nhiều lớp dữ liệu</em>' })}
    ${phone(profile(), 0.62, A('phone', 0, 3, P(110, 190)))}
    ${net([0, 1, 2].map((r) => [`M352 444 C390 444 390 ${265 + r * 170} 420 ${265 + r * 170}`, 1, r]))}
    ${l360.map(([i, t, d, ready, ex], x) => `<div class="l360 glass abs" ${A(x % 2 ? 'right' : 'left', 1, x, P(420 + (x % 2) * 550, 190 + (x >> 1) * 170, 530, 150))}><span class="num">0${x + 1}</span><div><div class="ttl">${ic(i)} ${t}</div><p class="dsc">${d}</p><span class="ex">${ex}</span></div><span class="st ${ready ? 'm1' : 'm3'}" ${A('fade', 2, x)}>${ready ? 'SẴN SÀNG' : 'MỞ RỘNG SAU'}</span></div>`).join('')}
    ${msg('Bắt đầu từ nhóm dữ liệu sẵn sàng – <em>mở rộng dần khi có thêm kết nối</em>', 2, 6, 'user-check', 1)}` });

  /* 17. CSKH */
  const t6 = [['users', 'Danh bộ'], ['gauge', 'Chỉ số'], ['droplet', 'Tiêu thụ'], ['file-text', 'Hóa đơn'], ['wallet', 'Công nợ'], ['message-square', 'Lịch sử<br>tương tác']];
  S.push({ name: 'Kinh doanh & CSKH', pptx: 17, n: 3, html: `
    ${head({ k: 'KINH DOANH &amp; CHĂM SÓC KHÁCH HÀNG', t: 'Từ câu hỏi của khách hàng <em>đến phản hồi đủ thông tin</em>', hs: 44 })}
    ${photo('cskh', 'TỔNG ĐÀI CSKH', A('left', 0, 2, P(100, 186, 560, 380)))}
    <div class="bubble abs" ${A('up', 0, 4, P(112, 588, 420))}><small>Khách hàng</small>Hóa đơn tháng này của tôi sao tăng vậy?</div>
    <div class="bubble me abs" ${A('up', 2, 3, P(230, 670, 430))}><small>Nhân viên CSKH</small>Kỳ này tiêu thụ 28 m³, tăng 12% – em gửi anh chi tiết chỉ số ạ.</div>
    ${net([['M660 300 L700 300', 1, 0, 0]])}
    <div class="glass tg abs" ${A('right', 1, 0, P(700, 186, 800, 230) + 'padding:18px 22px')}><div style="display:flex;align-items:center;gap:14px">${bub('database')}<span class="ttl">Thông tin được kết nối về một chỗ</span></div><div class="t6">${t6.map(([i, t]) => `<div>${ic(i)}<span>${t}</span></div>`).join('')}</div></div>
    <div class="glass abs" ${A('up', 2, 0, P(700, 440, 390, 300) + 'padding:18px 20px')}><div style="display:flex;align-items:center;gap:12px">${bub('settings', 'sm')}<span class="ttl">Phối hợp đúng nghiệp vụ</span></div><p class="dsc">Yêu cầu cần xử lý được chuyển đến hệ thống &amp; bộ phận chuyên môn phù hợp.</p>
      <div class="mf"><div>${bub('file-text', 'sm')}Tiếp nhận</div>${ic('chevron-right')}<div>${bub('users', 'sm')}Chuyển bộ phận</div>${ic('chevron-right')}<div>${bub('user-cog', 'sm')}Xử lý</div></div></div>
    <div class="glass abs" ${A('up', 2, 1, P(1110, 440, 390, 300) + 'padding:18px 20px')}><div style="display:flex;align-items:center;gap:12px">${bub('check-circle', 'sm')}<span class="ttl">Phản hồi &amp; lưu vết</span></div><p class="dsc">Phản hồi được cập nhật, lịch sử tương tác được ghi nhận.</p>
      <div class="lg">${[['#51e3a4', '09:12 · Tiếp nhận yêu cầu'], ['#38c6ff', '10:30 · Đã đối chiếu chỉ số'], ['#ffb547', '10:45 · Đã phản hồi khách hàng']].map(([c, t]) => `<div><i style="background:${c};color:${c}"></i>${t}</div>`).join('')}</div></div>
    ${msg('Tra cứu thuận tiện ở một nơi – <em>xử lý vẫn đúng hệ thống chuyên trách</em>', 2, 4, 'headphones', 1)}` });

  /* 18. Field */
  const g6a = [['plus-circle', 'Gắn mới'], ['refresh-cw', 'Thay đồng hồ'], ['search', 'Kiểm tra'], ['alert-triangle', 'Xử lý sự cố'], ['construction', 'Thi công'], ['clipboard-check', 'Hoàn công']];
  const g6b = [['clock', 'Thời gian'], ['users', 'Nhân sự'], ['check-circle', 'Trạng thái'], ['file-check', 'Kết quả'], ['camera', 'Hình ảnh'], ['file-stack', 'Vật tư']];
  const fcol = (icon, t, body, a) => `<div class="fcol glass abs" ${a}><div class="hd">${bub(icon)}<span class="ttl">${t}</span></div>${body}</div>`;
  S.push({ name: 'Kỹ thuật & hiện trường', pptx: 18, n: 3, html: `
    ${head({ k: 'KỸ THUẬT &amp; HIỆN TRƯỜNG', t: 'Từ hiện trường <em>đến dữ liệu vận hành có giá trị</em>', hs: 44 })}
    ${photo('field', 'HIỆN TRƯỜNG', A('left', 0, 2, P(100, 186, 330, 564)))}
    ${phone(tech(), 0.6, A('phone', 0, 3, P(458, 210)))}
    ${fcol('wrench', 'Nghiệp vụ kỹ thuật', `<div class="g6">${g6a.map(([i, t]) => `<div>${ic(i)}${t}</div>`).join('')}</div>`, A('up', 1, 0, P(728, 186, 244, 470)))}
    ${fcol('file-text', 'Dữ liệu được ghi nhận', `<div class="g6">${g6b.map(([i, t]) => `<div>${ic(i)}${t}</div>`).join('')}</div>`, A('up', 1, 2, P(992, 186, 244, 470)))}
    ${fcol('database', 'Kết quả liên thông', `<p class="dsc" style="text-align:center">Cập nhật về hệ thống nghiệp vụ, chia sẻ dữ liệu liên quan theo phân quyền.</p><div class="tags" style="justify-content:center">${['Danh bộ', 'Hồ sơ đồng hồ', 'GIS', 'Vật tư'].map((t) => `<span>${t}</span>`).join('')}</div><p class="dsc" style="margin-top:16px;font-size:13.5px;color:#9fc0ea;text-align:center">Thi công, nghiệm thu, hoàn công, phê duyệt vẫn theo quy trình chuyên môn &amp; phân quyền.</p>`, A('up', 2, 0, P(1256, 186, 244, 470)))}
    ${net([['M972 436 L992 436', 1, 3, 0], ['M1236 436 L1256 436', 2, 1, 0]])}
    <div class="abs" ${A('fade', 2, 2, P(728, 676, 772, 50) + 'display:flex;align-items:center;justify-content:center;gap:12px;font-size:16px;color:#bfe0ff;font-weight:600')}>${ic('smartphone')}Tra cứu trên Mobile tại hiện trường: đồng hồ · lịch sử thay · hồ sơ · vị trí điểm cấp nước</div>
    ${msg('Hiện trường được số hóa – <em>kết quả được ghi nhận – dữ liệu được liên thông</em>', 2, 4, 'hard-hat', 1)}` });

  /* 19. Data BI AI */
  const viz = [
    `<svg viewBox="0 0 290 90">${[0, 1, 2].map((k) => `<rect x="${30 + k * 22}" y="${18 + k * 6}" width="56" height="62" rx="6" fill="rgba(140,200,255,${0.25 + k * 0.2})" stroke="#9fe0ff"/>`).join('')}${[0, 1, 2].map((k) => `<ellipse cx="200" cy="${26 + k * 18}" rx="44" ry="11" fill="#1c6fe0" stroke="#9fe0ff"/>`).join('')}</svg>`,
    `<svg viewBox="0 0 290 90">${[[145, 45], [60, 22], [60, 70], [230, 22], [230, 70], [100, 45], [190, 45]].map(([x, y], k, a) => (k ? `<line x1="145" y1="45" x2="${x}" y2="${y}" stroke="#49b8ff"/>` : '')).join('')}${[[145, 45, 14], [60, 22, 8], [60, 70, 8], [230, 22, 8], [230, 70, 8], [100, 45, 6], [190, 45, 6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#1c7dff" stroke="#bff0ff"/>`).join('')}</svg>`,
    `<svg viewBox="0 0 290 90">${[30, 45, 38, 58, 50, 66, 72].map((h, k) => `<rect x="${20 + k * 38}" y="${84 - h}" width="22" height="${h}" rx="3" fill="#1c6fe0"/>`).join('')}<polyline points="${[30, 45, 38, 58, 50, 66, 72].map((h, k) => `${31 + k * 38},${78 - h}`).join(' ')}" fill="none" stroke="#7fe0ff" stroke-width="2.5"/></svg>`,
    `<svg viewBox="0 0 290 90"><path d="M10 70 L50 62 L90 66 L130 50 L170 44" fill="none" stroke="#7fe0ff" stroke-width="2.5"/><path d="M170 44 L210 30 L250 34 L282 14" fill="none" stroke="#7fe0ff" stroke-width="2.5" stroke-dasharray="6 5"/><path d="M170 44 L210 22 L250 20 L282 2 L282 30 L250 46 L210 40 Z" fill="rgba(56,198,255,.18)"/><path d="M243 14 l9 -16 l9 16z" fill="#ffb547"/><text x="196" y="84">Cảnh báo sớm</text></svg>`];
  const st19 = [['file-text', 'Dữ liệu được hình thành', 'Số hóa nghiệp vụ, ghi nhận lịch sử &amp; dữ liệu vận hành.'], ['network', 'Dữ liệu được liên kết', 'Chuẩn hóa, định danh, kết nối các nguồn phù hợp.'], ['bar-chart-3', 'Phân tích &amp; BI', 'Theo dõi chỉ số, tổng hợp, so sánh, phát hiện xu hướng.'], ['trending-up', 'Dự báo &amp; AI', 'Cảnh báo, dự báo theo bài toán cụ thể khi đủ điều kiện dữ liệu.']];
  const ad = smooth([[100, 770], [450, 752], [800, 690], [1150, 600], [1520, 470]]);
  S.push({ name: 'Data – BI – AI', pptx: 19, n: 4, html: `
    ${head({ k: 'DATA – BI – AI', t: 'Từ dữ liệu liên thông <em>đến điều hành thông minh</em>', hs: 46, lead: 'AI là bước phát triển dựa trên dữ liệu đã có chất lượng – không tự xuất hiện chỉ vì đã xây ứng dụng.', lw: 1000 })}
    <svg class="wires" viewBox="0 0 1600 900"><path pathLength="1" d="${ad}" style="stroke-width:4" ${A('draw', 1, 0, '--len:1.4')}/></svg>
    ${st19.map(([i, t, d], x) => `<div class="stair glass ${x === 3 ? 'tg' : ''} abs" ${A('up', x < 2 ? 1 : x, x < 2 ? x : 0, P(100 + x * 355, 446 - x * 66, 330, 304 + x * 66))}><div style="display:flex;align-items:center;gap:14px"><span class="num">0${x + 1}</span>${bub(i)}</div><div class="ttl">${t}</div><p class="dsc">${d}</p><div class="viz">${viz[x]}</div></div>`).join('')}
    ${msg('AI chỉ bền vững khi dựng trên <em>dữ liệu đúng, đủ và có lịch sử</em>', 3, 2, 'cpu')}` });

  /* 20. Value */
  const who = [['briefcase', 'Ban Giám đốc', ['Góc nhìn theo khách hàng, khu vực, mạng lưới', 'Theo dõi tình hình tập trung', 'Quyết định dựa trên dữ liệu']], ['network', 'Các phòng ban', ['Phối hợp liên thông', 'Giảm tra cứu phân tán', 'Theo dõi trạng thái nghiệp vụ']], ['hard-hat', 'Nhân viên', ['Tra cứu thuận tiện theo quyền', 'Ghi nhận công tác tại chỗ', 'Truy xuất hồ sơ &amp; lịch sử']], ['heart-handshake', 'Khách hàng', ['Thông tin nhất quán', 'Phản hồi có cơ sở', 'Trải nghiệm phục vụ tốt hơn']], ['server', 'Phòng CNTT', ['Quản trị kết nối rõ ràng', 'Nguồn dữ liệu minh bạch', 'Kiểm soát truy cập tập trung']]];
  S.push({ name: 'Giá trị cho doanh nghiệp', pptx: 20, n: 3, html: `
    ${head({ k: 'GIÁ TRỊ GIẢI PHÁP', t: 'Giá trị lan tỏa <em>trên toàn doanh nghiệp</em>' })}
    ${who.map(([i, t, li], x) => `<div class="who5 glass ${x === 4 ? 'it' : ''} abs" ${A('flip', 1, x, P(100 + x * 284, 190, 264, 420))}><div class="hero">${bub(i)}</div><div class="ttl">${t}</div><ul>${li.map((l) => `<li>${ic('check-circle')}<span>${l}</span></li>`).join('')}</ul></div>`).join('')}
    <div class="prin glass tg abs" ${A('up', 2, 0, P(100, 636, 1400, 80))}><span class="lb">${bub('target', 'sm')}Kiểm chứng bằng</span>${[['map-pin', 'Thí điểm thực tế'], ['activity', 'Chỉ số đo được cụ thể'], ['x', 'Không chỉ bằng giao diện hay số lượng chức năng']].map(([i, t]) => `<span class="it">${ic(i)}${t}</span>`).join('')}</div>
    ${msg('Từ hiệu quả từng bộ phận → <em>giá trị vận hành của toàn doanh nghiệp</em>', 2, 2, 'trending-up', 1)}` });

  /* 21. Pilot */
  const ps = [['file-search', 'Khảo sát &amp; thống nhất', 'Đánh giá hệ thống, dữ liệu, quy trình, điều kiện tích hợp.'], ['target', 'Chọn phạm vi thí điểm', 'Xác định nhóm người dùng, nghiệp vụ, dữ liệu ưu tiên.'], ['network', 'Triển khai liên thông', 'Kết nối dữ liệu cần thiết, xây trải nghiệm khai thác phù hợp.'], ['trending-up', 'Đánh giá &amp; mở rộng', 'Kiểm chứng kết quả, hoàn thiện, đề xuất nhân rộng.']];
  const sc = [['contact', 'Dữ liệu khách hàng · danh bộ · đồng hồ', 'TRỌNG TÂM', 'm1'], ['user-check', 'Hồ sơ khách hàng 360°', 'TRỌNG TÂM', 'm1'], ['map-pin', 'Liên kết tập điểm cấp nước lên GIS hiện hữu', 'KIỂM CHỨNG', 'm2'], ['alert-triangle', 'Thí điểm dữ liệu sự cố', 'KHI SẴN SÀNG', 'm3', 1]];
  S.push({ name: 'Đề xuất thí điểm', pptx: 21, n: 4, html: `
    ${head({ k: 'ĐỀ XUẤT TRIỂN KHAI', t: 'Thí điểm có trọng tâm – <em>kiểm chứng trước khi mở rộng</em>', hs: 44 })}
    <svg class="wires" viewBox="0 0 1600 900"><path pathLength="1" d="M152 250 L152 640" ${A('draw', 1, 0, '--len:1')}/></svg>
    ${ps.map(([i, t, d], x) => `<div class="pstep glass abs" ${A('left', 1, x, P(100, 194 + x * 130, 640, 112))}><span class="num">0${x + 1}</span>${bub(i)}<div><div class="ttl">${t}</div><p class="dsc">${d}</p></div></div>`).join('')}
    <div class="scope glass tg abs" ${A('right', 2, 0, P(780, 194, 720, 400))}><div class="hd">${bub('target')}<span class="ttl c">Phạm vi Giai đoạn 1 đề xuất</span></div>
      ${sc.map(([i, t, tg, m, opt], k) => `<div class="sc ${opt ? 'opt' : ''}" ${A('left', 2, k + 1)}>${ic(i)}${t}<small class="${m}">${tg}</small></div>`).join('')}
      <p class="fn">${ic('file-check')}Chi tiết Giai đoạn 1 chốt sau khảo sát &amp; thống nhất nguồn lực với Chợ Lớn.</p></div>
    <div class="pr3 glass abs" ${A('up', 3, 0, P(780, 614, 720, 108))}>${[['target', 'Ưu tiên giá trị thực tế'], ['shield-check', 'Bảo vệ hệ thống hiện hữu'], ['list-checks', 'Có tiêu chí nghiệm thu']].map(([i, t]) => `<div>${ic(i)}${t}</div>`).join('')}</div>
    ${msg('Bắt đầu có trọng tâm – <em>đo lường được – sẵn sàng mở rộng</em>', 3, 2, 'rocket')}` });

  /* 22. Measure */
  const before = [42, 30, 48, 36, 44], after = [52, 66, 80, 96, 118];
  S.push({ name: 'Đo lường hiệu quả', pptx: 22, n: 3, html: `
    ${head({ k: 'ĐO LƯỜNG HIỆU QUẢ', t: 'Đánh giá bằng kết quả – <em>không bằng số lượng tính năng</em>', hs: 40 })}
    <div class="bachart glass tg abs" ${A('left', 0, 2, P(100, 190, 600, 560))}><div style="display:flex;align-items:center;gap:12px">${bub('activity', 'sm')}<span class="ttl c">So sánh trước – sau triển khai</span></div>
      <svg viewBox="0 0 556 300" style="margin-top:14px"><line x1="278" x2="278" y1="0" y2="270" stroke="#38c6ff" stroke-dasharray="5 5"/><text x="120" y="292" text-anchor="middle" style="fill:#8fa6c8">TRƯỚC</text><text x="420" y="292" text-anchor="middle" style="fill:#7fe0ff">SAU</text>
        ${before.map((h, k) => `<rect x="${24 + k * 48}" y="${260 - h * 1.6}" width="30" height="${h * 1.6}" rx="4" fill="rgba(140,160,190,.4)"/>`).join('')}
        <polyline points="${before.map((h, k) => `${39 + k * 48},${250 - h * 1.6 - 30}`).join(' ')}" fill="none" stroke="#8fa6c8" stroke-width="2"/>
        ${after.map((h, k) => `<rect x="${302 + k * 48}" y="${260 - h * 1.9}" width="30" height="${h * 1.9}" rx="4" fill="url(#gb22)" ${A('grow', 1, k, '--d:.1')}/>`).join('')}
        <polyline pathLength="1" stroke-dasharray="1" points="${after.map((h, k) => `${317 + k * 48},${250 - h * 1.9 - 12}`).join(' ')}" fill="none" stroke="#7fe0ff" stroke-width="3" ${A('draw', 1, 4)}/>
        <defs><linearGradient id="gb22" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#45e0ff"/><stop offset="1" stop-color="#0b3fc2"/></linearGradient></defs></svg>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px">${['Đo đường cơ sở', 'Theo dõi kết quả', 'Đối chiếu mục tiêu', 'Xác nhận hiệu quả'].map((t, k) => `<div class="stepchip" style="height:48px;border-radius:12px;background:rgba(20,80,180,.35);font-size:16px"><i>${k + 1}</i>${t}</div>`).join('')}</div></div>
    ${[['clock', 'Thời gian tra cứu', 'Thời gian tìm khách hàng &amp; hồ sơ liên quan.'], ['database', 'Chất lượng dữ liệu', 'Mức đầy đủ, chính xác, thống nhất của dữ liệu liên kết.'], ['git-merge', 'Khả năng liên thông', 'Số luồng dữ liệu ổn định &amp; khả năng truy xuất.']].map(([i, t, d], x) => `<div class="kpi glass abs" ${A('flip', 1, x, P(740 + x * 258, 190, 242, 230))}>${bub(i, 'lg')}<div class="ttl">${t}</div><p class="dsc">${d}</p></div>`).join('')}
    ${[['settings', 'Hiệu quả quy trình', 'Thời gian xử lý, bước chuyển giao, theo dõi trạng thái.'], ['users', 'Mức độ sử dụng', 'Tần suất &amp; tỷ lệ khai thác theo nhóm người dùng.']].map(([i, t, d], x) => `<div class="kpi h glass abs" ${A('flip', 1, x + 3, P(740 + x * 387, 438, 373, 126))}>${bub(i)}<div><div class="ttl">${t}</div><p class="dsc">${d}</p></div></div>`).join('')}
    <div class="qs glass abs" ${A('up', 2, 0, P(740, 582, 760, 168))}><div class="ttl">Ví dụ câu hỏi nghiệm thu</div><ul>${['Danh bộ đã liên kết đúng điểm cấp nước?', 'Thông tin đồng hồ cập nhật đúng?', 'Chọn điểm trên GIS có mở đúng hồ sơ?', 'Thời gian tra cứu thay đổi ra sao?'].map((t) => `<li>${ic('check-circle')}<span>${t}</span></li>`).join('')}</ul><p class="dsc" style="font-size:13.5px;margin-top:8px">Lượng hóa sau khi hai bên chốt tập dữ liệu &amp; quy mô thí điểm.</p></div>
    ${msg('Kết quả đo lường là <em>cơ sở để quyết định mở rộng</em>', 2, 2, 'target')}` });

  /* 23. Roadmap 2030 */
  const rp = [[100, 470], [250, 478], [490, 420], [740, 462], [990, 400], [1236, 352]];
  const rd = smooth(rp);
  const ph = [['GIAI ĐOẠN 1', 'Nền tảng', 'Khảo sát · chuẩn hóa định danh · chọn thí điểm · liên thông dữ liệu ưu tiên', 'file-search'], ['GIAI ĐOẠN 2', 'Mở rộng', 'Hoàn thiện quy trình · mở rộng kết nối · khai thác GIS, Web, Mobile', 'smartphone'], ['GIAI ĐOẠN 3', 'Khai thác dữ liệu', 'Tổng hợp dữ liệu · Dashboard / BI · phân tích hiệu quả · giám sát chỉ số', 'bar-chart-3'], ['GIAI ĐOẠN 4', 'Nâng cao', 'Phân tích chuyên sâu · cảnh báo rủi ro · dự báo &amp; AI theo điều kiện thực tế', 'cpu']];
  S.push({ name: 'Lộ trình đến 2030', pptx: 23, n: 3, html: `
    ${head({ k: 'LỘ TRÌNH PHÁT TRIỂN ĐẾN 2030', t: 'Từ nền tảng nghiệp vụ <em>đến vận hành cấp nước thông minh</em>', hs: 42 })}
    <svg class="wires" viewBox="0 0 1600 900"><path pathLength="1" d="${rd}" style="stroke-width:4" ${A('draw', 0, 2, '--len:1')}/><g ${A('fade', 0, 6)}><path class="flow" d="${rd}"/>${pk(rd, 6, 0)}${pk(rd, 6, -3)}<path d="M1236 352 l-22 -2 l12 18z" fill="#7fdcff"/></g>
      ${rp.slice(1, 5).map(([x, y], k) => `<g ${A('zoom', 1, k)}><line x1="${x}" x2="${x}" y1="${k % 2 ? y + 14 : y - 14}" y2="${k % 2 ? 520 : 380}" stroke="#49b8ff" stroke-dasharray="4 4"/><circle cx="${x}" cy="${y}" r="13" fill="#062058" stroke="#38c6ff" stroke-width="3"/><circle cx="${x}" cy="${y}" r="5" fill="#bff0ff"/></g>`).join('')}</svg>
    ${ph.map(([tg, t, d, i], x) => `<div class="ph glass abs" ${A(x % 2 ? 'up' : 'flip', 1, x, P(rp[x + 1][0] - 150, x % 2 ? 520 : 200, 300, 180))}><div style="display:flex;align-items:center;gap:12px">${bub(i, 'sm')}<div><div class="tagp">${tg}</div><div class="ttl">${t}</div></div></div><p class="dsc">${d}</p></div>`).join('')}
    <div class="vision abs" ${A('zoom', 0, 4, P(1260, 186, 250, 250))}><img src="assets/img/dawn.jpg" alt=""></div>
    <div class="vtxt abs" ${A('up', 0, 5, P(1200, 452, 370))}><b>TẦM NHÌN 2030</b><span>Doanh nghiệp cấp nước<br>vận hành dựa trên dữ liệu</span></div>
    <div class="gantt glass abs" ${A('up', 2, 0, P(100, 718, 1400, 92))}><div class="hd"><span>Các giai đoạn có thể triển khai chồng lấn khi đủ điều kiện – không tuần tự cứng nhắc</span><span>→ 2030</span></div>
      <div class="row"><i style="left:0;width:36%;background:rgba(28,125,255,.85)" ${A('growx', 2, 1)}>GĐ1 · Nền tảng</i><i style="left:48%;width:34%;background:rgba(56,198,255,.75);color:#03203f" ${A('growx', 2, 3)}>GĐ3 · Khai thác dữ liệu</i></div>
      <div class="row"><i style="left:24%;width:36%;background:rgba(80,140,255,.7)" ${A('growx', 2, 2)}>GĐ2 · Mở rộng</i><i style="left:68%;width:32%;background:rgba(255,181,71,.8);color:#3a1d00" ${A('growx', 2, 4)}>GĐ4 · Nâng cao</i></div></div>` });

  /* 24. WAO */
  const dom = [['users', 'Kinh doanh &amp; khách hàng', 'Quản lý danh bộ · ghi chỉ số · thu tiền · công nợ · CSKH'], ['wrench', 'Kỹ thuật &amp; hiện trường', 'Gắn mới · thay đồng hồ · khảo sát · thi công · hoàn công · vật tư'], ['database', 'Liên thông nghiệp vụ &amp; dữ liệu', 'Kết nối quy trình · tra cứu thông tin liên quan · tích hợp hệ thống']];
  const procs = [['contact', 'Danh bộ'], ['gauge', 'Ghi chỉ số'], ['wallet', 'Thu tiền'], ['plus-circle', 'Gắn mới'], ['route', 'Nâng dời'], ['refresh-cw', 'Tái lập'], ['wrench', 'Thay đồng hồ'], ['clipboard-check', 'Hoàn công']];
  S.push({ name: 'Năng lực của WAO', pptx: 24, n: 3, html: `
    ${head({ k: 'NĂNG LỰC TRIỂN KHAI CỦA WAO', t: 'Kinh nghiệm hệ sinh thái nghiệp vụ <em>ngành cấp nước</em>', hs: 44 })}
    ${photo('wao', 'HIỂU NGHIỆP VỤ – KẾT NỐI QUY TRÌNH – HÌNH THÀNH DỮ LIỆU VẬN HÀNH', A('zoom', 0, 2, P(100, 180, 1400, 300)))}
    ${dom.map(([i, t, d], x) => `<div class="dom glass abs" ${A('up', 1, x, P(100 + x * 475, 506, 450, 150))}>${bub(i, 'lg')}<div><div class="ttl">${t}</div><p class="dsc">${d}</p></div></div>`).join('')}
    <div class="procs abs" ${A('up', 2, 0, P(100, 680, 1400, 60))}>${procs.map(([i, t]) => `<span>${ic(i)}${t}</span>`).join('')}</div>
    ${msg('Kế thừa kinh nghiệm – <em>thiết kế riêng theo thực trạng Cấp nước Chợ Lớn</em>', 2, 2, 'quote', 1)}` });

  /* 25. Closing */
  const nx = [['navigation', 'Thống nhất chủ trương', 'Phối hợp nghiên cứu và khảo sát giải pháp Chowaco One.'], ['file-search', 'Tổ chức khảo sát', 'Đánh giá hệ thống hiện hữu, quy trình nghiệp vụ và khả năng liên thông dữ liệu.'], ['target', 'Xác định phạm vi thí điểm', 'Thống nhất nhu cầu ưu tiên, phương án triển khai và tiêu chí đánh giá.']];
  S.push({ name: 'Bước tiếp theo & Cảm ơn', pptx: 25, n: 3, cls: 'cover', html: `
    <div class="closing-bg abs" ${A('fade', 0, 0, P(700, 0, 900, 620))}><img src="assets/img/cover.jpg" alt="" style="object-position:50% 30%"></div>
    <div class="logo-pill abs" ${A('up', 0, 0, P(100, 56))}><img src="assets/logo.png" alt="Chowaco"></div>
    <h1 class="abs" ${A('wipe', 0, 1, P(100, 140) + 'font-size:84px')}>Chowaco <em>One</em></h1>
    <p class="abs" ${A('up', 0, 2, P(100, 250, 900) + 'font-size:24px;font-weight:700;letter-spacing:1px;color:var(--cyan);text-transform:uppercase')}>Giải pháp vận hành cấp nước liên thông</p>
    <p class="abs" ${A('up', 0, 3, P(100, 290, 900) + 'font-size:32px;font-weight:600;line-height:1.3')}>Từ tầm nhìn chung đến những bước triển khai thực chất</p>
    <div class="col-title abs" ${A('up', 1, 0, P(100, 376, 420))}>ĐỀ XUẤT BƯỚC TIẾP THEO</div>
    ${nx.map(([i, t, d], x) => `<div class="next3 glass ${x === 0 ? 'tg' : ''} abs" ${A('flip', 1, x + 1, P(100 + x * 480, 430, 440, 230))}><span class="nn num">0${x + 1}</span>${bub(i)}<div class="ttl">${t}</div><p class="dsc">${d}</p></div>`).join('')}
    ${[0, 1].map((x) => `<div class="chev abs" ${A('fade', 1, x * 2 + 2, P(546 + x * 480, 525, 30, 40))}>${ic('chevron-right')}</div>`).join('')}
    <div class="thx abs" ${A('wipe', 2, 0, P(100, 688))}>Trân trọng cảm ơn!</div>
    <div class="sig abs" ${A('up', 2, 2, P(900, 714))}><i></i><b>WAO</b>đồng hành cùng Cấp nước Chợ Lớn</div>` });

  window.SCENES = S;
  window.ic = ic;
})();
