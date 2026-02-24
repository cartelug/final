/**
 * ACCESSUG - ADVANCED SPATIAL PHYSICS ENGINE
 * Location: HOME/script.js
 * Implements 3D Parallax Tilt Math and Intersection Observers.
 */

document.addEventListener('DOMContentLoaded', () => {

    // === 1. GLASS NAVIGATION SCROLL LOGIC ===
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });

    // === 2. HIGH-PERFORMANCE INTERSECTION OBSERVER ===
    // Triggers the fade-up animations only once when they enter the viewport
    const observerOptions = { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 };
    
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Saves CPU after reveal
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => scrollObserver.observe(el));

    // === 3. ADVANCED 3D SPATIAL CARD PHYSICS ===
    // This is what makes the cards 1000x better. 
    // We use JS to calculate the exact mouse position, and apply a 3D rotate matrix to the card.
    
    const cards = document.querySelectorAll('[data-tilt]');
    
    // Lerp function for buttery smooth physical deceleration
    const lerp = (start, end, factor) => start + (end - start) * factor;

    cards.forEach(card => {
        // Physical bounds of the card
        let bounds;
        
        // Target rotation values based on mouse position
        let targetX = 0;
        let targetY = 0;
        
        // Current rotation values (used for lerping to the target)
        let currentX = 0;
        let currentY = 0;
        
        // Mouse coordinate tracking for the internal glare effect
        let mouseX = 50;
        let mouseY = 50;

        let isHovering = false;

        const updateBounds = () => { bounds = card.getBoundingClientRect(); };

        card.addEventListener('mouseenter', () => {
            isHovering = true;
            updateBounds();
            // Start the animation loop for this specific card
            requestAnimationFrame(renderCard);
        });

        card.addEventListener('mousemove', (e) => {
            if (!bounds) updateBounds();
            
            // Calculate mouse position relative to card center (-1 to 1)
            const clientX = e.clientX;
            const clientY = e.clientY;
            
            const centerX = bounds.left + bounds.width / 2;
            const centerY = bounds.top + bounds.height / 2;
            
            // X and Y distance from center normalized to a -1 to 1 range
            const x = (clientX - centerX) / (bounds.width / 2);
            const y = (clientY - centerY) / (bounds.height / 2);
            
            // Multiply by max rotation degrees (e.g., 15 degrees)
            // Note: Invert Y for proper tilt direction
            targetX = y * -15; 
            targetY = x * 15;
            
            // Calculate coordinates for the CSS glare gradient mask
            mouseX = ((clientX - bounds.left) / bounds.width) * 100;
            mouseY = ((clientY - bounds.top) / bounds.height) * 100;
        });

        card.addEventListener('mouseleave', () => {
            isHovering = false;
            // Reset targets to flat
            targetX = 0;
            targetY = 0;
            mouseX = 50;
            mouseY = 50;
        });

        // The Render Loop
        const renderCard = () => {
            // Smoothly interpolate current position to target position
            currentX = lerp(currentX, targetX, 0.1);
            currentY = lerp(currentY, targetY, 0.1);
            
            // Apply the 3D rotation
            card.style.transform = `perspective(1000px) rotateX(${currentX}deg) rotateY(${currentY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // Apply the glare coordinates to CSS variables
            card.style.setProperty('--mouse-x', `${mouseX}%`);
            card.style.setProperty('--mouse-y', `${mouseY}%`);

            // If we are hovering, OR if we haven't returned to resting state (0), keep animating
            if (isHovering || Math.abs(currentX) > 0.1 || Math.abs(currentY) > 0.1) {
                requestAnimationFrame(renderCard);
            } else {
                // Hard reset when fully stopped to save CPU
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            }
        };
        
        // Re-calculate bounds on resize or scroll to prevent math errors
        window.addEventListener('resize', updateBounds);
        window.addEventListener('scroll', updateBounds, { passive: true });
    });
});