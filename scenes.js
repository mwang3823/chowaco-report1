(() => {
  const ic = (n, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24">${window.ICONS[n] || ''}</svg>`;
  const P = (x, y, w, h) => `left:${x}px;top:${y}px;${w ? `width:${w}px;` : ''}${h ? `height:${h}px;` : ''}`;
  const A = (a, s = 0, i = 0, x = '') => `data-a="${a}" ${s ? '' : 'data-s0'} style="--s:${s};--i:${i};${x}"`;
  const li = (a) => a.map((t) => `<li>${t}</li>`).join('');
  const dot = (a, c = '') => `<ul class="dotlist ${c}">${li(a)}</ul>`;
  const chk = (a) => `<ul class="chk">${a.map((t) => `<li>${ic('check-circle')}<span>${t}</span></li>`).join('')}</ul>`;
  const head = ({ k, t, sub, lead, c = '', lw, hs }) => `<header class="head ${c}">
    ${k ? `<span class="kicker" ${A('up')}>${k}</span>` : ''}
    <h1 ${A('wipe', 0, 0, hs ? `font-size:${hs}px` : '')}>${t}</h1>
    ${sub ? `<p class="sub" ${A('up', 0, 1)}>${sub}</p>` : ''}
    ${lead ? `<p class="lead" ${A('up', 0, 2, lw ? `max-width:${lw}px` : '')}>${lead}</p>` : ''}
  </header>`;
  const msg = (t, s, i = 0, icon = 'target') => `<div class="msg" ${A('zoom', s, i)}><span class="msg-ic">${ic(icon)}</span><span>${t}</span></div>`;
  const node = (icon, t, a) => `<div class="node card abs" ${a}><span class="nic">${ic(icon)}</span><span>${t}</span></div>`;
  const fchip = (icon, t, a) => `<div class="fchip glass abs" ${a}>${ic(icon)}<span>${t}</span></div>`;
  const wires = (paths) => `<svg class="wires" viewBox="0 0 1600 900">${paths.map(([d, s, i]) => `<path pathLength="1" d="${d}" ${A('draw', s, i)}/>`).join('')}</svg>`;
  const phone = (screen, k, a = '', id = '') => `<div class="abs" ${a}><div class="phone-fit" ${id ? `id="${id}"` : ''} style="--pk:${k}"><div class="phone"><div class="island"></div><div class="screen">${screen}</div></div></div></div>`;
  const icard = (icon, t, items, a) => `<div class="icard card abs" ${a}><span class="big">${ic(icon)}</span><div><h3>${t}</h3>${dot(items)}</div></div>`;

  /* ---------- static app screens ---------- */
  const sb = (c = '#fff') => `<div class="sb" style="color:${c}"><span>9:41</span><i>${ic('bar-chart-2')}${ic('zap')}</i></div>`;
  const tile = (icon, t) => `<div class="tile"><span>${ic(icon)}</span>${t}</div>`;
  const tabbar = (on = 0) => `<div class="tabbar">${[['home', 'Trang chủ'], ['users', 'Danh bạ'], ['clipboard-check', 'Công việc'], ['bar-chart-3', 'Báo cáo'], ['more-horizontal', 'Thêm']].map(([i, t], x) => `<span class="${x === on ? 'on' : ''}">${ic(i)}${t}</span>`).join('')}</div>`;

  const home = () => `<div class="app">
    <div class="ah">${sb()}<div class="ah-bar">${ic('menu')}<span>CHOWACO ONE</span>${ic('bell')}</div>
      <div class="greet"><span class="ava">${ic('user')}</span><div><small>Xin chào,</small><b>Nguyễn Văn An</b><small>Nhân viên hiện trường</small></div></div></div>
    <div class="abody">
      <div class="box pull"><div class="chips"><span class="on">${ic('layout-grid')}Tất cả</span><span>${ic('contact')}Danh bộ</span><span>${ic('users')}CCCD/SĐD</span><span>${ic('receipt')}Hóa đơn</span></div>
        <div class="sfield">${ic('search')}Nhập danh bộ để tra cứu thông tin nhanh</div></div>
      <div class="box"><div class="stt">SỬ DỤNG GẦN ĐÂY<small>Xem tất cả ›</small></div>
        <div class="tiles">${tile('contact', 'Thông tin<br>khách hàng')}${tile('users', 'Tra cứu<br>CCCD/SĐD')}${tile('receipt', 'Tra cứu<br>hóa đơn')}</div></div>
      <div class="box"><div class="stt">DANH SÁCH CHỨC NĂNG</div>
        <div class="tiles">${tile('contact', 'Thông tin<br>khách hàng')}${tile('receipt', 'Tra cứu<br>hóa đơn')}${tile('users', 'Tra cứu<br>CCCD/SĐD')}${tile('calendar-check', 'Cập nhật<br>kiểm tra')}${tile('gauge', 'Cập nhật HC<br>bấm chì')}${tile('file-check', 'Thay ĐHN<br>kiểm định')}</div></div>
    </div>${tabbar(0)}</div>`;

  const statBox = `<div class="stats">
    <div class="stat">${ic('badge-check')}<div>Trạng thái<b class="ok" style="font-size:13px">● Đang hoạt động</b></div></div>
    <div class="stat">${ic('wallet')}<div>Công nợ<b>0 đ</b><small>Không nợ</small></div></div>
    <div class="stat">${ic('droplet')}<div>Tiêu thụ tháng này<b>28 m³</b><small>+12% so với T-1</small></div></div>
    <div class="stat">${ic('alert-triangle', 'warn')}<div>Cảnh báo<b class="warn">02</b><small>Cần xử lý</small></div></div></div>`;
  const custRow = `<div class="cust"><span class="ava">${ic('user')}</span><div><b>Nguyễn Văn An</b><p>KH00012345 · Cá nhân</p><p>${ic('map-pin')}123 Hải Thượng Lãn Ông, P. Chợ Lớn</p><p>${ic('phone')}0901 234 567</p></div>${ic('chevron-right')}</div>`;
  const search = (animated) => `<div class="app">
    <div class="ah">${sb()}<div class="ah-bar"><span>${ic('droplet')} Chowaco One</span>${ic('bell')}</div>
      <div style="padding:0 14px 14px"><div class="sfield">${ic('search')}Nhập từ khóa để tra cứu khách hàng${ic('sliders-horizontal')}</div></div></div>
    <div class="abody" style="padding-top:10px">
      <div class="box"><div class="segs"><span class="on">${ic('contact')}Danh bộ</span><span>${ic('map-pin')}Địa chỉ</span><span>${ic('phone')}Số điện thoại</span><span>${ic('map')}Lộ trình</span></div></div>
      <div class="stt">Kết quả tìm kiếm<small>Xem tất cả (120) ›</small></div>
      <div class="box">${custRow}</div>
      <div ${animated ? A('up', 2, 2) : ''}>
        <div class="stt">Hồ sơ khách hàng (đã chọn)<small class="ok">✓</small></div>
        <div class="box">${statBox}</div>
        <div class="box rowlink">${ic('file-text')}Xem chi tiết hồ sơ${ic('chevron-right')}</div>
      </div>
    </div></div>`;

  const kv = (i, k, v) => `<div class="kv">${ic(i)}<span>${k}</span><b>${v}</b>${ic('chevron-right')}</div>`;
  const profile = () => `<div class="app">
    <div class="ah">${sb()}<div class="ah-bar">${ic('arrow-left')}<span>Hồ sơ khách hàng</span>${ic('more-horizontal')}</div></div>
    <div class="abody" style="padding-top:12px">
      <div class="box"><div class="cust" style="margin-bottom:8px"><span class="ava">${ic('user')}</span><b>Nguyễn Văn An</b><span class="badge">Đang sử dụng</span></div>
        ${kv('contact', 'Mã danh bộ', 'KD01234567')}${kv('map-pin', 'Địa chỉ sử dụng nước', '123 Hải Thượng Lãn Ông, P. Chợ Lớn')}${kv('phone', 'Số điện thoại', '0901 234 567')}${kv('route', 'Khu vực / lộ trình', 'KV01 - CL / LT.01-03')}${kv('droplet', 'Trạng thái sử dụng nước', '<span class="ok">Đang sử dụng</span>')}</div>
      <div class="box"><div class="stt">Dashboard tổng quan</div><div class="stats">
        <div class="stat">${ic('wallet')}<div>Công nợ<b class="bad">1.250.000 đ</b></div></div>
        <div class="stat">${ic('calendar')}<div>Số kỳ chưa thanh toán<b class="warn">2 kỳ</b></div></div>
        <div class="stat">${ic('droplet')}<div>Bình quân tiêu thụ<b>18 m³/tháng</b><small>▼ 5% so với kỳ trước</small></div></div>
        <div class="stat">${ic('activity')}<div>Kỳ tiêu thụ bất thường<b>1 kỳ</b><small>Kỳ 04/2026</small></div></div></div></div>
      <div class="box rowlink">${ic('alert-triangle', 'warn')}Có 1 cảnh báo đang hoạt động${ic('chevron-right')}</div>
    </div></div>`;

  const f = (k, v) => `<div><small>${k}</small>${v}</div>`;
  const tech = () => `<div class="app">
    <div class="ah">${sb()}<div class="ah-bar">${ic('chevron-left')}<span>Chi tiết Danh bộ</span>${ic('scan-line')}</div></div>
    <div class="ntabs"><span>Gắn mới</span><span class="on">Thay &amp; lịch sử ĐHN</span><span>Nâng - dời</span></div>
    <div class="abody" style="padding-top:12px">
      <div class="box"><span class="pill">Lịch sử thay</span><div class="fgrid">
        ${f('Số bảng kê', '0005DK1/26')}${f('Loại báo thay', 'Định kỳ')}${f('Ngày báo', '10/01/2026')}${f('Ngày kiểm định', '27/02/2026')}${f('Ngày thay', '15/03/2026')}${f('Ngày cập nhật', '17/03/2026')}${f('Ngày hoàn công', '17/03/2026')}${f('Ngày điều chỉnh', '17/03/2026')}${f('Hiệu cũ', 'ARAD')}${f('Hiệu mới', 'AIC')}${f('Số thân cũ', '094537')}${f('Số thân mới', '102365')}${f('Chỉ số gỡ', '1161')}${f('Chỉ số gắn', '0')}</div>
        <small style="display:block;margin-top:10px;color:#0d5fd0;font-weight:700">Ảnh hiện trường</small>
        <div class="pics"><i>${ic('gauge')}</i><i>${ic('image')}</i><i>${ic('camera')}</i></div></div>
      <div class="box"><span class="pill">Lịch sử thay</span><div class="fgrid">${f('Số bảng kê', '0112DK4/21')}${f('Loại báo thay', 'Định kỳ')}</div></div>
    </div></div>`;

  const biz = () => `<div class="app">
    <div class="ah">${sb()}<div class="ah-bar">${ic('chevron-left')}<span>Chi tiết khách hàng</span>${ic('layout-grid')}</div></div>
    <div style="padding:10px 16px 0;background:#fff"><b>KH00012345</b><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:16px">Công ty TNHH An Phú</b><span class="badge b2">Khách hàng doanh nghiệp</span></div><small style="color:#5a6c88">88 Châu Văn Liêm, P. Chợ Lớn, TP. HCM</small></div>
    <div class="ntabs"><span>Tổng quan</span><span>Kỹ thuật</span><span class="on">Kinh doanh &amp; CSKH</span></div>
    <div class="abody bz" style="padding-top:10px">
      <div class="box"><h4>${ic('receipt')}Thanh toán &amp; công nợ</h4><p>Trạng thái hóa đơn<b class="warn">Chưa thanh toán</b></p><p>Tổng nợ<b class="bad">12.450.000 đ</b></p><p>Số kỳ chưa thanh toán<b>3 kỳ</b></p><a>Xem chi tiết ›</a></div>
      <div class="box"><h4>${ic('history')}Lịch sử thanh toán</h4><p>5 giao dịch gần nhất<span class="minibars"><i style="height:14px"></i><i style="height:22px"></i><i style="height:17px"></i><i style="height:26px"></i><i style="height:20px"></i></span></p><a>Xem tất cả ›</a></div>
      <div class="box"><h4>${ic('droplet')}Chỉ số tiêu thụ</h4><p><span>Kỳ gần nhất (09/2026)<br><b style="font-size:18px">528 m³</b> <span class="ok">▲ 12%</span></span><svg class="spark" viewBox="0 0 110 34"><path d="M2 28 L14 24 L26 26 L38 18 L50 21 L62 14 L74 16 L86 8 L98 10 L108 4"/></svg></p><a>Xem chi tiết ›</a></div>
      <div class="box"><h4>${ic('headphones')}Khiếu nại / CSKH</h4><p>Đang xử lý<b class="warn">1 yêu cầu</b></p><p>Đã xử lý<b class="ok">4 yêu cầu</b></p><a>Xem chi tiết ›</a></div>
      <div class="box"><h4>${ic('message-square')}Ghi chú xử lý</h4><p>Cập nhật gần nhất<b>10/09/2026 09:45</b></p></div>
    </div></div>`;

  const splash = () => `<div class="app splash"><img src="assets/logo.png" alt="" style="width:230px;background:#fff;padding:14px 18px;border-radius:18px"><b>CHOWACO ONE</b><small>VẬN HÀNH TẬP TRUNG<br>KẾT NỐI BỀN VỮNG</small></div>`;

  /* ---------- scenes ---------- */
  const S = [];

  S.push({ name: 'Chowaco One', pptx: 1, n: 2, cls: 'cover', html: `
    <div class="logo-pill abs" ${A('up', 0, 0, P(100, 66))}><img src="assets/logo.png" alt="Chowaco"></div>
    <h1 class="abs" ${A('wipe', 0, 1, P(100, 170))}>Chowaco <em>One</em></h1>
    <div class="rule abs" ${A('wipe', 0, 2, P(100, 326, 640, 2))}></div>
    <p class="lead abs" ${A('up', 0, 3, P(100, 350, 760))}>Nền tảng mobile vận hành tập trung cho nhân viên Cấp nước Chợ Lớn</p>
    <div class="tagline abs" ${A('up', 0, 4, P(100, 492))}><span class="nic solid round">${ic('droplet')}</span>Một ứng dụng – Nhiều nghiệp vụ – Dữ liệu tập trung</div>
    <div class="focus glass abs" ${A('flip', 1, 0, P(100, 610, 640, 116))}><span class="nic solid round">${ic('target')}</span><div><b>Trọng tâm Giai đoạn 1:</b>Danh bộ tập trung &amp; Báo cáo cơ bản</div></div>
    <div class="halo abs" style="${P(800, 150, 600, 600)}"></div>
    ${phone(home(), 0.93, A('phone', 0, 3, P(920, 70)))}
    ${fchip('database', 'Dữ liệu<br>tập trung', A('right', 1, 1, P(1320, 190, 230, 84)))}
    ${fchip('shield-check', 'Phân quyền<br>theo vai trò', A('right', 1, 2, P(1350, 400, 230, 84)))}
    ${fchip('hard-hat', 'Sẵn sàng cho<br>hiện trường', A('right', 1, 3, P(1320, 610, 230, 84)))}` });

  const ctx = [['users', '1. Danh bạ khách hàng'], ['gauge', '2. Đồng hồ nước'], ['bar-chart-3', '3. Chỉ số tiêu thụ'], ['wallet', '4. Thanh toán &amp; công nợ'], ['droplets', '5. Đóng/mở nước'], ['wrench', '6. Gắn mới, thay &amp; hoàn công thay'], ['headphones', '7. Khiếu nại, công văn, CSKH'], ['image', '8. Hồ sơ số hóa &amp; hình ảnh hiện trường']];
  S.push({ name: 'Bối cảnh & bài toán', pptx: 2, n: 4, html: `
    ${head({ t: 'Bối cảnh &amp; bài toán <em>vận hành</em>', lead: 'Mỗi khách hàng cấp nước liên quan đến nhiều nhóm dữ liệu' })}
    ${wires([0, 1, 2, 3].map((i) => [`M410 ${262 + i * 104} C500 ${262 + i * 104} 500 ${340 + i * 70} 590 ${340 + i * 70}`, 1, i]).concat([0, 1, 2, 3].map((i) => [`M1010 ${340 + i * 70} C1100 ${340 + i * 70} 1100 ${262 + i * 104} 1190 ${262 + i * 104}`, 2, i])))}
    <div class="ccard card abs" ${A('zoom', 0, 2, P(590, 216, 420, 420))}>
      <div class="top"><span class="ava">${ic('user')}</span><div><h3>Nguyễn Văn An</h3><span class="id">KH00012345</span></div></div>
      <ul><li>${ic('map-pin')}<span>Địa chỉ</span><b>123 Hải Thượng Lãn Ông, P. Chợ Lớn</b></li><li>${ic('building-2')}<span>Loại khách hàng</span><b>Sinh hoạt</b></li><li>${ic('users')}<span>Nhóm khách hàng</span><b>Hộ gia đình</b></li><li>${ic('calendar')}<span>Ngày đăng ký</span><b>15/03/2021</b></li><li>${ic('droplet')}<span>Trạng thái</span><b style="color:#0171cc">Đang hoạt động</b></li></ul></div>
    ${ctx.slice(0, 4).map(([i, t], x) => node(i, t, A('left', 1, x, P(110, 220 + x * 104, 300, 84)))).join('')}
    ${ctx.slice(4).map(([i, t], x) => node(i, t, A('right', 2, x, P(1190, 220 + x * 104, 300, 84)))).join('')}
    <div class="info glass abs" ${A('up', 3, 0, P(160, 664, 1280, 66))}>${ic('droplet')}Dữ liệu nhiều, nhưng cần được tra cứu nhanh hơn, tập trung hơn và thuận tiện hơn trên mobile.</div>
    ${msg('Đưa đúng dữ liệu đến <em>đúng người, đúng thời điểm, đúng quyền hạn.</em>', 3, 2)}` });

  const groups = [['briefcase', '1. Ban Giám đốc / Quản lý'], ['bar-chart-3', '2. Khối Kinh doanh'], ['wrench', '3. Khối Kỹ thuật'], ['headphones', '4. Chăm sóc khách hàng'], ['monitor', '5. Nhân viên văn phòng'], ['users', '6. Các phòng ban nghiệp vụ liên quan']];
  const roles = [['file-search', 'Tra cứu dữ liệu khách hàng tập trung'], ['smartphone', 'Hỗ trợ xử lý nghiệp vụ trên mobile'], ['puzzle', 'Kết nối dần các module hiện trường'], ['line-chart', 'Cung cấp báo cáo cơ bản cho quản lý'], ['shield-check', 'Phân quyền dữ liệu theo vai trò']];
  S.push({ name: 'Định hướng giải pháp', pptx: 3, n: 3, html: `
    ${head({ t: 'Định hướng <em>giải pháp</em>', lead: '<b>Chowaco One</b> là ứng dụng mobile nội bộ dùng chung cho các nhóm người dùng trong công ty.<br><span style="color:var(--cyan)">Một nền tảng mobile tập trung để tra cứu, khai thác dữ liệu và hỗ trợ xử lý nghiệp vụ.</span>', lw: 1100 })}
    ${phone(home(), 0.7, A('phone', 0, 3, P(418, 262)))}
    ${groups.slice(0, 3).map(([i, t], x) => node(i, t, A('left', 1, x, P(100, 300 + x * 160, 290, 104)))).join('')}
    ${groups.slice(3).map(([i, t], x) => node(i, t, A('right', 1, x + 3, P(720, 300 + x * 160, 300, 104)))).join('')}
    <div class="col-title abs" ${A('up', 2, 0, P(1080, 250, 420))}>VAI TRÒ CỦA NỀN TẢNG</div>
    ${roles.map(([i, t], x) => node(i, t, A('flip', 2, x + 1, P(1080, 312 + x * 106, 420, 88)))).join('')}` });

  const phases = [
    { no: '01', icon: 'database', t: 'Xây nền tảng<br>dữ liệu khách hàng', focus: ['Danh bộ tập trung', 'Hồ sơ khách hàng 360°', 'Dashboard tổng quan', 'Báo cáo cơ bản'], val: ['Tra cứu nhanh hơn', 'Dữ liệu tập trung hơn', 'Hỗ trợ Kinh doanh &amp; Kỹ thuật tốt hơn'], foot: ['star', 'Ưu tiên triển khai'] },
    { no: '02', icon: 'hard-hat', t: 'Mở rộng<br>nghiệp vụ hiện trường', focus: ['Kiểm tra kiểm soát', 'Báo bể', 'Đọc số nước', 'Đóng/Mở nước', 'Nhắc nợ', 'Gắn mới, thay &amp; hoàn công'], val: ['Nhân viên xử lý nghiệp vụ trên mobile', 'Giảm phụ thuộc giấy tờ / gọi hỏi nội bộ', 'Tăng tốc độ xử lý hiện trường'], foot: ['trending-up', 'Mở rộng theo lộ trình'] },
    { no: '03', icon: 'network', t: 'Hình thành nền tảng<br>vận hành thống nhất', focus: ['Liên kết các module trên cùng một app', 'Giao việc &amp; theo dõi trạng thái xử lý', 'Báo cáo vận hành theo thời gian thực', 'Điều hành tập trung theo vai trò'], val: ['Dữ liệu xuyên suốt giữa các bộ phận', 'Quản lý theo dõi vận hành tập trung', 'Từng bước xây hệ sinh thái mobile nội bộ'], foot: ['crown', 'Tầm nhìn dài hạn'] }];
  S.push({ name: 'Tầm nhìn theo giai đoạn', pptx: 4, n: 4, html: `
    ${head({ t: 'Tầm nhìn triển khai <em>theo giai đoạn</em>', sub: 'Xây từ dữ liệu lõi – Mở rộng nghiệp vụ – Tiến tới nền tảng vận hành thống nhất' })}
    ${phases.map((p, x) => `<div class="phase card abs ${x ? '' : 'hot'}" ${A(x === 1 ? 'up' : x ? 'right' : 'left', x + 1, 0, P(100 + x * 490, 232, 420, 520) + '--len:.7')}>
      <span class="no">${p.no}</span><span class="tag">Giai đoạn ${x + 1}</span>
      <div class="pt"><span class="nic solid round">${ic(p.icon)}</span>${p.t}</div>
      <h4>Trọng tâm</h4>${dot(p.focus, p.focus.length > 4 ? 'two' : '')}<h4>Giá trị đạt được</h4>${chk(p.val)}
      <div class="foot">${ic(p.foot[0])}${p.foot[1]}</div></div>`).join('')}
    <div class="arrow abs" ${A('left', 2, 0, P(525, 440, 60, 60))}>${ic('arrow-right')}</div>
    <div class="arrow abs" ${A('left', 3, 0, P(1015, 440, 60, 60))}>${ic('arrow-right')}</div>
    ${msg('Làm từng bước – Đúng nhu cầu – <em>Kiểm soát chi phí – Giảm rủi ro</em>', 3, 4)}` });

  const panel = (icon, t, items, a) => `<div class="panel card abs" ${a}><h3>${ic(icon)}${t}</h3><ul>${items.map(([i, x]) => `<li>${ic(i)}${x}</li>`).join('')}</ul></div>`;
  S.push({ name: 'Vì sao bắt đầu từ danh bộ', pptx: 5, n: 3, html: `
    ${head({ t: 'Vì sao bắt đầu từ danh bộ tập trung?', hs: 50, sub: 'Danh bộ là dữ liệu lõi kết nối mọi nghiệp vụ khách hàng', lead: 'Khi danh bộ được tập trung hóa, các phòng ban và module nghiệp vụ có thể cùng khai thác một hồ sơ khách hàng thống nhất trên Chowaco One.', lw: 780 })}
    ${wires([['M440 480 L640 480', 1, 0], ['M958 440 C1050 440 1050 330 1140 330', 1, 2], ['M958 520 C1050 520 1050 600 1140 600', 1, 4]])}
    <div class="core abs" ${A('spin', 0, 3, P(650, 330, 300, 300))}><div>${ic('users')}<b>DANH BỘ<br>TẬP TRUNG</b><br><small>Hồ sơ khách hàng 360°</small></div></div>
    ${panel('users', 'Kinh doanh &amp; CSKH', [['wallet', 'Thanh toán &amp; công nợ'], ['message-square', 'Khiếu nại'], ['headphones', 'CSKH']], A('left', 1, 1, P(100, 372, 340)))}
    ${panel('wrench', 'Kỹ thuật &amp; hiện trường', [['gauge', 'Đọc số nước'], ['droplets', 'Đóng/mở nước'], ['refresh-cw', 'Thay đồng hồ'], ['plus-circle', 'Gắn mới']], A('right', 1, 3, P(1140, 200, 360)))}
    ${panel('droplet', 'Kiểm tra &amp; xử lý sự cố', [['alert-triangle', 'Báo bể'], ['shield-check', 'Kiểm tra kiểm soát']], A('right', 1, 5, P(1140, 500, 360)))}
    ${[['search', 'Tra cứu nhanh hơn'], ['database', 'Dữ liệu thống nhất hơn'], ['puzzle', 'Mở rộng module dễ hơn']].map(([i, t], x) => `<div class="benefit card abs" ${A('up', 2, x, P(300 + x * 340, 678, 320, 64))}>${ic(i)}${t}</div>`).join('')}
    ${msg('Làm tốt danh bộ tập trung = tạo nền móng cho toàn bộ <em>Chowaco One.</em>', 2, 4, 'trending-up')}` });

  const feats = [['search', 'Tra cứu nhanh', 'Tìm khách hàng theo danh bộ, địa chỉ, số điện thoại, lộ trình hoặc thông tin đồng hồ.'], ['user-check', 'Hồ sơ khách hàng 360°', 'Tổng hợp thông tin khách hàng, đồng hồ, tiêu thụ, thanh toán, công nợ và lịch sử xử lý.'], ['shield-check', 'Phân quyền theo vai trò', 'Mỗi nhóm nhân sự xem đúng dữ liệu cần thiết cho nghiệp vụ của mình.'], ['puzzle', 'Nền tảng mở rộng', 'Làm cơ sở để tích hợp các module hiện trường ở các giai đoạn sau.']];
  S.push({ name: 'Module Danh bộ tập trung', pptx: 6, n: 2, html: `
    ${head({ k: 'GIAI ĐOẠN 1', t: 'Module danh bộ <em>tập trung</em>', sub: 'Module nền tảng đầu tiên của Chowaco One', lead: 'Tập trung toàn bộ thông tin khách hàng vào một hồ sơ số thống nhất, giúp nhân viên tra cứu nhanh, xem đủ dữ liệu và hỗ trợ xử lý công việc trên mobile.', lw: 980 })}
    ${phone(search(false), 0.58, A('phone', 0, 4, P(190, 296)))}
    ${feats.map(([i, t, d], x) => `<div class="feat card abs" ${A('flip', 1, x, P(560 + (x % 2) * 480, 300 + (x >> 1) * 232, 460, 216))}><div class="top"><span class="nic round">${ic(i)}</span><h3>${t}</h3></div><p>${d}</p></div>`).join('')}
    ${msg('Tìm nhanh – Xem đủ – <em>Hiểu đúng – Xử lý nhanh</em>', 1, 5)}` });

  const flow = [['user-plus', 'Đăng nhập ứng dụng'], ['search', 'Tìm kiếm khách hàng'], ['clipboard-list', 'Mở hồ sơ khách hàng'], ['line-chart', 'Xem dashboard tổng quan'], ['file-text', 'Xem thông tin chi tiết'], ['headphones', 'Hỗ trợ xử lý công việc']];
  S.push({ name: 'Luồng tra cứu khách hàng', pptx: 7, n: 4, html: `
    ${head({ k: 'GIAI ĐOẠN 1', t: 'Luồng tra cứu khách hàng <em>trên mobile</em>', hs: 54, lead: 'Từ Module Danh bộ tập trung, nhân viên có thể tra cứu khách hàng chỉ trong vài thao tác trên Chowaco One.', lw: 700 })}
    ${phone(search(true), 0.62, A('phone', 0, 4, P(130, 262)))}
    ${wires([['M876 250 L876 740', 1, 0]])}
    ${flow.map(([i, t], x) => `<div class="stepr glass abs" ${A('right', x < 3 ? 1 : 2, x % 3, P(900, 236 + x * 86, 600, 70) + '--d:.14')}><span class="n">${x + 1}</span><span class="nic">${ic(i)}</span>${t}</div>`).join('')}
    <div class="crit glass abs" ${A('zoom', 3, 0, P(420, 360, 400, 236))}><h3>Tìm kiếm theo nhiều tiêu chí</h3><div>${[['contact', 'Mã danh bộ'], ['user', 'Tên khách hàng'], ['map-pin', 'Địa chỉ'], ['phone', 'Số điện thoại'], ['map', 'Mã lộ trình'], ['scan-line', 'Mã định danh'], ['gauge', 'Thông tin đồng hồ']].map(([i, t]) => `<span>${ic(i)}${t}</span>`).join('')}</div></div>
    ${msg('Tìm đúng khách hàng – Mở đúng hồ sơ – <em>Xem đúng dữ liệu – Xử lý nhanh hơn</em>', 3, 3).replace('class="msg"', 'class="msg" data-sm')}` });

  const bars = [388, 138.1, 128.9, 128.9, 165];
  const line = [28, 14, 13, 13, 17];
  const lx = (i) => 40 + i * 75, ly = (v) => 150 - v * 4.4;
  S.push({ name: 'Hồ sơ khách hàng 360°', pptx: 0, n: 3, html: `
    ${head({ t: 'Hồ sơ khách hàng <em>360°</em>', lead: 'Sau khi mở hồ sơ khách hàng, nhân viên có thể xem ngay toàn bộ bối cảnh của khách hàng trên một màn hình tổng hợp.', lw: 900 })}
    ${phone(profile(), 0.64, A('phone', 0, 3, P(110, 232)))}
    <div class="ilist glass abs" ${A('up', 1, 0, P(410, 232, 320, 300))}><h3>${ic('user')}Thông tin khách hàng</h3>${dot(['Tên khách hàng', 'Mã danh bộ', 'Địa chỉ sử dụng nước', 'Số điện thoại', 'Khu vực / lộ trình', 'Trạng thái sử dụng nước'])}</div>
    <div class="ilist glass abs" ${A('up', 1, 1, P(750, 232, 320, 300))}><h3>${ic('bar-chart-3')}Dashboard tổng quan</h3>${dot(['Số tiền nợ', 'Số kỳ chưa thanh toán', 'Bình quân tiêu thụ', 'Kỳ tiêu thụ bất thường', 'Cảnh báo cần chú ý'])}</div>
    <div class="fchip glass abs" ${A('zoom', 1, 3, P(410, 556, 210, 190))} ><div>${ic('wallet')}<small>Công nợ</small><b style="color:#ff6b6b">1.250.000 đ</b><small>2 kỳ chưa thanh toán</small></div></div>
    <div class="fchip glass abs" ${A('zoom', 1, 4, P(635, 556, 210, 190))}><div>${ic('droplet')}<small>Tiêu thụ</small><b>18 m³/tháng</b><small style="color:#51cf66">▼ 5% so với kỳ trước</small></div></div>
    <div class="fchip glass abs" ${A('zoom', 1, 5, P(860, 556, 210, 190))}><div>${ic('alert-triangle')}<small>Cảnh báo</small><b style="color:#ffa94d">1 cảnh báo</b><small>đang hoạt động</small></div></div>
    <div class="chartp glass abs" ${A('right', 2, 0, P(1100, 232, 400, 514))}><h3>THỐNG KÊ TIÊU THỤ: m³</h3>
      <svg viewBox="0 0 360 200">${[0, 100, 200, 300, 400].map((v) => `<text x="0" y="${174 - v * 0.38}">${v}</text><line x1="34" x2="360" y1="${170 - v * 0.38}" y2="${170 - v * 0.38}" stroke="rgba(120,180,255,.18)"/>`).join('')}
        ${bars.map((v, i) => `<rect x="${52 + i * 62}" y="${170 - v * 0.38}" width="38" height="${v * 0.38}" rx="4" fill="url(#gb)" ${A('grow', 2, i + 2, 'transform-box:fill-box;--d:.1;--len:.4')}/><text class="v" x="${71 + i * 62}" y="${164 - v * 0.38}" text-anchor="middle">${v.toFixed(1)}</text><text x="${71 + i * 62}" y="190" text-anchor="middle">T${i + 1}</text>`).join('')}
        <defs><linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#3aa0ff"/><stop offset="1" stop-color="#0b3fc2"/></linearGradient><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#1c7dff" stop-opacity=".7"/><stop offset="1" stop-color="#1c7dff" stop-opacity=".05"/></linearGradient></defs></svg>
      <svg viewBox="0 0 360 180" style="margin-top:10px">${[0, 10, 20, 30].map((v) => `<text x="0" y="${ly(v) + 4}">${v}</text>`).join('')}
        <path d="M${line.map((v, i) => `${lx(i)} ${ly(v)}`).join(' L')} L${lx(4)} 150 L${lx(0)} 150Z" fill="url(#ga)" ${A('fade', 2, 5)}/>
        <line x1="40" x2="340" y1="${ly(7)}" y2="${ly(7)}" stroke="#35e0ff" stroke-width="2"/>
        <path pathLength="1" d="M${line.map((v, i) => `${lx(i)} ${ly(v)}`).join(' L')}" fill="none" stroke="#ff8a3d" stroke-width="3" stroke-dasharray="1" ${A('draw', 2, 4, '--len:.45')}/>
        ${line.map((v, i) => `<circle cx="${lx(i)}" cy="${ly(v)}" r="6" fill="#ff4d5e" stroke="#fff" stroke-width="2" ${A('fade', 2, 5)}/><text x="${lx(i)}" y="172" text-anchor="middle">T${i + 1}</text>`).join('')}</svg>
      <div class="legend"><span><i style="background:#1c7dff"></i>Tiêu thụ</span><span><i style="background:#ff4d5e"></i>Bất thường</span><span><i style="background:#35e0ff"></i>BQTT Năm</span></div></div>
    ${msg('Nhân viên nắm nhanh toàn cảnh <em>trước khi xử lý chi tiết.</em>', 2, 6)}` });

  S.push({ name: 'Dữ liệu kỹ thuật & hiện trường', pptx: 10, n: 2, html: `
    ${head({ t: 'Dữ liệu kỹ thuật <em>&amp; hiện trường</em>', lead: 'Từ hồ sơ khách hàng 360°, nhân viên kỹ thuật có thể nắm trước thông tin đồng hồ, lịch sử xử lý và bối cảnh hiện trường ngay trên mobile.', lw: 540 })}
    ${phone(tech(), 0.66, A('phone', 0, 3, P(680, 222)))}
    ${fchip('map-pin', '<small>Vị trí khách hàng</small>123 Hải Thượng Lãn Ông, P. Chợ Lớn', A('left', 1, 0, P(100, 330, 480, 92)))}
    ${fchip('bar-chart-2', '<small>Tín hiệu đồng hồ</small><b style="color:#51cf66">Tốt</b>', A('left', 1, 1, P(100, 444, 480, 92)))}
    ${fchip('camera', '<small>Ảnh hiện trường</small>Cập nhật 08:45 AM', A('left', 1, 2, P(100, 558, 480, 92)))}
    ${icard('gauge', 'THÔNG TIN ĐỒNG HỒ NƯỚC', ['Hiệu đồng hồ', 'Cỡ đồng hồ', 'Số thân đồng hồ', 'Ngày gắn / kiểm định', 'Tình trạng đồng hồ'], A('right', 1, 1, P(1010, 222, 490, 170)))}
    ${icard('clipboard-check', 'LỊCH SỬ XỬ LÝ KỸ THUẬT', ['Đóng/mở nước', 'Gắn mới', 'Thay đồng hồ', 'Hoàn công thay', 'Hình ảnh / hồ sơ đính kèm'], A('right', 1, 2, P(1010, 406, 490, 170)))}
    ${icard('headphones', 'HỖ TRỢ HIỆN TRƯỜNG', ['Xem dữ liệu trước khi xử lý', 'Nắm bối cảnh khách hàng', 'Giảm gọi hỏi nội bộ', 'Phối hợp Kinh doanh &amp; Kỹ thuật'], A('right', 1, 3, P(1010, 590, 490, 160)))}
    ${msg('Có đủ dữ liệu trước khi ra hiện trường – <em>xử lý nhanh hơn, chính xác hơn.</em>', 1, 5)}` });

  S.push({ name: 'Kinh doanh, thanh toán & CSKH', pptx: 11, n: 2, html: `
    ${head({ t: 'Dữ liệu kinh doanh, thanh toán <em>&amp; CSKH</em>', hs: 54, lead: 'Bên cạnh dữ liệu kỹ thuật, Chowaco One giúp khối Kinh doanh &amp; CSKH nắm nhanh tình trạng thanh toán, công nợ, tiêu thụ và lịch sử tương tác của khách hàng.', lw: 540 })}
    ${phone(biz(), 0.66, A('phone', 0, 3, P(680, 222)))}
    ${[['receipt', 'Công nợ'], ['file-text', 'Hóa đơn'], ['bar-chart-3', 'Tiêu thụ'], ['headphones', 'Khiếu nại']].map(([i, t], x) => fchip(i, `<b>${t}</b>`, A('spin', 1, x, P(120 + (x % 2) * 250, 380 + (x >> 1) * 120, 230, 92)))).join('')}
    ${icard('receipt', 'THANH TOÁN &amp; CÔNG NỢ', ['Lịch sử thanh toán', 'Trạng thái hóa đơn', 'Tổng số tiền nợ', 'Số kỳ chưa thanh toán', 'Lịch sử nhắc nợ'], A('flip', 1, 1, P(1010, 222, 490, 170)))}
    ${icard('bar-chart-3', 'TIÊU THỤ &amp; ĐỐI CHIẾU', ['Chỉ số tiêu thụ theo kỳ', 'Code bất thường', 'So sánh kỳ gần nhất', 'Dữ liệu phục vụ đối chiếu'], A('flip', 1, 2, P(1010, 406, 490, 160)))}
    ${icard('headphones', 'CSKH &amp; XỬ LÝ', ['Khiếu nại, công văn', 'Lịch sử chăm sóc khách hàng', 'Ghi chú trao đổi', 'Kết quả xử lý'], A('flip', 1, 3, P(1010, 580, 490, 160)))}
    ${msg('Phản hồi khách hàng nhanh hơn, chính xác hơn, <em>đủ dữ liệu đối chiếu trên một nền tảng.</em>', 1, 5).replace('class="msg"', 'class="msg" data-sm')}` });

  S.push({ name: 'Chowaco One Báo cáo', pptx: 12, n: 2, html: `
    ${head({ t: 'Chowaco One <em>Báo cáo</em>', sub: 'Báo cáo cơ bản Giai đoạn 1 cho quản lý', lead: 'Từ dữ liệu khách hàng và nghiệp vụ, Chowaco One cung cấp các báo cáo tổng quan giúp quản lý theo dõi nhanh tình hình vận hành, doanh thu, sản lượng và công nợ.', lw: 540 })}
    <div class="abs" ${A('phone', 0, 3, P(680, 222))}><div class="abs pulse" id="liveHome" style="left:0;top:0;border-radius:37px"><div class="phone-fit" id="livePhone" style="--pk:.66"><div class="phone"><div class="island"></div><div class="screen" id="liveScreen"></div></div></div></div><button class="demo-open" data-demo-open style="width:258px;height:542px" aria-label="Mở demo báo cáo"></button></div>
    ${[['bar-chart-3', 'Doanh thu'], ['droplet', 'Sản lượng'], ['receipt', 'Công nợ'], ['users', 'Khách hàng']].map(([i, t], x) => fchip(i, `<b>${t}</b>`, A('left', 1, x, P(100 + (x % 2) * 250, 410 + (x >> 1) * 104, 230, 84)))).join('')}
    <button class="cta abs" data-demo-open ${A('zoom', 0, 5, P(100, 640, 480, 68))}>${ic('mouse-pointer-click')}Demo trực tiếp</button>
    <p class="cta-note abs" style="${P(100, 718, 480)}">Nhấn vào điện thoại hoặc nút trên để mở demo</p>
    ${icard('pie-chart', 'TỔNG QUAN VẬN HÀNH', ['Tổng số khách hàng', 'Tổng sản lượng', 'Tổng doanh thu', 'Giá bán bình quân'], A('right', 1, 1, P(1010, 222, 490, 150)))}
    ${icard('receipt', 'CÔNG NỢ &amp; THANH TOÁN', ['Tổng công nợ', 'Khách hàng còn nợ', 'Số kỳ chưa thanh toán', 'Theo dõi tình trạng nợ'], A('right', 1, 2, P(1010, 386, 490, 150)))}
    ${icard('bar-chart-3', 'PHÂN TÍCH THEO THỜI GIAN / KHU VỰC', ['Doanh thu theo kỳ / đợt', 'Sản lượng theo giá biểu / cỡ ĐHN', 'So sánh cùng kỳ', 'Khách hàng theo phường'], A('right', 1, 3, P(1010, 550, 490, 196)))}
    ${msg('Quản lý nắm nhanh số liệu tổng quan – <em>trực quan, dễ theo dõi, thuận tiện ra quyết định.</em>', 1, 5).replace('class="msg"', 'class="msg" data-sm')}` });

  const vcols = [
    ['briefcase', 'Ban Giám đốc / Quản lý', 'line-chart', [['smartphone', 'Nền tảng mobile nội bộ dùng chung'], ['pie-chart', 'Dữ liệu tổng quan phục vụ điều hành'], ['shield-check', 'Kiểm soát phân quyền và truy cập dữ liệu'], ['home', 'Nền móng chuyển đổi số nghiệp vụ hiện trường']]],
    ['headphones', 'Khối Kinh doanh / CSKH', 'receipt', [['search', 'Tra cứu nhanh hồ sơ khách hàng'], ['wallet', 'Kiểm tra thanh toán, công nợ, sản lượng'], ['bell', 'Hỗ trợ nhắc nợ và phản hồi khách hàng nhanh hơn'], ['file-check', 'Có đầy đủ dữ liệu đối chiếu khi làm việc với khách hàng']]],
    ['hard-hat', 'Khối Kỹ thuật', 'gauge', [['clipboard-list', 'Có dữ liệu trước khi đi hiện trường'], ['gauge', 'Xem đồng hồ, lịch sử thay, đóng/mở nước'], ['user-check', 'Nắm bối cảnh khách hàng trước khi xử lý'], ['wrench', 'Giảm bị động khi xử lý nghiệp vụ ngoài hiện trường']]]];
  S.push({ name: 'Giá trị cho từng nhóm', pptx: 13, n: 2, html: `
    ${head({ c: 'center', t: 'Giá trị mang lại cho <em>từng nhóm người dùng</em>', hs: 52, lead: 'Từ cùng một nền tảng mobile tập trung, mỗi nhóm người dùng có thể khai thác những giá trị khác nhau phù hợp với vai trò của mình.', lw: 900 })}
    ${vcols.map(([i, t, hero, rows], x) => `<div class="vcol glass abs" ${A(['left', 'up', 'right'][x], 1, x, P(100 + x * 475, 220, 450, 526) + '--d:.12')}><h3>${ic(i)}${t}</h3><div class="hero"><span class="float" style="animation-delay:${-x * 2}s">${ic(hero)}</span></div><ul>${rows.map(([ri, rt]) => `<li>${ic(ri)}${rt}</li>`).join('')}</ul></div>`).join('')}
    ${msg('Một nền tảng dùng chung – <em>Nhiều giá trị thiết thực cho từng bộ phận.</em>', 1, 4, 'droplet')}` });

  const sec = (icon, t, rows, a) => `<div class="sec card abs" ${a}><h3>${ic(icon)}${t}</h3><ul>${rows.map(([i, x]) => `<li>${ic(i)}${x}</li>`).join('')}</ul></div>`;
  S.push({ name: 'Phân quyền, bảo mật & hiệu quả', pptx: 14, n: 3, html: `
    ${head({ t: 'Phân quyền, bảo mật <em>&amp; hiệu quả kỳ vọng</em>', hs: 54, lead: 'Chowaco One không chỉ hỗ trợ tra cứu và vận hành, mà còn được triển khai theo nguyên tắc kiểm soát dữ liệu rõ ràng và hướng đến hiệu quả thực tế sau Giai đoạn 1.', lw: 1000 })}
    ${sec('lock', 'Nguyên tắc kiểm soát dữ liệu', [['user', 'Mỗi nhân viên dùng tài khoản riêng'], ['users', 'Phân quyền theo vai trò và phòng ban'], ['eye', 'Chỉ hiển thị dữ liệu phù hợp nghiệp vụ'], ['lock', 'Có thể giới hạn thông tin nhạy cảm'], ['history', 'Ghi nhận lịch sử đăng nhập / truy cập'], ['server', 'Không làm xáo trộn hệ thống hiện tại']], A('left', 1, 0, P(100, 232, 630, 480) + '--len:.7'))}
    <div class="shield abs" ${A('spin', 1, 3, P(755, 420, 90, 90))}>${ic('shield-check')}</div>
    ${sec('target', 'Hiệu quả kỳ vọng sau Giai đoạn 1', [['clock', 'Rút ngắn thời gian tra cứu hồ sơ'], ['phone-incoming', 'Giảm số lần gọi hỏi nội bộ'], ['gauge', 'Tăng tốc độ phản hồi khách hàng'], ['hard-hat', 'Nhân viên hiện trường chủ động hơn'], ['bar-chart-3', 'Quản lý theo dõi nhanh hơn qua báo cáo tổng quan'], ['trending-up', 'Sẵn sàng mở rộng các module nghiệp vụ tiếp theo']], A('right', 2, 0, P(870, 232, 630, 480) + '--len:.7'))}
    ${msg('Phân quyền rõ ràng – Bảo mật phù hợp – <em>Hiệu quả thực tế sau triển khai</em>', 2, 4)}` });

  const grp = (no, icon, t, cols, tiles, a) => `<div class="grp glass abs" ${a}><h3>${ic(icon)}<i>${no}</i>${t}</h3><div class="g" style="grid-template-columns:repeat(${cols},1fr)">${tiles.map(([i, x]) => `<div class="t">${ic(i)}${x}</div>`).join('')}</div></div>`;
  S.push({ name: 'Module mở rộng sau Giai đoạn 1', pptx: 15, n: 3, html: `
    ${head({ t: 'Các module mở rộng <em>sau Giai đoạn 1</em>', hs: 54, lead: 'Sau khi Giai đoạn 1 ổn định, Chowaco One có thể mở rộng từng bước thành nền tảng vận hành mobile thống nhất cho toàn công ty.', lw: 900 })}
    ${wires([['M640 400 C590 400 590 360 530 360', 1, 0], ['M960 400 C1010 400 1010 320 1070 320', 1, 2], ['M650 520 C590 520 590 630 530 630', 2, 0], ['M950 520 C1010 520 1010 630 1070 630', 2, 2]])}
    <div class="halo abs" style="${P(600, 240, 400, 400)}"></div>
    <div class="core dark abs" ${A('zoom', 0, 3, P(630, 270, 340, 340))}><div>${ic('droplet')}<b>Chowaco One</b><br><span class="tag">Giai đoạn 1</span><p>Danh bộ tập trung<br>Nền tảng dữ liệu lõi</p><small>Một app – nhiều nghiệp vụ</small></div></div>
    ${grp(1, 'hard-hat', 'Nghiệp vụ hiện trường', 2, [['gauge', 'Đọc số nước'], ['droplets', 'Đóng / Mở nước'], ['plus-circle', 'Gắn mới &amp; hoàn công'], ['wrench', 'Thay &amp; hoàn công thay']], A('left', 1, 1, P(100, 216, 430)))}
    ${grp(2, 'shield-check', 'Kiểm tra &amp; xử lý', 3, [['clipboard-check', 'Kiểm tra kiểm soát'], ['droplet', 'Báo bể'], ['bell', 'Nhắc nợ']], A('right', 1, 3, P(1070, 236, 430)))}
    ${grp(3, 'navigation', 'Điều phối &amp; giám sát', 2, [['users', 'Giao việc hiện trường'], ['map-pin', 'Hình ảnh / vị trí / trạng thái xử lý']], A('left', 2, 1, P(100, 546, 430)))}
    ${grp(4, 'bar-chart-3', 'Điều hành &amp; báo cáo', 3, [['bar-chart-3', 'Báo cáo vận hành thời gian thực'], ['activity', 'Theo dõi trạng thái xử lý'], ['pie-chart', 'Giám sát kết quả theo module']], A('right', 2, 3, P(1070, 546, 430)))}
    ${msg('Tất cả module cùng liên kết về hồ sơ khách hàng, <em>vận hành trên một nền tảng thống nhất.</em>', 2, 5, 'network').replace('class="msg"', 'class="msg" data-sm')}` });

  const road = [['file-search', '1. Khảo sát &amp;<br>xác định phạm vi', ['Khảo sát dữ liệu &amp; nghiệp vụ', 'Rà soát đặc thù dữ liệu ngành cấp nước', 'Chốt phạm vi Giai đoạn 1']], ['smartphone', '2. Thiết kế &amp;<br>thống nhất giao diện', ['Thiết kế giao diện mẫu', 'Thống nhất luồng tra cứu', 'Xác định nhóm dữ liệu hiển thị']], ['code', '3. Phát triển &amp;<br>tích hợp', ['Phát triển module danh bộ tập trung', 'Tích hợp dữ liệu', 'Phân quyền theo vai trò']], ['user-check', '4. Chạy thử &amp;<br>hoàn thiện', ['Chạy thử nhóm người dùng đại diện', 'Điều chỉnh theo phản hồi', 'Nghiệm thu và chuẩn bị mở rộng']]];
  S.push({ name: 'Lộ trình triển khai Giai đoạn 1', pptx: 16, n: 2, html: `
    ${head({ t: 'Lộ trình triển khai <em>Giai đoạn 1</em>', lead: 'Giai đoạn 1 được triển khai theo lộ trình rõ ràng, ưu tiên kiểm soát phạm vi, dữ liệu, phân quyền và trải nghiệm người dùng thực tế.', lw: 900 })}
    ${wires([['M100 480 L1500 480', 1, 0]])}
    ${road.map(([i, t, rows], x) => `<div class="rstep card abs" ${A('flip', 1, x, P(100 + x * 357, 236, 330, 490) + '--d:.14')}><span class="n">${x + 1}</span>${ic(i)}<h3>${t}</h3><ul>${rows.map((r) => `<li>${ic('droplet')}<span>${r}</span></li>`).join('')}</ul></div>`).join('')}
    ${msg('Triển khai gọn – Thiết kế riêng – <em>Kiểm soát tốt – Có kết quả thực tế</em>', 1, 5)}` });

  const next = [['file-check', 'Thống nhất chủ trương triển khai Giai đoạn 1'], ['network', 'Cử đầu mối phối hợp từ các phòng ban'], ['file-search', 'Khảo sát chi tiết dữ liệu và nghiệp vụ'], ['list-checks', 'Chốt phạm vi chức năng, quyền người dùng và báo cáo'], ['settings', 'WAO xây dựng đề xuất kỹ thuật, lộ trình và chi phí'], ['users', 'Trình Ban Giám đốc phê duyệt triển khai']];
  S.push({ name: 'Đề xuất bước tiếp theo', pptx: 17, n: 3, html: `
    ${head({ t: 'Đề xuất <em>bước tiếp theo</em>', lead: 'WAO đề xuất 6 bước để hoàn thiện phạm vi và chuẩn bị triển khai Giai đoạn 1.' })}
    ${next.map(([i, t], x) => `<div class="nstep card abs" ${A('zoom', x < 3 ? 1 : 2, x % 3, P(100 + (x % 3) * 490, 210 + (x >> 1 > 0 && x > 2 ? 172 : 0), 420, 150) + '--d:.16')}><span class="n">0${x + 1}</span><span class="big">${ic(i)}</span>${t}</div>`).join('')}
    ${[0, 1].map((x) => `<div class="arrow abs" ${A('left', 1, x * 2 + 1, P(525 + x * 490, 255, 60, 60))}>${ic('arrow-right')}</div><div class="arrow abs" ${A('left', 2, x * 2 + 1, P(525 + x * 490, 427, 60, 60))}>${ic('arrow-right')}</div>`).join('')}
    <div class="goal glass abs" ${A('up', 2, 4, P(100, 582, 1400, 140))}>${ic('target')}<div><b>Mục tiêu gần nhất</b>Chốt phạm vi Chowaco One Giai đoạn 1: Danh bộ tập trung &amp; Báo cáo cơ bản</div></div>
    ${msg('Rõ phạm vi – Rõ đầu mối – <em>Rõ lộ trình – Sẵn sàng triển khai</em>', 2, 5, 'rocket')}` });

  const props = [['shield-check', 'Không thay thế hệ thống hiện tại ngay lập tức'], ['database', 'Bắt đầu từ dữ liệu lõi: danh bộ khách hàng'], ['trending-up', 'Triển khai theo giai đoạn'], ['users', 'Kế thừa kinh nghiệm ngành, thiết kế riêng cho Chợ Lớn'], ['user-check', 'Ưu tiên hiệu quả thực tế cho nhân viên'], ['layout-grid', 'Mở rộng dần thành ứng dụng All-in-One cho toàn công ty']];
  S.push({ name: 'Kết luận', pptx: 18, n: 3, cls: 'cover', html: `
    <div class="logo-pill abs" ${A('up', 0, 0, P(100, 44))}><img src="assets/logo.png" alt="Chowaco" style="height:38px"></div>
    <h1 class="abs" ${A('wipe', 0, 1, P(100, 118) + 'font-size:96px')}>Chowaco <em>One</em></h1>
    <p class="lead abs" ${A('up', 0, 2, P(100, 232, 800) + 'font-size:32px')}>Bắt đầu từ danh bộ tập trung để xây dựng nền tảng vận hành mobile dài hạn</p>
    <div class="col-title abs" ${A('up', 1, 0, P(100, 336, 300) + 'border:0')}>WAO đề xuất:</div>
    ${props.map(([i, t], x) => `<div class="prop glass abs" ${A('left', 1, x, P(100, 382 + x * 61, 780, 52) + '--d:.09')}><span class="nic round">${ic(i)}</span><span class="tick">${ic('check')}</span>${t}</div>`).join('')}
    ${phone(home(), 0.8, A('phone', 0, 3, P(960, 80)))}
    ${[['database', 'Dữ liệu<br>tập trung'], ['settings', 'Vận hành<br>hiệu quả'], ['shield-check', 'Quản trị<br>minh bạch'], ['heart-handshake', 'Phục vụ<br>tận tâm']].map(([i, t], x) => fchip(i, t, A('right', 1, x + 2, P(1310 + (x % 2) * 30, 130 + x * 150, 220, 84)))).join('')}
    ${msg('Một ứng dụng – Nhiều nghiệp vụ – <em>Dữ liệu tập trung</em>', 2, 0, 'droplet')}` });

  S.push({ name: 'Năng lực ngành cấp nước', pptx: 19, n: 3, html: `
    ${head({ t: 'Năng lực am hiểu nghiệp vụ <em>ngành cấp nước</em>', hs: 52 })}
    <ul class="bullets abs" style="${P(100, 122, 820)}"><li ${A('up', 0, 1)}>${ic('droplet')}WAO có kinh nghiệm thực tế trong việc xây dựng giải pháp mobile app và nền tảng vận hành cho ngành cấp nước.</li><li ${A('up', 0, 2)}>${ic('shield-check')}Kinh nghiệm ngành giúp WAO hiểu nhanh hơn đặc thù dữ liệu, nghiệp vụ, phân quyền, bảo mật và các rủi ro khi tích hợp hệ thống.</li></ul>
    <div class="proc glass abs" ${A('left', 1, 0, P(100, 330, 720, 282))}><h3>QUY TRÌNH TRIỂN KHAI CHUYÊN NGHIỆP</h3><div class="g">${[['file-search', 'Hiểu<br>nghiệp vụ'], ['bar-chart-3', 'Phân tích<br>dữ liệu'], ['user-check', 'Thiết kế<br>phân quyền'], ['gantt-chart', 'Triển khai<br>theo giai đoạn']].map(([i, t], x) => `<div class="t"><i>${x + 1}</i>${ic(i)}${t}</div>`).join('')}</div></div>
    <div class="caps glass abs" ${A('right', 1, 2, P(850, 292, 650, 320))}>${[['contact', 'Dữ liệu danh bộ và hồ sơ khách hàng'], ['clipboard-list', 'Nghiệp vụ kinh doanh, kỹ thuật và hiện trường'], ['key-round', 'Phân quyền truy cập theo vai trò'], ['lock', 'Bảo mật dữ liệu khách hàng'], ['alert-triangle', 'Rủi ro khi tích hợp dữ liệu'], ['trending-up', 'Triển khai theo từng giai đoạn']].map(([i, t]) => `<div class="cap">${ic(i)}${t}</div>`).join('')}</div>
    <div class="state glass abs" ${A('up', 2, 0, P(100, 634, 1400, 104))}>${ic('shield-check')}<span>Chowaco One được thiết kế riêng cho Cấp nước Chợ Lớn,<br>không áp dụng máy móc mô hình của bất kỳ đơn vị nào.</span></div>
    ${msg('Kinh nghiệm ngành giúp triển khai nhanh hơn. <em>Thiết kế riêng giúp Chowaco One phù hợp hơn.</em>', 2, 3, 'quote').replace('class="msg"', 'class="msg" data-sm')}` });

  S.push({ name: 'Cảm ơn', pptx: 20, n: 1, cls: 'thanks', html: `
    <div class="logo-pill abs" ${A('up', 0, 0, P(100, 56))}><img src="assets/logo.png" alt="Chowaco"></div>
    <h1 class="abs" ${A('wipe', 0, 1, P(100, 170, 960) + 'font-size:54px')}>Cảm ơn Quý Ban Lãnh đạo<br><em>Cấp nước Chợ Lớn</em></h1>
    <p class="lead abs" ${A('up', 0, 2, P(100, 326, 720))}>WAO sẵn sàng đồng hành cùng Chowaco trong hành trình xây dựng nền tảng vận hành mobile tập trung, thiết thực và hiệu quả.</p>
    <div class="brandbar glass abs" ${A('flip', 0, 3, P(100, 446, 680, 108))}>${ic('droplet')}<div><b>CHOWACO ONE</b><span>Một ứng dụng – Nhiều nghiệp vụ – Dữ liệu tập trung</span></div></div>
    <div class="contact abs" ${A('up', 0, 4, P(100, 578, 700))}><h3>THÔNG TIN LIÊN HỆ</h3><ul><li>${ic('user')}Mr. Bình</li><li>${ic('briefcase')}Đại diện Công ty TNHH WAO</li><li>${ic('phone')}Hotline/Zalo: 0987.960.024</li><li>${ic('mail')}Email: binhnp@epoints.vn</li><li>${ic('globe')}Website: www.epoints.vn</li></ul></div>
    <div class="foot abs" ${A('up', 0, 5, P(100, 826, 700))}>${ic('building-2')}WAO Co., Ltd<i></i>${ic('cpu')}Công nghệ ứng dụng AI &amp; Giải pháp doanh nghiệp</div>
    <div class="halo abs" style="${P(960, 140, 620, 620)}"></div>
    ${phone(splash(), 0.9, A('phone', 0, 3, P(1094, 80)))}` });

  window.SCENES = S;
  window.ic = ic;
})();
