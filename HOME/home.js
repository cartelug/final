document.addEventListener('DOMContentLoaded', () => {
    
    // 1. LIGHTWEIGHT SCROLL REVEAL (Intersection Observer)
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px', // Triggers slightly before element comes into view
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once revealed to save resources
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // 2. NAVBAR BLUR EFFECT ON SCROLL
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true }); // passive: true improves scroll performance

    // 3. FLUID SERVICE TAB FILTERING
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const target = btn.getAttribute('data-target');

            serviceCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                if (categories.includes(target)) {
                    card.style.display = 'flex';
                    // Force a reflow to restart CSS animation cleanly
                    void card.offsetWidth; 
                    card.classList.add('is-visible');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('is-visible');
                }
            });
        });
    });

});