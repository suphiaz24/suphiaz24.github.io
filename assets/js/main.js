// Shared site scripts: catalog filter, hanging nav physics, drafting-line reveal, photo callouts.
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Project catalog filter ---------- */
  (function () {
    var group = document.querySelector('.filter');
    if (!group) return;
    var buttons = group.querySelectorAll('button[data-filter]');
    var items = document.querySelectorAll('#projects .cards > li');
    var count = document.querySelector('[data-count]');
    var empty = document.querySelector('[data-empty]');

    function apply(cat) {
      var shown = 0;
      items.forEach(function (li) {
        var match = cat === 'all' || li.dataset.cat.split(' ').indexOf(cat) !== -1;
        li.hidden = !match;
        if (match) shown++;
      });
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.filter === cat));
      });
      if (count) count.textContent = shown + (shown === 1 ? ' item' : ' items');
      if (empty) empty.hidden = shown !== 0;
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        apply(b.dataset.filter);
        history.replaceState(null, '', b.dataset.filter === 'all' ? location.pathname : '?cat=' + b.dataset.filter);
      });
    });

    // Project pages link back with ?cat=... to open a category.
    var initial = new URLSearchParams(location.search).get('cat');
    if (initial && group.querySelector('[data-filter="' + initial + '"]')) apply(initial);
  })();

  /* ---------- Hanging nav: each sign is a damped pendulum on a V cable ---------- */
  (function () {
    var nav = document.querySelector('.nav.hang');
    if (!nav) return;
    var G = 9.81;
    var PX_PER_M = 100;          // 1 m of pendulum per 100 px of sign
    var mass = 0.4;              // kg, set by the load slider
    var signs = Array.prototype.map.call(nav.querySelectorAll('.sign'), function (el) {
      return { el: el, tension: el.querySelector('.tension'), theta: 0, omega: 0 };
    });

    function geometry(s) {
      var r = s.el.getBoundingClientRect();
      var plate = s.el.querySelector('.plate').getBoundingClientRect();
      var cable = s.el.querySelector('.cable').getBoundingClientRect();
      // Pivot at the hook, centre of mass at the plate centre.
      s.L = Math.max(0.2, (plate.top + plate.height / 2 - r.top - 7) / PX_PER_M);
      // Half-angle of the V cable: hook to plate corner (cable drawn from 50% to 10%/90% of width).
      s.alpha = Math.atan((0.4 * cable.width) / Math.max(1, cable.height));
    }
    signs.forEach(geometry);
    window.addEventListener('resize', function () { signs.forEach(geometry); });

    function damping() { return 0.9 / Math.sqrt(mass / 0.4); } // heavier signs ring longer

    var forcesOn = false;
    function writeTension(s) {
      // Cable tension from radial balance: 2T cos(alpha) = m (g cos(theta) + L omega^2)
      var T = mass * (G * Math.cos(s.theta) + s.L * s.omega * s.omega) / (2 * Math.cos(s.alpha));
      s.tension.textContent = 'T ' + T.toFixed(2) + ' N ×2';
    }

    var running = false, last = 0;
    function step(now) {
      var dt = Math.min(0.033, (now - last) / 1000 || 0.016);
      last = now;
      var active = false;
      signs.forEach(function (s) {
        var sub = 4, h = dt / sub;
        for (var i = 0; i < sub; i++) {
          var acc = -(G / s.L) * Math.sin(s.theta) - damping() * s.omega;
          s.omega += acc * h;
          s.theta += s.omega * h;
        }
        s.el.style.transform = 'rotate(' + s.theta.toFixed(4) + 'rad)';
        if (forcesOn) writeTension(s);
        if (Math.abs(s.theta) > 0.0008 || Math.abs(s.omega) > 0.002) active = true;
      });
      if (active) requestAnimationFrame(step);
      else {
        running = false;
        signs.forEach(function (s) { s.theta = 0; s.omega = 0; s.el.style.transform = ''; if (forcesOn) writeTension(s); });
      }
    }
    function wake() {
      if (reduceMotion || running) return;
      running = true;
      last = performance.now();
      requestAnimationFrame(step);
    }
    function push(s, impulse) {
      s.omega += impulse * (0.4 / mass); // lighter signs take more swing from the same push
      wake();
    }

    // A cursor sweeping through the cables pushes the signs it crosses.
    var lastX = null, lastT = 0;
    nav.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var now = performance.now();
      if (lastX !== null) {
        var vx = (e.clientX - lastX) / Math.max(1, now - lastT); // px per ms
        signs.forEach(function (s) {
          var r = s.el.getBoundingClientRect();
          if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
            push(s, Math.max(-2.5, Math.min(2.5, vx * 1.6)));
          }
        });
      }
      lastX = e.clientX; lastT = now;
    });
    nav.addEventListener('pointerleave', function () { lastX = null; });
    signs.forEach(function (s, i) {
      s.el.addEventListener('pointerdown', function () { push(s, i % 2 ? 1.2 : -1.2); });
      s.el.addEventListener('focus', function () { push(s, 0.6); });
    });

    // Signs swing in on load, as if just hung.
    if (!reduceMotion) {
      signs.forEach(function (s, i) { s.theta = (i % 2 ? 1 : -1) * (0.10 + 0.03 * i); });
      wake();
    }

    // Forces readout and load slider.
    var btn = document.querySelector('.forces-btn');
    var load = document.querySelector('.statics-ctl .load');
    if (btn && load) {
      var range = load.querySelector('input');
      var out = load.querySelector('output');
      btn.addEventListener('click', function () {
        forcesOn = btn.getAttribute('aria-pressed') !== 'true';
        btn.setAttribute('aria-pressed', String(forcesOn));
        btn.textContent = forcesOn ? 'Hide forces' : 'Show forces';
        load.hidden = !forcesOn;
        nav.classList.toggle('forces-on', forcesOn);
        signs.forEach(writeTension);
      });
      range.addEventListener('input', function () {
        mass = parseFloat(range.value);
        out.textContent = mass.toFixed(1) + ' kg';
        signs.forEach(function (s, i) { if (forcesOn) writeTension(s); push(s, (i % 2 ? 1 : -1) * 0.25); });
      });
    }
  })();

  /* ---------- Drafting-line reveal on scroll ---------- */
  (function () {
    var targets = document.querySelectorAll('.section-head, .cards');
    document.querySelectorAll('#projects .cards > li').forEach(function (li, i) { li.style.setProperty('--i', i); });
    if (!('IntersectionObserver' in window) || reduceMotion) {
      targets.forEach(function (t) { t.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  })();

  /* ---------- Photo callouts ---------- */
  (function () {
    var pins = document.querySelectorAll('.pin');
    if (!pins.length) return;
    function closeAll(except) {
      pins.forEach(function (p) {
        if (p === except) return;
        p.setAttribute('aria-expanded', 'false');
        document.getElementById(p.getAttribute('aria-controls')).hidden = true;
      });
    }
    pins.forEach(function (p) {
      var note = document.getElementById(p.getAttribute('aria-controls'));
      // Place the note beside its pin, flipping to the left on the right half of the photo.
      var x = parseFloat(p.style.left), y = parseFloat(p.style.top);
      note.style.top = 'calc(' + y + '% + 18px)';
      if (x > 55) note.style.right = 'calc(' + (100 - x) + '% - 14px)';
      else note.style.left = 'calc(' + x + '% - 14px)';
      p.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = p.getAttribute('aria-expanded') === 'true';
        closeAll(p);
        p.setAttribute('aria-expanded', String(!open));
        note.hidden = open;
      });
    });
    document.addEventListener('click', function () { closeAll(null); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(null); });
  })();

  /* ---------- Drafting sheet: line drawings scattered down the page ---------- */
  (function () {
    var css = document.querySelector('link[rel="stylesheet"][href*="main.css"]');
    if (!css) return;
    var base = new URL('../img/drafts/', css.href).href;
    // spin: degrees turned per px scrolled (rotating parts only).
    var parts = [
      { f: 'robot-arm.svg', w: 300 }, { f: 'bearing.svg', w: 210, spin: 0.09 },
      { f: 'spring.svg', w: 260 }, { f: 'bolt.svg', w: 300 },
      { f: 'planetary.svg', w: 250, spin: -0.05 }, { f: 'cam.svg', w: 180 },
      { f: 'servo.svg', w: 230 }, { f: 'ibeam.svg', w: 230 },
      { f: 'beetle.svg', w: 250 }, { f: 'gear-pair.svg', w: 280 }
    ];
    var layer = document.createElement('div');
    layer.className = 'drafts';
    layer.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(layer, document.body.firstChild);
    var spinners = [];

    function rand(a, b) { return a + Math.random() * (b - a); }
    function shuffle(a) {
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    }

    function lay() {
      layer.textContent = '';
      spinners = [];
      layer.style.height = '0';
      var vw = document.documentElement.clientWidth;
      var docH = document.body.offsetHeight; // content height, not the viewport
      layer.style.height = docH + 'px';
      var scale = vw < 640 ? 0.6 : vw < 1100 ? 0.8 : 1;
      var deck = shuffle(parts.slice());
      var y = rand(560, 700), k = 0, left = Math.random() < 0.5;
      while (y < docH - 260) {
        var p = deck[k++ % deck.length];
        var w = p.w * scale * rand(0.85, 1.15);
        var x = left ? rand(-0.35 * w, Math.min(0.08 * vw, 120)) : vw - w - rand(-0.35 * w, Math.min(0.08 * vw, 120));
        var img = document.createElement('img');
        img.src = base + p.f;
        img.alt = '';
        img.decoding = 'async';
        img.style.cssText = 'left:' + x.toFixed(0) + 'px;top:' + y.toFixed(0) + 'px;width:' + w.toFixed(0) + 'px';
        var tilt = p.spin ? rand(0, 360) : rand(-10, 10);
        img.style.transform = 'rotate(' + tilt.toFixed(1) + 'deg)';
        if (p.spin) spinners.push({ el: img, tilt: tilt, rate: p.spin });
        layer.appendChild(img);
        y += rand(420, 640) * (vw < 640 ? 1.3 : 1);
        left = Math.random() < 0.7 ? !left : left; // mostly alternate sides
      }
      // A second, fainter run down the middle, behind the content.
      y = rand(380, 520);
      while (y < docH - 300) {
        var q = deck[k++ % deck.length];
        var mw = q.w * scale * rand(1, 1.35);
        var lo = 0.18 * vw, hi = Math.max(lo, 0.82 * vw - mw);
        var mid = document.createElement('img');
        mid.src = base + q.f;
        mid.alt = '';
        mid.decoding = 'async';
        mid.className = 'mid';
        mid.style.cssText = 'left:' + rand(lo, hi).toFixed(0) + 'px;top:' + y.toFixed(0) + 'px;width:' + mw.toFixed(0) + 'px';
        var mt = q.spin ? rand(0, 360) : rand(-8, 8);
        mid.style.transform = 'rotate(' + mt.toFixed(1) + 'deg)';
        if (q.spin) spinners.push({ el: mid, tilt: mt, rate: q.spin });
        layer.appendChild(mid);
        y += rand(520, 820) * (vw < 640 ? 1.4 : 1);
      }
      turn();
    }

    var ticking = false;
    function turn() {
      ticking = false;
      if (reduceMotion) return;
      var s = window.scrollY;
      spinners.forEach(function (g) { g.el.style.transform = 'rotate(' + (g.tilt + s * g.rate).toFixed(1) + 'deg)'; });
    }
    window.addEventListener('scroll', function () {
      if (!ticking && spinners.length) { ticking = true; requestAnimationFrame(turn); }
    }, { passive: true });

    var lastW = 0, timer;
    function relay() {
      var w = document.documentElement.clientWidth;
      if (w === lastW) return; // ignore height-only resizes (mobile URL bar)
      lastW = w;
      lay();
    }
    window.addEventListener('resize', function () { clearTimeout(timer); timer = setTimeout(relay, 200); });
    if (document.readyState === 'complete') relay();
    else window.addEventListener('load', relay);
  })();
})();
