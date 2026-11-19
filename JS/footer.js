/* =========================================================
   RODAPÉ ÚNICO — vale para TODAS as páginas.
   Para mudar o rodapé (links, e-mail, redes sociais), edite só aqui.
   Cada página só tem <footer class="footer" id="siteFooter"></footer>
   e carrega este arquivo ANTES do i18n.js (para a tradução pegar o rodapé).
   ========================================================= */
(function () {
  var CFG = window.BH_CONFIG || { email: "blackhole@gmail.com", instagram: "#", facebook: "#" };

  /* As redes sociais e os contatos vêm do arquivo JS/config.js */
  var REDES = [
    { nome: "Instagram", url: CFG.instagram, icone: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>' },
    { nome: "Facebook",  url: CFG.facebook,  icone: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>' }
  ];

  var ICONE_EMAIL = '<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><polyline points="22,6 12,13 2,6"/>';
  var ICONE_LOCAL = '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>';

  function svg(conteudo) {
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + conteudo + '</svg>';
  }

  var rodape = document.getElementById("siteFooter");
  if (!rodape) return;

  var pagina = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  function atual(arquivo) { return pagina === arquivo ? ' aria-current="page"' : ""; }

  /* Só mostra a rede social que já tem link preenchido em JS/config.js */
  REDES = REDES.filter(function (r) { return r.url && r.url !== "#"; });
  var redes = REDES.map(function (r) {
    return '<a class="social-link" href="' + r.url + '" aria-label="' + r.nome + '" target="_blank" rel="noopener noreferrer">' + svg(r.icone) + '</a>';
  }).join("");

  /* A página de contatos também mostra as redes sociais: usa a mesma lista */
  var redesContato = document.getElementById("ctSocial");
  if (redesContato) {
    redesContato.innerHTML = redes;
    if (!redes && redesContato.parentElement) redesContato.parentElement.hidden = true;
  }

  rodape.innerHTML =
    '<div class="wrap footer-grid">' +

      '<div class="footer-brand">' +
        '<a class="footer-logo" href="index.html" data-i18n-aria="f_home_aria" aria-label="Black Hole — página inicial">' +
          '<img src="IMG/Logo Black Holeversao branca.png" alt="Black Hole">' +
        '</a>' +
        '<p data-i18n="f_tagline">Transformamos ideias complexas em experiências visuais e digitais.</p>' +
        (redes ? '<div class="social" role="group" data-i18n-aria="f_social" aria-label="Redes sociais">' + redes + '</div>' : '') +
      '</div>' +

      '<nav class="footer-col" data-i18n-aria="aria_footer" aria-label="Rodapé">' +
        '<h3 data-i18n="f_nav">Navegação</h3>' +
        '<ul>' +
          '<li><a href="index.html"' + atual("index.html") + ' data-i18n="footer_home">Início</a></li>' +
          '<li><a href="historia.html"' + atual("historia.html") + ' data-i18n="footer_hist">História</a></li>' +
          '<li><a href="integrantes.html"' + atual("integrantes.html") + ' data-i18n="footer_team">Integrantes</a></li>' +
          '<li><a href="contatos.html"' + atual("contatos.html") + ' data-i18n="footer_contact">Contatos</a></li>' +
        '</ul>' +
      '</nav>' +

      '<div class="footer-col">' +
        '<h3 data-i18n="np_g2">Conheça mais</h3>' +
        '<ul>' +
          '<li><a href="servicos.html"' + atual("servicos.html") + ' data-i18n="np_serv_t">Serviços</a></li>' +
          '<li><a href="ouro-do-norte.html"' + atual("ouro-do-norte.html") + ' data-i18n="np_ouro_t">Ouro do Norte</a></li>' +
          '<li><a href="bastidores.html"' + atual("bastidores.html") + ' data-i18n="np_back_t">Bastidores</a></li>' +
        '</ul>' +
      '</div>' +

      '<div class="footer-col footer-news">' +
        '<h3 data-i18n="f_news_t">Inscrição demonstrativa</h3>' +
        '<p data-i18n="f_news_p">Formulário demonstrativo: seu e-mail não é enviado nem armazenado.</p>' +
        '<form class="news-form" id="newsForm" novalidate>' +
          '<label class="sr-only" for="newsEmail" data-i18n="f_news_label">Seu e-mail para receber novidades</label>' +
          '<input id="newsEmail" type="email" autocomplete="email" required placeholder="Seu e-mail" data-i18n-placeholder="f_news_ph">' +
          '<button type="submit" data-i18n="f_news_btn">Validar e-mail</button>' +
        '</form>' +
        '<p class="news-status" id="newsStatus" role="status" aria-live="polite"></p>' +
        '<ul class="footer-contact">' +
          '<li>' + svg(ICONE_LOCAL) + '<span data-i18n="ct_addr_v">Vila Olímpia, São Paulo – SP</span></li>' +
          '<li>' + svg(ICONE_EMAIL) + '<a href="mailto:' + CFG.email + '" data-bh="email">' + CFG.email + '</a></li>' +
        '</ul>' +
      '</div>' +

    '</div>' +

    '<div class="footer-bottom">' +
      '<div class="wrap">' +
        '<p data-i18n="footer_rights">© 2026 Black Hole. Todos os direitos reservados.</p>' +
        '<a class="to-top" href="#top" data-i18n="f_top">Voltar ao topo</a>' +
      '</div>' +
    '</div>';

  /* Newsletter demonstrativa: valida o e-mail sem enviá-lo ou armazená-lo. */
  var form = document.getElementById("newsForm");
  var status = document.getElementById("newsStatus");
  var campo = document.getElementById("newsEmail");
  function msg(chave, padrao) { return (window.BH && window.BH.t(chave)) || padrao; }
  if (form) {
    campo.addEventListener("input", function () {
      if (campo.checkValidity()) {
        campo.removeAttribute("aria-invalid");
        status.classList.remove("erro");
        status.textContent = "";
      }
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!campo.value.trim() || !campo.checkValidity()) {
        campo.focus();
        campo.setAttribute("aria-invalid", "true");
        status.textContent = msg("f_news_err", "Informe um e-mail válido.");
        status.classList.add("erro");
        return;
      }
      campo.removeAttribute("aria-invalid");
      status.classList.remove("erro");
      status.textContent = msg("f_news_local", "E-mail válido. Nenhum dado foi enviado ou armazenado.");
      form.reset();
    });
  }
})();
