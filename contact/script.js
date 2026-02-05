/* === SUPPORT PAGE LOGIC === */
document.addEventListener('DOMContentLoaded', () => {

    // 1. Payment Issue Escalation Logic
    const paymentBtn = document.getElementById('payment-escalate-btn');
    const paymentInitial = document.getElementById('payment-initial');
    const paymentApology = document.getElementById('payment-apology');

    if (paymentBtn && paymentInitial && paymentApology) {
        paymentBtn.addEventListener('click', () => {
            paymentInitial.style.display = 'none';
            paymentApology.classList.remove('hidden');
        });
    }

    // 2. Modal Logic (Signed Out)
    const modalTrigger = document.getElementById('signed-out-trigger');
    const modal = document.getElementById('signed-out-modal');
    const modalClose = document.querySelector('.modal-close');
    
    // Available Emails
    const clientEmails = [
        "cartel1@Netflix.com",
        "cartel2@Netflix.com",
        "cartel3@Netflix.com",
        "vip@cartelug.com",
        "member@accessug.com"
    ];

    let selectedEmail = "";

    // Open Modal
    if (modalTrigger) {
        modalTrigger.addEventListener('click', () => {
            if(modal) {
                modal.classList.add('active');
                loadEmails();
                goToStep(1);
            }
        });
    }

    // Close Modal
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Functions attached to window for HTML usage
    window.closeModal = function() {
        if(modal) modal.classList.remove('active');
    };

    window.goToStep = function(stepNum) {
        document.querySelectorAll('.modal-step').forEach(el => el.classList.remove('active'));
        const target = document.getElementById(`step-${stepNum}`);
        if(target) target.classList.add('active');
    };

    function loadEmails() {
        const list = document.getElementById('email-list');
        if(!list) return;
        list.innerHTML = '';
        
        clientEmails.forEach(email => {
            const div = document.createElement('div');
            div.className = 'email-option';
            div.textContent = email;
            div.onclick = () => selectEmail(email);
            list.appendChild(div);
        });
    }

    function selectEmail(email) {
        selectedEmail = email;
        const display = document.getElementById('selected-email-display');
        if(display) display.textContent = email;
        goToStep(2);
    }

    window.showInstruction = function(device) {
        const emailDisplay = document.getElementById('final-email');
        const tvExtra = document.getElementById('tv-extra');
        
        if(emailDisplay) emailDisplay.textContent = selectedEmail;
        
        if (device === 'tv') {
            if(tvExtra) tvExtra.classList.remove('hidden');
        } else {
            if(tvExtra) tvExtra.classList.add('hidden');
        }
        
        goToStep(4);
    };
});
