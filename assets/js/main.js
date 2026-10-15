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

  /* ---------- Card tracks: prev/next arrows when the row overflows ---------- */
  document.querySelectorAll('.cards.track').forEach(function (track) {
    var head = track.parentNode.querySelector('.section-head');
    if (!head) return;
    var nav = document.createElement('div');
    nav.className = 'track-nav';
    nav.hidden = true;
    nav.innerHTML = '<button type="button" aria-label="Scroll left" aria-controls="' + track.id + '">←</button>' +
                    '<button type="button" aria-label="Scroll right" aria-controls="' + track.id + '">→</button>';
    head.appendChild(nav);
    var prev = nav.children[0], next = nav.children[1];

    function step() {
      var li = track.querySelector('li:not([hidden])');
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return li ? li.getBoundingClientRect().width + gap : track.clientWidth;
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      nav.hidden = max <= 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
    }
    prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    // The category filter changes how many cards are showing.
    document.querySelectorAll('.filter button').forEach(function (b) { b.addEventListener('click', function () { track.scrollLeft = 0; update(); }); });
    update();
  });

  /* ---------- Mechanical scrollbars: rack & pinion (projects), vernier caliper (side projects) ---------- */
  (function () {
    var SVG = 'http://www.w3.org/2000/svg';
    function gearSVG(size, teeth) {
      var c = size / 2, tip = c - 1, root = tip - 3.6, pts = [];
      for (var i = 0; i < teeth; i++) {
        var a = i * 2 * Math.PI / teeth, p = 2 * Math.PI / teeth;
        [[0, root], [0.18, tip], [0.42, tip], [0.6, root]].forEach(function (q) {
          var t = a + q[0] * p;
          pts.push((c + q[1] * Math.cos(t)).toFixed(2) + ' ' + (c + q[1] * Math.sin(t)).toFixed(2));
        });
      }
      var holes = '';
      for (var h = 0; h < 4; h++) {
        var ha = h * Math.PI / 2 + Math.PI / 4;
        holes += '<circle cx="' + (c + (c - 16) * Math.cos(ha)).toFixed(2) + '" cy="' + (c + (c - 16) * Math.sin(ha)).toFixed(2) + '" r="2"/>';
      }
      return '<svg xmlns="' + SVG + '" viewBox="0 0 ' + size + ' ' + size + '" width="' + size + '" height="' + size + '" fill="#fff" stroke="#1a1a1a" stroke-width="1.3" stroke-linejoin="round">' +
        '<path d="M' + pts.join(' L') + ' Z"/><circle cx="' + c + '" cy="' + c + '" r="' + (c - 10) + '" fill="none" stroke-dasharray="2 3" stroke-width="1"/>' + holes +
        '<circle cx="' + c + '" cy="' + c + '" r="4.5" fill="#3a3a38"/></svg>';
    }

    document.querySelectorAll('.cards.track').forEach(function (track) {
      var kind = track.classList.contains('side-cards') ? 'caliper' : 'rack';
      var bar = document.createElement('div');
      bar.className = 'scroller ' + kind;
      bar.setAttribute('aria-hidden', 'true'); // the arrow buttons are the keyboard path
      bar.hidden = true;
      var thumb;
      if (kind === 'rack') {
        bar.innerHTML = '<div class="rack-bar"></div><div class="pinion">' + gearSVG(52, 18) + '</div>';
        thumb = bar.querySelector('.pinion');
      } else {
        bar.innerHTML = '<div class="beam"><div class="fixed-jaw"></div><div class="scale"></div></div>' +
          '<div class="slider"><div class="plate"><span class="screw"></span><output class="reading">0.0 mm</output></div><div class="jaw"></div></div>';
        thumb = bar.querySelector('.slider');
      }
      track.insertAdjacentElement('afterend', bar);
      var gear = bar.querySelector('svg');
      var reading = bar.querySelector('.reading');
      var scale = bar.querySelector('.scale');

      function travel() { return Math.max(0, bar.clientWidth - thumb.offsetWidth); }
      function numbers() {
        if (!scale) return;
        scale.textContent = '';
        for (var x = 60, n = 1; x < bar.clientWidth - 10; x += 60, n++) {
          var s = document.createElement('span'); s.style.left = x + 'px'; s.textContent = n * 10; scale.appendChild(s);
        }
      }
      function render() {
        var max = track.scrollWidth - track.clientWidth;
        bar.hidden = max <= 2;
        if (bar.hidden) return;
        if (scale && +scale.dataset.w !== bar.clientWidth) { numbers(); scale.dataset.w = bar.clientWidth; }
        var r = Math.min(1, Math.max(0, track.scrollLeft / max)), x = r * travel();
        if (gear) {
          // Rolling without slipping: angle = distance / pitch radius.
          thumb.style.transform = 'translateX(' + x.toFixed(1) + 'px)';
          gear.style.transform = 'rotate(' + (x / 23 * 180 / Math.PI).toFixed(1) + 'deg)';
        } else {
          thumb.style.transform = 'translateX(' + x.toFixed(1) + 'px)';
          reading.textContent = (x / 6).toFixed(1) + ' mm'; // scale: 6 px per mm
        }
      }

      var dragging = false, grab = 0;
      function seek(clientX) {
        var rect = bar.getBoundingClientRect();
        var x = Math.min(travel(), Math.max(0, clientX - rect.left - grab));
        track.scrollLeft = (travel() ? x / travel() : 0) * (track.scrollWidth - track.clientWidth);
      }
      bar.addEventListener('pointerdown', function (e) {
        dragging = true;
        var t = thumb.getBoundingClientRect();
        grab = (e.clientX >= t.left && e.clientX <= t.right) ? e.clientX - t.left : thumb.offsetWidth / 2;
        track.style.scrollSnapType = 'none';
        bar.classList.add('dragging');
        bar.setPointerCapture(e.pointerId);
        seek(e.clientX);
      });
      bar.addEventListener('pointermove', function (e) { if (dragging) seek(e.clientX); });
      function release() {
        if (!dragging) return;
        dragging = false;
        bar.classList.remove('dragging');
        track.style.scrollSnapType = '';
      }
      bar.addEventListener('pointerup', release);
      bar.addEventListener('pointercancel', release);

      var ticking = false;
      track.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; render(); }); }
      }, { passive: true });
      window.addEventListener('resize', render);
      document.querySelectorAll('.filter button').forEach(function (b) { b.addEventListener('click', function () { requestAnimationFrame(render); }); });
      numbers();
      render();
    });
  })();

  /* ---------- Project sidebar: section dropdowns + current-section highlight ---------- */
  (function () {
    var toc = document.querySelector('.toc');
    if (!toc) return;
    toc.querySelectorAll('.toc-tog').forEach(function (b) {
      b.addEventListener('click', function () {
        var open = b.getAttribute('aria-expanded') === 'true';
        b.setAttribute('aria-expanded', String(!open));
        document.getElementById(b.getAttribute('aria-controls')).hidden = open;
      });
    });

    // Links in the current project's list point at "#id" on this page.
    var links = Array.prototype.filter.call(toc.querySelectorAll('ul a'), function (a) {
      return a.getAttribute('href').charAt(0) === '#';
    });
    var targets = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
    if (!targets.length || targets.some(function (t) { return !t; })) return;

    function mark() {
      ticking = false;
      // Sections sit in two columns on desktop, so pick the one whose top is closest above the line.
      var line = 140, idx = 0, best = -Infinity;
      targets.forEach(function (t, i) {
        var top = t.getBoundingClientRect().top;
        if (top <= line && top > best + 1) { best = top; idx = i; }
      });
      // At the very bottom, the last section is the current one.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) idx = targets.length - 1;
      links.forEach(function (a, i) { a.classList.toggle('here', i === idx); });
    }
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(mark); }
    }, { passive: true });
    mark();
  })();
})();

