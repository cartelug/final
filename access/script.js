document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step-view');
    const nextButtons = document.querySelectorAll('.next-btn');
    const deviceButtons = document.querySelectorAll('.device-btn');
    const backButtons = document.querySelectorAll('.back-btn');
    const copyButtons = document.querySelectorAll('.copy-btn');
    const deviceNameSpan = document.querySelector('.device-name');
    const loginTitle = document.getElementById('login-title');

    const showStep = (stepId) => {
        steps.forEach(step => {
            step.classList.remove('active');
        });
        const targetStep = document.getElementById(stepId);
        if (targetStep) {
            targetStep.classList.add('active');
        }
        window.scrollTo(0, 0);
    };

    nextButtons.forEach(button => {
        button.addEventListener('click', () => showStep('step2'));
    });

    deviceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const device = button.dataset.device;
            deviceNameSpan.textContent = device;
            loginTitle.textContent = `Login on Your ${device}`;
            showStep('step3');
        });
    });

    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetStep = button.dataset.target;
            showStep(targetStep);
        });
    });

    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.copy;
            const textToCopy = document.getElementById(type).textContent;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const icon = button.querySelector('i');
                const span = button.querySelector('span');
                const originalText = span.textContent;
                
                icon.classList.remove('fa-copy');
                icon.classList.add('fa-check');
                span.textContent = 'Copied!';
                button.style.backgroundColor = 'var(--green-accent)';

                setTimeout(() => {
                    icon.classList.remove('fa-check');
                    icon.classList.add('fa-copy');
                    span.textContent = originalText;
                    button.style.backgroundColor = 'var(--primary-color)';
                }, 2000);
            });
        });
    });
});
