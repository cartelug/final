document.addEventListener('DOMContentLoaded', () => {
    
    // --- Tabs Logic ---
    const tabs = document.querySelectorAll('.tab-btn');
    const cards = document.querySelectorAll('.service-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked tab
            tab.classList.add('active');

            const filter = tab.getAttribute('data-tab');

            cards.forEach(card => {
                const categories = card.getAttribute('data-category');
                if (categories.includes(filter)) {
                    card.style.display = 'flex';
                    // Simple fade in effect
                    card.style.opacity = '0';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- Infinite Marquee Logic ---
    // Clones the track content to create the seamless loop effect
    const marquees = document.querySelectorAll('.marquee .track');
    
    marquees.forEach(track => {
        // Clone the entire track content to ensure seamless scroll
        // We clone it twice to be safe for wide screens
        const content = track.innerHTML;
        track.innerHTML = content + content + content;
    });

    // --- Smooth Anchor Scroll ---
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