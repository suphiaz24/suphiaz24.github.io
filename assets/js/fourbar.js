// Live four-bar crank–rocker: the kind of drive that turns a motor's rotation into a wing's flap.
(function () {
  var canvas = document.getElementById('fourbar');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var stage = canvas.parentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var deg = 180 / Math.PI;

  var ids = ['a', 'b', 'c', 'd', 'rpm'];
  var ui = {};
  ids.forEach(function (k) { ui[k] = document.getElementById('fb-' + k); ui[k + 'Out'] = document.getElementById('fb-' + k + '-out'); });
  ui.play = document.getElementById('fb-play');
  ui.type = document.getElementById('fb-type');
  ['rocker', 'stroke', 'mu', 'mumin'].forEach(function (k) { ui[k] = document.getElementById('fb-' + k); });

  function L() { return { a: +ui.a.value, b: +ui.b.value, c: +ui.c.value, d: +ui.d.value }; }

  // Ground pivots O2 = (0,0) (crank) and O4 = (d,0) (rocker); y up.
  function solve(phi, l) {
    var A = { x: l.a * Math.cos(phi), y: l.a * Math.sin(phi) };
    var O4 = { x: l.d, y: 0 };
    var dx = O4.x - A.x, dy = O4.y - A.y, r = Math.hypot(dx, dy);
    if (r > l.b + l.c || r < Math.abs(l.b - l.c) || r === 0) return null;
    var p = (l.b * l.b - l.c * l.c + r * r) / (2 * r);
    var h = Math.sqrt(Math.max(0, l.b * l.b - p * p));
    var mx = A.x + p * dx / r, my = A.y + p * dy / r;
    // Open configuration: coupler–rocker joint above the line A–O4.
    var B = { x: mx - h * dy / r, y: my + h * dx / r };
    var rocker = Math.atan2(B.y - O4.y, B.x - O4.x);
    // Transmission angle: between coupler (A→B) and rocker (O4→B).
    var u1 = { x: B.x - A.x, y: B.y - A.y }, u2 = { x: B.x - O4.x, y: B.y - O4.y };
    var mu = Math.acos(Math.max(-1, Math.min(1, (u1.x * u2.x + u1.y * u2.y) / (l.b * l.c))));
    return { A: A, B: B, O4: O4, rocker: rocker, mu: mu };
  }

  function grashof(l) {
    var arr = [l.a, l.b, l.c, l.d].sort(function (x, y) { return x - y; });
    var ok = arr[0] + arr[3] <= arr[1] + arr[2];
    var shortest = Math.min(l.a, l.b, l.c, l.d);
    if (ok && shortest === l.a) return { full: true, text: 'Grashof crank–rocker: the crank turns fully, the wing rocks' };
    if (ok && shortest === l.d) return { full: true, text: 'Grashof double-crank (drag link)' };
    if (ok) return { full: false, text: 'Grashof double-rocker: the input can’t make a full turn' };
    return { full: false, text: 'Non-Grashof: no link makes a full turn' };
  }

  // Sweep one input cycle for stroke, transmission angle and the coupler-point path.
  var sweep = null;
  function analyse() {
    var l = L(), minR = Infinity, maxR = -Infinity, minMu = Infinity, path = [], reach = [];
    for (var i = 0; i <= 360; i += 2) {
      var s = solve(i / deg, l);
      if (!s) { path.push(null); continue; }
      reach.push(i / deg);
      minR = Math.min(minR, s.rocker); maxR = Math.max(maxR, s.rocker);
      var tmu = s.mu > Math.PI / 2 ? Math.PI - s.mu : s.mu;
      minMu = Math.min(minMu, tmu);
      path.push({ x: (s.A.x + s.B.x) / 2, y: (s.A.y + s.B.y) / 2 });
    }
    sweep = { l: l, g: grashof(l), stroke: maxR - minR, minMu: minMu, path: path, reach: reach };
    ui.type.textContent = sweep.g.text;
    ui.stroke.textContent = isFinite(sweep.stroke) ? (sweep.stroke * deg).toFixed(1) + '°' : '—';
    ui.mumin.textContent = isFinite(minMu) ? (minMu * deg).toFixed(1) + '°' : '—';
  }

  var phi = 0.6, dir = 1, playing = !reduceMotion, dragging = false;
  var view = { s: 1, ox: 0, oy: 0, w: 0, h: 0 };
  function resize() {
    var r = stage.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    view.w = r.width; view.h = r.height;
    draw();
  }
  function fit(l) {
    var spanX = l.a + l.d + l.c * 2.6 + 40, spanY = Math.max(l.a, l.c) * 2 + l.c * 2.2;
    view.s = Math.min((view.w - 40) / spanX, (view.h - 50) / spanY);
    view.ox = 20 + (l.a + 20) * view.s;
    view.oy = view.h * 0.62;
  }
  function P(pt) { return { x: view.ox + pt.x * view.s, y: view.oy - pt.y * view.s }; }

  var C = { ink: '#1a1a1a', muted: '#5f5f5b', rule: '#d9d9d6', blue: '#1b5e9b', green: '#2e7d32', wash: '#f4f4f2' };
  function pivot(pt, ground) {
    if (ground) {
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2; ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.moveTo(pt.x, pt.y); ctx.lineTo(pt.x - 11, pt.y + 16); ctx.lineTo(pt.x + 11, pt.y + 16); ctx.closePath(); ctx.fill(); ctx.stroke();
      for (var i = -12; i <= 8; i += 5) { ctx.beginPath(); ctx.moveTo(pt.x + i, pt.y + 22); ctx.lineTo(pt.x + i + 5, pt.y + 16); ctx.stroke(); }
    }
    ctx.fillStyle = '#fff'; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  function link(p, q, color, width) {
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
  }
  function label(text, x, y, color) {
    ctx.fillStyle = color || C.muted; ctx.font = '500 12px "JetBrains Mono", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y);
  }

  function draw() {
    if (!view.w || !sweep) return;
    var l = sweep.l; fit(l);
    ctx.clearRect(0, 0, view.w, view.h);
    var s = solve(phi, l);
    var O2 = P({ x: 0, y: 0 }), O4 = P({ x: l.d, y: 0 });

    // Ground line and crank circle.
    ctx.setLineDash([6, 5]); ctx.strokeStyle = C.rule; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(O2.x - 30, O2.y); ctx.lineTo(O4.x + 30, O4.y); ctx.stroke();
    ctx.beginPath(); ctx.arc(O2.x, O2.y, l.a * view.s, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);

    // Coupler-point path over one cycle.
    ctx.strokeStyle = 'rgba(27, 94, 155, .45)'; ctx.lineWidth = 1.2; ctx.beginPath();
    var pen = false;
    sweep.path.forEach(function (pt) {
      if (!pt) { pen = false; return; }
      var q = P(pt);
      if (pen) ctx.lineTo(q.x, q.y); else { ctx.moveTo(q.x, q.y); pen = true; }
    });
    ctx.stroke();

    if (!s) { label('Links can’t close at this angle', view.w / 2, 24, C.ink); pivot(O2, true); pivot(O4, true); return; }
    var A = P(s.A), B = P(s.B);

    // Wing extends from the rocker pivot in the rocker direction, past B.
    var wingLen = l.c * 2.4 * view.s;
    var dirx = (B.x - O4.x) / (l.c * view.s), diry = (B.y - O4.y) / (l.c * view.s);
    var wingEnd = { x: O4.x + dirx * wingLen, y: O4.y + diry * wingLen };
    ctx.fillStyle = 'rgba(58, 58, 56, .08)'; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.4;
    var nx = -diry, ny = dirx, chord = Math.max(10, l.c * 0.28 * view.s);
    ctx.beginPath();
    ctx.moveTo(B.x, B.y);
    ctx.lineTo(wingEnd.x, wingEnd.y);
    ctx.quadraticCurveTo(wingEnd.x + nx * chord * 0.8, wingEnd.y + ny * chord * 0.8, B.x + nx * chord, B.y + ny * chord);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    link(O4, B, C.ink, 5);
    link(A, B, C.blue, 5);
    link(O2, A, C.ink, 6);
    pivot(O2, true); pivot(O4, true); pivot(A, false); pivot(B, false);

    label('a', (O2.x + A.x) / 2 + 10, (O2.y + A.y) / 2 - 10);
    label('b', (A.x + B.x) / 2, (A.y + B.y) / 2 - 12, C.blue);
    label('c', (O4.x + B.x) / 2 + 12, (O4.y + B.y) / 2);
    label('d', (O2.x + O4.x) / 2, O2.y + 14);
    label('wing', wingEnd.x, wingEnd.y - 14, C.ink);

    var tmu = s.mu > Math.PI / 2 ? Math.PI - s.mu : s.mu;
    ui.rocker.textContent = (s.rocker * deg).toFixed(1) + '°';
    ui.mu.textContent = (tmu * deg).toFixed(1) + '°';
  }

  var last = 0, running = false, visible = true;
  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
    if (playing && !dragging) {
      var next = phi + dir * (+ui.rpm.value / 60) * 2 * Math.PI * dt;
      if (!solve(next, sweep.l)) dir = -dir; // input can't pass this point: rock back
      else phi = next;
    }
    draw();
    if ((playing || dragging) && visible) requestAnimationFrame(frame); else running = false;
  }
  function wake() { if (running) return; running = true; last = performance.now(); requestAnimationFrame(frame); }

  ids.forEach(function (k) {
    ui[k].addEventListener('input', function () {
      ui[k + 'Out'].textContent = ui[k].value + (k === 'rpm' ? ' rpm' : ' mm');
      analyse(); draw();
    });
  });
  ui.play.addEventListener('click', function () {
    playing = !playing;
    ui.play.textContent = playing ? 'Pause' : 'Play';
    ui.play.setAttribute('aria-pressed', String(playing));
    if (playing) wake();
  });
  ui.play.textContent = playing ? 'Pause' : 'Play';
  ui.play.setAttribute('aria-pressed', String(playing));

  // Drag the crank pin to turn the input by hand.
  function local(e) { var r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  canvas.addEventListener('pointerdown', function (e) {
    var s = solve(phi, sweep.l); if (!s) return;
    var q = local(e), A = P(s.A);
    if (Math.hypot(q.x - A.x, q.y - A.y) > 22) return;
    dragging = true; canvas.setPointerCapture(e.pointerId); e.preventDefault(); wake();
  });
  canvas.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var q = local(e), O2 = P({ x: 0, y: 0 });
    var next = Math.atan2(-(q.y - O2.y), q.x - O2.x);
    if (solve(next, sweep.l)) phi = next;
  });
  function release() { dragging = false; if (!playing) draw(); }
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible && playing) wake();
    }).observe(stage);
  }
  new ResizeObserver(resize).observe(stage);
  analyse();
  if (!solve(phi, sweep.l) && sweep.reach.length) phi = sweep.reach[0];
  if (document.fonts) document.fonts.ready.then(draw);
  wake();
})();
