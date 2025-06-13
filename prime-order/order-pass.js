// order-pass.js - UPDATED FOR DYNAMIC STORY OPTION

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
    const elements = {
        steps: document.querySelectorAll('.order-step'),
        summary: {
            container: document.getElementById('order-summary'),
            plan: document.getElementById('summary-plan'),
            price: document.getElementById('summary-price')
        },
        packageCards: document.querySelectorAll('.package-card'),
        clientNameInput: document.getElementById('clientName'),
        paymentCards: document.querySelectorAll('.payment-card'),
        ctaButton: document.getElementById('cta-button')
    };
    
    // --- FUNCTIONS ---
    
    function updateSummary() {
        elements.summary.plan.textContent = order.plan || '--';
        elements.summary.price.textContent = order.price || '--';
    }

    function revealStep(stepElement) {
        if (!stepElement) return;
        
        // Use a short timeout to ensure smooth scroll works after element is visible
        setTimeout(() => {
            stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            stepElement.classList.add('visible');
        }, 100);
    }

    function checkCompletion() {
        const isComplete = order.plan && order.clientName && order.paymentMethod;
        if (isComplete) {
            elements.ctaButton.disabled = false;
            elements.ctaButton.classList.add('ready');
        } else {
            elements.ctaButton.disabled = true;
            elements.ctaButton.classList.remove('ready');
        }
    }

    // --- EVENT LISTENERS ---

    // 1. Package Selection
    elements.packageCards.forEach(card => {
        card.addEventListener('click', () => {
            elements.packageCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            order.plan = card.dataset.plan;
            order.price = card.dataset.price;
            
            elements.summary.container.classList.add('visible');
            updateSummary();
            revealStep(document.getElementById('step-2'));
            checkCompletion();
        });
    });

    // 2. Client Name Input
    elements.clientNameInput.addEventListener('input', () => {
        // Use a debounce to prevent revealing step while user is still typing
        clearTimeout(elements.clientNameInput.timer);
        elements.clientNameInput.timer = setTimeout(() => {
            order.clientName = elements.clientNameInput.value.trim();
            if (order.clientName) {
                revealStep(document.getElementById('step-3'));
            }
            checkCompletion();
        }, 500);
    });

    // 3. Payment Method Selection
    elements.paymentCards.forEach(card => {
        card.addEventListener('click', () => {
            elements.paymentCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            order.paymentMethod = card.dataset.method;
            revealStep(document.getElementById('step-4'));
            checkCompletion();
        });
    });



    // 4. Final CTA Button
    elements.ctaButton.addEventListener('click', () => {
        if (!elements.ctaButton.disabled) {
            const message = `Hi Cartelug, I'd like to order the following package:\n\n*Service:* ${order.service}\n*Plan:* ${order.plan}\n*Price:* ${order.price}\n\n*My Name:* ${order.clientName}\n*Payment Method:* ${order.paymentMethod}`;
            
            // Correct WhatsApp Number
            const whatsappNumber = "256762193386";
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
        }
    });

    // --- INITIALIZATION ---
    // Reveal the first step on load
    document.getElementById('step-1').classList.add('visible');

});
