/* =========================================================
   ACESSIBILIDADE — aumentar texto e imagens
   Este arquivo é carregado no <head> para aplicar a escolha
   salva ANTES da página aparecer (sem "piscar").
   ========================================================= */
/* Transição entre páginas: se a página anterior pediu, já começa "coberta" e é revelada pelo CSS */
try {
  if (sessionStorage.getItem("bh_trans") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("bh-enter");
  }
  sessionStorage.removeItem("bh_trans");
} catch (e) { /* tudo bem */ }

(function () {
  var NIVEIS_TEXTO = [1, 1.15, 1.3, 1.5, 1.75];   // 100% a 175%
  var NIVEIS_IMG   = [1, 1.25, 1.5, 1.75, 2];     // 100% a 200%
  var KEY_TEXTO = "bh_texto";
  var KEY_IMG = "bh_imagens";

  function ler(chave) {
    try {
      var v = parseInt(localStorage.getItem(chave), 10);
      return isNaN(v) ? 0 : v;
    } catch (e) { return 0; }
  }
  function salvar(chave, valor) {
    try { localStorage.setItem(chave, String(valor)); } catch (e) { /* tudo bem */ }
  }

  var estado = {
    texto: Math.min(Math.max(ler(KEY_TEXTO), 0), NIVEIS_TEXTO.length - 1),
    img: Math.min(Math.max(ler(KEY_IMG), 0), NIVEIS_IMG.length - 1)
  };

  function aplicar() {
    var raiz = document.documentElement;
    raiz.style.setProperty("--text-scale", NIVEIS_TEXTO[estado.texto]);
    raiz.style.setProperty("--img-scale", NIVEIS_IMG[estado.img]);
  }
  aplicar();

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("a11yBtn");
    var painel = document.getElementById("a11yPanel");
    if (!btn || !painel) return;

    var el = {
      tMenos: document.getElementById("textDown"), tMais: document.getElementById("textUp"), tVal: document.getElementById("textValue"),
      iMenos: document.getElementById("imgDown"), iMais: document.getElementById("imgUp"), iVal: document.getElementById("imgValue"),
      reset: document.getElementById("a11yReset")
    };

    function pintar() {
      el.tVal.textContent = Math.round(NIVEIS_TEXTO[estado.texto] * 100) + "%";
      el.iVal.textContent = Math.round(NIVEIS_IMG[estado.img] * 100) + "%";
      el.tMenos.disabled = estado.texto === 0;
      el.tMais.disabled = estado.texto === NIVEIS_TEXTO.length - 1;
      el.iMenos.disabled = estado.img === 0;
      el.iMais.disabled = estado.img === NIVEIS_IMG.length - 1;
    }
    function mudar(qual, passo) {
      var lista = qual === "texto" ? NIVEIS_TEXTO : NIVEIS_IMG;
      estado[qual] = Math.min(Math.max(estado[qual] + passo, 0), lista.length - 1);
      salvar(qual === "texto" ? KEY_TEXTO : KEY_IMG, estado[qual]);
      aplicar(); pintar();
    }

    el.tMenos.addEventListener("click", function () { mudar("texto", -1); });
    el.tMais.addEventListener("click", function () { mudar("texto", 1); });
    el.iMenos.addEventListener("click", function () { mudar("img", -1); });
    el.iMais.addEventListener("click", function () { mudar("img", 1); });
    el.reset.addEventListener("click", function () {
      estado.texto = 0; estado.img = 0;
      salvar(KEY_TEXTO, 0); salvar(KEY_IMG, 0);
      aplicar(); pintar();
    });

    function abrir(abrirPainel) {
      painel.hidden = !abrirPainel;
      btn.setAttribute("aria-expanded", String(abrirPainel));
    }
    btn.addEventListener("click", function (e) { e.stopPropagation(); abrir(painel.hidden); });
    painel.addEventListener("click", function (e) { e.stopPropagation(); });
    document.addEventListener("click", function () { abrir(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !painel.hidden) { abrir(false); btn.focus(); }
    });

    pintar();
  });
})();
