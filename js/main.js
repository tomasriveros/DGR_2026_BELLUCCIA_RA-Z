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

  /* Toggle antes/después del sillón en el hero (click en la imagen) */
  function initHeroToggle() {
    const chair = document.getElementById('heroChair');
    const before = document.getElementById('heroChairBefore');
    const after = document.getElementById('heroChairAfter');
    if (!chair || !before || !after) return;
    chair.addEventListener('click', () => {
      const showingAfter = after.classList.contains('is-active');
      before.classList.toggle('is-active', showingAfter);
      after.classList.toggle('is-active', !showingAfter);
    });
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

  /* Slider antes/después en sección "por qué restaurar" */
  function initWhySlider() {
    const slider  = document.getElementById('whySlider');
    const after   = document.getElementById('whyAfter');
    const divider = document.getElementById('whyDivider');
    const handle  = document.getElementById('whyHandle');
    if (!slider || !after || !divider || !handle) return;

    let isDragging = false;

    function setPos(percent) {
      const p = Math.min(100, Math.max(0, percent));
      after.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
      divider.style.left = `${p}%`;
      handle.setAttribute('aria-valuenow', Math.round(p));
    }

    function pctFromX(clientX) {
      const rect = slider.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    handle.addEventListener('mousedown', e => { isDragging = true; setPos(pctFromX(e.clientX)); e.preventDefault(); });
    window.addEventListener('mousemove', e => { if (isDragging) setPos(pctFromX(e.clientX)); });
    window.addEventListener('mouseup', () => { isDragging = false; });

    handle.addEventListener('touchstart', e => { isDragging = true; setPos(pctFromX(e.touches[0].clientX)); }, { passive: true });
    window.addEventListener('touchmove', e => { if (isDragging) { setPos(pctFromX(e.touches[0].clientX)); e.preventDefault(); } }, { passive: false });
    window.addEventListener('touchend', () => { isDragging = false; });

    slider.addEventListener('mousedown', e => {
      if (e.target === handle || handle.contains(e.target)) return;
      isDragging = true; setPos(pctFromX(e.clientX));
    });

    handle.addEventListener('keydown', e => {
      const cur = parseFloat(divider.style.left) || 50;
      if (e.key === 'ArrowLeft') { setPos(cur - 5); e.preventDefault(); }
      if (e.key === 'ArrowRight') { setPos(cur + 5); e.preventDefault(); }
    });

    setPos(50);
  }

  /* Animación abanico de cartas — sección Así funciona */
  function initHowCards() {
    const cards = document.querySelectorAll('.how__card');
    if (!cards.length) return;
    if (!('IntersectionObserver' in window)) {
      cards.forEach(c => c.classList.add('is-fanned'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cards.forEach(c => c.classList.add('is-fanned'));
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });
    const grid = document.querySelector('.how__grid');
    if (grid) observer.observe(grid);
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
        buttons.forEach(b => {
          b.setAttribute('aria-expanded', 'false');
          const a = document.getElementById(b.getAttribute('aria-controls'));
          if (a) a.hidden = true;
        });
        if (!isOpen) {
          btn.setAttribute('aria-expanded', 'true');
          if (answer) answer.hidden = false;
        }
      });
    });
  }

  /* Nav que se oculta al bajar y aparece al subir */
  function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      if (currentY <= 60) {
        nav.classList.remove('nav--hidden');
      } else if (currentY > lastY) {
        nav.classList.add('nav--hidden');
      } else {
        nav.classList.remove('nav--hidden');
      }
      lastY = currentY;
    }, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initWoodCounter();
    initHeroToggle();
    initWaitlist();
    initScrollAnimations();
    initWhySlider();
    initHowCards();
    initFaq();
    initNav();
  });
})();
