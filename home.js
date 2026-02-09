document.addEventListener('DOMContentLoaded', () => {
    
    const menuBtn = document.querySelector('.ac-gn-menuanchor');
    const body = document.body;
    const curtain = document.querySelector('.ac-gn-curtain');

    if(menuBtn) {
        menuBtn.addEventListener('click', () => {
            body.classList.toggle('menu-open');
            
            // Transform lines to X
            const top = menuBtn.querySelector('.ac-gn-menuicon-bread-top');
            const bottom = menuBtn.querySelector('.ac-gn-menuicon-bread-bottom');
            
            if(body.classList.contains('menu-open')) {
                top.style.transform = 'rotate(45deg) translate(2px, 2px)';
                bottom.style.transform = 'rotate(-45deg) translate(2px, -3px)';
            } else {
                top.style.transform = 'none';
                bottom.style.transform = 'none';
            }
        });

        // Close when link clicked
        curtain.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                body.classList.remove('menu-open');
                const top = menuBtn.querySelector('.ac-gn-menuicon-bread-top');
                const bottom = menuBtn.querySelector('.ac-gn-menuicon-bread-bottom');
                top.style.transform = 'none';
                bottom.style.transform = 'none';
            });
        });
    }
});