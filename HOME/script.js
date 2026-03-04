/**
 * ACCESSUG - OBSIDIAN INTERACTIVE ENGINE
 * Location: HOME/script.js
 */

document.addEventListener('DOMContentLoaded', () => {

    // === 1. DYNAMIC SPOTLIGHT ===
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

    // === 3. HIGH-PERFORMANCE OBSERVER ===
    const observerOptions = { root: null, rootMargin: '0px 0px -15% 0px', threshold: 0 };
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));

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

// === MASTER SCROLLYTELLING ENGINE ===
    const triggers = document.querySelectorAll('.scroll-trigger');
    const slides = document.querySelectorAll('.hud-slide');
    const nodes = {
        1: ['node-kla'], // Genesis: Kampala active
        2: ['node-kla', 'node-juba', 'node-gulu'], // Scale: Juba and Gulu light up
        3: ['node-kla', 'node-juba'], // Payments
        4: [] // Trust: Map dims for focus
    };

    // Advanced Counter Logic
    const runHudCounters = (slide) => {
        const counters = slide.querySelectorAll('.dynamic-counter');
        counters.forEach(counter => {
            if (counter.classList.contains('counted')) return; // Only count once
            counter.classList.add('counted');
            
            const target = +counter.getAttribute('data-target');
            let current = 0;
            const increment = target / 60; // Smooth 60 frames

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

    // Observer to track which scroll zone the user is in
    const storyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const step = entry.target.getAttribute('data-step');
                
                // 1. Swap the active text slide
                slides.forEach(s => s.classList.remove('active-slide'));
                const activeSlide = document.getElementById(`slide-${step}`);
                if(activeSlide) {
                    activeSlide.classList.add('active-slide');
                    runHudCounters(activeSlide); // Fire numbers if they exist
                }

                // 2. Update the glowing map nodes
                document.querySelectorAll('.map-node').forEach(n => n.classList.remove('active-node'));
                if(nodes[step]) {
                    nodes[step].forEach(nodeId => {
                        const nodeEl = document.getElementById(nodeId);
                        if(nodeEl) nodeEl.classList.add('active-node');
                    });
                }
            }
        });
    }, { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 }); // Triggers right in the middle of the screen

    triggers.forEach(trigger => storyObserver.observe(trigger));
});