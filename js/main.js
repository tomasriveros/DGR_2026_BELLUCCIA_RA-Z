/* =========================================================
   RAÍZ — main.js
   Slider antes/después · Stepper de anillos · Bento interactivo
   Sin dependencias externas.
   ========================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------
     1. SLIDER ANTES / DESPUÉS
     Lógica de arrastre nativa con soporte mouse + touch.
     --------------------------------------------------------- */
  function initBeforeAfter() {
    const frame = document.querySelector('.before-after__frame');
    const afterImg = document.getElementById('afterImg');
    const divider = document.getElementById('divider');
    const handle = document.getElementById('handle');

    if (!frame || !afterImg || !divider || !handle) return;

    let isDragging = false;

    function setPosition(percent) {
      const clamped = Math.min(100, Math.max(0, percent));
      afterImg.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
      divider.style.left = `${clamped}%`;
      handle.setAttribute('aria-valuenow', Math.round(clamped));
    }

    function percentFromClientX(clientX) {
      const rect = frame.getBoundingClientRect();
      const x = clientX - rect.left;
      return (x / rect.width) * 100;
    }

    // --- Mouse events ---
    function onMouseDown(e) {
      isDragging = true;
      setPosition(percentFromClientX(e.clientX));
      e.preventDefault();
    }

    function onMouseMove(e) {
      if (!isDragging) return;
      setPosition(percentFromClientX(e.clientX));
    }

    function onMouseUp() {
      isDragging = false;
    }

    // --- Touch events (evita colisión con el scroll vertical) ---
    function onTouchStart(e) {
      isDragging = true;
      const touch = e.touches[0];
      setPosition(percentFromClientX(touch.clientX));
    }

    function onTouchMove(e) {
      if (!isDragging) return;
      const touch = e.touches[0];
      setPosition(percentFromClientX(touch.clientX));
      e.preventDefault(); // solo prevenimos scroll mientras arrastramos activamente
    }

    function onTouchEnd() {
      isDragging = false;
    }

    // --- Keyboard accessibility ---
    function onKeyDown(e) {
      const current = parseFloat(divider.style.left) || 50;
      if (e.key === 'ArrowLeft') {
        setPosition(current - 5);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        setPosition(current + 5);
        e.preventDefault();
      } else if (e.key === 'Home') {
        setPosition(0);
        e.preventDefault();
      } else if (e.key === 'End') {
        setPosition(100);
        e.preventDefault();
      }
    }

    handle.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    handle.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    handle.addEventListener('keydown', onKeyDown);

    // También permitir click/drag directo sobre el frame
    frame.addEventListener('mousedown', function (e) {
      if (e.target === handle || handle.contains(e.target)) return;
      isDragging = true;
      setPosition(percentFromClientX(e.clientX));
    });

    setPosition(50);
  }

  /* ---------------------------------------------------------
     2. STEPPER DE ANILLOS
     Cambia el panel activo y rellena el anillo correspondiente.
     --------------------------------------------------------- */
  function initStepper() {
    const steps = document.querySelectorAll('.stepper__step');
    const panels = document.querySelectorAll('.stepper__panel');

    if (!steps.length || !panels.length) return;

    function activateStep(targetStep) {
      steps.forEach((step) => {
        const isTarget = step.dataset.step === targetStep;
        step.classList.toggle('is-active', isTarget);
        step.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      });

      panels.forEach((panel) => {
        const isTarget = panel.id === `panel-${targetStep}`;
        panel.classList.toggle('is-active', isTarget);
        panel.hidden = !isTarget;
      });
    }

    steps.forEach((step) => {
      step.addEventListener('click', () => {
        activateStep(step.dataset.step);
      });
    });

    // Navegación con flechas entre pasos (patrón de tabs accesible)
    const stepperNav = document.querySelector('.stepper__nav');
    if (stepperNav) {
      stepperNav.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        const stepsArray = Array.from(steps);
        const currentIndex = stepsArray.findIndex((s) => s.classList.contains('is-active'));
        let nextIndex;
        if (e.key === 'ArrowDown') {
          nextIndex = (currentIndex + 1) % stepsArray.length;
        } else {
          nextIndex = (currentIndex - 1 + stepsArray.length) % stepsArray.length;
        }
        const nextStep = stepsArray[nextIndex];
        activateStep(nextStep.dataset.step);
        nextStep.focus();
        e.preventDefault();
      });
    }
  }

  /* ---------------------------------------------------------
     3. CONTADOR ANIMADO (kg de madera recuperada)
     Se dispara cuando el bloque entra en viewport.
     --------------------------------------------------------- */
  function initWoodCounter() {
    const counterEl = document.getElementById('woodCounter');
    if (!counterEl) return;

    const target = 4280;
    const duration = 1400;
    let hasRun = false;

    function animateCount() {
      if (hasRun) return;
      hasRun = true;
      const start = performance.now();

      function step(now) {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        counterEl.textContent = Math.round(eased * target).toLocaleString('es-AR');
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount();
            observer.disconnect();
          }
        });
      }, { threshold: 0.4 });
      observer.observe(counterEl);
    } else {
      animateCount();
    }
  }

  /* ---------------------------------------------------------
     4. FORMULARIO DE LISTA DE ESPERA (Muebles Cápsula)
     --------------------------------------------------------- */
  function initWaitlistForm() {
    const form = document.getElementById('waitlistForm');
    const successMsg = document.getElementById('formSuccess');
    if (!form || !successMsg) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.hidden = true;
      successMsg.hidden = false;
    });
  }

  /* ---------------------------------------------------------
     Init
     --------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initBeforeAfter();
    initStepper();
    initWoodCounter();
    initWaitlistForm();
  });
})();
