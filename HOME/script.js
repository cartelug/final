/**
 * ACCESSUG - PREMIUM INTERACTION ENGINE
 * Mobile-optimized, lightweight, high-performance execution.
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // 2. High-Performance Scroll Reveals (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Run once for performance
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

    // 3. Vault Filter Logic (Native Scroll Reset)
    const vaultTrack = document.getElementById('vault-track');
    const cards = document.querySelectorAll('.service-card');
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (vaultTrack && cards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                let firstMatch = null;

                cards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'flex';
                        // Add a tiny animation reset for premium feel
                        card.style.animation = 'none';
                        card.offsetHeight; /* trigger reflow */
                        card.style.animation = null; 
                        
                        if (!firstMatch) firstMatch = card;
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Smooth scroll back to start of track on mobile
                if (firstMatch) {
                    setTimeout(() => {
                        vaultTrack.scrollTo({ left: 0, behavior: 'smooth' });
                    }, 10);
                }
            });
        });
    }

    // 4. Marquee Interaction (Pause on Hover/Touch)
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        const pauseMarquee = () => marqueeTrack.style.animationPlayState = 'paused';
        const playMarquee = () => marqueeTrack.style.animationPlayState = 'running';
        
        marqueeTrack.addEventListener('mouseenter', pauseMarquee);
        marqueeTrack.addEventListener('mouseleave', playMarquee);
        marqueeTrack.addEventListener('touchstart', pauseMarquee, {passive: true});
        marqueeTrack.addEventListener('touchend', playMarquee);
    }

    // 5. Tap-to-Zoom Lightbox for Intel Section
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const intelImgs = document.querySelectorAll('.intel-img');

    if (lightbox && lightboxImg) {
        intelImgs.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                if(marqueeTrack) marqueeTrack.style.animationPlayState = 'paused';
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            if(marqueeTrack) marqueeTrack.style.animationPlayState = 'running';
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
});