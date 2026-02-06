document.addEventListener('DOMContentLoaded', () => {
    
    // 1. MAGNETIC BUTTONS (Mouse follows cursor slightly)
    const buttons = document.querySelectorAll('.nav-btn-glow, .btn-primary-3d');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // 2. PARALLAX CARDS (Catalog)
    const cards = document.querySelectorAll('.bento-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${index * 0.1}s`;
        observer.observe(card);
    });

    // 3. THE VORTEX SCROLL EFFECT (Connect Section)
    const portalSection = document.querySelector('.connect-portal');
    const megaCards = document.querySelectorAll('.social-mega-card');
    
    if(portalSection) {
        window.addEventListener('scroll', () => {
            const sectionTop = portalSection.getBoundingClientRect().top;
            const screenHeight = window.innerHeight;
            
            if (sectionTop < screenHeight) {
                // Calculate progress (0 to 1)
                const progress = 1 - (sectionTop / screenHeight);
                
                megaCards.forEach((card, index) => {
                    const direction = index === 0 ? -1 : 1; // Left vs Right
                    // Move cards inward as you scroll
                    const moveAmount = Math.max(0, (100 - (progress * 100)));
                    card.style.transform = `translateX(${moveAmount * direction}px)`;
                    card.style.opacity = Math.min(1, progress * 2);
                });
            }
        });
    }

    // 4. MOBILE MENU
    const mobileBtn = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu-overlay');
    const closeBtn = document.querySelector('.mm-close');
    const menuLinks = document.querySelectorAll('.mm-content a');

    if(mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Lock Scroll
            setTimeout(() => mobileMenu.style.opacity = '1', 10);
        });
        
        const closeMenu = () => {
            mobileMenu.style.opacity = '0';
            document.body.style.overflow = ''; // Unlock Scroll
            setTimeout(() => mobileMenu.style.display = 'none', 300);
        }

        closeBtn.addEventListener('click', closeMenu);
        
        menuLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
});