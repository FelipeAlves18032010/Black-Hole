const VERSAO = "bh-v9";
const ARQUIVOS = [
  "./", "index.html", "historia.html", "servicos.html", "ouro-do-norte.html", "bastidores.html", "integrantes.html", "contatos.html",
  "CSS/style.css", "CSS/Contatos.css", "CSS/integrantes.css",
  "JS/acessibilidade.js", "JS/config.js", "JS/textos.js", "JS/header.js", "JS/footer.js", "JS/i18n.js", "JS/script.js",
  "IMG/Campnha fotos.png", "IMG/Felipe.png", "IMG/Icon Black Hole.png", "IMG/Logo Black Hole 2.png", "IMG/Logo Black Hole.png",
  "IMG/Logo Black Holeversao branca.png", "IMG/Logo Ouro do Norte.png", "IMG/Lucas.png", "IMG/ODN-ETQ-96889020.png",
  "IMG/etiqueta.png", "IMG/favicon.png", "IMG/icone.png", "IMG/poster-buraco-negro.jpg",
  "IMG/web1.png", "IMG/web2.png", "IMG/web3.png", "IMG/web4.png", "IMG/web5.png", "IMG/web6.png", "IMG/web7.png",
  "IMG/identidade/blackhole-1.jpg", "IMG/identidade/ouro-1.jpg", "IMG/identidade/ouro-2.jpg",
  "IMG/identidade/ouro-3.jpg", "IMG/identidade/ouro-4.jpg", "IMG/identidade/ouro-5.jpg", "IMG/identidade/ouro-6.jpg",
  "IMG/diagramas/der-banco-de-dados.png", "IMG/diagramas/dfd-contexto.png", "IMG/diagramas/dfd-nivel-0.png",
  "IMG/diagramas/diagrama-de-classes.png", "IMG/diagramas/uml-casos-de-uso.png",
  "IMG/identidade visual Ouro do Norte .pdf", "IMG/indentidade visual Black Hole.pdf",
  "IMG/pesquisa/Casa do norte climax.png", "IMG/pesquisa/nordestina.png", "IMG/pesquisa/zez%C3%A3o.png",
  "manifest.webmanifest", "IMG/pwa/apple-touch-icon.png", "IMG/pwa/icon-192.png", "IMG/pwa/icon-512.png",
  "IMG/pwa/icon-maskable-512.png"
].map(arquivo => new URL(arquivo, self.registration.scope).href);

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(VERSAO)
      .then(cache => cache.addAll(ARQUIVOS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(chaves => Promise.all(chaves
        .filter(chave => chave.startsWith("bh-") && chave !== VERSAO)
        .map(chave => caches.delete(chave))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const requisicao = event.request;
  if (requisicao.method !== "GET") return;

  const url = new URL(requisicao.url);
  if (url.origin !== self.location.origin || /\.(mp4|webm)$/i.test(url.pathname)) return;

  event.respondWith(
    fetch(requisicao)
      .then(resposta => {
        if (resposta.ok) {
          const copia = resposta.clone();
          caches.open(VERSAO)
            .then(cache => cache.put(requisicao, copia))
            .catch(erro => console.error("Não foi possível guardar a resposta no cache:", erro));
        }
        return resposta;
      })
      .catch(async () => {
        const guardada = await caches.match(requisicao, { ignoreSearch: true });
        if (guardada) return guardada;

        if (requisicao.mode === "navigate") {
          const inicio = await caches.match(new URL("index.html", self.registration.scope).href);
          if (inicio) return inicio;
        }

        return new Response("", { status: 504, statusText: "Offline" });
      })
  );
});
