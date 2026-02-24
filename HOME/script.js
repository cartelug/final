/**
 * ACCESSUG - CHAMELEON ENGINE & OBSERVERS
 * Location: HOME/script.js
 */

document.addEventListener('DOMContentLoaded', () => {

    // === 1. NAVBAR GLASS EFFECT ===
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // === 2. INTERSECTION OBSERVERS (For Reveals) ===
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Save CPU
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => revealObserver.observe(el));

    // === 3. THE CHAMELEON AURA ENGINE ===
    // This watches sections and changes the root aura color based on the brand being viewed.
    const auraContainer = document.body;
    
    const colorObserverOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px', // Trigger when section is squarely in the middle of the screen
        threshold: 0
    };

    const colorObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const colorTheme = entry.target.getAttribute('data-color');
                if (colorTheme) {
                    // Update the active aura variable dynamically
                    auraContainer.style.setProperty('--active-aura', `var(--theme-${colorTheme})`);
                }
            }
        });
    }, colorObserverOptions);

    const colorSections = document.querySelectorAll('[data-color]');
    colorSections.forEach(section => colorObserver.observe(section));

});