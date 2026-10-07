(function () {
  var root = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');
  var metaTheme = document.querySelector('meta[name="theme-color"]');

  // ----- Tema claro / escuro -----
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var isLight = theme === 'light';
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(isLight));
      toggle.setAttribute('aria-label', isLight ? 'Ativar modo escuro' : 'Ativar modo claro');
    }
    if (metaTheme) metaTheme.setAttribute('content', isLight ? '#F6F5F2' : '#0D0D0D');
  }

  applyTheme(root.getAttribute('data-theme') || 'dark');

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem('tema', next); } catch (e) {}
    });
  }

  // ----- Navegação: fundo ao rolar -----
  var nav = document.querySelector('.nav');
  function onScroll() { if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ----- Link ativo conforme a seção visível -----
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));
  var map = { topo: 'topo', trabalhos: 'trabalhos', sobre: 'sobre', processo: 'processo', formacao: 'processo', redes: 'contato', contato: 'contato' };
  if ('IntersectionObserver' in window && links.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var target = map[entry.target.id] || 'topo';
        links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + target); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['trabalhos', 'sobre', 'processo', 'formacao', 'redes', 'contato'].forEach(function (id) {
      var el = document.getElementById(id); if (el) io.observe(el);
    });
    var hero = document.querySelector('.hero');
    if (hero) { hero.id = hero.id || 'inicio'; map[hero.id] = 'topo'; io.observe(hero); }
  }

  // ----- Ano atual -----
  var year = String(new Date().getFullYear());
  document.querySelectorAll('[data-ano]').forEach(function (el) { el.textContent = year; });
})();
