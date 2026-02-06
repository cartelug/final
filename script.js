document.addEventListener('DOMContentLoaded', () => {
    
    // 1. MOBILE MENU TOGGLE
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    const menuLinks = document.querySelectorAll('.mm-link');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            menuOverlay.classList.toggle('active');
        });

        // Close when clicking a link
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuOverlay.classList.remove('active');
            });
        });
    }

    // 2. SCROLL FADE-IN ANIMATIONS
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

    // Apply to all fade-in elements (manually selected or generic)
    const fadeElements = document.querySelectorAll('.fade-in-up, .bento-card, .timeline-step, .faq-item');
    fadeElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s ease-out";
        observer.observe(el);
    });

    // 3. 3D TILT EFFECT FOR CARDS
    const cards = document.querySelectorAll('.tilt-effect');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max -5deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
        });
    });

    // 4. FAQ ACCORDION
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close others
            faqItems.forEach(other => {
                if (other !== item) other.classList.remove('active');
            });
            // Toggle current
            item.classList.toggle('active');
        });
    });

    // 5. LIVE COUNTER ANIMATION (Fake)
    const counter = document.querySelector('.count-up');
    if (counter) {
        let count = 10000;
        setInterval(() => {
            count += Math.floor(Math.random() * 5);
            counter.innerText = (count / 1000).toFixed(1) + "k+";
        }, 3000);
    }
});