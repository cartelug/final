/**
 * ACCESSUG - ELITE INTERACTION ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. CUSTOM FLARE CURSOR (Desktop Only)
    const flare = document.getElementById('flare');
    if (window.matchMedia("(pointer: fine)").matches && flare) {
        window.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                flare.style.left = `${e.clientX}px`;
                flare.style.top = `${e.clientY}px`;
            });
        });
        document.addEventListener('mouseleave', () => flare.style.opacity = '0');
        document.addEventListener('mouseenter', () => flare.style.opacity = '1');
    } else if(flare) {
        flare.style.display = 'none';
    }

    // 2. GLASS NAV SCROLL BEHAVIOR
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // 3. PREMIUM REVEAL OBSERVER
    const observerOptions = { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 };
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Unobserve to animate only once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

    // 4. VAULT CATEGORY FILTER
    const vaultTrack = document.getElementById('vault-track');
    const cards = document.querySelectorAll('.elite-card');
    const tabs = document.querySelectorAll('.tab-btn'); 

    if(vaultTrack && cards.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab styling
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const filter = tab.getAttribute('data-filter');
                let firstMatch = null;

                // Animate out, then filter, then animate in
                cards.forEach(card => {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    
                    setTimeout(() => {
                        if(filter === 'all' || card.getAttribute('data-category') === filter) {
                            card.style.display = 'flex';
                            if(!firstMatch) firstMatch = card;
                            
                            // Trigger reflow and animate in
                            requestAnimationFrame(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1) translateY(0)';
                            });
                        } else {
                            card.style.display = 'none';
                        }
                    }, 300); // Wait for fade out
                });

                // Scroll to the first match smoothly
                if(firstMatch) {
                    setTimeout(() => {
                        vaultTrack.scrollTo({ left: 0, behavior: 'smooth' });
                    }, 350);
                }
            });
        });
    }

    // 5. MARQUEE AUTO-SCROLL & DRAG
    const marquee = document.getElementById('swipe-marquee');
    const track = document.getElementById('marquee-track');
    let isDown = false;
    let startX;
    let scrollLeft;
    let autoScrollSpeed = 1.5; 
    let autoScrollActive = true;

    const autoScroll = () => {
        if (autoScrollActive && !isDown && marquee) {
            marquee.scrollLeft += autoScrollSpeed;
            // Loop back when reaching half (assuming duplicated content)
            if (marquee.scrollLeft >= track.scrollWidth / 2) {
                marquee.scrollLeft = 0;
            }
        }
        requestAnimationFrame(autoScroll);
    };
    
    if (marquee && track) {
        requestAnimationFrame(autoScroll);

        // Mouse Events
        marquee.addEventListener('mousedown', (e) => {
            isDown = true;
            marquee.style.cursor = 'grabbing';
            startX = e.pageX - marquee.offsetLeft;
            scrollLeft = marquee.scrollLeft;
        });
        marquee.addEventListener('mouseleave', () => { 
            isDown = false; 
            marquee.style.cursor = 'grab';
        });
        marquee.addEventListener('mouseup', () => { 
            isDown = false; 
            marquee.style.cursor = 'grab';
        });
        marquee.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - marquee.offsetLeft;
            const walk = (x - startX) * 2; 
            marquee.scrollLeft = scrollLeft - walk;
        });

        // Touch Events
        marquee.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - marquee.offsetLeft;
            scrollLeft = marquee.scrollLeft;
        }, { passive: true });
        marquee.addEventListener('touchend', () => { isDown = false; });
        marquee.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - marquee.offsetLeft;
            const walk = (x - startX) * 2.5; // Slightly faster drag on mobile
            marquee.scrollLeft = scrollLeft - walk;
        }, { passive: true });
    }

    // 6. LIGHTBOX ZOOM
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const intelAssets = document.querySelectorAll('.intel-asset');

    if(lightbox && lightboxImg) {
        intelAssets.forEach(asset => {
            asset.addEventListener('click', () => {
                if(!isDown) { // Prevent click triggering while dragging
                    lightbox.classList.add('active');
                    lightboxImg.src = asset.src;
                    autoScrollActive = false;
                    document.body.style.overflow = 'hidden'; // Stop background scrolling
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            autoScrollActive = true; 
            document.body.style.overflow = '';
        };

        if(closeBtn) closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
});