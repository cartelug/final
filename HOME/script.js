/**
 * ACCESSUG - ELITE INTERACTION ENGINE V2
 * Performance optimized: Removed heavy DOM manip, utilizing hardware acceleration.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. HARDWARE-ACCELERATED FLARE CURSOR
    const flare = document.getElementById('flare');
    if (window.matchMedia("(pointer: fine)").matches && flare) {
        let mouseX = 0, mouseY = 0;
        let flareX = 0, flareY = 0;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Smooth interpolation for premium feel
        const animateFlare = () => {
            flareX += (mouseX - flareX) * 0.15;
            flareY += (mouseY - flareY) * 0.15;
            flare.style.transform = `translate3d(calc(${flareX}px - 50%), calc(${flareY}px - 50%), 0)`;
            requestAnimationFrame(animateFlare);
        };
        requestAnimationFrame(animateFlare);

        document.addEventListener('mouseleave', () => flare.style.opacity = '0');
        document.addEventListener('mouseenter', () => flare.style.opacity = '1');
    } else if (flare) {
        flare.style.display = 'none'; // Disable on mobile/touch for performance
    }

    // 2. GLASS NAV SCROLL OBSERVER (Better performance than scroll listener)
    const navbar = document.getElementById('navbar');
    const heroSection = document.querySelector('.scene-hero');
    
    if(navbar && heroSection) {
        const navObserver = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { rootMargin: '-80px 0px 0px 0px' });
        navObserver.observe(heroSection);
    }

    // 3. PREMIUM REVEAL ANIMATIONS
    const revealOptions = { root: null, rootMargin: '0px 0px -5% 0px', threshold: 0.1 };
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

    // 4. VAULT FILTERING (Optimized)
    const vaultTrack = document.getElementById('vault-track');
    const cards = document.querySelectorAll('.elite-card');
    const tabs = document.querySelectorAll('.tab-btn'); 

    if (vaultTrack && cards.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const target = e.currentTarget;
                tabs.forEach(t => t.classList.remove('active'));
                target.classList.add('active');
                
                const filter = target.getAttribute('data-filter');

                cards.forEach(card => {
                    // Quick fade out
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    
                    setTimeout(() => {
                        if (filter === 'all' || card.getAttribute('data-category') === filter) {
                            card.style.display = 'flex';
                            requestAnimationFrame(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1) translateY(0)';
                            });
                        } else {
                            card.style.display = 'none';
                        }
                    }, 300);
                });

                // Reset scroll position smoothly
                setTimeout(() => {
                    vaultTrack.scrollTo({ left: 0, behavior: 'smooth' });
                }, 350);
            });
        });
    }

    // 5. LIGHTBOX ZOOM LOGIC
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const intelAssets = document.querySelectorAll('.intel-asset');

    if (lightbox && lightboxImg) {
        intelAssets.forEach(asset => {
            asset.addEventListener('click', () => {
                lightbox.classList.add('active');
                lightboxImg.src = asset.src;
                document.body.style.overflow = 'hidden'; // Lock background
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            setTimeout(() => { lightboxImg.src = ''; }, 400); // Clear after fade out
            document.body.style.overflow = '';
        };

        if(closeBtn) closeBtn.addEventListener('click', closeLightbox);
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