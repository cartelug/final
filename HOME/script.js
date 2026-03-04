/**
 * ACCESSUG - MASTER INTERACTIVE ENGINE (100% Optimized)
 * Location: HOME/script.js
 */

document.addEventListener('DOMContentLoaded', () => {

    // === 1. DYNAMIC SPOTLIGHT (GPU Accelerated) ===
    const spotlight = document.getElementById('spotlight');
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                spotlight.style.left = `${e.clientX}px`;
                spotlight.style.top = `${e.clientY}px`;
            });
        });
        document.addEventListener('mouseleave', () => spotlight.style.opacity = '0');
        document.addEventListener('mouseenter', () => spotlight.style.opacity = '1');
    } else {
        spotlight.style.display = 'none';
    }

    // === 2. PRECISION NAVBAR ===
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // === 3. MASTER SCROLL ANIMATION ENGINE ===
    // This watches EVERY element with an animation class and triggers it beautifully
    const observerOptions = { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0 };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the visible class to trigger CSS transition
                entry.target.classList.add('is-visible');
                
                // If it's a counter, trigger the number spinning math
                if (entry.target.querySelector('.anim-counter') && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    runCounters(entry.target);
                }
                
                // Stop observing once animated to save CPU
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Grab all elements that need to animate on scroll
    const animElements = document.querySelectorAll('.fade-up, .scale-in, .slide-in-right, .fade-in');
    animElements.forEach(el => revealObserver.observe(el));


    // === 4. VAULT APP-DOCK FILTER (PURE NATIVE) ===
    const vaultTrack = document.getElementById('vault-track');
    const cards = document.querySelectorAll('.spatial-card');
    const filterPills = document.querySelectorAll('.dock-btn'); 

    if(vaultTrack && cards.length > 0) {
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                
                const filter = pill.getAttribute('data-filter');
                let firstMatch = null;

                cards.forEach(card => {
                    if(filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'flex';
                        if(!firstMatch) firstMatch = card;
                    } else {
                        card.style.display = 'none';
                    }
                });

                if(firstMatch) {
                    setTimeout(() => {
                        vaultTrack.scrollTo({ left: 0, behavior: 'smooth' });
                    }, 50);
                }
            });
        });
    }

    // === 5. NUMBER COUNTER ENGINE (For Intel Pillars) ===
    const runCounters = (parentSection) => {
        const counters = parentSection.querySelectorAll('.anim-counter');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let current = 0;
            const increment = target / 60; // 60 frames = 1 second speed

            const update = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current).toLocaleString();
                    requestAnimationFrame(update);
                } else {
                    counter.innerText = target.toLocaleString();
                }
            };
            update();
        });
    };

});