/* =========================================================
   BLACK HOLE — comportamentos gerais
   (cabeçalho, menu do celular, estrelas, vídeo e ampliação de imagens)
   ========================================================= */

const t = (chave, padrao) =>
  (window.BH && window.BH.t(chave)) || padrao;

/* ---------- Cabeçalho muda ao rolar ---------- */
const topbar = document.querySelector(".topbar");
function atualizarCabecalho() {
  if (topbar) topbar.classList.toggle("scrolled", window.scrollY > 35);
}
atualizarCabecalho();
window.addEventListener("scroll", atualizarCabecalho, { passive: true });

/* ---------- Menu do celular ---------- */
const nav = document.getElementById("topbarNav");
const menuToggle = document.getElementById("menuToggle");

function definirMenu(aberto) {
  nav.classList.toggle("open", aberto);
  menuToggle.textContent = aberto ? "✕" : "☰";
  menuToggle.setAttribute("aria-expanded", String(aberto));
  menuToggle.setAttribute(
    "aria-label",
    aberto ? t("menu_close", "Fechar menu") : t("menu_open", "Abrir menu")
  );
}
if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => definirMenu(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => definirMenu(false)));
  document.addEventListener("langchange", () => definirMenu(nav.classList.contains("open")));
}

/* ---------- Estrelas do fundo ---------- */
const starfield = document.getElementById("starfield");
const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (starfield) {
  const quantidade = window.innerWidth < 700 ? 95 : 180;
  for (let i = 0; i < quantidade; i++) {
    const star = document.createElement("span");
    star.className = "star";
    const tamanho = Math.random() * 2.1 + 0.35;
    star.style.width = `${tamanho}px`;
    star.style.height = `${tamanho}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty("--duration", `${2.5 + Math.random() * 5}s`);
    star.style.animationDelay = `${Math.random() * -6}s`;
    star.style.opacity = `${0.25 + Math.random() * 0.7}`;
    starfield.appendChild(star);
  }
}

/* ---------- Vídeo do buraco negro: botão de pausar ---------- */
const video = document.getElementById("bhVideo");
const videoToggle = document.getElementById("videoToggle");

if (video && videoToggle) {
  const rotulo = () => {
    const tocando = !video.paused;
    videoToggle.querySelector("[data-state]").textContent = tocando ? "❚❚" : "▶";
    videoToggle.querySelector("[data-label]").textContent = tocando
      ? t("video_pause", "Pausar vídeo")
      : t("video_play", "Reproduzir vídeo");
  };
  if (reduzMovimento) video.pause();   // respeita quem pediu menos movimento
  videoToggle.addEventListener("click", () => {
    if (video.paused) video.play(); else video.pause();
  });
  video.addEventListener("play", rotulo);
  video.addEventListener("pause", rotulo);
  document.addEventListener("langchange", rotulo);
  rotulo();
}

/* ---------- Ampliar imagem em tela cheia ---------- */
const lightbox = document.getElementById("lightbox");

if (lightbox) {
  const imgGrande = lightbox.querySelector("img");
  const titulo = lightbox.querySelector(".lb-title");
  const valor = lightbox.querySelector("[data-lb-value]");
  const NIVEIS = [100, 150, 200, 300, 400];
  let nivel = 0;

  function aplicarNivel() {
    imgGrande.style.width = NIVEIS[nivel] + "%";
    valor.textContent = NIVEIS[nivel] + "%";
    lightbox.querySelector("[data-lb='out']").disabled = nivel === 0;
    lightbox.querySelector("[data-lb='in']").disabled = nivel === NIVEIS.length - 1;
  }

  document.querySelectorAll(".zoom-open").forEach(botao => {
    botao.addEventListener("click", () => {
      const origem = botao.querySelector("img");
      imgGrande.src = origem.currentSrc || origem.src;
      imgGrande.alt = origem.alt;
      titulo.textContent = origem.alt;
      nivel = 0;
      aplicarNivel();
      lightbox.showModal();
    });
  });

  lightbox.querySelector("[data-lb='in']").addEventListener("click", () => { nivel = Math.min(nivel + 1, NIVEIS.length - 1); aplicarNivel(); });
  lightbox.querySelector("[data-lb='out']").addEventListener("click", () => { nivel = Math.max(nivel - 1, 0); aplicarNivel(); });
  lightbox.querySelector("[data-lb='close']").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", e => { if (e.target === lightbox) lightbox.close(); });
}

/* ---------- Galeria em carrossel infinito ---------- */
const carrossel = document.getElementById("carousel");
const trilho = document.getElementById("carouselTrack");
const carrosselBtn = document.getElementById("carouselToggle");

if (carrossel && trilho) {
  // Duplica os slides: quando a primeira metade sai da tela, a cópia ocupa o lugar e o laço recomeça sem emenda.
  if (!reduzMovimento) {
    Array.from(trilho.children).forEach(slide => {
      const copia = slide.cloneNode(true);
      copia.setAttribute("aria-hidden", "true");
      trilho.appendChild(copia);
    });
  }
  if (carrosselBtn) {
    const rotuloGaleria = () => {
      const parado = carrossel.classList.contains("paused");
      carrosselBtn.setAttribute("aria-pressed", String(parado));
      carrosselBtn.querySelector("[data-state]").textContent = parado ? "▶" : "❚❚";
      carrosselBtn.querySelector("[data-label]").textContent = parado
        ? t("gal_play", "Retomar galeria")
        : t("gal_pause", "Pausar galeria");
    };
    carrosselBtn.addEventListener("click", () => { carrossel.classList.toggle("paused"); rotuloGaleria(); });
    document.addEventListener("langchange", rotuloGaleria);
    rotuloGaleria();
  }
}

/* ---------- Página de contatos: formulário demonstrativo ---------- */
const formContato = document.getElementById("contactForm");

if (formContato) {
  const aviso = document.getElementById("ctStatus");
  const obrigatorios = formContato.querySelectorAll("[required]");

  const mostrar = (texto, erro) => {
    aviso.textContent = texto;
    aviso.classList.toggle("erro", Boolean(erro));
  };

  // links como contatos.html?assunto=orcamento já chegam com o assunto preenchido
  const parametro = new URLSearchParams(location.search).get("assunto");
  if (parametro === "orcamento") document.getElementById("ctAssunto").value = t("ct_subject_budget", "Pedido de orçamento");

  obrigatorios.forEach(campo =>
    campo.addEventListener("input", () => { if (campo.checkValidity()) campo.removeAttribute("aria-invalid"); })
  );

  formContato.addEventListener("submit", e => {
    e.preventDefault();
    let primeiroErro = null;
    obrigatorios.forEach(campo => {
      const ok = campo.value.trim() !== "" && campo.checkValidity();
      if (ok) campo.removeAttribute("aria-invalid");
      else campo.setAttribute("aria-invalid", "true");
      if (!ok && !primeiroErro) primeiroErro = campo;
    });
    if (primeiroErro) {
      mostrar(t("ct_err", "Preencha nome, e-mail e mensagem para continuar."), true);
      primeiroErro.focus();
      return;
    }

    mostrar(t("ct_local", "Campos validados. A mensagem não foi enviada nem armazenada por este site."), false);
    formContato.reset();
  });
}

/* ---------- Transição entre páginas ---------- */
/* Ao clicar num link interno, um círculo escuro cresce a partir do clique e só então a página muda.
   A página nova começa coberta e "fecha" o círculo (veja acessibilidade.js e o fim do style.css). */
(function () {
  if (reduzMovimento) return;
  const raiz = document.documentElement;

  // voltar pelo botão do navegador pode trazer a página "congelada" já coberta
  window.addEventListener("pageshow", e => { if (e.persisted) raiz.classList.remove("bh-leave"); });

  document.addEventListener("click", e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html?$/i.test(url.pathname)) return;      // só páginas do próprio site
    if (url.pathname === location.pathname) return;                                      // âncora da mesma página: rolagem normal

    e.preventDefault();
    raiz.style.setProperty("--tx", (e.clientX || innerWidth / 2) + "px");
    raiz.style.setProperty("--ty", (e.clientY || innerHeight / 2) + "px");
    raiz.classList.add("bh-leave");
    try { sessionStorage.setItem("bh_trans", "1"); } catch (err) { /* tudo bem */ }
    setTimeout(() => { location.href = a.href; }, 480);
  });
})();

/* ---------- Seções aparecem ao rolar ---------- */
(function () {
  if (reduzMovimento || !("IntersectionObserver" in window)) return;
  const alvos = document.querySelectorAll(
    ".section-head, .section .grid, .steps, .stats, .project > div, .split > *, .cta-band, .feature-container > *, " +
    ".pitch, .flow > li, .sq-row, .prose > *, .rows > .row, .diag, .viewer-card, .places > *, .members-list > *, .tags, .rel-list, .faq-list, .timeline > li, .page-hero .wrap > *, .ct-card, .ct-map"
  );
  const io = new IntersectionObserver(entradas => {
    entradas.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  alvos.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.setProperty("--d", (i % 3) * 0.08 + "s");   // pequeno escalonamento
    io.observe(el);
  });
})();


/* ---------- Dados de contato (e-mail e telefone) vindos de JS/config.js ---------- */
if (window.BH_CONTACTS) {
  window.BH_CONTACTS.preencher();
  document.addEventListener("langchange", () => window.BH_CONTACTS.preencher());
}

/* ---------- Foto que não carregou: mostra as iniciais no lugar ---------- */
document.querySelectorAll(".member-photo img").forEach(img => {
  const semFoto = () => { img.parentElement.classList.add("sem-foto"); img.remove(); };
  if (img.complete && img.naturalWidth === 0) semFoto(); else img.addEventListener("error", semFoto, { once: true });
});

/* ---------- Vídeo pitch em tela cheia ----------
   <div class="pitch" data-pitch="videos/arquivo.mp4" data-fallback="videos/outro.mp4" data-poster="IMG/capa.jpg">
   Ao clicar no botão a tela fica cheia e o vídeo toca. Se o arquivo do pitch ainda não existir, toca o vídeo reserva (data-fallback). */
(function () {
  const caixas = document.querySelectorAll(".pitch[data-pitch]");
  if (!caixas.length) return;

  const janela = document.createElement("dialog");
  janela.className = "pitch-modal";
  janela.innerHTML =
    '<div class="pm-bar"><button type="button" class="vw-btn" data-pm="close"></button></div>' +
    '<video class="pm-video" controls playsinline preload="metadata"></video>';
  document.body.appendChild(janela);
  const video = janela.querySelector("video");
  const fechar = janela.querySelector('[data-pm="close"]');
  let gatilho = null;

  const rotular = () => {
    fechar.textContent = t("pitch_close", "Fechar");
    video.setAttribute("aria-label", t("pitch_label", "Vídeo pitch"));
  };
  rotular();
  document.addEventListener("langchange", rotular);

  function abrir(caixa, origem) {
    gatilho = origem;
    video.poster = caixa.dataset.poster || "";
    let tentouReserva = false;
    video.onerror = () => {
      if (!tentouReserva && caixa.dataset.fallback) { tentouReserva = true; video.src = caixa.dataset.fallback; video.play().catch(() => {}); }
    };
    video.src = caixa.dataset.pitch;
    janela.showModal();
    if (janela.requestFullscreen && !reduzMovimento) janela.requestFullscreen().catch(() => {});
    video.play().catch(() => {});
    fechar.focus();
  }
  caixas.forEach(caixa => caixa.querySelectorAll(".pitch-open").forEach(b => b.addEventListener("click", () => abrir(caixa, b))));

  fechar.addEventListener("click", () => janela.close());
  janela.addEventListener("click", e => { if (e.target === janela) janela.close(); });
  janela.addEventListener("close", () => {
    video.pause(); video.removeAttribute("src"); video.load();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    if (gatilho) gatilho.focus();
  });
  // Esc sai da tela cheia do navegador: fecha também a janela
  document.addEventListener("fullscreenchange", () => { if (!document.fullscreenElement && janela.open) janela.close(); });
})();

/* ---------- Visualizador de PDF ----------
   Para adicionar outro: crie uma entrada em DOCS e um botão <button class="viewer-card" data-viewer="nome">. */
const DOCS = {
  ouro: {
    titulo: ["vw_ouro_t", "Identidade visual — Ouro do Norte"],
    pdf: "IMG/identidade visual Ouro do Norte .pdf"
  },
  blackhole: {
    titulo: ["vw_bh_t", "Identidade visual — Black Hole"],
    pdf: "IMG/indentidade visual Black Hole.pdf"
  }
};

(function () {
  const gatilhos = document.querySelectorAll("[data-viewer]");
  if (!gatilhos.length) return;

  const janela = document.createElement("dialog");
  janela.className = "viewer";
  janela.innerHTML =
    '<div class="vw-bar">' +
      '<p class="vw-title"></p>' +
      '<div class="vw-tools">' +
        '<button type="button" class="vw-btn" data-vw="full"></button>' +
        '<a class="vw-btn" data-vw="pdf" download></a>' +
        '<button type="button" class="vw-btn" data-vw="close"></button>' +
      '</div>' +
    '</div>' +
    '<div class="vw-stage"><iframe class="vw-pdf" title="" loading="lazy"></iframe></div>';
  document.body.appendChild(janela);

  const q = s => janela.querySelector(s);
  const pdf = q(".vw-pdf");
  let doc = null, ultimoGatilho = null;

  const rotular = () => {
    q('[data-vw="full"]').textContent = t("vw_full", "Tela cheia");
    q('[data-vw="close"]').textContent = t("vw_close", "Fechar");
    const baixar = q('[data-vw="pdf"]'); baixar.textContent = t("vw_download", "Baixar PDF");
    if (doc) {
      q(".vw-title").textContent = t(doc.titulo[0], doc.titulo[1]);
      pdf.title = t(doc.titulo[0], doc.titulo[1]);
    }
  };

  const abrir = (nome, gatilho) => {
    doc = DOCS[nome]; if (!doc) return;
    ultimoGatilho = gatilho;
    q('[data-vw="pdf"]').href = doc.pdf;
    pdf.src = doc.pdf;
    rotular();
    janela.showModal();
    q('[data-vw="close"]').focus();
  };

  gatilhos.forEach(g => g.addEventListener("click", () => abrir(g.dataset.viewer, g)));
  document.addEventListener("langchange", rotular);

  janela.addEventListener("click", e => {
    const alvo = e.target.closest("[data-vw]");
    if (e.target === janela) janela.close();
    if (!alvo) return;
    const acao = alvo.dataset.vw;
    if (acao === "close") janela.close();
    if (acao === "full") {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (janela.requestFullscreen) janela.requestFullscreen().catch(() => {});
    }
  });

  janela.addEventListener("keydown", e => {
    if (e.key === "f" || e.key === "F") { e.preventDefault(); q('[data-vw="full"]').click(); }
  });

  janela.addEventListener("close", () => {
    pdf.removeAttribute("src");
    if (document.fullscreenElement) document.exitFullscreen();
    if (ultimoGatilho) ultimoGatilho.focus();
  });
})();


/* ---------- App instalável (PWA) ----------
   Só funciona com o site publicado em endereço https:// (ou no localhost). Abrindo o arquivo direto do computador, é ignorado. */
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", { scope: "./" })
      .catch(error => console.error("Não foi possível registrar o service worker:", error));
  });
}
