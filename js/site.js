(function() {
  'use strict';

  function copyFallback(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); btn.textContent = '已複製'; }
    catch (e) { btn.textContent = '失敗'; }
    setTimeout(function() { btn.textContent = '複製'; }, 1500);
    document.body.removeChild(ta);
  }

  function copyInstall(btn) {
    var block = btn.parentElement;
    var text = block.querySelector('.cmd');
    if (!text) return;
    var cmd = text.textContent.trim();
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(cmd).then(function() {
        btn.textContent = '已複製';
        setTimeout(function() { btn.textContent = '複製'; }, 1500);
      }).catch(function() {
        copyFallback(cmd, btn);
      });
    } else {
      copyFallback(cmd, btn);
    }
  }
  window.copyInstall = copyInstall;

  function initHamburger() {
    var navEl = document.querySelector('.nav');
    var hamburger = document.querySelector('.nav__hamburger');
    var navLinks = document.getElementById('nav-links');

    if (!hamburger || !navEl) return;

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

  function initScrollAnimations() {
    var animatedElements = document.querySelectorAll('[data-animate]');
    if (!animatedElements.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

      animatedElements.forEach(function(el) { observer.observe(el); });
    } else {
      animatedElements.forEach(function(el) { el.classList.add('is-visible'); });
    }
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
      link.addEventListener('click', function(event) {
        var targetSelector = link.getAttribute('href');
        if (!targetSelector || targetSelector === '#') return;
        var target = document.querySelector(targetSelector);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function init() {
    initHamburger();
    initSmoothScroll();
    initScrollAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
