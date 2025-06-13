// order-pass.js - UPDATED FOR  FLOW (Revision)
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
        intro: document.getElementById('step-intro'),
        packages: document.getElementById('step-packages'),
        name: document.getElementById('step-name'),
        payment: document.getElementById('step-payment'),
        final: document.getElementById('step-final')
    };

    const packageCards = document.querySelectorAll('.package-card');
    const nameForm = document.getElementById('name-form');
    const clientNameInput = document.getElementById('clientName');
    const paymentCards = document.querySelectorAll('.payment-card');
    const ctaButton = document.getElementById('cta-button');
    const finalTitle = document.getElementById('final-title');
    const nextButton = nameForm.querySelector('.next-button');

    let currentStep = steps.intro;

    // --- FLOW CONTROL FUNCTION ---
    function goToStep(nextStep) {
        if (currentStep) {
            currentStep.classList.remove('active');
        }
        nextStep.classList.add('active');
        currentStep = nextStep;
    }

    // --- EVENT LISTENERS ---

    // Initial animation to start the flow
    setTimeout(() => {
        goToStep(steps.packages);
    }, 2500); // Slightly shorter delay

    // 1. Package Selection
    packageCards.forEach(card => {
        card.addEventListener('click', () => {
            order.plan = card.dataset.plan;
            order.price = card.dataset.price;
            goToStep(steps.name);
            setTimeout(() => clientNameInput.focus(), 600);
        });
    });

    // 2. Name Input "Next" Button
    nameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = clientNameInput.value.trim();
        if (name) {
            order.clientName = name;
            goToStep(steps.payment);
        } else {
            clientNameInput.classList.add('error'); // Example: Add a visual cue for empty input
            setTimeout(() => clientNameInput.classList.remove('error'), 1000);
        }
    });

    // 3. Payment Method Selection
    paymentCards.forEach(card => {
        card.addEventListener('click', () => {
            order.paymentMethod = card.dataset.method;
            finalTitle.textContent = `Your ${order.plan} access is ready.`;
            goToStep(steps.final);
        });
    });

    // 4. Final CTA Button
    ctaButton.addEventListener('click', () => {
        const message = `Hi Cartelug, I'd like to order the following package:\n\n*Service:* ${order.service}\n*Plan:* ${order.plan}\n*Price:* ${order.price}\n\n*My Name:* ${order.clientName}\n*Payment Method:* ${order.paymentMethod}`;
        const whatsappNumber = "256762193386";
        const whatsappUrl = `https://wa.me/<span class="math-inline">\{whatsappNumber\}?text\=</span>{encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });

});
