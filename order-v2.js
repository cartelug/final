// js/order-v2.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('netflix-order-form');
    const clientNameInput = document.getElementById('client-name');
    const packageRadios = form.querySelectorAll('input[name="package"]');
    const paymentRadios = form.querySelectorAll('input[name="payment-method"]');
    
    const summaryPlan = document.getElementById('summary-plan');
    const summaryPrice = document.getElementById('summary-price');
    const whatsappButton = document.getElementById('whatsapp-button');

    const updateSummary = () => {
        const selectedPackage = form.querySelector('input[name="package"]:checked');
        const clientName = clientNameInput.value.trim();
        
        let isFormValid = false;

        // Update Plan and Price
        if (selectedPackage) {
            summaryPlan.textContent = selectedPackage.value;
            summaryPrice.textContent = `${selectedPackage.dataset.price} UGX`;
        } else {
            summaryPlan.textContent = 'Not Selected';
            summaryPrice.textContent = '0 UGX';
        }
        
        // Check if form is valid for submission
        if (selectedPackage && clientName) {
            isFormValid = true;
        }

        // Enable or disable the button
        if (isFormValid) {
            whatsappButton.classList.remove('disabled');
            whatsappButton.href = generateWhatsAppLink();
        } else {
            whatsappButton.classList.add('disabled');
            whatsappButton.href = '#';
        }
    };

    const generateWhatsAppLink = () => {
        const service = form.querySelector('input[name="service"]').value;
        const selectedPackage = form.querySelector('input[name="package"]:checked');
        const selectedPayment = form.querySelector('input[name="payment-method"]:checked');
        const clientName = clientNameInput.value.trim();
        
        if (!selectedPackage || !clientName || !selectedPayment) return '#';
        
        const phoneNumber = "256758411229"; // Your WhatsApp number
        const message = `Hello Cartel UG,

I'd like to place an order for a *${service}* account.

*Service:* ${service}
*Client Name:* ${clientName}
*Package:* ${selectedPackage.value} (${selectedPackage.dataset.price} UGX)
*Payment Method:* ${selectedPayment.value}

Please let me know the next steps. Thank you!`;

        return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    };

    // Add event listeners
    packageRadios.forEach(radio => radio.addEventListener('change', updateSummary));
    clientNameInput.addEventListener('input', updateSummary);
    // Initial call to set the state
    updateSummary();
});
