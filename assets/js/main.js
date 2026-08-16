// Boomes Tuinonderhoud — site interactivity (vanilla JS, no dependencies)
(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("is-open", !open);
      document.body.style.overflow = !open ? "hidden" : "";
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Sticky header: shadow on scroll, hide on scroll-down, reveal on scroll-up ---------- */
  var header = document.querySelector("[data-site-header]");
  var lastY = window.scrollY;
  var headerHeight = header ? header.offsetHeight : 0;
  function onScrollHeader() {
    if (!header) return;
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 8);
    if (y > lastY && y > headerHeight) {
      header.classList.add("is-hidden");
    } else {
      header.classList.remove("is-hidden");
    }
    lastY = y;
  }
  document.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Sticky mobile CTA bar: show after hero ---------- */
  var ctaBar = document.querySelector("[data-mobile-cta]");
  var heroEl = document.querySelector(".hero, .page-hero");
  if (ctaBar) {
    if (heroEl && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            ctaBar.classList.toggle("is-visible", !entry.isIntersecting);
          });
        },
        { rootMargin: "-70% 0px 0px 0px" }
      );
      io.observe(heroEl);
    } else {
      document.addEventListener(
        "scroll",
        function () {
          ctaBar.classList.toggle("is-visible", window.scrollY > 480);
        },
        { passive: true }
      );
    }
  }

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll("[data-reveal], [data-reveal-group]");
  if ("IntersectionObserver" in window && revealTargets.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Offerte form: real validation + lightweight client feedback ---------- */
  var form = document.querySelector("[data-quote-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector("[data-form-status]");

      if (!form.checkValidity()) {
        form.reportValidity();
        if (status) {
          status.textContent = "Vul de verplichte velden in (naam, telefoon en e-mail) voordat u verstuurt.";
          status.hidden = false;
          status.classList.add("is-error");
        }
        return;
      }

      if (status) {
        status.hidden = true;
        status.classList.remove("is-error");
      }
      var btn = form.querySelector("button[type='submit']");
      if (btn) { btn.disabled = true; btn.textContent = "Versturen…"; }
      setTimeout(function () {
        if (status) {
          status.textContent = "Bedankt! We nemen binnen 24 uur contact met u op.";
          status.hidden = false;
        }
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = "Offerte aanvragen"; }
      }, 700);
    });
  }

  /* ---------- Current year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
