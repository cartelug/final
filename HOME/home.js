document.addEventListener('DOMContentLoaded', () => {
    
    // 1. ELITE SCROLL ANIMATION ENGINE (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Triggers when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the animate class
                entry.target.classList.add('aos-animate');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Grab all elements with data-aos and observe them
    const aosElements = document.querySelectorAll('[data-aos]');
    aosElements.forEach(el => observer.observe(el));


    // 2. NAVBAR SCROLL EFFECT
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. SERVICE TAB FILTERING
    const tabChips = document.querySelectorAll('.tab-chip');
    const serviceCards = document.querySelectorAll('.elite-card');

    tabChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Remove active from all chips
            tabChips.forEach(c => c.classList.remove('active'));
            // Add active to clicked chip
            chip.classList.add('active');

            const targetCategory = chip.getAttribute('data-target');

            // Filter logic
            serviceCards.forEach(card => {
                const cardCategories = card.getAttribute('data-category').split(' ');
                
                // Hide card first
                card.style.display = 'none';
                card.classList.remove('aos-animate'); // Reset animation state
                
                // If it matches, show it
                if (cardCategories.includes(targetCategory)) {
                    card.style.display = 'block';
                    // Re-trigger animation cleanly
                    setTimeout(() => {
                        card.classList.add('aos-animate');
                    }, 50);
                }
            });
        });
    });

    // 4. MOUSE PARALLAX FOR 3D TOKENS (Desktop Only)
    const tokens = document.querySelectorAll('.orbit-item');
    const heroSection = document.querySelector('.hero-section');

    if (window.innerWidth > 768) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            tokens.forEach(token => {
                const speed = parseFloat(token.getAttribute('data-speed')) || 1;
                const moveX = x * 30 * speed;
                const moveY = y * 30 * speed;
                
                // Apply a smooth transform
                token.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });

        // Reset tokens on mouse leave
        heroSection.addEventListener('mouseleave', () => {
            tokens.forEach(token => {
                token.style.transform = `translate(0px, 0px)`;
            });
        });
    }

});