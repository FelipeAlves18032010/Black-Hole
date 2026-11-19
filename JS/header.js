/* =========================================================
   CABEÇALHO ÚNICO — vale para TODAS as páginas.
   Para mudar os links do menu ou do painel da História, edite só aqui.
   Cada página só tem <header class="topbar" id="siteHeader"></header>
   e carrega este arquivo ANTES do footer.js, i18n.js e script.js.

   Menu principal: Início · História · Integrantes · Contatos
   Ao passar o mouse (ou clicar na setinha, ou usar o teclado) em
   "História", abre um painel com as páginas de apoio.
   ========================================================= */
(function () {
  var cab = document.getElementById("siteHeader");
  if (!cab) return;

  var pagina = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  /* Páginas que "pertencem" à História: o item História fica sublinhado nelas */
  var FILHAS = ["historia.html", "servicos.html", "ouro-do-norte.html", "bastidores.html"];
  var naHistoria = FILHAS.indexOf(pagina) >= 0;

  function atual(arquivo) { return pagina === arquivo ? ' aria-current="page"' : ""; }

  /* ---- MENUZINHO DA HISTÓRIA: edite aqui os links (texto vem do i18n) ---- */
  var LINKS = [
    { href: "bastidores.html",    t: "np_back_t", pt: "Bastidores" },
    { href: "ouro-do-norte.html", t: "np_ouro_t", pt: "Ouro do Norte" },
    { href: "servicos.html",      t: "np_serv_t", pt: "Serviços" }
  ];
  var itens = LINKS.map(function (l) {
    return '<li><a class="dd-link" href="' + l.href + '"' + atual(l.href) + ' data-i18n="' + l.t + '">' + l.pt + '</a></li>';
  }).join("");
  var painel =
    '<ul class="nav-panel" id="panelHistoria" data-i18n-aria="np_aria" aria-label="Mais sobre a Black Hole">' + itens + '</ul>';

  cab.innerHTML =
    '<a href="index.html" class="wordmark">' +
      '<img src="IMG/Logo Black Holeversao branca.png" alt="Black Hole">' +
    '</a>' +

    '<nav class="topbar-nav" id="topbarNav" data-i18n-aria="aria_nav" aria-label="Menu principal">' +
      '<a href="index.html"' + atual("index.html") + ' data-i18n="nav_inicio">INÍCIO</a>' +

      '<div class="nav-item has-panel' + (naHistoria ? ' is-current' : '') + '" id="navHistoria">' +
        '<a href="historia.html" class="nav-link"' + atual("historia.html") + ' data-i18n="nav_historia">HISTÓRIA</a>' +
        '<button type="button" class="nav-caret" id="navCaret" aria-expanded="false" aria-controls="panelHistoria" data-i18n-aria="np_toggle" aria-label="Abrir mais páginas da História">' +
          '<svg viewBox="0 0 12 8" width="12" height="8" aria-hidden="true" focusable="false"><polyline points="1,1.5 6,6.5 11,1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</button>' +
        painel +
      '</div>' +

      '<a href="integrantes.html"' + atual("integrantes.html") + ' data-i18n="nav_integrantes">INTEGRANTES</a>' +
      '<a href="contatos.html"' + atual("contatos.html") + ' data-i18n="nav_contatos">CONTATOS</a>' +
    '</nav>' +

    '<div class="topbar-tools">' +
      /* AUMENTAR TEXTO E IMAGENS */
      '<div class="a11y">' +
        '<button class="tool-btn" id="a11yBtn" type="button" aria-expanded="false" aria-controls="a11yPanel">' +
          '<span class="aa" aria-hidden="true">Aa</span>' +
          '<span class="tool-label" data-i18n="a11y_btn">Acessibilidade</span>' +
        '</button>' +
        '<div class="a11y-panel" id="a11yPanel" role="group" aria-labelledby="a11yTitle" hidden>' +
          '<p class="panel-title" id="a11yTitle" data-i18n="a11y_title">Ajustes de leitura</p>' +
          '<div class="a11y-row">' +
            '<span data-i18n="a11y_text">Tamanho do texto</span>' +
            '<div class="stepper">' +
              '<button type="button" id="textDown" data-i18n-aria="aria_text_down" aria-label="Diminuir texto">A−</button>' +
              '<output id="textValue" aria-live="polite">100%</output>' +
              '<button type="button" id="textUp" data-i18n-aria="aria_text_up" aria-label="Aumentar texto">A+</button>' +
            '</div>' +
          '</div>' +
          '<div class="a11y-row">' +
            '<span data-i18n="a11y_img">Tamanho das imagens</span>' +
            '<div class="stepper">' +
              '<button type="button" id="imgDown" data-i18n-aria="aria_img_down" aria-label="Diminuir imagens">−</button>' +
              '<output id="imgValue" aria-live="polite">100%</output>' +
              '<button type="button" id="imgUp" data-i18n-aria="aria_img_up" aria-label="Aumentar imagens">+</button>' +
            '</div>' +
          '</div>' +
          '<button type="button" class="btn-ghost" id="a11yReset" data-i18n="a11y_reset">Restaurar padrão</button>' +
        '</div>' +
      '</div>' +

      /* TROCAR IDIOMA */
      '<div class="lang" role="group" data-i18n-aria="lang_group" aria-label="Idioma">' +
        '<button type="button" data-lang="pt" aria-pressed="true" lang="pt">PT</button>' +
        '<button type="button" data-lang="en" aria-pressed="false" lang="en">EN</button>' +
      '</div>' +

      '<button class="menu-toggle" id="menuToggle" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="topbarNav">☰</button>' +
    '</div>';

  /* ---------- Comportamento do painel ---------- */
  var item = document.getElementById("navHistoria");
  var caret = document.getElementById("navCaret");
  var link = item.querySelector(".nav-link");
  if (!item || !caret) return;

  /* No computador: abre ao passar o mouse. No celular/tablet: só ao tocar na setinha. */
  var podeHover = window.matchMedia("(hover: hover) and (min-width: 1201px)");
  var timer = null;

  function definir(aberto) {
    item.classList.toggle("open", aberto);
    caret.setAttribute("aria-expanded", String(aberto));
  }
  function abrirDepois() { clearTimeout(timer); timer = setTimeout(function () { definir(true); }, 60); }
  function fecharDepois() { clearTimeout(timer); timer = setTimeout(function () { definir(false); }, 220); }

  item.addEventListener("mouseenter", function () { if (podeHover.matches) abrirDepois(); });
  item.addEventListener("mouseleave", function () { if (podeHover.matches) fecharDepois(); });

  caret.addEventListener("click", function (e) {
    e.stopPropagation();
    clearTimeout(timer);
    definir(!item.classList.contains("open"));
  });

  /* Teclado: Esc fecha; sair do painel com Tab também fecha */
  item.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && item.classList.contains("open")) { definir(false); caret.focus(); }
  });
  item.addEventListener("focusout", function (e) {
    if (!item.contains(e.relatedTarget)) definir(false);
  });

  /* Clicar fora fecha */
  document.addEventListener("click", function (e) { if (!item.contains(e.target)) definir(false); });

  /* Ao rolar a página o painel fecha, para não ficar por cima do conteúdo */
  window.addEventListener("scroll", function () { if (item.classList.contains("open") && podeHover.matches) definir(false); }, { passive: true });

  /* Clicou num link do painel: a página vai mudar, então fecha */
  item.querySelectorAll(".nav-panel a").forEach(function (a) { a.addEventListener("click", function () { definir(false); }); });

  void link;
})();
