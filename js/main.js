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

  /* Crossfade scroll en sección "por qué restaurar" */
  function initCrossfade() {
    const container = document.querySelector('.why__image');
    const imgAfter = container ? container.querySelector('.img-after') : null;
    if (!container || !imgAfter) return;

    function update() {
      const rect = container.getBoundingClientRect();
      const windowH = window.innerHeight;
      // Empieza a cruzar cuando el centro del contenedor entra en pantalla
      // y termina cuando el contenedor ya pasó la mitad de la pantalla
      const start = windowH * 0.6;
      const end   = windowH * 0.1;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      imgAfter.style.opacity = progress;
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* Acordeón FAQ */
  function initFaq() {
    const buttons = document.querySelectorAll('.faq__question');
    if (!buttons.length) return;
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        const answerId = btn.getAttribute('aria-controls');
        const answer = document.getElementById(answerId);
        // Cerrar todos
        buttons.forEach(b => {
          b.setAttribute('aria-expanded', 'false');
          const a = document.getElementById(b.getAttribute('aria-controls'));
          if (a) a.hidden = true;
        });
        // Abrir el clickeado (si estaba cerrado)
        if (!isOpen) {
          btn.setAttribute('aria-expanded', 'true');
          if (answer) answer.hidden = false;
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initWoodCounter();
    initWaitlist();
    initScrollAnimations();
    initCrossfade();
    initFaq();
  });
})();
