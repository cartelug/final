document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Professional Image Handling
    // If an image is missing, hide the card so the layout stays perfect.
    const images = document.querySelectorAll('.proof-card img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Hide the parent .proof-card
            this.parentElement.style.display = 'none';
        });
    });

    // 2. Smooth Scroll Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

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
