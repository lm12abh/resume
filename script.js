document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initScrollReveal();
    initSmoothScrolling();
    initContactForm();
});

// ─── Navigation ──────────────────────────────────────────────────────────────

function initNavigation() {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('navMenu');
    const navLinks  = document.querySelectorAll('.nav-link');

    // Hamburger toggle
    hamburger.addEventListener('click', function () {
        const isOpen = hamburger.classList.toggle('active');
        navMenu.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Scroll: toggle .scrolled class and update active link
    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        updateActiveLink();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
}

function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 120) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${current}`);
    });
}

// ─── Scroll Reveal ───────────────────────────────────────────────────────────

function initScrollReveal() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger siblings in grids slightly
                    const siblings = entry.target.parentElement
                        ? [...entry.target.parentElement.children].filter(el => el.classList.contains('reveal'))
                        : [];
                    const index = siblings.indexOf(entry.target);
                    const delay = index >= 0 ? index * 80 : 0;

                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);

                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ─── Contact Form ────────────────────────────────────────────────────────────

function initContactForm() {
    const form     = document.getElementById('contactForm');
    const btn      = document.getElementById('submitBtn');
    const feedback = document.getElementById('formFeedback');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        feedback.textContent = '';
        feedback.className = 'form-feedback';

        const name    = form.name.value.trim();
        const email   = form.email.value.trim();
        const message = form.message.value.trim();

        if (!name || !email || !message) {
            feedback.textContent = 'Please fill in your name, email, and message.';
            feedback.classList.add('error');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            feedback.textContent = 'Please enter a valid email address.';
            feedback.classList.add('error');
            return;
        }

        // ← Paste your Formspree form ID here (from formspree.io/dashboard)
        const FORMSPREE_ID = 'mvzdroql';

        btn.disabled = true;
        btn.querySelector('.btn-text').textContent = 'Sending…';

        fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: new FormData(form)
        })
        .then(res => {
            if (res.ok) {
                form.reset();
                feedback.textContent = 'Message sent — I\'ll get back to you soon.';
                feedback.classList.add('success');
            } else {
                return res.json().then(data => {
                    throw new Error(data.errors ? data.errors.map(e => e.message).join(', ') : 'Submission failed.');
                });
            }
        })
        .catch(err => {
            feedback.textContent = err.message || 'Something went wrong. Please try again.';
            feedback.classList.add('error');
        })
        .finally(() => {
            btn.disabled = false;
            btn.querySelector('.btn-text').textContent = 'Send Message';
        });
    });
}

// ─── Smooth Scrolling ────────────────────────────────────────────────────────

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const offset = target.offsetTop - 64;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        });
    });
}
