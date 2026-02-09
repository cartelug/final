document.addEventListener('DOMContentLoaded', () => {
    // 1. Tab Filtering System
    const tabs = document.querySelectorAll('.tab-btn');
    const cards = document.querySelectorAll('.card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            tabs.forEach(t => t.classList.remove('active'));
            // Add to clicked
            tab.classList.add('active');

            const category = tab.getAttribute('data-category');

            cards.forEach(card => {
                const cardCat = card.getAttribute('data-cat');
                
                if (category === 'all' || cardCat === category) {
                    card.style.display = 'flex';
                    // Slight animation for re-appearing
                    card.style.opacity = '0';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 2. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 3. Ticker Cloner (Infinite Effect)
    const ticker = document.querySelector('.ticker');
    if (ticker) {
        const clone = ticker.innerHTML;
        ticker.innerHTML += clone; // Duplicate content for seamless loop
    }
});