// order-pass.js - UPDATED FOR GLASS CARD FLOW
document.addEventListener('DOMContentLoaded', () => {

    // --- STATE MANAGEMENT ---
    const order = {
        service: 'Prime Video',
        plan: null,
        price: null,
        clientName: null,
        paymentMethod: null
    };

    // --- DOM ELEMENT SELECTORS ---
    const steps = {
        step2: document.getElementById('step-2'),
        step3: document.getElementById('step-3'),
        final: document.getElementById('step-final')
    };

    const packageButtons = document.querySelectorAll('.option-button');
    const nameForm = document.getElementById('name-form');
    const clientNameInput = document.getElementById('clientName');
    const paymentCards = document.querySelectorAll('.payment-card');
    const ctaButton = document.getElementById('cta-button');

    // --- FLOW CONTROL ---
    function unlockStep(stepElement) {
        if (stepElement.classList.contains('locked')) {
            stepElement.classList.remove('locked');
            // Scroll to the newly unlocked element
            setTimeout(() => {
                stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }
    
    function checkCompletion() {
        if (order.plan && order.clientName && order.paymentMethod) {
            unlockStep(steps.final);
        }
    }

    // --- EVENT LISTENERS ---

    // 1. Package Selection
    packageButtons.forEach(button => {
        button.addEventListener('click', () => {
            packageButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');

            order.plan = button.dataset.plan;
            order.price = button.dataset.price;
            
            unlockStep(steps.step2);
            checkCompletion();
        });
    });

    // 2. Name Input Form
    nameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = clientNameInput.value.trim();
        if (name) {
            order.clientName = name;
            unlockStep(steps.step3);
            checkCompletion();
        }
    });

    // 3. Payment Method Selection
    paymentCards.forEach(card => {
        card.addEventListener('click', () => {
            paymentCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            order.paymentMethod = card.dataset.method;
            checkCompletion();
        });
    });

    // 4. Final CTA Button with a custom message format
    ctaButton.addEventListener('click', () => {
        const whatsappNumber = "256762193386";
        
        // Using your preferred message format
        let message = `Order for Cartelug:\n\n`;
        message += `*Service:* ${order.service}\n`;
        message += `*Package:* ${order.plan}\n`; // "Package" as per your format's structure
        message += `*Name:* ${order.clientName}\n`;
        message += `*Payment Method:* ${order.paymentMethod}`;
        
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });

});
