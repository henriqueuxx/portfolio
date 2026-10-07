(function () {
  var root = document.documentElement;
  var toggles = Array.prototype.slice.call(document.querySelectorAll('.theme-toggle'));
  var metaTheme = document.querySelector('meta[name="theme-color"]');

  // Tema claro / escuro
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var isLight = theme === 'light';
    toggles.forEach(function (t) {
      t.setAttribute('aria-pressed', String(isLight));
      t.setAttribute('aria-label', isLight ? 'Ativar modo escuro' : 'Ativar modo claro');
    });
    if (metaTheme) metaTheme.setAttribute('content', isLight ? '#F6F5F2' : '#0D0D0D');
  }
  applyTheme(root.getAttribute('data-theme') || 'dark');
  toggles.forEach(function (t) {
    t.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem('tema', next); } catch (e) {}
    });
  });

  // Menu hambúrguer
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    root.classList.toggle('menu-open', open);
    if (burger) { burger.setAttribute('aria-expanded', String(open)); burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); }
    if (menu) menu.setAttribute('aria-hidden', String(!open));
  }
  if (burger) burger.addEventListener('click', function () { setMenu(!root.classList.contains('menu-open')); });
  if (menu) menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('menu-open')) { setMenu(false); if (burger) burger.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 1023) setMenu(false); });

  // Navegação ganha fundo de vidro ao rolar
  var nav = document.querySelector('.nav');
  var heroEl = document.querySelector('.hero');
  function onScroll() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 24);
    if (heroEl) {
      var p = Math.min(Math.max(window.scrollY / 320, 0), 1);
      heroEl.style.setProperty('--orb-rot', (135 * p).toFixed(1) + 'deg');
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Link ativo conforme a seção visível
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a, .menu__links a'));
  var sections = [
    ['inicio', 'topo'], ['trabalhos', 'trabalhos'], ['sobre', 'sobre'],
    ['processo', 'processo'], ['formacao', 'processo'], ['redes', 'contato'], ['contato', 'contato']
  ];
  var hero = document.querySelector('.hero'); if (hero) hero.id = 'inicio';
  if ('IntersectionObserver' in window && links.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var target = 'topo';
        sections.forEach(function (s) { if (s[0] === entry.target.id) target = s[1]; });
        links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + target); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { var el = document.getElementById(s[0]); if (el) io.observe(el); });
  }

  // Assinatura (Instrument Serif) e giro dos diamantes.
  // Acontecem toda vez que a pessoa entra na área e "rearmam" quando a área sai da tela.
  var once = Array.prototype.slice.call(document.querySelectorAll('.serif, .diamond'));
  function cls(el) { return el.classList.contains('diamond') ? 'is-in' : 'is-signed'; }
  if ('IntersectionObserver' in window) {
    var enter = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add(cls(e.target)); });
    }, { rootMargin: '0px 0px -20% 0px', threshold: 0.6 });
    var leave = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (!e.isIntersecting) e.target.classList.remove(cls(e.target)); });
    }, { threshold: 0 });
    once.forEach(function (el) { enter.observe(el); leave.observe(el); });
  } else {
    once.forEach(function (el) { el.classList.add(cls(el)); });
  }

  // Cursor de vidro líquido: só em desktop com mouse e sem "reduzir movimento"
  (function () {
    // aparece em qualquer tela com mouse (inclusive janelas estreitas no computador)
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    // com "reduzir movimento" ativo no sistema, a gota se move sem balançar nem esticar
    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // filtro de distorção que dá o efeito de líquido (Chrome/Edge; nos outros fica um vidro fosco)
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    svg.innerHTML = '<filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="7" result="noise">' +
      (calm ? '' : '<animate attributeName="baseFrequency" dur="9s" values="0.012 0.018;0.018 0.012;0.012 0.018" repeatCount="indefinite"/>') + '</feTurbulence>' +
      '<feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G"/></filter>';
    document.body.appendChild(svg);
    if (!fine.matches) { scrollDrop(calm); return; }

    // gota principal + duas gotinhas que formam um "rastro" líquido
    function makeDrop(cls) { var d = document.createElement('div'); d.className = 'liquid ' + cls; d.setAttribute('aria-hidden', 'true'); document.body.appendChild(d); return d; }
    var trail2 = makeDrop('liquid--drop liquid--drop-2');
    var trail1 = makeDrop('liquid--drop liquid--drop-1');
    var blob = makeDrop('liquid--main');
    var all = [blob, trail1, trail2];

    var mx = -200, my = -200, started = false;
    var p = { x: mx, y: my, vx: 0, vy: 0 };              // posição com mola
    var st = { v: 1, vel: 0 };                            // esticar com mola (dá o "balanço" de gelatina)
    var angle = 0;
    var t1 = { x: mx, y: my }, t2 = { x: mx, y: my };     // rastro
    function on(v) { all.forEach(function (d) { d.classList.toggle('is-on', v); }); }
    var pop = 0;
    window.__liquid = {
      el: blob, mobile: false, calm: calm,
      pos: function () { return { x: p.x, y: p.y }; },
      place: function (x, y) { mx = x; my = y; p.x = t1.x = t2.x = x; p.y = t1.y = t2.y = y; p.vx = p.vy = 0; started = true; on(true); },
      pop: function () { pop = 1; }
    };

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!started) { p.x = t1.x = t2.x = mx; p.y = t1.y = t2.y = my; started = true; }
      on(true);
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', function () { on(false); });
    document.documentElement.addEventListener('mouseenter', function () { if (started) on(true); });
    window.addEventListener('mousedown', function () { blob.classList.add('is-down'); });
    window.addEventListener('mouseup', function () { blob.classList.remove('is-down'); });
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest && e.target.closest('a, button, .step, .c-problem, .c-source');
      blob.classList.toggle('is-hover', !!t);
    });

    var last = performance.now();
    function tick(now) {
      var dt = Math.min((now - last) / 1000, 1 / 30); last = now;
      if (calm) { p.x = mx; p.y = my; p.vx = p.vy = 0; }
      else {
        // mola amortecida: segue o mouse de forma macia, sem tremer
        var K = 140, D = 20;
        p.vx += ((mx - p.x) * K - p.vx * D) * dt;
        p.vy += ((my - p.y) * K - p.vy * D) * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
      }
      var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);          // px/s
      // direção suavizada (evita girar bruscamente quando quase parado)
      if (speed > 40) {
        var target = Math.atan2(p.vy, p.vx) * 180 / Math.PI;
        var diff = ((target - angle + 540) % 360) - 180;
        angle += diff * Math.min(1, dt * 14);
      }
      // esticar com mola pouco amortecida: ao parar, a gota "balança" antes de assentar
      var want = calm ? 1 : 1 + Math.min(speed / 2600, 0.55);
      st.vel += ((want - st.v) * 260 - st.vel * 12) * dt;
      st.v += st.vel * dt;
      var sx = st.v, sy = 1 / Math.sqrt(Math.max(st.v, 0.6));   // conserva o "volume"

      pop = Math.max(0, pop - dt * 2.4);
      var bumpD = pop > 0 ? 1 + Math.sin((1 - pop) * Math.PI) * 0.22 : 1;
      blob.style.transform = 'translate3d(' + p.x.toFixed(2) + 'px,' + p.y.toFixed(2) + 'px,0) rotate(' + angle.toFixed(2) + 'deg) scale(' + (sx * bumpD).toFixed(4) + ',' + (sy * bumpD).toFixed(4) + ')';

      // rastro: cada gotinha persegue a anterior e some quando o movimento para
      var f1 = 1 - Math.pow(0.0008, dt), f2 = 1 - Math.pow(0.002, dt);
      t1.x += (p.x - t1.x) * f1; t1.y += (p.y - t1.y) * f1;
      t2.x += (t1.x - t2.x) * f2; t2.y += (t1.y - t2.y) * f2;
      var vis = calm ? 0 : Math.min(speed / 900, 1);
      trail1.style.transform = 'translate3d(' + t1.x.toFixed(2) + 'px,' + t1.y.toFixed(2) + 'px,0) scale(' + (0.45 + vis * 0.2).toFixed(3) + ')';
      trail2.style.transform = 'translate3d(' + t2.x.toFixed(2) + 'px,' + t2.y.toFixed(2) + 'px,0) scale(' + (0.28 + vis * 0.14).toFixed(3) + ')';
      trail1.style.setProperty('--lq-vis', vis.toFixed(3));
      trail2.style.setProperty('--lq-vis', (vis * 0.85).toFixed(3));
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    liquidArrive();
  })();

  // Gota do celular: desce com a rolagem em zigue-zague, por trás do conteúdo (nunca cobre texto)
  function scrollDrop(calm) {
    function makeDrop(cls) { var d = document.createElement('div'); d.className = 'liquid is-scroll ' + cls; d.setAttribute('aria-hidden', 'true'); document.body.appendChild(d); return d; }
    var t2el = makeDrop('liquid--drop');
    var t1el = makeDrop('liquid--drop');
    var drop = makeDrop('liquid--main');
    var p = null, t1 = null, t2 = null, st = 1, stv = 0, angle = 90;
    var last = performance.now();

    // dedo na tela: a gota vai até onde o usuário está tocando
    var touchX = null, touchY = null, touchUntil = 0, pulse = 0;
    function onTouch(e) {
      var t = e.touches && e.touches[0]; if (!t) return;
      touchX = t.clientX; touchY = t.clientY;
      touchUntil = performance.now() + 1400;            // depois de soltar, fica ali um pouco e volta ao zigue-zague
    }
    window.__liquid = {
      el: drop, mobile: true, calm: calm,
      pos: function () { return p ? { x: p.x, y: p.y } : target(); },
      place: function () {},
      pop: function () { pulse = 1; }
    };
    var touching = false, lastActive = 0;
    var wasParked = true, corner = null, dirX = 1, dirY = 1;
    function active() { lastActive = performance.now(); }
    window.addEventListener('touchstart', function (e) { touching = true; active(); onTouch(e); pulse = 1; }, { passive: true });
    window.addEventListener('touchmove', function (e) { active(); onTouch(e); }, { passive: true });
    window.addEventListener('touchend', function () { touching = false; active(); touchUntil = performance.now() + 500; }, { passive: true });
    var lastSY = window.scrollY, scrollDir = 1, prevGX = null;
    window.addEventListener('scroll', function () {
      active();
      var y = window.scrollY; if (y !== lastSY) scrollDir = y > lastSY ? 1 : -1; lastSY = y;
    }, { passive: true });

    function target() {
      var size = 64, margin = size / 2 + 6;
      var navH = (document.querySelector('.nav') || { offsetHeight: 88 }).offsetHeight;
      var top = navH + size, bottom = window.innerHeight - size;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var prog = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      var ph = window.scrollY / 640;                       // a cada 640px rolados, cruza a tela
      var zig = 1 - Math.abs((ph % 2) - 1);                // 0 → 1 → 0 (zigue-zague)
      return { x: margin + zig * (window.innerWidth - margin * 2), y: top + prog * (bottom - top) };
    }
    // ponto onde o trecho atual do zigue-zague terminaria (na borda da tela)
    function legEnd() {
      var size = 64;
      var navH = (document.querySelector('.nav') || { offsetHeight: 88 }).offsetHeight;
      var top = navH + size, bottom = window.innerHeight - size;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ph = window.scrollY / 640;
      var endScroll = (dirY >= 0 ? Math.ceil(ph + 0.0001) : Math.floor(ph - 0.0001)) * 640;
      endScroll = Math.min(Math.max(endScroll, 0), Math.max(max, 0));
      var prog = max > 0 ? endScroll / max : 0;
      return { x: dirX >= 0 ? window.innerWidth - 18 : 18, y: top + prog * (bottom - top) };
    }
    function tick(now) {
      var dt = Math.min((now - last) / 1000, 1 / 30); last = now;
      var g = target();
      // rolando: lado = para onde o zigue-zague está indo; altura = sentido da rolagem
      if (!touching && now - lastActive <= 700) {
        if (prevGX !== null && Math.abs(g.x - prevGX) > 0.5) dirX = g.x > prevGX ? 1 : -1;
        dirY = scrollDir;
      }
      prevGX = g.x;
      if (touchX !== null && now < touchUntil) g = { x: touchX, y: touchY };
      // parou de rolar/tocar: a gota sai do caminho e descansa no canto inferior direito
      var parked = !touching && now - lastActive > 700;
      if (parked && !wasParked && p) {
        // escolhe o canto para onde a gota estava indo (direção do último movimento)
        corner = legEnd();
      }
      wasParked = parked;
      if (parked) g = corner || { x: window.innerWidth - 18, y: window.innerHeight - 136 };
      drop.classList.toggle('is-parked', parked);
      if (!p) { p = { x: g.x, y: g.y, vx: 0, vy: 0 }; t1 = { x: g.x, y: g.y }; t2 = { x: g.x, y: g.y }; }
      if (calm) { p.x = g.x; p.y = g.y; p.vx = p.vy = 0; }
      else {
        p.vx += ((g.x - p.x) * 90 - p.vx * 16) * dt;
        p.vy += ((g.y - p.y) * 90 - p.vy * 16) * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
      }
      var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 30) {
        var ta = Math.atan2(p.vy, p.vx) * 180 / Math.PI;
        angle += ((((ta - angle + 540) % 360) - 180)) * Math.min(1, dt * 10);
        if (!parked && touching) {
          // com o dedo: a direção é a do próprio movimento da gota
          if (Math.abs(p.vx) > 20) dirX = p.vx > 0 ? 1 : -1;
          if (Math.abs(p.vy) > 20) dirY = p.vy > 0 ? 1 : -1;
        }
      }
      var want = calm ? 1 : 1 + Math.min(speed / 1600, 0.6);
      stv += ((want - st) * 240 - stv * 12) * dt;
      st += stv * dt;
      var sy = 1 / Math.sqrt(Math.max(st, 0.6));
      // ao tocar, a gota "pulsa" de leve, como uma gota caindo
      pulse = calm ? 0 : Math.max(0, pulse - dt * 2.5);
      var bump = 1 + Math.sin((1 - pulse) * Math.PI) * 0.18 * (pulse > 0 ? 1 : 0);
      drop.style.transform = 'translate3d(' + p.x.toFixed(2) + 'px,' + p.y.toFixed(2) + 'px,0) rotate(' + angle.toFixed(2) + 'deg) scale(' + (st * bump).toFixed(4) + ',' + (sy * bump).toFixed(4) + ')';

      var f1 = 1 - Math.pow(0.0015, dt), f2 = 1 - Math.pow(0.004, dt);
      t1.x += (p.x - t1.x) * f1; t1.y += (p.y - t1.y) * f1;
      t2.x += (t1.x - t2.x) * f2; t2.y += (t1.y - t2.y) * f2;
      var vis = calm ? 0 : Math.min(speed / 700, 1);
      t1el.style.transform = 'translate3d(' + t1.x.toFixed(2) + 'px,' + t1.y.toFixed(2) + 'px,0) scale(' + (0.42 + vis * 0.18).toFixed(3) + ')';
      t2el.style.transform = 'translate3d(' + t2.x.toFixed(2) + 'px,' + t2.y.toFixed(2) + 'px,0) scale(' + (0.26 + vis * 0.12).toFixed(3) + ')';

      var hide = document.documentElement.classList.contains('menu-open');
      [drop, t1el, t2el].forEach(function (d) { d.classList.toggle('is-on', !hide); });
      t1el.style.setProperty('--lq-vis', hide ? 0 : vis.toFixed(3));
      t2el.style.setProperty('--lq-vis', hide ? 0 : (vis * 0.85).toFixed(3));
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    liquidArrive();
  }

  // ===== Estouro: a gota se espalha em gotinhas e se reconstrói =====
  function liquidBurst(cx, cy, opts) {
    var L = window.__liquid; if (!L || L.calm) return;
    opts = opts || {};
    L.el.classList.add('is-burst');
    var n = 12, bits = [];
    for (var i = 0; i < n; i++) {
      var el = document.createElement('div');
      el.className = 'liquid liquid--bit is-on' + (L.mobile ? ' is-scroll' : '');
      el.setAttribute('aria-hidden', 'true');
      var size = 10 + Math.random() * 20;
      el.style.setProperty('--lq-size', size.toFixed(1) + 'px');
      var a = (i / n) * Math.PI * 2 + Math.random() * 0.5;
      var b = { el: el, x: cx, y: cy, vx: 0, vy: 0 };
      if (opts.scatter) {           // chegando de outra página: começa espalhada e se junta
        var r = 70 + Math.random() * 110;
        b.x = cx + Math.cos(a) * r; b.y = cy + Math.sin(a) * r;
      } else {                      // clique: explode para fora
        var sp = 420 + Math.random() * 520;
        b.vx = Math.cos(a) * sp; b.vy = Math.sin(a) * sp;
      }
      el.style.transform = 'translate3d(' + b.x + 'px,' + b.y + 'px,0)';
      document.body.appendChild(el); bits.push(b);
    }
    var explode = opts.scatter ? 0 : 0.34, t0 = performance.now(), last = t0;
    function step(now) {
      var dt = Math.min((now - last) / 1000, 1 / 30); last = now;
      var el = (now - t0) / 1000, home = L.pos(), done = true;
      bits.forEach(function (b, k) {
        if (el < explode) {
          var drag = Math.pow(0.015, dt);
          b.vx *= drag; b.vy = b.vy * drag + 520 * dt;     // freia e cai um pouco, como respingo
        } else {
          var K = 70 + k * 4, D = 13;                        // cada gotinha volta num ritmo diferente
          b.vx += ((home.x - b.x) * K - b.vx * D) * dt;
          b.vy += ((home.y - b.y) * K - b.vy * D) * dt;
          if (Math.abs(home.x - b.x) + Math.abs(home.y - b.y) > 10) done = false;
        }
        b.x += b.vx * dt; b.y += b.vy * dt;
        var shrink = el < explode ? 1 : Math.max(0.35, Math.min(1, (Math.abs(home.x - b.x) + Math.abs(home.y - b.y)) / 60));
        b.el.style.transform = 'translate3d(' + b.x.toFixed(1) + 'px,' + b.y.toFixed(1) + 'px,0) scale(' + shrink.toFixed(3) + ')';
      });
      if (el < explode) done = false;
      if (done || el > 2.2) {
        bits.forEach(function (b) { b.el.remove(); });
        L.el.classList.remove('is-burst');
        L.pop();
        return;
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // chegando de outra página do site: a gota se reconstrói onde o clique aconteceu
  function liquidArrive() {
    var data = null;
    try { data = JSON.parse(sessionStorage.getItem('liquid-rebuild') || 'null'); sessionStorage.removeItem('liquid-rebuild'); } catch (e) {}
    if (!data || Date.now() - data.t > 6000 || !window.__liquid || window.__liquid.calm) return;
    var x = Math.min(Math.max(data.x, 0), window.innerWidth), y = Math.min(Math.max(data.y, 0), window.innerHeight);
    window.__liquid.place(x, y);
    liquidBurst(x, y, { scatter: true });
  }

  // clique/toque em qualquer lugar: estoura
  document.addEventListener('pointerdown', function (e) {
    if (e.button !== 0 || !window.__liquid) return;
    liquidBurst(e.clientX, e.clientY);
  }, { passive: true });

  // link para outra página do site: estoura, troca de página e se reconstrói lá
  document.addEventListener('click', function (e) {
    var L = window.__liquid;
    if (!L || L.calm || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.hasAttribute('download') || (a.target && a.target !== '_self')) return;
    var url; try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return;  // só âncora na mesma página
    e.preventDefault();
    var pt = (e.clientX || e.clientY) ? { x: e.clientX, y: e.clientY } : L.pos();
    try { sessionStorage.setItem('liquid-rebuild', JSON.stringify({ x: pt.x, y: pt.y, t: Date.now() })); } catch (err) {}
    if (!(e.clientX || e.clientY)) liquidBurst(pt.x, pt.y);   // clique pelo teclado
    setTimeout(function () { location.href = url.href; }, 420);
  }, true);

  // Ano atual
  var year = String(new Date().getFullYear());
  document.querySelectorAll('[data-ano]').forEach(function (el) { el.textContent = year; });
})();
