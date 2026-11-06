/* ==========================================================================
   Rede AV — interações do protótipo
   Dependências (self-hosted em assets/vendor): GSAP + ScrollTrigger, Lenis
   Tudo degrada com elegância: sem JS/GSAP o conteúdo continua visível e utilizável.
   ========================================================================== */
(() => {
  "use strict";

  const cfg = window.REDEAV || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = !!window.gsap;
  const brl = (n, d = 2) => n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

  /* ---------- Links (WhatsApp e placeholders) ---------- */
  const waUrl = (msg) => `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(msg || "Olá!")}`;
  $$("[data-wa]").forEach((a) => {
    a.href = waUrl(a.dataset.msg);
    a.target = "_blank";
    a.rel = "noopener";
  });
  $$("[data-link]").forEach((a) => {
    const v = cfg.links && cfg.links[a.dataset.link];
    if (v) a.setAttribute("href", v);
  });
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a && a.getAttribute("href") === "#") e.preventDefault();
    const c = e.target.closest("[data-cta]");
    if (c) (window.dataLayer = window.dataLayer || []).push({ event: "cta_click", cta: c.dataset.cta });
  });

  /* ---------- Scroll suave (Lenis) + GSAP ---------- */
  let lenis = null;
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    if (hasGSAP) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  const scrollToTarget = (el) => {
    const off = -72;
    if (lenis) lenis.scrollTo(el, { offset: off, duration: 1.3 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + off, behavior: reduce ? "auto" : "smooth" });
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const el = $(id);
    if (!el) return;
    e.preventDefault();
    closeDrawer();
    scrollToTarget(el);
  });

  /* ---------- Header ---------- */
  const hdr = $("#hdr");
  const onScroll = () => {
    const y = window.scrollY;
    document.documentElement.style.setProperty("--sy", Math.min(y, 80) + "px");
    hdr.classList.toggle("is-top", y < 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const links = $$("[data-spy]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => l.classList.toggle("is-active", l.dataset.spy === en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach((l) => { const s = document.getElementById(l.dataset.spy); if (s) io.observe(s); });
  }

  /* ---------- Menu móvel ---------- */
  const burger = $("#burger");
  const drawer = $("#drawer");
  function closeDrawer() {
    if (drawer.hidden) return;
    drawer.hidden = true;
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Abrir menu");
    burger.firstElementChild.firstElementChild.setAttribute("href", "#i-menu");
    document.body.classList.remove("menu-open");
    if (lenis) lenis.start();
  }
  burger.addEventListener("click", () => {
    if (!drawer.hidden) return closeDrawer();
    drawer.hidden = false;
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Fechar menu");
    burger.firstElementChild.firstElementChild.setAttribute("href", "#i-close");
    document.body.classList.add("menu-open");
    if (lenis) lenis.stop();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

  /* ---------- Hero: uma única entrada orquestrada ---------- */
  const pixVal = $(".pix-val");
  if (hasGSAP && !reduce) {
    const q = (n) => `[data-hero="${n}"]`;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(q("pill"), { y: 16, autoAlpha: 0, duration: 0.6 })
      .from(q("l1"), { yPercent: 115, duration: 0.95 }, "-=0.25")
      .from(q("l2"), { yPercent: 115, duration: 0.95 }, "-=0.75")
      .from([q("lead"), q("cta"), q("micro")], { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.1 }, "-=0.55")
      .from(`${q("chips")} li`, { y: 14, autoAlpha: 0, duration: 0.5, stagger: 0.08 }, "-=0.45")
      .from(q("photo-back"), { scale: 0.92, rotate: -2, autoAlpha: 0, duration: 1.1 }, 0.25)
      .from(q("photo-main"), { scale: 0.94, y: 34, autoAlpha: 0, duration: 1.1 }, 0.4)
      .from([q("float-1"), q("float-2")], { scale: 0.7, autoAlpha: 0, duration: 0.6, stagger: 0.2, ease: "back.out(1.7)" }, "-=0.4")
      .from(q("seal"), { scale: 0, rotate: -120, autoAlpha: 0, duration: 0.9, ease: "back.out(1.4)" }, "-=0.5");

    if (pixVal) {
      const o = { v: 0 };
      tl.to(o, { v: 12.4, duration: 1.1, ease: "power2.out", onUpdate: () => (pixVal.textContent = "+ R$ " + brl(o.v)) }, "-=0.9");
    }
    // Parallax discreto das fotos ao rolar
    if (window.matchMedia("(min-width: 981px)").matches) {
      gsap.to(q("photo-back"), { yPercent: -7, ease: "none", scrollTrigger: { trigger: "#inicio", start: "top top", end: "bottom top", scrub: true } });
    }
  }

  /* ---------- Telas do app: flutuação suave no hero e entrada da seção "Tudo em um só lugar" ---------- */
  if (hasGSAP && !reduce) {
    gsap.to(".dev--main", { y: -12, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.8 });
    if ($(".plat__img")) gsap.from(".plat__img", { y: 48, autoAlpha: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: ".plat__stage", start: "top 82%", once: true } });
    if ($(".dev--cash")) gsap.from(".dev--cash", { y: 40, autoAlpha: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".cash__visual", start: "top 78%", once: true } });
  }

  /* ---------- Parceiros: mosaico de marcas (sorteio a cada carga + faixas que deslizam com a rolagem) ---------- */
  (() => {
    const wrap = $("[data-rede-rows]");
    if (!wrap) return;
    const pool = window.REDE_AV_LOGOS;
    if (Array.isArray(pool) && pool.length) {
      const a = pool.slice();
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      $$(".ptile img", wrap).forEach((img, i) => { const [nome, arq] = a[i % a.length]; img.alt = nome; img.src = "assets/parceiros/" + arq; });
    }
    if (!hasGSAP || reduce) return;
    // 1ª faixa → direita, 2ª ← esquerda, 3ª → direita; amplitude limitada para nunca revelar o fim da faixa
    $$(".rede__row", wrap).forEach((row) => {
      const dir = Number(row.dataset.dir) || 1;
      const amp = () => Math.max(0, Math.min(wrap.clientWidth * 0.2, 280, (row.offsetWidth - wrap.clientWidth) / 2));
      gsap.fromTo(row, { x: () => -dir * amp() }, { x: () => dir * amp(), ease: "none", scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true } });
    });
  })();

  /* ---------- Onde economizar: scroll horizontal fixo (desktop) ---------- */
  if (hasGSAP) {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 981px) and (prefers-reduced-motion: no-preference)", () => {
      const sec = $("#onde");
      const track = $("#ondeTrack");
      const view = $(".onde__view");
      const bar = $("#ondeBar");
      const dist = () => Math.max(0, track.scrollWidth - view.clientWidth);
      gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: sec, start: "top top", end: () => "+=" + dist(),
          pin: true, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: (s) => { bar.style.transform = `scaleX(${0.12 + 0.88 * s.progress})`; }
        }
      });
    });
  }

  /* ---------- Contadores ---------- */
  const countUp = (el, to, dec, dur = 1.6, fmt = (v) => brl(v, dec)) => {
    if (!hasGSAP || reduce) { el.textContent = fmt(to); return; }
    const o = { v: 0 };
    gsap.to(o, { v: to, duration: dur, ease: "power2.out", onUpdate: () => (el.textContent = fmt(o.v)) });
  };
  const onceInView = (el, fn, start = "top 85%") => {
    if (hasGSAP) ScrollTrigger.create({ trigger: el, start, once: true, onEnter: fn });
    else fn();
  };
  $$("[data-count]").forEach((el) => {
    const to = parseFloat(el.dataset.count);
    el.textContent = hasGSAP && !reduce ? "0" : String(to);
    onceInView(el, () => countUp(el, to, 0, 1.8, (v) => String(Math.round(v))));
  });
  const bal = $("#phoneBal");
  if (bal) {
    const to = parseFloat(bal.dataset.to);
    bal.textContent = hasGSAP && !reduce ? "0,00" : brl(to);
    onceInView(bal, () => countUp(bal, to, 2, 1.8), "top 80%");
  }

  /* ---------- Simulador ---------- */
  (function sim() {
    const form = $("#simForm");
    if (!form || !cfg.simulador) return;
    const state = {};
    cfg.simulador.forEach((c) => (state[c.id] = c.valor));

    form.innerHTML = cfg.simulador.map((c) => `
      <div class="fld">
        <div class="fld__top">
          <label class="fld__name" for="f-${c.id}"><span class="fld__ico"><svg class="ico"><use href="#${c.icon}"/></svg></span>${c.label}</label>
          <output class="fld__val" id="o-${c.id}" for="f-${c.id}"></output>
        </div>
        <input type="range" id="f-${c.id}" name="${c.id}" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.valor}" aria-label="Gasto mensal com ${c.label.toLowerCase()}">
      </div>`).join("");

    const bar = $("#simBar");
    const legend = $("#simLegend");
    bar.innerHTML = cfg.simulador.map((c) => `<i style="background:${c.cor}"></i>`).join("");
    legend.innerHTML = cfg.simulador.map((c) => `<li><i style="background:${c.cor}"></i>${c.label}<b id="l-${c.id}"></b></li>`).join("");

    const mes = $("#simMes");
    const ano = $("#simAno");
    const cta = $("#simCta");
    const shown = { v: 0 };

    const setPct = (input) => {
      const p = ((input.value - input.min) / (input.max - input.min)) * 100;
      input.style.setProperty("--p", p + "%");
    };

    const render = () => {
      let total = 0, gasto = 0;
      cfg.simulador.forEach((c, i) => {
        const v = state[c.id];
        const back = v * c.taxa;
        total += back; gasto += v;
        $("#o-" + c.id).textContent = "R$ " + brl(v, 0);
        $("#l-" + c.id).textContent = "R$ " + brl(back);
        bar.children[i].style.flexGrow = Math.max(back, 0.0001);
      });
      const apply = (v) => { mes.textContent = brl(v, 0); };
      if (hasGSAP && !reduce) gsap.to(shown, { v: total, duration: 0.5, ease: "power2.out", overwrite: true, onUpdate: () => apply(shown.v) });
      else apply(total);
      ano.textContent = "R$ " + brl(total * 12, 0);
      cta.href = waUrl(`Olá! Fiz a simulação no site da Rede AV: gasto mensal de cerca de R$ ${brl(gasto, 0)} e estimativa de R$ ${brl(total, 0)} de volta por mês. Quero saber como entrar.`);
    };

    $$("input[type=range]", form).forEach((inp) => {
      setPct(inp);
      inp.addEventListener("input", () => { state[inp.name] = +inp.value; setPct(inp); render(); });
    });
    shown.v = 0;
    render();
  })();

  /* ---------- FAQ (acordeão, um aberto por vez) ---------- */
  const qas = $$(".qa");
  const setOpen = (qa, open) => {
    qa.classList.toggle("is-open", open);
    $(".qa__q", qa).setAttribute("aria-expanded", String(open));
  };
  qas.forEach((qa, i) => {
    const btn = $(".qa__q", qa);
    const panel = $(".qa__a", qa);
    const id = "qa-" + i;
    btn.id = id + "-b"; panel.id = id;
    btn.setAttribute("aria-controls", id);
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-labelledby", btn.id);
    btn.addEventListener("click", () => {
      const willOpen = !qa.classList.contains("is-open");
      qas.forEach((o) => setOpen(o, false));
      setOpen(qa, willOpen);
      if (hasGSAP) setTimeout(() => ScrollTrigger.refresh(), 450);
    });
  });
  if (qas[0]) setOpen(qas[0], true);

  /* ---------- Recalcula âncoras quando fontes/imagens terminam de carregar ---------- */
  window.addEventListener("load", () => { if (hasGSAP) ScrollTrigger.refresh(); });
})();
