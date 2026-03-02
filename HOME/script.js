/**
 * ACCESSUG - PREMIUM INTERACTION ENGINE
 * Focused on performance, smooth state transitions, and native feel.
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. DYNAMIC SPOTLIGHT (Desktop only, minimal overhead)
    const spotlight = document.getElementById('spotlight');
    if (spotlight && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                spotlight.style.left = `${e.clientX}px`;
                spotlight.style.top = `${e.clientY}px`;
            });
        });
        document.addEventListener('mouseleave', () => spotlight.style.opacity = '0');
        document.addEventListener('mouseenter', () => spotlight.style.opacity = '1');
    }

    // 2. GLASS NAVBAR SCROLL STATE
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // 3. HARDWARE-ACCELERATED REVEAL OBSERVER
    const observerOptions = { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0 };
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));

    // 4. VAULT FILTER (Smooth DOM update)
    const vaultTrack = document.getElementById('vault-track');
    const cards = document.querySelectorAll('.premium-card');
    const filterBtns = document.querySelectorAll('.filter-btn'); 

    if (vaultTrack && cards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                let firstMatch = null;

                cards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'flex';
                        if (!firstMatch) firstMatch = card;
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Smooth scroll back to start of track on filter change
                if (firstMatch) {
                    setTimeout(() => {
                        vaultTrack.scrollTo({ left: 0, behavior: 'smooth' });
                    }, 50);
                }
            });
        });
    }

    // 5. SEAMLESS DRAG & AUTO-SCROLL MARQUEE
    const marquee = document.getElementById('swipe-marquee');
    const track = document.getElementById('marquee-track');
    let isDown = false;
    let startX;
    let scrollLeft;
    let autoScrollSpeed = 1; // Elegant, slow speed
    let autoScrollActive = true;

    const autoScroll = () => {
        if (autoScrollActive && !isDown && marquee) {
            marquee.scrollLeft += autoScrollSpeed;
            // Seamless loop logic: if scrolled past halfway, reset to 0
            if (marquee.scrollLeft >= track.scrollWidth / 2) {
                marquee.scrollLeft = 0;
            }
        }
        requestAnimationFrame(autoScroll);
    };

    if (marquee && track) {
        requestAnimationFrame(autoScroll);

        // Mouse Drag
        marquee.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - marquee.offsetLeft;
            scrollLeft = marquee.scrollLeft;
            marquee.style.cursor = 'grabbing';
        });
        marquee.addEventListener('mouseleave', () => { isDown = false; marquee.style.cursor = 'grab'; });
        marquee.addEventListener('mouseup', () => { isDown = false; marquee.style.cursor = 'grab'; });
        marquee.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - marquee.offsetLeft;
            const walk = (x - startX) * 1.5; 
            marquee.scrollLeft = scrollLeft - walk;
        });

        // Touch Swipe
        marquee.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - marquee.offsetLeft;
            scrollLeft = marquee.scrollLeft;
        }, { passive: true });
        marquee.addEventListener('touchend', () => { isDown = false; });
        marquee.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - marquee.offsetLeft;
            const walk = (x - startX) * 1.5;
            marquee.scrollLeft = scrollLeft - walk;
        }, { passive: true });
    }

    // 6. CINEMATIC LIGHTBOX
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const intelAssets = document.querySelectorAll('.intel-asset');

    if (lightbox && lightboxImg) {
        intelAssets.forEach(asset => {
            asset.addEventListener('click', () => {
                if (!isDown) { // Prevent opening while dragging
                    lightbox.classList.add('active');
                    lightboxImg.src = asset.src;
                    autoScrollActive = false; // Pause marquee
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            autoScrollActive = true; // Resume marquee
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }
});