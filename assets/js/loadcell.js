// Foot load cell comparison: one footstep on the MKII hexapod, run through two sensor stacks.
// Rev A: two 50 kg half-bridge cells. Rev B: one ATO 20 kg button cell.
(function () {
  var root = document.getElementById('loadcell');
  if (!root) return;
  var $ = function (id) { return document.getElementById(id); };
  var g = 9.81, VEX = 5, T = 800; // ms per step cycle
  var COL = { A: '#1b5e9b', B: '#b4530f', ink: '#1a1a1a', ink2: '#3a3a38', muted: '#5f5f5b', grid: '#e6e6e3', base: '#b9b9b5' };
  var CELLS = {
    A: { name: 'Two 50 kg half-bridges', short: 'Two-cell', cap: 490, color: COL.A, height: 15.6, mass: '~25 g (2 cells)', wires: '6 wires, opposite wiring', price: '~$10 (kit)' },
    B: { name: 'ATO 20 kg button', short: 'ATO', cap: 196, color: COL.B, height: 12.0, mass: '~15–20 g', wires: '4 wires, direct', price: '~$54–134' }
  };
  var AMP = { hx10: { sps: 10, nv: 50 }, hx80: { sps: 80, nv: 90 }, nau320: { sps: 320, nv: 200 } };
  var st = {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var now = reduceMotion ? 420 : 0, playing = !reduceMotion, last = 0, raf = 0, visible = true;

  function read() {
    st.mass = +$('lc-mass').value; st.feet = +$('lc-gait').value; st.spike = +$('lc-spike').value; st.amp = AMP[$('lc-amp').value];
    st.cop = +$('lc-cop').value; st.spd = +$('lc-spd').value;
    st.atoMv = +$('lc-atoMv').value; st.nlA = +$('lc-nlA').value / 100; st.nlB = +$('lc-nlB').value / 100; st.ocA = +$('lc-ocA').value / 100; st.ocB = +$('lc-ocB').value / 100;
    $('lc-mass-out').textContent = st.mass.toFixed(2) + ' kg';
    $('lc-cop-out').textContent = st.cop + ' mm';
    $('lc-spd-out').textContent = st.spd.toFixed(2) + '×';
    $('lc-atoMv-out').textContent = st.atoMv.toFixed(1) + ' mV/V';
    $('lc-nlA-out').textContent = '±' + (st.nlA * 100).toFixed(1) + '% FS';
    $('lc-nlB-out').textContent = '±' + (st.nlB * 100).toFixed(1) + '% FS';
    $('lc-ocA-out').textContent = (st.ocA * 100).toFixed(1) + '% / 10 mm';
    $('lc-ocB-out').textContent = (st.ocB * 100).toFixed(1) + '% / 10 mm';
    st.Fs = st.mass * g / st.feet;
    CELLS.A.sens = 0.0125;                       // mV per N
    CELLS.B.sens = st.atoMv * VEX / CELLS.B.cap; // mV per N
    CELLS.A.nl = st.nlA; CELLS.B.nl = st.nlB; CELLS.A.oc = st.ocA; CELLS.B.oc = st.ocB;
  }

  // True force on one foot over a step.
  function force(t) {
    var Fs = st.Fs, td = 60, lo = 640, os = 2.7, F;
    if (t < td || t > lo + 50) return 0;
    if (t > lo) return Fs * (1 - (t - lo) / 50);
    var tr = t - td;
    F = tr < 15 ? Fs * os * (tr / 15) : Fs * (1 + (os - 1) * Math.exp(-(tr - 15) / 40));
    if (st.spike > 0) {
      var s0 = 360;
      if (t >= s0 && t < s0 + 22) return Fs * 0.04; // foot briefly loses contact
      if (t >= s0 + 22) {
        var r = t - (s0 + 22), pk = st.spike * Fs;
        if (r < 7) return Math.max(F, Fs * 0.04 + (pk - Fs * 0.04) * (r / 7));
        return F + (pk - F) * Math.exp(-(r - 7) / 22);
      }
    }
    return F;
  }
  // Deterministic noise so the chart is stable between frames.
  function hash(n) { var x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); }
  function gauss(n) { var u = Math.max(hash(n), 1e-6), v = hash(n + 7.77); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function measured(k, F, i) {
    var c = CELLS[k], x = F / c.cap;
    var e = c.nl * c.cap * 4 * x * (1 - x); // bow-shaped nonlinearity, zero at 0 and full scale
    if (x > 1) e += (x - 1) * c.cap * 0.05;
    e += c.oc * (st.cop / 10) * F;
    var noiseN = (st.amp.nv / 1e6) / c.sens;
    return F + e + gauss(i * 3.1 + (k === 'A' ? 0 : 101)) * noiseN;
  }
  var cache = {};
  function samples(k) {
    if (cache[k]) return cache[k];
    var out = [], dt = 1000 / st.amp.sps, i = 0;
    for (var t = dt / 2; t < T; t += dt, i++) { var F = force(t); out.push({ t: t, F: F, m: measured(k, F, i) }); }
    return (cache[k] = out);
  }
  function peakF() { var p = 0; for (var t = 0; t < T; t += 0.5) p = Math.max(p, force(t)); return p; }
  function status(pct) {
    if (pct <= 100) return { lab: 'Within rating', cls: 'ok' };
    if (pct <= 150) return { lab: 'Above rating, reading inaccurate', cls: 'moving' };
    return { lab: 'Past safe overload: damage risk', cls: 'bad' };
  }
  function niceMax(v) { var p = Math.pow(10, Math.floor(Math.log10(v))), n = v / p; return (n <= 1.5 ? 1.5 : n <= 2 ? 2 : n <= 3 ? 3 : n <= 5 ? 5 : 10) * p; }
  function fmt(v) { return v >= 10 ? v.toFixed(0) : v.toFixed(1); }
  function txt(x, y, s, a) { return '<text x="' + x + '" y="' + y + '" ' + (a || '') + '>' + s + '</text>'; }

  // ---------- force chart ----------
  var CH = { w: 680, h: 300, l: 52, r: 16, t: 14, b: 40 }, scale = null;
  function drawChart(now) {
    var nice = niceMax(Math.max(peakF() * 1.15, st.Fs * 3.2, 10));
    var X = function (t) { return CH.l + (CH.w - CH.l - CH.r) * t / T; };
    var Y = function (v) { return CH.h - CH.b - (CH.h - CH.t - CH.b) * v / nice; };
    var s = '', i, t;
    for (i = 0; i <= 5; i++) {
      var v = nice * i / 5, y = Y(v);
      s += '<line x1="' + CH.l + '" x2="' + (CH.w - CH.r) + '" y1="' + y + '" y2="' + y + '" stroke="' + COL.grid + '"/>';
      s += txt(CH.l - 8, y + 4, fmt(v), 'text-anchor="end" class="tk"');
    }
    for (t = 0; t <= T; t += 100) s += txt(X(t), CH.h - CH.b + 16, t, 'text-anchor="middle" class="tk"');
    s += txt((CH.l + CH.w) / 2, CH.h - 6, 'time (ms)', 'text-anchor="middle" class="ax"');
    var my = (CH.t + CH.h - CH.b) / 2;
    s += txt(14, my, 'force on foot (N)', 'text-anchor="middle" class="ax" transform="rotate(-90 14 ' + my + ')"');
    [['B', 1], ['B', 1.5], ['A', 1]].forEach(function (r) {
      var c = CELLS[r[0]], val = c.cap * r[1];
      if (val < nice) {
        var yy = Y(val);
        s += '<line x1="' + CH.l + '" x2="' + (CH.w - CH.r) + '" y1="' + yy + '" y2="' + yy + '" stroke="' + c.color + '" stroke-dasharray="2 4"/>';
        s += txt(CH.w - CH.r - 4, yy - 4, c.short + ' ' + (r[1] === 1 ? 'rated' : 'safe overload') + ' ' + fmt(val) + ' N', 'text-anchor="end" class="tk"');
      }
    });
    var d = '';
    for (t = 0; t <= T; t += 2) d += (t ? 'L' : 'M') + X(t).toFixed(1) + ',' + Y(force(t)).toFixed(1);
    s += '<path d="' + d + '" fill="none" stroke="' + COL.ink2 + '" stroke-width="2" stroke-dasharray="4 3"/>';
    var rad = st.amp.sps > 100 ? 3 : 4.5;
    ['A', 'B'].forEach(function (k) {
      var c = CELLS[k], sm = samples(k).filter(function (p) { return p.t <= now; }), pd = '';
      sm.forEach(function (p, j) { pd += (j ? 'L' : 'M') + X(p.t).toFixed(1) + ',' + Y(p.m).toFixed(1); });
      if (sm.length > 1) s += '<path d="' + pd + '" fill="none" stroke="' + c.color + '" stroke-width="2" opacity=".55"/>';
      sm.forEach(function (p) { s += '<circle cx="' + X(p.t).toFixed(1) + '" cy="' + Y(p.m).toFixed(1) + '" r="' + rad + '" fill="' + c.color + '" stroke="#fff" stroke-width="1.5"/>'; });
    });
    s += '<line x1="' + X(now) + '" x2="' + X(now) + '" y1="' + CH.t + '" y2="' + Y(0) + '" stroke="' + COL.ink + '" opacity=".35"/>';
    $('lc-chart').innerHTML = s;
    scale = { X: X, Y: Y };
  }
  function drawErr(now) {
    var H = 150, l = CH.l, r = CH.r, t = 10, b = 26, w = 680, m = 0.5;
    var sa = samples('A'), sb = samples('B');
    [sa, sb].forEach(function (arr) { arr.forEach(function (p) { m = Math.max(m, Math.abs(p.m - p.F)); }); });
    var lim = niceMax(m * 1.1);
    var X = function (tt) { return l + (w - l - r) * tt / T; };
    var Y = function (v) { return t + (H - t - b) * (1 - (v + lim) / (2 * lim)); };
    var s = '';
    [-lim, -lim / 2, 0, lim / 2, lim].forEach(function (v) {
      var y = Y(v);
      s += '<line x1="' + l + '" x2="' + (w - r) + '" y1="' + y + '" y2="' + y + '" stroke="' + (v === 0 ? COL.base : COL.grid) + '"/>';
      s += txt(l - 8, y + 4, (v > 0 ? '+' : '') + (Math.abs(v) < 10 ? v.toFixed(1) : v.toFixed(0)), 'text-anchor="end" class="tk"');
    });
    for (var tt = 0; tt <= T; tt += 100) s += txt(X(tt), H - 8, tt, 'text-anchor="middle" class="tk"');
    var my = (H - b) / 2 + 4;
    s += txt(14, my, 'error (N)', 'text-anchor="middle" class="ax" transform="rotate(-90 14 ' + my + ')"');
    [['A', sa], ['B', sb]].forEach(function (pair) {
      var c = CELLS[pair[0]], vis = pair[1].filter(function (p) { return p.t <= now; }), d = '';
      vis.forEach(function (p, j) { d += (j ? 'L' : 'M') + X(p.t).toFixed(1) + ',' + Y(p.m - p.F).toFixed(1); });
      if (vis.length > 1) s += '<path d="' + d + '" fill="none" stroke="' + c.color + '" stroke-width="2"/>';
      var lp = vis[vis.length - 1];
      if (lp) s += '<circle cx="' + X(lp.t) + '" cy="' + Y(lp.m - lp.F) + '" r="4" fill="' + c.color + '" stroke="#fff" stroke-width="1.5"/>';
    });
    s += '<line x1="' + X(now) + '" x2="' + X(now) + '" y1="' + t + '" y2="' + (H - b) + '" stroke="' + COL.ink + '" opacity=".35"/>';
    $('lc-err').innerHTML = s;
  }

  // ---------- cross-section ----------
  var P = { socket: '#3d3d3b', carrier: '#e08a2c', plate: '#e8c35a', sole: '#1e1e1d', cell: '#c9ccd0', steel: '#8e949b', fsr: '#6250d6' };
  function rect(x, y, w, h, fill, extra) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="2" fill="' + fill + '" ' + (extra || '') + '/>'; }
  function drawStack(F) {
    var s = '<defs><marker id="lc-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + COL.ink + '"/></marker></defs>';
    var S = 4.2; // px per mm
    [{ k: 'A', x: 20 }, { k: 'B', x: 240 }].forEach(function (col) {
      var k = col.k, x = col.x, c = CELLS[k], W = 180, cx = x + W / 2, pct = F / c.cap;
      var shift = Math.min(Math.min(pct, 2) * 0.06 * 400 / (k === 'A' ? 1 : 1.3), 8); // lift, exaggerated 400×
      var y = 40, fill = Math.min(pct, 1.5) / 1.5;
      s += txt(cx, 14, k === 'A' ? 'Rev A: two half-bridges' : 'Rev B: ATO button', 'text-anchor="middle" class="hd"');
      s += '<path d="M' + (cx - 22) + ',' + y + ' h44 v18 h-44 z" fill="' + P.socket + '" opacity=".7"/>';
      s += txt(cx, y + 12, 'tibia', 'text-anchor="middle" class="lbl" fill="#fff"');
      y += 18;
      s += rect(x + 10, y, W - 20, 26, P.socket) + txt(cx, y + 17, 'socket (Nylon)', 'text-anchor="middle" class="lbl" fill="#fff"');
      y += 26;
      var top = y, cellH = c.height * S;
      if (k === 'A') {
        var h1 = 7.8 * S, cw = 34 * S * 0.9;
        s += rect(cx - cw / 2, y, cw, h1 - 2, P.cell) + rect(cx - cw / 2, y + h1, cw, h1 - 2, P.cell);
        s += rect(cx - cw / 2, y, cw * fill, h1 * 2 - 2, c.color, 'opacity=".7"');
        s += txt(cx, y + h1 / 2 + 4, '50 kg cell', 'text-anchor="middle" class="lbl"') + txt(cx, y + h1 * 1.5 + 4, '50 kg cell', 'text-anchor="middle" class="lbl"');
      } else {
        var bw = 20 * S, bh = 10 * S;
        s += rect(cx - bw / 2, y, bw, bh, P.cell) + rect(cx - bw / 2, y, bw * fill, bh, c.color, 'opacity=".7"');
        s += txt(cx, y + bh / 2 + 4, '20 kg button', 'text-anchor="middle" class="lbl"');
        s += '<rect x="' + (cx - 5) + '" y="' + (y + bh) + '" width="10" height="' + 2 * S + '" rx="5" fill="' + P.steel + '"/>';
      }
      s += '<line x1="' + (x + 4) + '" x2="' + (x + 4) + '" y1="' + top + '" y2="' + (top + cellH) + '" stroke="' + COL.ink2 + '"/>';
      s += txt(x + 10, 31, 'stack ' + c.height + ' mm', 'class="lbl" fill="' + COL.ink2 + '"');
      var ym = top + cellH + 2;
      s += '<g transform="translate(0,' + (-shift).toFixed(2) + ')">';
      if (k === 'B') s += '<rect x="' + (cx - 15) + '" y="' + ym + '" width="30" height="' + 2 * S * 0.6 + '" fill="' + P.steel + '"/>';
      s += rect(x + 20, ym, W - 40, 6 * S * 0.8, P.carrier) + txt(cx, ym + 14, 'carrier', 'text-anchor="middle" class="lbl" fill="#fff"');
      ym += 6 * S * 0.8;
      [x + 38, x + W - 62].forEach(function (fx) { s += rect(fx, ym, 24, 3, P.fsr) + rect(fx + 4, ym + 3, 16, 4, P.plate); });
      ym += 7;
      s += rect(x + 20, ym, W - 40, 5 * S * 0.8, P.plate) + txt(cx, ym + 12, 'puck plate', 'text-anchor="middle" class="lbl"');
      ym += 5 * S * 0.8;
      s += rect(x + 18, ym, W - 36, 4 * S * 0.8, P.sole) + txt(cx, ym + 10, 'VytaFlex sole', 'text-anchor="middle" class="lbl" fill="#ddd"');
      ym += 4 * S * 0.8;
      s += '</g>';
      var gy = ym - shift + 6, al = Math.min(14 + F / Math.max(st.Fs * 7, 1) * 90, 95);
      s += '<line x1="' + cx + '" x2="' + cx + '" y1="' + (gy + al) + '" y2="' + (gy + 2) + '" stroke="' + COL.ink + '" stroke-width="2.5" marker-end="url(#lc-ar)"/>';
      s += '<line x1="' + (x + 8) + '" x2="' + (x + W - 8) + '" y1="' + (gy + al + 2) + '" y2="' + (gy + al + 2) + '" stroke="' + COL.base + '"/>';
      s += txt(cx + 8, gy + al - 2, F.toFixed(0) + ' N', 'class="hd"');
      var cls = status(pct * 100).cls;
      s += txt(x + W - 10, 31, (pct * 100).toFixed(0) + '% of rating', 'text-anchor="end" class="lbl st-' + cls + '"');
    });
    $('lc-stack').innerHTML = s;
  }

  // ---------- readouts ----------
  function info(k) {
    var c = CELLS[k], pk = peakF(), noiseN = (st.amp.nv / 1e6) / c.sens;
    var acc = c.nl * c.cap + c.oc * (st.cop / 10) * st.Fs;
    return { c: c, pct: pk / c.cap * 100, standMv: st.Fs * c.sens, standPct: st.Fs / c.cap * 100, noiseG: noiseN / g * 1000, acc: acc, counts: st.Fs * c.sens * Math.pow(2, 23) / 19.53 };
  }
  function refreshStatic() {
    read(); cache = {};
    var a = info('A'), b = info('B');
    ['A', 'B'].forEach(function (k) {
      var I = k === 'A' ? a : b, stt = status(I.pct), el = $('lc-peak-' + k);
      el.textContent = I.pct.toFixed(0) + '% · ' + stt.lab;
      el.className = 'st-' + stt.cls;
    });
    $('lc-standing').textContent = st.Fs.toFixed(1) + ' N';
    var win = function (x) { return x ? ' class="win"' : ''; };
    var row = function (lab, va, vb, best) { return '<tr><th scope="row">' + lab + '</th><td' + win(best === 'a') + '>' + va + '</td><td' + win(best === 'b') + '>' + vb + '</td></tr>'; };
    var lower = function (x, y) { return x < y ? 'a' : y < x ? 'b' : ''; };
    $('lc-table').innerHTML =
      row('Rated capacity', '490 N (50 kg)', '196 N (20 kg)', '') +
      row('Peak load this step', a.pct.toFixed(0) + '% of rating', b.pct.toFixed(0) + '% of rating', a.pct > 150 ? '' : (b.pct > 150 ? 'a' : '')) +
      row('Signal when standing', a.standMv.toFixed(2) + ' mV', b.standMv.toFixed(2) + ' mV', a.standMv > b.standMv ? 'a' : 'b') +
      row('Amplifier counts when standing', Math.round(a.counts).toLocaleString(), Math.round(b.counts).toLocaleString(), a.counts > b.counts ? 'a' : 'b') +
      row('Noise floor', a.noiseG.toFixed(1) + ' g', b.noiseG.toFixed(1) + ' g', lower(a.noiseG, b.noiseG)) +
      row('Spec accuracy, worst case', '±' + a.acc.toFixed(1) + ' N', '±' + b.acc.toFixed(1) + ' N', lower(a.acc, b.acc)) +
      row('Stack height', '15.6 mm', '12.0 mm', 'b') +
      row('Mass (estimate)', CELLS.A.mass, CELLS.B.mass, 'b') +
      row('Wiring', CELLS.A.wires, CELLS.B.wires, 'b') +
      row('Cost (estimate)', CELLS.A.price, CELLS.B.price, 'a') +
      row('Needs in the CAD', 'Relief pockets behind each tongue', 'Steel contact, anti-tip guide, overload stop', '');
    if (!playing) draw();
  }

  // ---------- tooltip ----------
  var chart = $('lc-chart'), tip = $('lc-tip');
  chart.addEventListener('mousemove', function (ev) {
    if (!scale) return;
    var pt = chart.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
    var p = pt.matrixTransform(chart.getScreenCTM().inverse());
    if (p.x < CH.l || p.x > CH.w - CH.r) { tip.hidden = true; return; }
    var t = (p.x - CH.l) / (CH.w - CH.l - CH.r) * T;
    var near = function (k) { var sm = samples(k), best = sm[0]; sm.forEach(function (q) { if (Math.abs(q.t - t) < Math.abs(best.t - t)) best = q; }); return best; };
    tip.innerHTML = '<b>t = ' + t.toFixed(0) + ' ms</b><span>True force <i>' + force(t).toFixed(1) + ' N</i></span><span class="a">Two-cell <i>' + near('A').m.toFixed(1) + ' N</i></span><span class="b">ATO <i>' + near('B').m.toFixed(1) + ' N</i></span>';
    tip.hidden = false;
    var wrap = chart.parentElement.getBoundingClientRect(), lx = ev.clientX - wrap.left + 14;
    if (lx > wrap.width - 180) lx -= 200;
    tip.style.left = lx + 'px'; tip.style.top = (ev.clientY - wrap.top - 20) + 'px';
  });
  chart.addEventListener('mouseleave', function () { tip.hidden = true; });

  // ---------- loop ----------
  function draw() { drawChart(now); drawErr(now); drawStack(force(now)); }
  function frame(ts) {
    raf = 0;
    if (last) { now += (ts - last) * st.spd; if (now > T) now = 0; }
    last = ts; draw();
    if (playing && visible) raf = requestAnimationFrame(frame);
  }
  function start() { if (!raf && playing && visible) { last = 0; raf = requestAnimationFrame(frame); } }
  var playBtn = $('lc-play');
  playBtn.textContent = playing ? 'Pause' : 'Play';
  playBtn.setAttribute('aria-pressed', String(playing));
  playBtn.addEventListener('click', function () {
    playing = !playing;
    playBtn.textContent = playing ? 'Pause' : 'Play';
    playBtn.setAttribute('aria-pressed', String(playing));
    start();
  });
  root.querySelectorAll('input, select').forEach(function (el) { el.addEventListener('input', refreshStatic); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; start(); }).observe(root);
  }
  refreshStatic(); draw(); start();
})();
