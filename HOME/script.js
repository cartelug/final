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

    // === 4. SPATIAL CAROUSEL ENGINE & SLIDE-TO-DEPLOY ===
    const track = document.getElementById('vault-track');
    const cards = document.querySelectorAll('.spatial-card');
    const silkMesh = document.getElementById('silk-mesh');
    const filterPills = document.querySelectorAll('.filter-pill');

    if(track && cards.length > 0) {
        
        // --- 1. Intersection Observer for Active Focus & Aura ---
        const observerOptions = { root: track, rootMargin: '0px', threshold: 0.6 };
        const carouselObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remove active from all
                    cards.forEach(c => c.classList.remove('is-active'));
                    // Add active to centered
                    entry.target.classList.add('is-active');
                    
                    // Shift Background Aura
                    const themeColor = entry.target.getAttribute('data-theme');
                    if(themeColor) {
                        silkMesh.style.background = `radial-gradient(circle, ${themeColor} 0%, transparent 60%)`;
                    }
                }
            });
        }, observerOptions);

        cards.forEach(card => carouselObserver.observe(card));

        // Center first item on load
        setTimeout(() => {
            const firstActive = [...cards].find(c => c.style.display !== 'none');
            if(firstActive) {
                const scrollPos = firstActive.offsetLeft - (window.innerWidth / 2) + (firstActive.offsetWidth / 2);
                track.scrollTo({ left: scrollPos, behavior: 'smooth' });
            }
        }, 500);

        // --- 2. Filter Logic ---
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

                // Scroll to first matched item
                if(firstMatch) {
                    setTimeout(() => {
                        const scrollPos = firstMatch.offsetLeft - (window.innerWidth / 2) + (firstMatch.offsetWidth / 2);
                        track.scrollTo({ left: scrollPos, behavior: 'smooth' });
                    }, 50);
                }
            });
        });

        // --- 3. Slide to Deploy Logic ---
        const slideTracks = document.querySelectorAll('.slide-track:not(.disabled)');
        
        slideTracks.forEach(trackElement => {
            const thumb = trackElement.querySelector('.slide-thumb');
            const text = trackElement.querySelector('.slide-text');
            const targetLink = trackElement.getAttribute('data-link');
            
            let isDragging = false;
            let startX = 0;
            let currentX = 0;
            const maxDrag = trackElement.offsetWidth - thumb.offsetWidth - 8; // 8px padding

            const startDrag = (e) => {
                isDragging = true;
                startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
                thumb.style.transition = 'none';
                text.style.opacity = '0.3';
            };

            const drag = (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
                currentX = Math.min(Math.max(0, x - startX), maxDrag);
                thumb.style.transform = `translateX(${currentX}px)`;
            };

            const endDrag = () => {
                if (!isDragging) return;
                isDragging = false;
                thumb.style.transition = 'transform 0.3s ease';
                
                if (currentX >= maxDrag * 0.85) { // 85% threshold to trigger
                    thumb.style.transform = `translateX(${maxDrag}px)`;
                    thumb.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                    setTimeout(() => {
                        window.location.href = targetLink;
                    }, 300);
                } else {
                    thumb.style.transform = `translateX(0px)`;
                    text.style.opacity = '1';
                }
            };

            thumb.addEventListener('mousedown', startDrag);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', endDrag);

            thumb.addEventListener('touchstart', startDrag, {passive: true});
            document.addEventListener('touchmove', drag, {passive: false});
            document.addEventListener('touchend', endDrag);
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
        if (autoScrollActive && !isDown) {
            marquee.scrollLeft += autoScrollSpeed;
            // Seamless loop reset
            if (marquee.scrollLeft >= track.scrollWidth / 2) {
                marquee.scrollLeft = 0;
            }
        }
        requestAnimationFrame(autoScroll);
    };
    requestAnimationFrame(autoScroll);

    // Mouse / Drag Events
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


    // === 6. TAP-TO-ZOOM LIGHTBOX ===
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const intelAssets = document.querySelectorAll('.intel-asset');

    intelAssets.forEach(asset => {
        asset.addEventListener('click', () => {
            // Check if it was a drag or a click by looking at drag state
            if(!isDown) {
                lightbox.classList.add('active');
                lightboxImg.src = asset.src;
                autoScrollActive = false; // Pause background animation
            }
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        autoScrollActive = true; // Resume background animation
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
});