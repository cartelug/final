document.addEventListener('DOMContentLoaded', () => {

    const menuButton = document.getElementById('mobile-menu-button');
    const mainNav = document.getElementById('main-nav');
    if (menuButton && mainNav) {
        menuButton.addEventListener('click', () => {
            mainNav.classList.toggle('mobile-active');
            const icon = menuButton.querySelector('i');
            if (mainNav.classList.contains('mobile-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    const setupOrderFormRedirect = (formId, serviceName) => {
        const orderForm = document.getElementById(formId);
        if (orderForm) {
            orderForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const selectedPackageRadio = orderForm.querySelector('input[name="package"]:checked');
                const clientNameInput = orderForm.querySelector('#clientName');
                const selectedPaymentRadio = orderForm.querySelector('input[name="paymentMethod"]:checked');

                if (!selectedPackageRadio) {
                    alert("Please select a package.");
                    return;
                }
                if (!clientNameInput || clientNameInput.value.trim() === "") {
                    alert("Please enter your name.");
                    return;
                }
                if (!selectedPaymentRadio) {
                    alert("Please select a payment method.");
                    return;
                }

                const duration = selectedPackageRadio.value;
                const price = selectedPackageRadio.getAttribute('data-price');
                const clientName = clientNameInput.value.trim();
                const paymentMethod = selectedPaymentRadio.value;

                const whatsappNumber = "256762193386";
                let message = `Order for Cartelug:\n\n`;
                message += `*Service:* ${serviceName}\n`;
                message += `*Package:* ${duration}\n`;
                if (price) {
                    message += `*Price:* ${price}\n`;
                }
                message += `*Payment Method:* ${paymentMethod}\n`;
                message += `*Name:* ${clientName}`;

                const encodedMessage = encodeURIComponent(message);
                window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            });
        }
    };
    
    setupOrderFormRedirect('netflix-order-form', 'Netflix');
    setupOrderFormRedirect('prime-order-form', 'Prime Video');
    setupOrderFormRedirect('spotify-order-form', 'Spotify');

    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
