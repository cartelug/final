document.addEventListener('DOMContentLoaded', () => {
    
    // 1. MOBILE MENU TOGGLE
    const menuBtn = document.querySelector('.menu-trigger');
    const portal = document.querySelector('.mobile-portal');
    const links = document.querySelectorAll('.mp-content a');

    if(menuBtn) {
        menuBtn.addEventListener('click', () => {
            portal.classList.toggle('active');
            menuBtn.classList.toggle('open');
            // Animate lines
            const lines = menuBtn.querySelectorAll('.line');
            if(portal.classList.contains('active')) {
                lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                lines[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                lines.forEach(l => l.style.transform = 'none');
            }
        });

        links.forEach(l => {
            l.addEventListener('click', () => {
                portal.classList.remove('active');
                menuBtn.querySelectorAll('.line').forEach(l => l.style.transform = 'none');
            });
        });
    }

    // 2. PARALLAX CARDS (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    const cards = document.querySelectorAll('.holo-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        // Staggered delay
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // 3. MOUSE TRACKING GLOW (For Buttons)
    const buttons = document.querySelectorAll('.btn-neon-primary');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            btn.style.setProperty('--x', x + 'px');
            btn.style.setProperty('--y', y + 'px');
        });
    });
});