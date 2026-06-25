(function () {
  'use strict';

  /* Contador animado de kg de madera */
  function initWoodCounter() {
    const el = document.getElementById('woodCounter');
    if (!el) return;
    const target = 266, duration = 1400;
    let hasRun = false;
    function run() {
      if (hasRun) return; hasRun = true;
      const start = performance.now();
      function step(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target).toLocaleString('es-AR');
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries, obs) => {
        entries.forEach(e => { if (e.isIntersecting) { run(); obs.disconnect(); } });
      }, { threshold: 0.4 }).observe(el);
    } else { run(); }
  }

  /* Formulario lista de espera */
  function initWaitlist() {
    const form = document.getElementById('waitlistForm');
    const msg  = document.getElementById('formSuccess');
    if (!form || !msg) return;
    form.addEventListener('submit', e => {
      e.preventDefault(); form.hidden = true; msg.hidden = false;
    });
  }

  /* Animaciones scroll */
  function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-up');
    if (!elements.length) return;
    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach(el => observer.observe(el));
  }

  document.addEventListener('DOMContentLoaded', function () {
    initWoodCounter();
    initWaitlist();
    initScrollAnimations();
  });
})();
