document.addEventListener('DOMContentLoaded', () => {
    
    // 1. CAROUSEL LOGIC
    const track = document.getElementById('track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (track && prevBtn && nextBtn) {
        
        nextBtn.addEventListener('click', () => {
            const slideWidth = track.clientWidth;
            track.scrollBy({ left: slideWidth, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            const slideWidth = track.clientWidth;
            track.scrollBy({ left: -slideWidth, behavior: 'smooth' });
        });
    }

    // 2. IMAGE ERROR HANDLING
    // If an image (like boost3.png) is missing, hide it so there is no empty box
    const images = document.querySelectorAll('.slide img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.parentElement.style.display = 'none';
        });
    });

    // 3. FADE IN ANIMATION
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-auto').forEach(el => observer.observe(el));
});