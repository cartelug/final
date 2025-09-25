document.addEventListener("DOMContentLoaded", () => {
    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mainNav = document.getElementById("main-nav");
    if (mobileMenuButton && mainNav) {
        mobileMenuButton.addEventListener("click", () => {
            mainNav.classList.toggle("mobile-active");
        });
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu on click
                if (mainNav.classList.contains('mobile-active')) {
                    mainNav.classList.remove('mobile-active');
                }
            }
        });
    });

    // --- Intersection Observer for Scroll Animations ---
    const animatedElements = document.querySelectorAll('.services-section, .how-it-works-section, .trust-section, .community-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});
