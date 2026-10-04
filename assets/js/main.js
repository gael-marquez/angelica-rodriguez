document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  // Menú móvil
  const toggle = document.querySelector(".nav-toggle");
  toggle?.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open);
  });
  document.querySelectorAll(".nav a").forEach(a =>
    a.addEventListener("click", () => document.body.classList.remove("nav-open"))
  );

  // Borde del header al hacer scroll
  const header = document.querySelector(".site-header");
  const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Aparición suave
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  // Botones de copiar (datos bancarios)
  document.querySelectorAll("[data-copy]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy.replace(/\s/g, "");
      try { await navigator.clipboard.writeText(text); } catch { return; }
      const label = btn.textContent;
      btn.textContent = "¡Copiado!";
      btn.classList.add("is-copied");
      setTimeout(() => { btn.textContent = label; btn.classList.remove("is-copied"); }, 1600);
    });
  });

  // Google Forms: si hay URL en data-form-src se inserta el iframe,
  // si no, se queda el recuadro de "pega aquí tu formulario".
  document.querySelectorAll(".form-embed[data-form-src]").forEach(box => {
    const src = box.dataset.formSrc.trim();
    const openLink = document.querySelector(`[data-open-form="${box.closest(".form-panel")?.id}"]`);
    if (!src) { openLink?.remove(); return; }
    if (openLink) { openLink.href = src.replace(/[?&]embedded=true/, ""); openLink.target = "_blank"; openLink.rel = "noopener"; }
    const iframe = document.createElement("iframe");
    iframe.src = src.includes("embedded=true") ? src : src + (src.includes("?") ? "&" : "?") + "embedded=true";
    iframe.loading = "lazy";
    iframe.title = box.dataset.formTitle || "Formulario";
    box.querySelector(".form-placeholder")?.remove();
    box.append(iframe);
  });

  // Pestañas de formularios (+ soporte para formularios.html#agenda)
  const tabs = [...document.querySelectorAll(".form-tab")];
  const select = id => {
    tabs.forEach(t => {
      const on = t.dataset.target === id;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.dataset.target).hidden = !on;
    });
  };
  tabs.forEach(t => t.addEventListener("click", () => {
    select(t.dataset.target);
    history.replaceState(null, "", "#" + t.dataset.target);
  }));
  if (tabs.length) {
    const fromHash = location.hash.slice(1);
    select(tabs.some(t => t.dataset.target === fromHash) ? fromHash : tabs[0].dataset.target);
  }

  // Año del footer
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
});
