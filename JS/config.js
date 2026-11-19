/* Dados de contato da Black Hole */
window.BH_CONFIG = {
  email: "blackhole@gmail.com",
  telefone: "(11) 98764-5554",
  instagram: "#",
  facebook: "#"
};

window.BH_CONTACTS = {
  /* Preenche os links de e-mail e telefone a partir dos dados acima. */
  preencher: function () {
    var c = window.BH_CONFIG;
    document.querySelectorAll("[data-bh]").forEach(function (el) {
      var tipo = el.dataset.bh;
      if (tipo === "email") { el.textContent = c.email; el.setAttribute("href", "mailto:" + c.email); }
      if (tipo === "telefone") {
        el.textContent = c.telefone;
        el.setAttribute("href", "tel:+55" + c.telefone.replace(/\D/g, ""));
      }
    });
  }
};
