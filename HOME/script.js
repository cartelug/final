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

    // === 4. 3D TILT PHYSICS FOR CARDS ===
    const cards = document.querySelectorAll('[data-tilt]');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (!window.matchMedia("(pointer: fine)").matches) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4; 
            const rotateY = ((x - centerX) / centerX) * 4;
            card.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1500px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
    });

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