// Resume dropdown: close on outside click or Escape.
document.addEventListener('click', function (e) {
  document.querySelectorAll('.resume-menu[open], .skill-menu[open]').forEach(function (m) { if (!m.contains(e.target)) m.open = false; });
});
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.resume-menu[open], .skill-menu[open]').forEach(function (m) { m.open = false; m.querySelector('summary').focus(); });
});


// Resume button video: show it once it can play; if the file is missing, keep the drawn jellyfish.
document.querySelectorAll('.btn-video').forEach(function (v) {
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var src = v.querySelector('source');
  if (src) src.addEventListener('error', function () { v.remove(); });
  v.addEventListener('loadeddata', function () {
    v.classList.add('ready');
    if (!still) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  });
});

// Home page: the hanging sign for the section in view is marked current; nothing is marked on the intro.
(function () {
  var signs = Array.prototype.filter.call(document.querySelectorAll('.nav.hang .sign'), function (a) {
    var h = a.getAttribute('href'); return h && h.charAt(0) === '#' && document.getElementById(h.slice(1));
  });
  if (!signs.length) return;
  var sections = signs.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  var ticking = false;
  function mark() {
    ticking = false;
    var line = window.innerHeight * 0.35, cur = -1;
    sections.forEach(function (s, i) { if (s.getBoundingClientRect().top <= line) cur = i; });
    // Past the last tracked section (e.g. into the footer) keep the last one only while it is still on screen.
    if (cur >= 0 && sections[cur].getBoundingClientRect().bottom < 0) cur = -1;
    signs.forEach(function (a, i) { if (i === cur) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(mark); } }, { passive: true });
  window.addEventListener('resize', mark);
  mark();
})();

