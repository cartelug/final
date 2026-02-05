/* === SUPPORT PAGE LOGIC === */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Payment Issue Escalation Logic
    const paymentBtn = document.getElementById('payment-escalate-btn');
    const paymentInitial = document.getElementById('payment-initial');
    const paymentApology = document.getElementById('payment-apology');

    if (paymentBtn) {
        paymentBtn.addEventListener('click', () => {
            paymentInitial.style.display = 'none';
            paymentApology.classList.remove('hidden');
        });
    }

    // 2. Modal Logic (Signed Out)
    const modalTrigger = document.getElementById('signed-out-trigger');
    const modal = document.getElementById('signed-out-modal');
    const modalClose = document.querySelector('.modal-close');
    
    // Available Emails (You can add more here)
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
            modal.classList.add('active');
            loadEmails();
            goToStep(1);
        });
    }

    // Close Modal
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Functions attached to window for HTML onclick access
    window.closeModal = function() {
        modal.classList.remove('active');
    };

    window.goToStep = function(stepNum) {
        // Hide all steps
        document.querySelectorAll('.modal-step').forEach(el => el.classList.remove('active'));
        // Show target step
        document.getElementById(`step-${stepNum}`).classList.add('active');
    };

    function loadEmails() {
        const list = document.getElementById('email-list');
        list.innerHTML = ''; // Clear previous
        
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
        document.getElementById('selected-email-display').textContent = email;
        goToStep(2);
    }

    window.showInstruction = function(device) {
        const emailDisplay = document.getElementById('final-email');
        const tvExtra = document.getElementById('tv-extra');
        
        emailDisplay.textContent = selectedEmail;
        
        if (device === 'tv') {
            tvExtra.classList.remove('hidden');
        } else {
            tvExtra.classList.add('hidden');
        }
        
        goToStep(4);
    };

    // 3. Animation On Scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-fade');
            }
        });
    });
    document.querySelectorAll('.hidden-fade').forEach(el => observer.observe(el));
});
