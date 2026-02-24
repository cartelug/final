document.addEventListener('DOMContentLoaded', () => {
    // 1. Lightweight Scroll Reveals
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target); 
            }
        });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 2. Nav Blur on Scroll
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    }, { passive: true });

    // 3. Tab Filtering Engine
    const tabs = document.querySelectorAll('.tab-btn');
    const cards = document.querySelectorAll('.luxury-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.getAttribute('data-filter');

            cards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                if (categories.includes(filter)) {
                    card.style.display = 'block';
                    void card.offsetWidth; // Trigger reflow for animation reset
                    card.classList.add('is-visible');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('is-visible');
                }
            });
        });
    });
});