/**
 * PROJECT OBSIDIAN - CORE ENGINE
 * Author: Advanced Creative Engineering
 * Focus: High-performance, GPU-mapped interactions
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Initial Hero Mount Animation
    // Small delay ensures CSS is fully parsed before triggering transformations.
    setTimeout(() => {
        document.body.classList.add('is-ready');
    }, 150);


    // 2. Intersection Observer for Scroll Reveals
    class ScrollRevealer {
        constructor() {
            this.options = {
                root: null,
                rootMargin: '0px 0px -10% 0px', // Triggers slightly before element enters
                threshold: 0.1
            };
            this.observer = new IntersectionObserver(this.handleIntersect.bind(this), this.options);
            this.init();
        }
        init() {
            const elements = document.querySelectorAll('.reveal-on-scroll');
            elements.forEach(el => this.observer.observe(el));
        }
        handleIntersect(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Unobserve to save memory after initial reveal
                    observer.unobserve(entry.target);
                }
            });
        }
    }
    new ScrollRevealer();


    // 3. Smart Nav & Parallax Logic (RequestAnimationFrame loop)
    class ScrollEngine {
        constructor() {
            this.nav = document.getElementById('header-main');
            this.parallaxNodes = document.querySelectorAll('.c-node');
            this.ticking = false;
            this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            this.init();
        }
        init() {
            window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
        }
        onScroll() {
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.update();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }
        update() {
            const scrollY = window.scrollY;

            // Nav Blur State
            if (scrollY > 20) {
                this.nav.classList.add('is-scrolled');
            } else {
                this.nav.classList.remove('is-scrolled');
            }

            // Parallax Constellation (Desktop only for performance)
            if (!this.prefersReducedMotion && window.innerWidth > 768) {
                this.parallaxNodes.forEach(node => {
                    const speed = parseFloat(node.getAttribute('data-parallax'));
                    const yPos = -(scrollY * speed);
                    node.style.transform = `translateY(${yPos}px)`;
                });
            }
        }
    }
    new ScrollEngine();


    // 4. The Signature "Flashlight Glow" Cards
    class GlowCardSystem {
        constructor() {
            this.cards = document.querySelectorAll('.glow-card');
            this.init();
        }
        init() {
            // Only apply mouse tracking on devices that support hover
            if (window.matchMedia('(hover: hover)').matches) {
                this.cards.forEach(card => {
                    card.addEventListener('mousemove', this.handleMouseMove);
                });
            }
        }
        handleMouseMove(e) {
            const rect = this.getBoundingClientRect();
            // Calculate mouse position relative to the card
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            // Update CSS custom properties on the card element
            this.style.setProperty('--mouse-x', `${x}px`);
            this.style.setProperty('--mouse-y', `${y}px`);
        }
    }
    new GlowCardSystem();


    // 5. Magnetic Button Physics
    class MagneticButtons {
        constructor() {
            this.buttons = document.querySelectorAll('.magnetic-target');
            this.init();
        }
        init() {
            if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                this.buttons.forEach(btn => {
                    btn.addEventListener('mousemove', this.move.bind(this));
                    btn.addEventListener('mouseleave', this.reset.bind(this));
                });
            }
        }
        move(e) {
            const btn = e.currentTarget;
            const bounding = btn.getBoundingClientRect();
            const strength = btn.getAttribute('data-strength') || 15;
            
            // Calculate distance from center of button
            const centerX = bounding.left + bounding.width / 2;
            const centerY = bounding.top + bounding.height / 2;
            const deltaX = (e.clientX - centerX) / bounding.width;
            const deltaY = (e.clientY - centerY) / bounding.height;

            // Apply translation
            btn.style.transform = `translate(${deltaX * strength}px, ${deltaY * strength}px)`;
        }
        reset(e) {
            const btn = e.currentTarget;
            btn.style.transform = `translate(0px, 0px)`;
        }
    }
    new MagneticButtons();


    // 6. Tab Filtering Engine
    class TabController {
        constructor() {
            this.tabs = document.querySelectorAll('.filter-pill');
            this.cards = document.querySelectorAll('.bento-grid .glow-card');
            this.init();
        }
        init() {
            this.tabs.forEach(tab => {
                tab.addEventListener('click', (e) => this.filterCards(e.target));
            });
        }
        filterCards(clickedTab) {
            // Update Active State
            this.tabs.forEach(t => t.classList.remove('active'));
            clickedTab.classList.add('active');

            const filter = clickedTab.getAttribute('data-target');

            // Filter Logic
            this.cards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                if (categories.includes(filter)) {
                    card.style.display = 'block';
                    // Force DOM reflow to safely restart CSS animations
                    void card.offsetWidth; 
                    card.classList.add('is-visible');
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.classList.remove('is-visible');
                    card.style.opacity = '0';
                }
            });
        }
    }
    new TabController();

});