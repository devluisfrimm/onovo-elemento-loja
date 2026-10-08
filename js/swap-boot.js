/*
  Roda no <head>, antes do corpo da página aparecer:
  1) define a seção (feminino/masculino) usada pelo tema de cores — as
     páginas de catálogo já declaram <html data-gender="...">; nas demais
     (produto, carrinho...) vale a última seção visitada;
  2) se acabamos de chegar de uma troca Feminino/Masculino, marca o <html>
     com data-arrived (o CSS desliga a animação de entrada das legendas dos
     heros, já concluída na camada) e data-fresh (os blocos .reveal que já
     estavam na tela entram sem fade; removido ~2s depois). No modo "veil"
     (plano B, quando a página nova não deu tempo de pré-carregar), também
     esconde o corpo sobre um fundo dourado até a transição assumir.
*/
(function () {
  var root = document.documentElement;

  try {
    if (!root.getAttribute("data-gender")) {
      var g = localStorage.getItem("one_gender");
      root.setAttribute("data-gender", g === "masc" ? "masc" : "fem");
    }
  } catch (e) {
    if (!root.getAttribute("data-gender")) root.setAttribute("data-gender", "fem");
  }

  try {
    var raw = sessionStorage.getItem("one_swap");
    if (!raw) return;
    var info = JSON.parse(raw);
    if (!info || Date.now() - info.t > 8000) {
      sessionStorage.removeItem("one_swap");
      return;
    }
    root.setAttribute("data-arrived", "1");
    root.setAttribute("data-fresh", "1");
    if (info.mode === "veil") {
      var style = document.createElement("style");
      style.id = "swap-boot-style";
      style.textContent = "html{background:#f1deaa!important}body{visibility:hidden!important}";
      document.head.appendChild(style);
      root.setAttribute("data-veil", String(info.dir));
    }
  } catch (e) {}
})();
