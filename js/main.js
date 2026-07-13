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

  /* Contador animado de alumnos */
  function initAlumnosCounter() {
    const el = document.getElementById('alumnosCounter');
    if (!el) return;
    const target = 150, duration = 1400;
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

  /* Flip cards de la sección Sobre RAÍZ */
  function initFlipCards() {
    const cards = document.querySelectorAll('.flip-card');
    if (!cards.length) return;
    cards.forEach(card => {
      card.addEventListener('click', () => card.classList.toggle('is-flipped'));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('is-flipped');
        }
      });
    });
  }

  /* Video en hover para las tarjetas de curso */
  function initCourseVideos() {
    const cards = document.querySelectorAll('.course-card');
    cards.forEach(card => {
      const wrap = card.querySelector('.course-card__img-wrap');
      const video = card.querySelector('.course-card__video');
      if (!wrap || !video) return;
      card.addEventListener('mouseenter', () => {
        wrap.classList.add('is-playing');
        video.currentTime = 0;
        video.play();
      });
      card.addEventListener('mouseleave', () => {
        wrap.classList.remove('is-playing');
        video.pause();
      });
    });
  }

  /* Slider antes/después del sillón en el hero (arrastre) */
  function initHeroSlider() {
    const slider  = document.getElementById('heroSlider');
    const after   = document.getElementById('heroAfter');
    const divider = document.getElementById('heroDivider');
    const handle  = document.getElementById('heroHandle');
    if (!slider || !after || !divider || !handle) return;

    let isDragging = false;

    function setPos(percent) {
      const p = Math.min(100, Math.max(0, percent));
      after.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
      divider.style.left = `${p}%`;
      handle.style.left = `${p}%`;
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

/* Showroom interactivo: mueble + acabados */
  function initShowroom() {
    const track = document.getElementById('showroomTrack');
    if (!track) return;

    const slides = track.querySelectorAll('.showroom__slide');
    const finishBtns = document.querySelectorAll('#showroomFinishes .finish');
    const prevBtn = document.querySelector('.showroom__arrow--prev');
    const nextBtn = document.querySelector('.showroom__arrow--next');
    const nombreEl = document.getElementById('showroomNombre');
    const descEl = document.getElementById('showroomDesc');
    if (!prevBtn || !nextBtn || !nombreEl || !descEl) return;

    let currentIndex = 0;

    function renderInfo() {
      const slide = slides[currentIndex];
      nombreEl.textContent = slide.dataset.nombre;
      descEl.textContent = slide.dataset.desc;
    }

    function goTo(index) {
      currentIndex = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      renderInfo();
    }

    function setFinish(acabado) {
      slides.forEach(slide => {
        slide.querySelectorAll('.showroom__img').forEach(img => {
          img.classList.toggle('is-active', img.dataset.acabado === acabado);
        });
      });
      finishBtns.forEach(btn => {
        btn.classList.toggle('is-active', btn.dataset.acabado === acabado);
      });
    }

    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));
    finishBtns.forEach(btn => {
      btn.addEventListener('click', () => setFinish(btn.dataset.acabado));
    });

    goTo(0);
    setFinish('nogal');
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

  /* Carrusel infinito de marcas/materiales con tooltip flotante */
  function initBrandsMarquee() {
    const track = document.getElementById('brandsTrack');
    const tooltip = document.getElementById('brandsTooltip');
    const tooltipName = document.getElementById('brandsTooltipName');
    const tooltipCat  = document.getElementById('brandsTooltipCat');
    const tooltipDesc = document.getElementById('brandsTooltipDesc');
    if (!track || !tooltip) return;

    const container = tooltip.parentElement; // .brands (position: relative)
    const items = track.querySelectorAll('.brands__item');

    function showTooltip(item) {
      tooltipName.textContent = item.dataset.name;
      tooltipCat.textContent  = item.dataset.cat;
      tooltipDesc.textContent = item.dataset.desc;

      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const left = itemRect.left + itemRect.width / 2 - containerRect.left;
      const top  = itemRect.top - containerRect.top;

      tooltip.style.left = `${left}px`;
      tooltip.style.top  = `${top}px`;
      tooltip.classList.add('is-visible');

      track.style.animationPlayState = 'paused';
    }

    function hideTooltip() {
      tooltip.classList.remove('is-visible');
      track.style.animationPlayState = 'running';
    }

    items.forEach(item => {
      item.addEventListener('mouseenter', () => showTooltip(item));
      item.addEventListener('focus', () => showTooltip(item));
      item.addEventListener('mouseleave', hideTooltip);
      item.addEventListener('blur', hideTooltip);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initWoodCounter();
    initAlumnosCounter();
    initHeroSlider();
    initWaitlist();
    initScrollAnimations();
    initWhySlider();
    initShowroom();
    initFaq();
    initNav();
    initFlipCards();
    initBrandsMarquee();
    initCourseVideos();
  });
})();
