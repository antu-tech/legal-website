(function() {
  'use strict';

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
