/**
 * ACCESSUG - OBSIDIAN INTERACTIVE ENGINE
 * Location: HOME/script.js
 */

document.addEventListener('DOMContentLoaded', () => {

    // === 1. DYNAMIC SPOTLIGHT (Cinematic Lighting) ===
    const spotlight = document.getElementById('spotlight');
    
    // Only enable on desktop for performance and UI reasons
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                spotlight.style.left = `${e.clientX}px`;
                spotlight.style.top = `${e.clientY}px`;
            });
        });
        
        // Hide spotlight when mouse leaves the window
        document.addEventListener('mouseleave', () => spotlight.style.opacity = '0');
        document.addEventListener('mouseenter', () => spotlight.style.opacity = '1');
    } else {
        spotlight.style.display = 'none'; // Disable on mobile
    }

    // === 2. PRECISION NAVBAR SCROLL LOGIC ===
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // === 3. HIGH-PERFORMANCE OBSERVER (Scroll Reveals) ===
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -15% 0px', // Trigger slightly before it hits the bottom
        threshold: 0
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Unobserve to save CPU/Battery
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-up');
    animatedElements.forEach(el => revealObserver.observe(el));

    // === 4. 3D TILT PHYSICS FOR VAULT CARDS ===
    // Creates a physical "weight" to the monolith cards when hovered
    const cards = document.querySelectorAll('[data-tilt]');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (!window.matchMedia("(pointer: fine)").matches) return; // Skip on mobile
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -4; // Subtle 4deg tilt
            const rotateY = ((x - centerX) / centerX) * 4;
            
            card.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1500px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
    });
});