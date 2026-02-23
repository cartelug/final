document.addEventListener('DOMContentLoaded', () => {
    
    // 1. LIGHTWEIGHT SCROLL REVEAL
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Run once for performance
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up').forEach(el => {
        revealObserver.observe(el);
    });

    // 2. NAV BLUR ON SCROLL
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });

    // 3. TAB FILTERING
    const tabs = document.querySelectorAll('.tab');
    const cards = document.querySelectorAll('.service-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.getAttribute('data-filter');

            cards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                if (categories.includes(filter)) {
                    card.style.display = 'flex';
                    // Trigger reflow to restart animation
                    void card.offsetWidth;
                    card.classList.add('is-visible');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('is-visible');
                }
            });
        });
    });

    // 4. PERFORMANCE-SAFE PARALLAX (Only active on desktop to save mobile battery)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (window.innerWidth > 768 && !prefersReducedMotion) {
        const logos = document.querySelectorAll('.f-logo');
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    logos.forEach(logo => {
                        const speed = parseFloat(logo.getAttribute('data-speed'));
                        logo.style.transform = `translateY(${scrollY * speed * -1}px)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
});