document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Hardware Accelerated Scroll Reveals
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target); 
            }
        });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // 2. Premium Nav Blur Transition
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    }, { passive: true });

    // 3. Optional: Mouse tracking for desktop card glow (Vercel style)
    const cards = document.querySelectorAll('.bento-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set custom properties for the CSS radial gradient
            const glow = card.querySelector('.card-glow-border');
            if(glow) {
                glow.style.setProperty('--mouse-x', `${x}px`);
                glow.style.setProperty('--mouse-y', `${y}px`);
            }
        });
    });
});