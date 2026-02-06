document.addEventListener('DOMContentLoaded', () => {
    
    // 1. MOBILE DRAWER LOGIC (New & Fixed)
    const mobileBtn = document.querySelector('.mobile-toggle');
    const closeBtn = document.querySelector('.mm-close-btn');
    const drawer = document.querySelector('.mobile-menu-drawer');
    const overlay = document.querySelector('.mm-overlay');
    const menuLinks = document.querySelectorAll('.mm-item, .mm-cta');

    function toggleMenu(show) {
        if (show) {
            drawer.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop background scrolling
        } else {
            drawer.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => toggleMenu(true));
        closeBtn.addEventListener('click', () => toggleMenu(false));
        overlay.addEventListener('click', () => toggleMenu(false));
        
        // Close when clicking a link
        menuLinks.forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });
    }

    // 2. PARALLAX CARD ENTRY
    const cards = document.querySelectorAll('.bento-card, .deck-card');
    
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
        card.style.transform = 'translateY(40px)';
        // Stagger effect
        card.style.transition = `all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) ${index * 0.05}s`;
        observer.observe(card);
    });

    // 3. MAGNETIC BUTTONS (Subtle Effect)
    const buttons = document.querySelectorAll('.btn-primary-3d');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0) scale(1)';
        });
    });

});