document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PRO MOBILE MENU LOGIC ---
    const menuOpen = document.getElementById('mobile-menu-open');
    const menuClose = document.getElementById('mobile-menu-close');
    const menuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu(show) {
        if (show) {
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop background scrolling
        } else {
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (menuOpen) menuOpen.addEventListener('click', () => toggleMenu(true));
    if (menuClose) menuClose.addEventListener('click', () => toggleMenu(false));
    
    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Close when clicking outside the menu box
    if (menuOverlay) {
        menuOverlay.addEventListener('click', (e) => {
            if (e.target === menuOverlay) toggleMenu(false);
        });
    }

    // --- 2. SCROLL REVEAL ANIMATION ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-fade');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden-fade');
    hiddenElements.forEach((el) => observer.observe(el));

    // --- 3. DYNAMIC YEAR ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
