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

    // === 4. SPATIAL CAROUSEL ENGINE (Zero Lag) ===
    const vaultTrack = document.getElementById('vault-track');
    const cards = document.querySelectorAll('.spatial-card');
    const filterPills = document.querySelectorAll('.dock-btn'); 

    if(vaultTrack && cards.length > 0) {
        
        // --- Intersection Observer for Active Scale & Opacity ---
        const carouselObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    cards.forEach(c => c.classList.remove('is-active'));
                    entry.target.classList.add('is-active');
                }
            });
        }, { root: vaultTrack, rootMargin: '0px', threshold: 0.6 });

        cards.forEach(card => carouselObserver.observe(card));

        // Center first item on load
        setTimeout(() => {
            const firstActive = [...cards].find(c => c.style.display !== 'none');
            if(firstActive) {
                const scrollPos = firstActive.offsetLeft - (window.innerWidth / 2) + (firstActive.offsetWidth / 2);
                vaultTrack.scrollTo({ left: scrollPos, behavior: 'smooth' });
            }
        }, 500);

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
                        const scrollPos = firstMatch.offsetLeft - (window.innerWidth / 2) + (firstMatch.offsetWidth / 2);
                        vaultTrack.scrollTo({ left: scrollPos, behavior: 'smooth' });
                    }, 50);
                }
            });
        });
    }

    // === 5. SWIPEABLE + FAST AUTO-SCROLL MARQUEE ===
    const marquee = document.getElementById('swipe-marquee');
    const track = document.getElementById('marquee-track');
    let isDown = false;
    let startX;
    let scrollLeft;
    let autoScrollSpeed = 2; // Fast speed
    let autoScrollActive = true;

    // Auto-scroll loop
    const autoScroll = () => {
        if (autoScrollActive && !isDown && marquee) {
            marquee.scrollLeft += autoScrollSpeed;
            // Seamless loop reset
            if (marquee.scrollLeft >= track.scrollWidth / 2) {
                marquee.scrollLeft = 0;
            }
        }
        requestAnimationFrame(autoScroll);
    };
    if (marquee && track) {
        requestAnimationFrame(autoScroll);
    }

    // Mouse / Drag Events
    if(marquee) {
        marquee.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - marquee.offsetLeft;
            scrollLeft = marquee.scrollLeft;
        });
        marquee.addEventListener('mouseleave', () => { isDown = false; });
        marquee.addEventListener('mouseup', () => { isDown = false; });
        marquee.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - marquee.offsetLeft;
            const walk = (x - startX) * 2; // Drag multiplier
            marquee.scrollLeft = scrollLeft - walk;
        });

        // Touch / Swipe Events
        marquee.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - marquee.offsetLeft;
            scrollLeft = marquee.scrollLeft;
        }, { passive: true });
        marquee.addEventListener('touchend', () => { isDown = false; });
        marquee.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - marquee.offsetLeft;
            const walk = (x - startX) * 2;
            marquee.scrollLeft = scrollLeft - walk;
        }, { passive: true });
    }

    // === 6. TAP-TO-ZOOM LIGHTBOX ===
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const intelAssets = document.querySelectorAll('.intel-asset');

    if(lightbox && lightboxImg) {
        intelAssets.forEach(asset => {
            asset.addEventListener('click', () => {
                if(!isDown) {
                    lightbox.classList.add('active');
                    lightboxImg.src = asset.src;
                    autoScrollActive = false;
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            autoScrollActive = true; 
        };

        if(closeBtn) closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
});