// Masthead slims down once the page is scrolled (with a little hysteresis so it doesn't flicker).
(function () {
  var head = document.querySelector('.masthead');
  if (!head) return;
  var compact = false, ticking = false;
  function check() {
    ticking = false;
    var y = window.scrollY;
    var next = compact ? y > 24 : y > 80;
    if (next === compact) return;
    compact = next;
    head.classList.toggle('compact', compact);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(check); } }, { passive: true });
  check();
})();

// On phones the masthead tucks away while scrolling down and comes back on any scroll up.
(function () {
  var head = document.querySelector('.masthead');
  if (!head) return;
  var phone = window.matchMedia('(max-width: 640px)');
  var lastY = window.scrollY, tucked = false, ticking = false;
  function set(t) { if (t !== tucked) { tucked = t; head.classList.toggle('tuck', t); } }
  function check() {
    ticking = false;
    var y = Math.max(0, window.scrollY), dy = y - lastY;
    if (!phone.matches || y < head.offsetHeight) { set(false); lastY = y; return; }
    if (head.contains(document.activeElement) && document.activeElement !== document.body) { set(false); lastY = y; return; } // keep it visible while a nav link has focus
    if (Math.abs(dy) < 6) return; // ignore jitter
    set(dy > 0);
    lastY = y;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(check); } }, { passive: true });
  head.addEventListener('focusin', function () { set(false); });
})();

// Copy-email buttons: copy to clipboard, confirm for two seconds.
document.querySelectorAll('.copy-email').forEach(function (b) {
  var label = b.querySelector('span'), timer;
  b.addEventListener('click', function () {
    var text = b.getAttribute('data-copy');
    function done(ok) {
      label.textContent = ok ? 'copied ✓' : 'press Ctrl+C';
      b.classList.toggle('done', ok);
      b.setAttribute('aria-label', ok ? 'Email address copied' : 'Copy failed');
      clearTimeout(timer);
      timer = setTimeout(function () { label.textContent = 'copy'; b.classList.remove('done'); b.setAttribute('aria-label', 'Copy email address'); }, 2000);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } else {
      var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
      t.remove(); done(ok);
    }
  });
});


