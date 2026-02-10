document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. SERVICE ROUTER (TABS) ===
    const tabs = document.querySelectorAll('.tab-btn');
    const cards = document.querySelectorAll('.service-card');

    if (tabs.length) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Active State
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Filter Logic
                const category = tab.getAttribute('data-tab');
                let visibleCount = 0;

                cards.forEach(card => {
                    const cardCats = card.getAttribute('data-category');
                    if (cardCats.includes(category)) {
                        card.style.display = 'flex';
                        // Add slight animation
                        card.style.animation = 'fadeIn 0.4s ease forwards';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // === 2. SCROLL STORY (INTERSECTION OBSERVER) ===
    const storySection = document.querySelector('.scroll-story-section');
    const storyPanels = document.querySelectorAll('.story-panel');
    const storyLinks = document.querySelectorAll('.story-links li');
    const navIndicator = document.querySelector('.nav-indicator');

    if (storySection && storyPanels.length > 0) {
        // We trigger the change based on scroll percentage within the section
        window.addEventListener('scroll', () => {
            const rect = storySection.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Calculate progress through section (0 to 1)
            // We start activating when section hits middle of screen
            if (rect.top < viewportHeight / 2 && rect.bottom > 0) {
                const scrolled = (viewportHeight / 2 - rect.top);
                const totalHeight = rect.height;
                const progress = Math.min(Math.max(scrolled / totalHeight, 0), 1);
                
                // Map progress to index (0, 1, 2)
                let activeIndex = 0;
                if (progress > 0.66) activeIndex = 2;
                else if (progress > 0.33) activeIndex = 1;

                // Update UI
                updateStory(activeIndex);
            }
        });

        function updateStory(index) {
            // Update Panels
            storyPanels.forEach((panel, i) => {
                if (i === index) panel.classList.add('active');
                else panel.classList.remove('active');
            });

            // Update Links
            storyLinks.forEach((link, i) => {
                if (i === index) link.classList.add('active');
                else link.classList.remove('active');
            });

            // Update Indicator
            if (navIndicator) {
                navIndicator.style.top = `${index * 33}%`;
            }
        }
    }

    // === 3. PARALLAX LOGOS (MOUSE MOVE) ===
    const heroSection = document.querySelector('.hero-section');
    const logos = document.querySelectorAll('.parallax');

    if (heroSection && window.matchMedia('(pointer: fine)').matches) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;

            logos.forEach(logo => {
                const speed = logo.getAttribute('data-speed') || 0.05;
                logo.style.transform = `translateX(${x * speed * 50}px) translateY(${y * speed * 50}px)`;
            });
        });
    }

    // === 4. LIGHTBOX FOR TESTIMONIALS ===
    const tCards = document.querySelectorAll('.t-card');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');

    if (lightbox) {
        tCards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightbox.classList.remove('hidden');
                    document.body.style.overflow = 'hidden'; // Lock scroll
                }
            });
            // Keyboard Access
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') card.click();
            });
        });

        const closeLightbox = () => {
            lightbox.classList.add('hidden');
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    // === 5. SMOOTH SCROLL ANCHORS ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});