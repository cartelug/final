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
        
        // --- Dock Filter Logic ---
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

// === 5. LIVE CHAT POP-IN SEQUENCER ===
    // This creates the "someone is texting you" stagger effect
    const chatObserverOptions = { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 };
    
    const chatObserver = new IntersectionObserver((entries, observer) => {
        // Find all entries that are intersecting
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        // Add a slight delay to each one based on its position so they pop one by one
        visibleEntries.forEach((entry, index) => {
            setTimeout(() => {
                entry.target.classList.add('is-visible');
            }, index * 200); // 200ms delay between each bubble
            
            observer.unobserve(entry.target);
        });
    }, chatObserverOptions);

    document.querySelectorAll('.reveal-chat').forEach(chat => {
        chatObserver.observe(chat);
    });

}); // End of DOMContentLoaded