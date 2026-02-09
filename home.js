document.addEventListener('DOMContentLoaded', () => {
    
    // Mobile Menu
    const trigger = document.querySelector('.mobile-trigger');
    const drawer = document.querySelector('.mobile-drawer');
    const icon = trigger.querySelector('i');

    if(trigger && drawer) {
        trigger.addEventListener('click', () => {
            drawer.classList.toggle('open');
            if(drawer.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close on link click
        drawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                drawer.classList.remove('open');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
});