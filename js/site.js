(function() {
  'use strict';

  function initHamburger() {
    var navEl = document.querySelector('.nav');
    var hamburger = document.querySelector('.nav__hamburger');
    var navLinks = document.getElementById('nav-links');

    if (!hamburger || !navEl) {
      return;
    }

    hamburger.addEventListener('click', function() {
      var open = navEl.classList.toggle('nav--open');
      hamburger.setAttribute('aria-expanded', open);
    });

    if (navLinks) {
      navLinks.querySelectorAll('.nav__link').forEach(function(link) {
        link.addEventListener('click', function() {
          navEl.classList.remove('nav--open');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  function initFabDial() {
    var dial = document.getElementById('fab-dial');
    var trigger = document.getElementById('fab-trigger');

    if (!dial || !trigger) {
      return;
    }

    trigger.addEventListener('click', function(event) {
      event.stopPropagation();
      var open = dial.classList.toggle('fab-dial--open');
      trigger.setAttribute('aria-expanded', open);
    });

    document.addEventListener('click', function(event) {
      if (!dial.contains(event.target)) {
        dial.classList.remove('fab-dial--open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function initModal() {
    var modal = document.getElementById('reg-modal');
    if (!modal) {
      return;
    }

    var modalClose = document.getElementById('modal-close');
    var backdrop = document.getElementById('modal-backdrop');
    var fabCta = document.getElementById('fab-cta');
    var openModalButtons = document.querySelectorAll('.js-open-reg-modal');
    var dial = document.getElementById('fab-dial');
    var trigger = document.getElementById('fab-trigger');

    function openModal() {
      if (dial) {
        dial.classList.remove('fab-dial--open');
      }
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (modalClose) {
        modalClose.focus();
      }
    }

    function closeModal() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      if (trigger) {
        trigger.focus();
      }
    }

    if (fabCta) {
      fabCta.addEventListener('click', function() {
        openModal();
      });
    }


    if (openModalButtons.length) {
      openModalButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
          event.preventDefault();
          openModal();
        });
      });
    }

    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function(event) {
      if (event.target.classList.contains('js-close-modal')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  function initModalForm() {
    var form = document.getElementById('reg-form');
    if (!form) return;

    var successEl = document.getElementById('reg-success');
    var successCta = document.getElementById('reg-success-cta');
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn ? submitBtn.textContent : '送出需求';
    var redirectTimeoutId = null;
    var demandTypeSelect = document.getElementById('modal-demand-type');
    var levelGroupSelect = document.getElementById('modal-level-group');
    var gradeSelect = document.getElementById('modal-grade');
    var subjectGroup = document.getElementById('modal-subject-group');
    var subjectSelect = document.getElementById('modal-subject');
    var gradeOptionsByLevel = {
      '國中': ['國一', '國二', '國三'],
      '高中': ['高一', '高二', '高三'],
      '重考 / 大學': []
    };

    function resetSelectOptions(selectEl, placeholder) {
      if (!selectEl) return;
      selectEl.innerHTML = '';

      var placeholderOption = document.createElement('option');
      placeholderOption.value = '';
      placeholderOption.textContent = placeholder;
      placeholderOption.disabled = true;
      placeholderOption.selected = true;
      selectEl.appendChild(placeholderOption);
    }

    function updateGradeOptions() {
      if (!gradeSelect || !levelGroupSelect) return;

      var skipsLevelAndGrade = demandTypeSelect && demandTypeSelect.value === '醫學系二階 / 面試';
      var level = levelGroupSelect.value;
      var grades = gradeOptionsByLevel[level] || [];
      var shouldHideGrade = skipsLevelAndGrade || level === '重考 / 大學';

      if (levelGroupSelect.parentElement) {
        levelGroupSelect.parentElement.hidden = skipsLevelAndGrade;
      }

      levelGroupSelect.required = !skipsLevelAndGrade;
      levelGroupSelect.disabled = skipsLevelAndGrade;

      if (skipsLevelAndGrade) {
        levelGroupSelect.selectedIndex = 0;
      }

      if (gradeSelect.parentElement) {
        gradeSelect.parentElement.hidden = shouldHideGrade;
      }

      gradeSelect.required = !shouldHideGrade;

      resetSelectOptions(gradeSelect, level ? '請選擇年級' : '請先選擇學段');

      if (!grades.length) {
        gradeSelect.disabled = true;
        return;
      }

      grades.forEach(function(grade) {
        var option = document.createElement('option');
        option.value = grade;
        option.textContent = grade;
        gradeSelect.appendChild(option);
      });

      gradeSelect.disabled = false;
    }

    function updateSubjectVisibility() {
      if (!demandTypeSelect || !subjectGroup || !subjectSelect) return;

      var needsSubject = demandTypeSelect.value === '學科家教';
      subjectGroup.hidden = !needsSubject;
      subjectSelect.disabled = !needsSubject;
      subjectSelect.required = needsSubject;

      if (!needsSubject) {
        subjectSelect.selectedIndex = 0;
      }

      updateGradeOptions();
    }

    function normalizeTaiwanPhoneNumber(value) {
      if (!value) return '';

      var cleaned = value.trim().replace(/[^\d+]/g, '');
      if (!cleaned) return '';

      if (cleaned.indexOf('+886') === 0) {
        return '+886' + cleaned.slice(4).replace(/^0+/, '');
      }

      if (cleaned.indexOf('886') === 0) {
        return '+886' + cleaned.slice(3).replace(/^0+/, '');
      }

      var digitsOnly = cleaned.replace(/\D/g, '');

      if (digitsOnly.indexOf('09') === 0 && digitsOnly.length === 10) {
        return '+886' + digitsOnly.slice(1);
      }

      if (digitsOnly.indexOf('9') === 0 && digitsOnly.length === 9) {
        return '+886' + digitsOnly;
      }

      return '';
    }

    function buildBookingUrl() {
      var baseUrl = form.getAttribute('data-cal-booking-url') || 'https://cal.antu-edu.com/antu/2hr';
      var url = new URL(baseUrl);
      var nameInput = form.querySelector('[name="name"]');
      var emailInput = form.querySelector('[name="email"]');
      var phoneInput = form.querySelector('[name="phone"]');
      var normalizedPhone = phoneInput ? normalizeTaiwanPhoneNumber(phoneInput.value) : '';

      if (nameInput && nameInput.value.trim()) {
        url.searchParams.set('name', nameInput.value.trim());
      }

      if (emailInput && emailInput.value.trim()) {
        url.searchParams.set('email', emailInput.value.trim());
      }

      if (normalizedPhone) {
        url.searchParams.set('attendeePhoneNumber', normalizedPhone);
      }

      return url.toString();
    }

    function scheduleRedirect() {
      var bookingUrl = buildBookingUrl();

      if (successCta) {
        successCta.setAttribute('href', bookingUrl);
      }

      redirectTimeoutId = window.setTimeout(function() {
        window.location.href = bookingUrl;
      }, 3000);
    }

    if (levelGroupSelect) {
      levelGroupSelect.addEventListener('change', updateGradeOptions);
      updateGradeOptions();
    }

    if (demandTypeSelect) {
      demandTypeSelect.addEventListener('change', updateSubjectVisibility);
      updateSubjectVisibility();
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '傳送中...';
      }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function(response) {
        if (response.ok) {
          form.hidden = true;
          if (successEl) {
            successEl.hidden = false;
          }
          scheduleRedirect();
        } else {
          alert('抱歉，傳送時發生錯誤。請稍後再試。');
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
        }
      }).catch(function() {
        alert('網路連線似乎有問題，請檢查您的網路狀態。');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
      });
    });

    // Reset form + success state when modal closes
    var modal = document.getElementById('reg-modal');
    if (modal) {
      var observer = new MutationObserver(function() {
        if (!modal.classList.contains('is-open')) {
          if (redirectTimeoutId) {
            window.clearTimeout(redirectTimeoutId);
            redirectTimeoutId = null;
          }
          form.hidden = false;
          form.reset();
          updateGradeOptions();
          updateSubjectVisibility();
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
          if (successEl) successEl.hidden = true;
          if (successCta) {
            successCta.setAttribute('href', form.getAttribute('data-cal-booking-url') || 'https://cal.antu-edu.com/antu/2hr');
          }
        }
      });
      observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
    }
  }

  function initScrollAnimations() {
    var animatedElements = document.querySelectorAll('[data-animate]');
    if (!animatedElements.length) {
      return;
    }

    function revealElement(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(revealElement);
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -120px 0px'
      });

      animatedElements.forEach(function(element) {
        observer.observe(element);
      });
    } else {
      animatedElements.forEach(function(element) {
        element.classList.add('is-visible');
      });
    }
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
      link.addEventListener('click', function(event) {
        var targetSelector = link.getAttribute('href');
        if (!targetSelector || targetSelector === '#') {
          return;
        }
        var target = document.querySelector(targetSelector);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function initFabHeroVisibility() {
    var hero = document.querySelector('.hero');
    var dial = document.getElementById('fab-dial');
    if (!hero || !dial) return;

    dial.classList.add('fab-dial--hidden');

    var observer = new IntersectionObserver(function(entries) {
      var heroVisible = entries[0].isIntersecting;
      dial.classList.toggle('fab-dial--hidden', heroVisible);
    }, { threshold: 0 });

    observer.observe(hero);
  }

  function init() {
    initHamburger();
    initFabDial();
    initModal();
    initModalForm();
    initSmoothScroll();
    initScrollAnimations();
    initFabHeroVisibility();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
