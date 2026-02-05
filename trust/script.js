/* === TRUST PAGE LOGIC === */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Image Error Handling
    // If an image (like trust10.png) doesn't exist, this hides the empty box
    // so your page always looks professional.
    const images = document.querySelectorAll('.proof-card img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.parentElement.style.display = 'none';
        });
    });

    // 2. Scroll Animation (Double check visibility)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-auto').forEach(el => observer.observe(el));
});
