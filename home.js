document.addEventListener('DOMContentLoaded', () => {
    
    const toggle = document.querySelector('.mobile-toggle');
    const body = document.body;
    const curtain = document.querySelector('.mobile-curtain');

    if(toggle) {
        toggle.addEventListener('click', () => {
            body.classList.toggle('menu-open');
            
            // Animate lines to X
            const lines = toggle.querySelectorAll('.line');
            if(body.classList.contains('menu-open')) {
                lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                lines[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                lines[0].style.transform = 'none';
                lines[1].style.transform = 'none';
            }
        });

        // Close when link clicked
        curtain.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                body.classList.remove('menu-open');
                const lines = toggle.querySelectorAll('.line');
                lines[0].style.transform = 'none';
                lines[1].style.transform = 'none';
            });
        });
    }
});