/* ---------- Drawing mode: sketch on the page; strokes stay pinned to the page as it scrolls ---------- */
(function () {
  var btn = document.querySelector('.draw-btn');
  if (!btn) return;
  var on = false, cv = null, ctx = null, bar = null, dpr = 1;
  var tool = { color: '#1f2d5c', erase: false }, drawing = false, last = null, mid = null;
  var COLORS = [['#1f2d5c', 'Navy'], ['#1b5e9b', 'Blue'], ['#5b3fa0', 'Purple'], ['#b3261e', 'Red']];

  function pageSize() {
    return { w: document.documentElement.scrollWidth, h: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) };
  }
  function fit() {
    var s = pageSize();
    dpr = Math.min(window.devicePixelRatio || 1, 2, 16000 / s.h);
    var w = Math.round(s.w * dpr), h = Math.round(s.h * dpr);
    if (cv.width === w && cv.height === h) return;
    var keep = null;
    if (cv.width && cv.height) {
      keep = document.createElement('canvas'); keep.width = cv.width; keep.height = cv.height;
      keep.getContext('2d').drawImage(cv, 0, 0);
    }
    cv.width = w; cv.height = h;
    cv.style.width = s.w + 'px'; cv.style.height = s.h + 'px';
    if (keep) ctx.drawImage(keep, 0, 0, keep.width, keep.height, 0, 0, w, h);
  }
  function pos(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * dpr, y: (e.clientY - r.top) * dpr }; }

  function build() {
    cv = document.createElement('canvas');
    cv.className = 'draw-layer';
    cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    ctx = cv.getContext('2d');

    bar = document.createElement('div');
    bar.className = 'draw-bar';
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Drawing tools');
    bar.innerHTML = '<span class="draw-title">Drawing</span>' +
      COLORS.map(function (c, i) {
        return '<button type="button" class="swatch" style="--c:' + c[0] + '" aria-pressed="' + (i === 0) + '" aria-label="' + c[1] + ' pen" data-color="' + c[0] + '"></button>';
      }).join('') +
      '<button type="button" class="tool" data-tool="erase" aria-pressed="false">Eraser</button>' +
      '<button type="button" class="tool" data-tool="clear">Clear</button>' +
      '<button type="button" class="tool done" data-tool="done">Done</button>';
    document.body.appendChild(bar);

    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.color) {
        tool.color = b.dataset.color; tool.erase = false;
        bar.querySelectorAll('.swatch').forEach(function (s) { s.setAttribute('aria-pressed', String(s === b)); });
        bar.querySelector('[data-tool="erase"]').setAttribute('aria-pressed', 'false');
      } else if (b.dataset.tool === 'erase') {
        tool.erase = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', String(tool.erase));
        bar.querySelectorAll('.swatch').forEach(function (s) { s.setAttribute('aria-pressed', String(!tool.erase && s.dataset.color === tool.color)); });
      } else if (b.dataset.tool === 'clear') {
        ctx.clearRect(0, 0, cv.width, cv.height);
      } else if (b.dataset.tool === 'done') {
        set(false); btn.focus();
      }
    });

    cv.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      drawing = true; last = pos(e); mid = last;
      cv.setPointerCapture(e.pointerId);
      // A single click leaves a dot.
      ctx.globalCompositeOperation = tool.erase ? 'destination-out' : 'source-over';
      ctx.fillStyle = tool.color;
      ctx.beginPath(); ctx.arc(last.x, last.y, (tool.erase ? 12 : 1.4) * dpr, 0, Math.PI * 2); ctx.fill();
    });
    cv.addEventListener('pointermove', function (e) {
      if (!drawing) return;
      var p = pos(e), m = { x: (last.x + p.x) / 2, y: (last.y + p.y) / 2 };
      var pressure = e.pointerType === 'pen' && e.pressure ? 0.5 + e.pressure : 1;
      ctx.globalCompositeOperation = tool.erase ? 'destination-out' : 'source-over';
      ctx.strokeStyle = tool.color;
      ctx.lineWidth = (tool.erase ? 24 : 2.6 * pressure) * dpr;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(mid.x, mid.y); ctx.quadraticCurveTo(last.x, last.y, m.x, m.y); ctx.stroke();
      last = p; mid = m;
    });
    function end() { drawing = false; }
    cv.addEventListener('pointerup', end);
    cv.addEventListener('pointercancel', end);
    window.addEventListener('resize', function () { if (cv) fit(); });
  }


  function set(state) {
    on = state;
    if (on && !cv) build();
    // Turning drawing mode off hides the sketch (fades out); turning it back on brings it back.
    // Only the Clear button actually erases it.
    if (on) { cv.classList.remove('fading'); fit(); }
    if (!on && cv) cv.classList.add('fading');
    document.documentElement.classList.toggle('drawing', on);
    btn.setAttribute('aria-pressed', String(on));
    btn.querySelector('.cmd').textContent = on ? 'drawing' : 'draw';
    if (bar) bar.hidden = !on;
  }
  btn.addEventListener('click', function () { set(!on); });
  document.addEventListener('keydown', function (e) { if (on && e.key === 'Escape') set(false); });
})();

// Zoom into projects: remember where the clicked project sits on screen, so the next page
// can zoom in from that spot (read by the inline pagereveal script in each page's <head>).
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href*="projects/"]');
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
  var card = a.closest('.card');
  if (card && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) card.classList.add('zoom-src');
  var box = (a.closest('.card') || a).getBoundingClientRect();
  var x = (box.left + box.width / 2) / window.innerWidth * 100;
  var y = (box.top + box.height / 2) / window.innerHeight * 100;
  try { sessionStorage.setItem('zoom', JSON.stringify({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 })); } catch (_) {}
});
// If the user comes back with the Back button, don't leave a card stuck in its zoomed state.
window.addEventListener('pageshow', function () { document.querySelectorAll('.zoom-src').forEach(function (c) { c.classList.remove('zoom-src'); }); });
