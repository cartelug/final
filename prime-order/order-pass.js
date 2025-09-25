document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT: Object to hold order details ---
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
    const ctaButtonLink = document.getElementById('cta-button-link');

    // --- FLOW CONTROL FUNCTIONS ---
    
    // Function to remove the 'locked' class, making a step visible and animated
    function unlockStep(stepElement) {
        if (stepElement && stepElement.classList.contains('locked')) {
            stepElement.classList.remove('locked');
            stepElement.classList.add('animate-in'); // Add animation class
            
            // Scroll the newly unlocked step into view for a smooth user experience
            setTimeout(() => {
                stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 150);
        }
    }

    // Function to generate and set the WhatsApp URL
    function updateWhatsAppLink() {
        if (order.plan && order.clientName && order.paymentMethod) {
            const whatsappNumber = "256762193386";
            
            // Construct the pre-filled WhatsApp message
            let message = `Order for Cartelug:\n\n`;
            message += `*Service:* ${order.service}\n`;
            message += `*Package:* ${order.plan}\n`;
            message += `*Price:* ${order.price}\n`;
            message += `*Name:* ${order.clientName}\n`;
            message += `*Payment Method:* ${order.paymentMethod}`;
            
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            ctaButtonLink.href = whatsappUrl;
        }
    }
    
    // Function to check if all required order details have been provided
    function checkCompletion() {
        if (order.plan && order.clientName && order.paymentMethod) {
            updateWhatsAppLink();
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
            clientNameInput.focus(); // Auto-focus on the name input
            checkCompletion();
        });
    });

    // 2. Name Input Form
    nameForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission
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
});
