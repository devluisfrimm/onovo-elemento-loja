/*
  Troca entre as seções Feminino e Masculino.

  - Monta o seletor "Feminino | Masculino" logo abaixo da navbar (em todas
    as páginas) e mantém os links "Catálogo" apontando pra seção atual.
  - A página de destino é pré-carregada numa camada invisível (iframe do
    mesmo site). Ao trocar de seção, essa camada é revelada por uma máscara
    de DEGRADÊ vertical: a seção atual vai sumindo enquanto a outra aparece
    (de cima pra baixo indo pro Masculino, de baixo pra cima voltando pro
    Feminino). Junto da borda do degradê corre uma luz dourada com
    sparkles. No fim, o navegador abre a página de verdade — idêntica à
    camada — e um resto de brilho se apaga.
  - Plano B: se a página nova não carregar a tempo, o degradê revela uma
    superfície dourada e, na chegada, ela sai pelo mesmo caminho.
  - Respeita prefers-reduced-motion: sem animação, troca direto.
*/
(function () {
  "use strict";

  var SWAP_KEY = "one_swap";
  var GENDER_KEY = "one_gender";
  var PAGES = { fem: "index.html", masc: "masculino.html" };
  var WIPE_MS = 620; // degradê entre as páginas
  var VEIL_MS = 420; // plano B (superfície dourada)
  var FRAME_WAIT_MS = 1000; // quanto esperar a página de destino carregar
  var GRAD_TOP = "linear-gradient(to bottom,#000 0%,#000 41.667%,transparent 58.333%,transparent 100%)";
  var GRAD_BOTTOM = "linear-gradient(to bottom,transparent 0%,transparent 41.667%,#000 58.333%,#000 100%)";
  var STAR_COLORS = ["255,246,214", "247,214,120", "222,172,64"];

  var inFrame = window.self !== window.top;
  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var maskOk = !!(
    window.CSS &&
    CSS.supports &&
    (CSS.supports("mask-image", "linear-gradient(#000,transparent)") ||
      CSS.supports("-webkit-mask-image", "linear-gradient(#000,transparent)"))
  );
  var root = document.documentElement;
  var currentGender = root.getAttribute("data-gender") === "masc" ? "masc" : "fem";
  var busy = false;
  var main = null; // camada principal (com a página de destino pré-carregada)
  var preload = { gender: null, loaded: false };
  var sprites = null;

  /* ---------------- util ---------------- */

  function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
  }

  function clamp01(x) {
    return x < 0 ? 0 : x > 1 ? 1 : x;
  }

  function saveGender(g) {
    try {
      localStorage.setItem(GENDER_KEY, g);
    } catch (e) {}
  }

  /* ---------------- seletor Feminino | Masculino ---------------- */

  function buildBar() {
    var header = document.querySelector(".site-header");
    if (!header || header.querySelector(".gender-bar")) return;

    var bar = document.createElement("div");
    bar.className = "gender-bar";
    bar.innerHTML =
      '<div class="gender-switch" role="group" aria-label="Escolher seção da loja" data-gender="' +
      currentGender +
      '">' +
      '<span class="gender-switch__thumb" aria-hidden="true"></span>' +
      '<a class="gender-switch__opt" href="' + PAGES.fem + '" data-gender-link="fem">Feminino</a>' +
      '<a class="gender-switch__opt" href="' + PAGES.masc + '" data-gender-link="masc">Masculino</a>' +
      "</div>";

    var nav = header.querySelector(".nav");
    if (nav) nav.insertAdjacentElement("afterend", bar);
    else header.appendChild(bar);
  }

  function applyGender(g) {
    currentGender = g === "masc" ? "masc" : "fem";
    root.setAttribute("data-gender", currentGender);

    var sw = document.querySelector(".gender-switch");
    if (sw) {
      sw.setAttribute("data-gender", currentGender);
      sw.querySelectorAll("[data-gender-link]").forEach(function (a) {
        var on = a.getAttribute("data-gender-link") === currentGender;
        if (on) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }

    // Links de "catálogo" (logo, menu, voltar, rodapé) levam pra seção atual.
    document.querySelectorAll("a").forEach(function (a) {
      if (a.hasAttribute("data-gender-link")) return;
      var h = a.getAttribute("href");
      if (h === PAGES.fem || h === PAGES.masc) a.setAttribute("href", PAGES[currentGender]);
    });
  }

  /* ---------------- sparkles (sprites pré-desenhados) ---------------- */

  function starSprite(c) {
    var S = 96;
    var cv = document.createElement("canvas");
    cv.width = cv.height = S;
    var g = cv.getContext("2d");
    g.translate(S / 2, S / 2);

    var halo = g.createRadialGradient(0, 0, 0, 0, 0, S / 2);
    halo.addColorStop(0, "rgba(255,248,220,0.9)");
    halo.addColorStop(0.15, "rgba(" + c + ",0.55)");
    halo.addColorStop(0.5, "rgba(" + c + ",0.12)");
    halo.addColorStop(1, "rgba(" + c + ",0)");
    g.fillStyle = halo;
    g.fillRect(-S / 2, -S / 2, S, S);

    var R = S / 2 - 3;
    function rays(scale, alpha) {
      g.save();
      g.scale(scale, scale);
      var rg = g.createRadialGradient(0, 0, 0, 0, 0, R);
      rg.addColorStop(0, "rgba(255,255,248," + alpha + ")");
      rg.addColorStop(0.35, "rgba(255,236,170," + alpha + ")");
      rg.addColorStop(1, "rgba(214,160,52," + alpha * 0.9 + ")");
      g.fillStyle = rg;
      g.beginPath();
      g.moveTo(0, -R);
      g.quadraticCurveTo(3, -3, R, 0);
      g.quadraticCurveTo(3, 3, 0, R);
      g.quadraticCurveTo(-3, 3, -R, 0);
      g.quadraticCurveTo(-3, -3, 0, -R);
      g.closePath();
      g.fill();
      g.restore();
    }
    rays(1, 1);
    g.rotate(Math.PI / 4);
    rays(0.55, 0.85);
    return cv;
  }

  function dotSprite(c) {
    var S = 48;
    var cv = document.createElement("canvas");
    cv.width = cv.height = S;
    var g = cv.getContext("2d");
    var rg = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    rg.addColorStop(0, "rgba(255,252,236,1)");
    rg.addColorStop(0.3, "rgba(" + c + ",0.85)");
    rg.addColorStop(1, "rgba(" + c + ",0)");
    g.fillStyle = rg;
    g.fillRect(0, 0, S, S);
    return cv;
  }

  function getSprites() {
    if (!sprites) {
      sprites = STAR_COLORS.map(function (c) {
        return { star: starSprite(c), dot: dotSprite(c) };
      });
    }
    return sprites;
  }

  /* ---------------- camada de transição ---------------- */

  function makeLayer(withFrame) {
    var el = document.createElement("div");
    el.className = "swap-layer";
    el.setAttribute("aria-hidden", "true");

    var surface = document.createElement("div");
    surface.className = "swap-surface";

    var frame = null;
    if (withFrame) {
      frame = document.createElement("iframe");
      frame.className = "swap-frame";
      frame.setAttribute("tabindex", "-1");
      frame.setAttribute("title", "");
      // Sem barra de rolagem própria: assim o layout da camada tem exatamente
      // a largura da página real (a barra de 15px deslocava tudo ~7px).
      frame.setAttribute("scrolling", "no");
      surface.appendChild(frame);
    }

    var gold = document.createElement("div");
    gold.className = "swap-gold";
    surface.appendChild(gold);

    var canvas = document.createElement("canvas");
    canvas.className = "swap-fx";

    el.appendChild(surface);
    el.appendChild(canvas);

    return {
      el: el,
      surface: surface,
      frame: frame,
      canvas: canvas,
      ctx: canvas.getContext("2d"),
      W: 0,
      H: 0,
      parts: [],
      side: null,
    };
  }

  function sizeFx(L) {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    L.W = window.innerWidth;
    L.H = window.innerHeight;
    L.canvas.width = Math.round(L.W * dpr);
    L.canvas.height = Math.round(L.H * dpr);
    L.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Posiciona a máscara de degradê. `side` é o lado que fica visível
  // ("top" ou "bottom") e yEdge o centro da borda macia, em px.
  function applyMask(L, side, yEdge, q, mode) {
    var st = L.surface.style;
    if (!maskOk) {
      st.opacity = String(mode === "cover" ? q : 1 - q);
      return;
    }
    if (L.side !== side) {
      var img = side === "top" ? GRAD_TOP : GRAD_BOTTOM;
      st.webkitMaskImage = st.maskImage = img;
      st.webkitMaskSize = st.maskSize = "100% 300%";
      st.webkitMaskRepeat = st.maskRepeat = "no-repeat";
      L.side = side;
    }
    var pos = clamp01((1.5 * L.H - yEdge) / (2 * L.H)) * 100;
    st.webkitMaskPosition = st.maskPosition = "0 " + pos.toFixed(3) + "%";
  }

  function edgeAt(L, dir, e) {
    return dir > 0 ? -0.25 * L.H + e * 1.5 * L.H : 1.25 * L.H - e * 1.5 * L.H;
  }

  function spawn(L, x, y, dir, big) {
    L.parts.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 18,
      vy: dir * (Math.random() * 38 - 6),
      age: 0,
      max: big ? 0.5 + Math.random() * 0.25 : 0.45 + Math.random() * 0.65,
      size: big ? 70 + Math.random() * 60 : 6 + Math.random() * Math.random() * 30,
      kind: big || Math.random() < 0.55 ? "star" : "dot",
      col: (Math.random() * STAR_COLORS.length) | 0,
      ph: Math.random() * 6.28,
      sp: 9 + Math.random() * 10,
    });
  }

  // Desenha o brilho dourado na borda do degradê e as faíscas.
  function fxFrame(L, yEdge, dt, dir, intensity) {
    var ctx = L.ctx;
    var W = L.W;
    var H = L.H;
    var i;
    ctx.clearRect(0, 0, W, H);
    dt = Math.min(dt, 0.05);

    if (yEdge !== null && intensity > 0) {
      var bh = H * 0.3;
      var g = ctx.createLinearGradient(0, yEdge - bh, 0, yEdge + bh);
      g.addColorStop(0, "rgba(236,196,96,0)");
      g.addColorStop(0.5, "rgba(246,216,132," + (0.28 * intensity).toFixed(3) + ")");
      g.addColorStop(1, "rgba(236,196,96,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.fillRect(0, yEdge - bh, W, bh * 2);

      var n = Math.min(14, Math.round(W * dt * 0.42 * intensity));
      for (i = 0; i < n; i++) {
        var spread = (Math.random() + Math.random() + Math.random() - 1.5) * H * 0.16;
        spawn(L, Math.random() * W, yEdge + spread, dir, false);
      }
      if (Math.random() < dt * 9 * intensity) {
        spawn(L, Math.random() * W, yEdge + (Math.random() - 0.5) * H * 0.2, dir, true);
      }
    }

    var sp = getSprites();
    for (i = L.parts.length - 1; i >= 0; i--) {
      var p = L.parts[i];
      p.age += dt;
      if (p.age >= p.max) {
        L.parts.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      var t = p.age / p.max;
      var env = Math.sin(Math.PI * t);
      var tw = 0.55 + 0.45 * Math.sin(p.ph + p.age * p.sp);
      var s = p.size * (0.55 + 0.45 * env);
      ctx.globalAlpha = Math.min(1, env * tw * 1.2);
      ctx.drawImage(sp[p.col][p.kind], p.x - s / 2, p.y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
  }

  // mode "cover": a camada aparece (degradê revela a página/superfície nova).
  // mode "reveal": a superfície dourada some, mostrando a página de verdade.
  function runWipe(L, mode, dir, duration) {
    return new Promise(function (resolve) {
      sizeFx(L);
      var side = (mode === "cover") === dir > 0 ? "top" : "bottom";
      applyMask(L, side, edgeAt(L, dir, 0), 0, mode);
      L.el.classList.add("swap-layer--on");

      var start = null;
      var last = null;
      function tick(ts) {
        if (start === null) {
          start = ts;
          last = ts;
        }
        var q = clamp01((ts - start) / duration);
        var e = easeInOutSine(q);
        var yEdge = edgeAt(L, dir, e);
        applyMask(L, side, yEdge, e, mode);
        fxFrame(L, yEdge, (ts - last) / 1000, dir, Math.sin(Math.PI * clamp01(q * 0.9 + 0.05)));
        last = ts;
        if (q < 1) requestAnimationFrame(tick);
        else resolve();
      }
      requestAnimationFrame(tick);
    });
  }

  function removeLayer(L) {
    if (L && L.el.parentNode) L.el.parentNode.removeChild(L.el);
  }

  /* ---------------- pré-carregar a página de destino ---------------- */

  function ensurePreload(g) {
    if (inFrame || reduceMotion) return null;
    if (!main) {
      main = makeLayer(true);
      document.body.appendChild(main.el);
      main.frame.addEventListener("load", function () {
        preload.loaded = true;
      });
    }
    if (preload.gender !== g) {
      preload.gender = g;
      preload.loaded = false;
      main.frame.src = PAGES[g];
    }
    return main;
  }

  function waitFrame(g) {
    return new Promise(function (resolve) {
      ensurePreload(g);
      var t0 = Date.now();
      (function poll() {
        if (preload.gender === g && preload.loaded) resolve(true);
        else if (Date.now() - t0 > FRAME_WAIT_MS) resolve(false);
        else setTimeout(poll, 30);
      })();
    });
  }

  /* ---------------- trocar de seção ---------------- */

  function goTo(g) {
    var href = PAGES[g];
    var dir = g === "masc" ? 1 : -1;
    saveGender(g);

    if (reduceMotion || inFrame) {
      window.location.href = href;
      return;
    }

    busy = true;
    var sw = document.querySelector(".gender-switch");
    if (sw) sw.setAttribute("data-gender", g);

    // Trava de segurança: se a navegação falhar, devolve a página ao usuário.
    setTimeout(function () {
      if (main) main.el.classList.remove("swap-layer--on");
      busy = false;
    }, 9000);

    var mode = "frame";
    waitFrame(g)
      .then(function (ok) {
        if (ok) {
          main.el.classList.remove("swap-layer--gold");
          return runWipe(main, "cover", dir, WIPE_MS);
        }
        mode = "veil";
        main.el.classList.add("swap-layer--gold");
        return runWipe(main, "cover", dir, VEIL_MS);
      })
      .then(function () {
        var anim = null;
        try {
          if (mode === "frame") anim = main.frame.contentWindow.performance.now();
        } catch (e) {}
        try {
          sessionStorage.setItem(
            SWAP_KEY,
            JSON.stringify({ dir: dir, t: Date.now(), mode: mode, anim: anim })
          );
        } catch (e) {}
        window.location.href = href;
      });
  }

  function onClick(e) {
    var link = e.target.closest && e.target.closest("[data-gender-link]");
    if (!link) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    if (busy) return;

    var target = link.getAttribute("data-gender-link");
    var onTargetCatalog =
      root.getAttribute("data-gender") === target && document.querySelector("[data-product-grid]");
    if (onTargetCatalog) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    goTo(target);
  }

  function onHover(e) {
    var link = e.target.closest && e.target.closest("[data-gender-link]");
    if (link && !busy) ensurePreload(link.getAttribute("data-gender-link"));
  }

  /* ---------------- chegada na página nova ---------------- */

  // Resto de brilho que se apaga logo depois da troca.
  function afterglow() {
    var L = makeLayer(false);
    L.el.classList.add("swap-layer--on", "swap-layer--fxonly");
    document.body.appendChild(L.el);
    sizeFx(L);
    var DURATION = 750;
    var start = null;
    var last = null;
    function tick(ts) {
      if (start === null) {
        start = ts;
        last = ts;
      }
      var q = clamp01((ts - start) / DURATION);
      var dt = Math.min((ts - last) / 1000, 0.05);
      var n = Math.round((1 - q) * L.W * dt * 0.12);
      for (var i = 0; i < n; i++) spawn(L, Math.random() * L.W, Math.random() * L.H * 0.9, 1, false);
      fxFrame(L, null, dt, 1, 0);
      last = ts;
      if (q < 1 || L.parts.length) requestAnimationFrame(tick);
      else removeLayer(L);
    }
    requestAnimationFrame(tick);
    setTimeout(function () {
      removeLayer(L);
    }, 2500);
  }

  // Plano B: a superfície dourada que cobriu a tela sai pelo mesmo caminho.
  function veilReveal(dir) {
    var L = makeLayer(false);
    L.el.classList.add("swap-layer--gold");
    document.body.appendChild(L.el);
    sizeFx(L);
    var side = dir > 0 ? "bottom" : "top"; // mesmo lado que runWipe("reveal") usa
    applyMask(L, side, edgeAt(L, dir, 0), 0, "reveal");
    L.el.classList.add("swap-layer--on");

    var boot = document.getElementById("swap-boot-style");
    if (boot) boot.parentNode.removeChild(boot);

    var loaded = new Promise(function (res) {
      if (document.readyState === "complete") res();
      else window.addEventListener("load", res, { once: true });
    });
    var minWait = new Promise(function (res) {
      setTimeout(res, 60);
    });
    var maxWait = new Promise(function (res) {
      setTimeout(res, 700);
    });

    setTimeout(function () {
      removeLayer(L);
    }, 4000);

    Promise.all([minWait, Promise.race([loaded, maxWait])])
      .then(function () {
        return runWipe(L, "reveal", dir, VEIL_MS);
      })
      .then(function () {
        removeLayer(L);
      });
  }

  function onArrival() {
    if (inFrame || !root.hasAttribute("data-arrived")) return;
    var veilDir = root.getAttribute("data-veil");
    root.removeAttribute("data-veil");
    var info = null;
    try {
      info = JSON.parse(sessionStorage.getItem(SWAP_KEY));
      sessionStorage.removeItem(SWAP_KEY);
    } catch (e) {}

    // O que já estava na tela na camada de transição não anima de novo
    // (mesmo critério do IntersectionObserver de nav.js: 15% visível).
    document.querySelectorAll(".reveal").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - r.height * 0.15) el.classList.add("reveal--visible");
    });
    setTimeout(function () {
      root.removeAttribute("data-fresh");
    }, 1800);

    // Animações em loop (carrossel do hero etc.) seguem de onde a camada estava.
    if (info && typeof info.anim === "number" && typeof CSSAnimation !== "undefined") {
      var at = info.anim + (Date.now() - info.t);
      document.getAnimations().forEach(function (a) {
        if (a instanceof CSSAnimation) {
          try {
            a.currentTime = at;
          } catch (e) {}
        }
      });
    }

    var boot = document.getElementById("swap-boot-style");
    if (reduceMotion) {
      if (boot) boot.parentNode.removeChild(boot);
      return;
    }
    if (veilDir) veilReveal(Number(veilDir) < 0 ? -1 : 1);
    else afterglow();
  }

  /* ---------------- init ---------------- */

  document.addEventListener("click", onClick);
  document.addEventListener("pointerover", onHover);
  document.addEventListener("touchstart", onHover, { passive: true });

  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      if (main) main.el.classList.remove("swap-layer--on");
      busy = false;
      var boot = document.getElementById("swap-boot-style");
      if (boot) boot.parentNode.removeChild(boot);
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    buildBar();
    applyGender(currentGender);
    onArrival();
  });

  // Em páginas de catálogo, pré-carrega a outra seção assim que a página assenta.
  window.addEventListener("load", function () {
    if (inFrame || reduceMotion) return;
    var conn = navigator.connection;
    if (conn && conn.saveData) return;
    if (!document.querySelector("[data-product-grid]")) return;
    setTimeout(function () {
      if (!busy) ensurePreload(currentGender === "masc" ? "fem" : "masc");
    }, 1200);
  });

  window.NE_GENDER = {
    apply: function (g) {
      saveGender(g);
      applyGender(g);
    },
    get: function () {
      return currentGender;
    },
  };
})();
