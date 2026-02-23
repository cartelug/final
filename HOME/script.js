document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. PROFESSIONAL MOBILE MENU TOGGLE ===
    const menuBtn = document.getElementById('menu-btn');
    const menuOverlay = document.getElementById('mob-menu-overlay');
    const menuLinks = document.querySelectorAll('.mm-link');

    if (menuBtn && menuOverlay) {
        menuBtn.addEventListener('click', () => {
            // Toggle Active State
            menuOverlay.classList.toggle('active');
            
            // Animate Hamburger Icon
            if (menuOverlay.classList.contains('active')) {
                menuBtn.classList.add('menu-open');
                document.body.style.overflow = 'hidden'; // Lock scroll
            } else {
                menuBtn.classList.remove('menu-open');
                document.body.style.overflow = ''; // Unlock scroll
            }
        });

        // Close when clicking a link
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuOverlay.classList.remove('active');
                menuBtn.classList.remove('menu-open');
                document.body.style.overflow = '';
            });
        });
    }

    // === 2. SCROLL FADE-IN ANIMATIONS (Legacy Support) ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply to elements
    const fadeElements = document.querySelectorAll('.obs-card, .section-title');
    fadeElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s ease-out";
        observer.observe(el);
    });

    // === 3. 3D TILT EFFECT FOR CARDS (Refined) ===
    const cards = document.querySelectorAll('.obs-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -3; 
            const rotateY = ((x - centerX) / centerX) * 3;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
        });
    });
});