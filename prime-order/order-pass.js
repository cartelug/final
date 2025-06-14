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

    // 4. Final CTA Button
    ctaButton.addEventListener('click', () => {
        const message = `Hi Cartelug, I'd like to order the following package:\n\n*Service:* ${order.service}\n*Plan:* ${order.plan}\n*Price:* ${order.price}\n\n*My Name:* ${order.clientName}\n*Payment Method:* ${order.paymentMethod}`;
        const whatsappNumber = "256762193386";
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });

});
