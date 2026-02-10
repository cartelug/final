document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. SERVICE NAVIGATOR LOGIC ===
    const tabs = document.querySelectorAll('.tab-chip');
    const cards = document.querySelectorAll('.svc-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // UI State
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter
            const target = tab.dataset.target;
            let count = 0;
            
            cards.forEach(card => {
                const categories = card.dataset.category;
                if (categories.includes(target) && count < 6) { // Limit 6
                    card.style.display = 'flex';
                    card.style.animation = 'none';
                    card.offsetHeight; /* Trigger reflow */
                    card.style.animation = 'fadeIn 0.4s ease forwards';
                    count++;
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // === 2. SCROLL STORY (INTERSECTION OBSERVER) ===
    const storyBlocks = document.querySelectorAll('.story-block');
    const navItems = document.querySelectorAll('.story-nav-list li');
    const progressBar = document.querySelector('.progress-bar');
    
    // Only run complex intersection logic on desktop/tablet
    if (window.innerWidth > 768) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.dataset.step);
                    
                    // Update Active Class
                    storyBlocks.forEach(b => b.classList.remove('active'));
                    entry.target.classList.add('active');

                    // Update Nav
                    navItems.forEach(n => n.classList.remove('active'));
                    if(navItems[index]) navItems[index].classList.add('active');

                    // Update Bar
                    if (progressBar) progressBar.style.setProperty('--prog', `${index * 33}%`);
                }
            });
        }, { threshold: 0.6 });

        storyBlocks.forEach(block => observer.observe(block));
    }

    // === 3. PARALLAX LOGOS (Reduced Motion Safe) ===
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const logos = document.querySelectorAll('.parallax');
    const hero = document.querySelector('.hero-section');

    if (!motionQuery.matches && window.innerWidth > 1024) {
        hero.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX) / 50;
            const y = (window.innerHeight - e.pageY) / 50;

            logos.forEach(logo => {
                const speed = parseFloat(logo.dataset.speed) || 0.05;
                logo.style.transform = `translate(${x * speed * 100}px, ${y * speed * 100}px) rotate(${speed * 100}deg)`;
            });
        });
    }

    // === 4. LIGHTBOX ===
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-image');
    const lbClose = document.querySelector('.lb-close');
    const reviewCards = document.querySelectorAll('.review-card');

    const openLightbox = (src) => {
        lbImg.src = src;
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    reviewCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            if (img) openLightbox(img.src);
        });
    });

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
});