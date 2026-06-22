/* DEN-AI — Shared JavaScript */

(function () {
    'use strict';

    /* ---- UTC Clock ---- */
    var clockEl = document.getElementById('utcClock');
    if (clockEl) {
        function updateClock() {
            var n = new Date();
            clockEl.textContent =
                String(n.getUTCHours()).padStart(2,'0') + ':' +
                String(n.getUTCMinutes()).padStart(2,'0') + ':' +
                String(n.getUTCSeconds()).padStart(2,'0') + ' UTC';
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    /* ---- Mobile Nav Toggle ---- */
    var burger = document.getElementById('headerBurger');
    var nav    = document.getElementById('headerNav');
    if (burger && nav) {
        burger.addEventListener('click', function () {
            var isOpen = nav.classList.toggle('open');
            burger.setAttribute('aria-expanded', isOpen);
        });
        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('open');
                burger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ---- Scroll Reveal with stagger ---- */
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
        var revealObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var siblings = entry.target.parentElement.querySelectorAll('.reveal');
                    var idx = Array.from(siblings).indexOf(entry.target);
                    entry.target.style.transitionDelay = (idx * 0.08) + 's';
                    entry.target.classList.add('visible');
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

        /* Fallback for slow connections / iframes */
        setTimeout(function () {
            reveals.forEach(function (el) {
                if (!el.classList.contains('visible')) el.classList.add('visible');
            });
        }, 3000);

        reveals.forEach(function (el) { revealObs.observe(el); });
    }

    /* ---- Bar Fill on Scroll ---- */
    document.querySelectorAll('.bar-track__fill').forEach(function (bar) {
        var target = bar.style.width;
        bar.style.width = '0%';
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    setTimeout(function () { bar.style.width = target; }, 250);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        obs.observe(bar);
    });

    /* ---- Back to Top ---- */
    var backTop = document.getElementById('backToTop');
    if (backTop) {
        backTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---- Contact form submit (prevent default, show confirmation) ---- */
    var form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = form.querySelector('.btn--primary');
            if (btn) {
                btn.textContent = 'Message Sent —';
                btn.style.background = '#2a2a2a';
                btn.style.cursor = 'default';
                btn.disabled = true;
            }
        });
    }

})();
