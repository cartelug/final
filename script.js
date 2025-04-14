document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const menuButton = document.getElementById('mobile-menu-button');
    const mainNav = document.getElementById('main-nav');
    if (menuButton && mainNav) {
        menuButton.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = menuButton.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                menuButton.setAttribute('aria-label', 'Close Menu');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                menuButton.setAttribute('aria-label', 'Open Menu');
            }
        });
        // Close menu when a link is clicked (optional)
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    const icon = menuButton.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    menuButton.setAttribute('aria-label', 'Open Menu');
                }
            });
        });
    }

    // --- Generic Modal Open/Close Functionality (for index.html) ---
    const setupModal = (buttonId, modalId) => {
        const startButton = document.getElementById(buttonId);
        const modal = document.getElementById(modalId);
        if (startButton && modal) {
            const modalCloseButton = modal.querySelector('.modal-close');
            const modalOverlay = modal.querySelector('.modal-overlay');
            const modalContent = modal.querySelector('.modal-content'); // To prevent closing when clicking inside
            const openModal = () => modal.classList.add('active');
            const closeModal = () => modal.classList.remove('active');
            startButton.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior
                openModal();
            });
            if (modalCloseButton) modalCloseButton.addEventListener('click', closeModal);
            if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
            // Prevent modal closing when clicking inside the content area
            if (modalContent) modalContent.addEventListener('click', (event) => event.stopPropagation());
        }
    };
    // Setup modals if they exist on the current page (likely index.html)
    setupModal('netflix-start-btn', 'netflix-modal');
    setupModal('prime-start-btn', 'prime-modal');
    setupModal('spotify-start-btn', 'spotify-modal');

    // --- Generic Order Form WhatsApp Redirect Function ---
    const setupOrderFormRedirect = (formId, serviceName) => {
        const orderForm = document.getElementById(formId);
        if (orderForm) {
            orderForm.addEventListener('submit', function(event) {
                event.preventDefault(); // Prevent actual form submission

                const selectedPackageRadio = orderForm.querySelector('input[name="package"]:checked');
                const clientNameInput = orderForm.querySelector('#clientName');
                const selectedPaymentRadio = orderForm.querySelector('input[name="paymentMethod"]:checked');
                const instaUsernameInput = orderForm.querySelector('#instaUsername'); // Specific to instagram form

                // Validation
                if (!selectedPackageRadio) {
                    alert("Please select a package.");
                    return;
                }
                 // Specific validation for Instagram username
                if (instaUsernameInput && instaUsernameInput.value.trim() === "") {
                     alert("Please enter your Instagram Username.");
                     instaUsernameInput.focus();
                     return;
                 }
                 if (!clientNameInput || clientNameInput.value.trim() === "") {
                    alert("Please enter your name.");
                    clientNameInput.focus();
                    return;
                }
                if (!selectedPaymentRadio) {
                    alert("Please select a payment method.");
                    return;
                }

                // Get form data
                const duration = selectedPackageRadio.value;
                const price = selectedPackageRadio.getAttribute('data-price');
                const clientName = clientNameInput.value.trim();
                const paymentMethod = selectedPaymentRadio.value;
                const instagramUsername = instaUsernameInput ? instaUsernameInput.value.trim() : null; // Get username if field exists

                // Construct WhatsApp message
                const whatsappNumber = "256762193386"; // Replace with your actual number
                let message = `Order for Cartelug:\n\n`;
                message += `*Service:* ${serviceName}\n`;
                if (instagramUsername) { // Add username only if it exists
                    message += `*Instagram Username:* ${instagramUsername}\n`;
                }
                message += `*Package:* ${duration}\n`;
                message += `*Price:* ${price}\n`;
                message += `*Payment Method:* ${paymentMethod}\n`;
                message += `*Name:* ${clientName}`;

                // Encode and redirect
                const encodedMessage = encodeURIComponent(message);
                const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                window.location.href = whatsappURL; // Or window.open(whatsappURL, '_blank');
            });
        }
    };
    // Setup redirects if the forms exist on the current page
    setupOrderFormRedirect('netflix-order-form', 'Netflix');
    setupOrderFormRedirect('prime-order-form', 'Prime Video');
    setupOrderFormRedirect('spotify-order-form', 'Spotify');
    setupOrderFormRedirect('instagram-boost-form', 'Instagram Likes Boost');

    // --- Testimonial Swiper Initialization (for index.html) ---
    if (typeof Swiper !== 'undefined' && document.querySelector('.testimonial-swiper')) {
        try {
            const testimonialSwiper = new Swiper('.testimonial-swiper', {
                // Optional parameters
                direction: 'horizontal',
                loop: true,
                slidesPerView: 1,
                spaceBetween: 30,
                grabCursor: true,
                autoHeight: true, // Adjusts slider height to content

                // If we need pagination
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },

                // Navigation arrows
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },

                // Accessibility
                 a11y: {
                     prevSlideMessage: 'Previous slide',
                     nextSlideMessage: 'Next slide',
                     paginationBulletMessage: 'Go to slide {{index}}',
                 },
            });
        } catch (error) {
            console.error("Swiper initialization failed:", error);
        }
    }


    // --- Contact Page Issue Card WhatsApp Redirect Logic ---
    const issueButtons = document.querySelectorAll('.issue-card[data-service]'); // Select only buttons with data-service
    issueButtons.forEach(button => {
        // Check if this button is the one we modified (it won't have data-service anymore)
        // Or more robustly, check if its parent doesn't contain the specific new elements.
        // For simplicity here, we assume the button element itself implies it's NOT the modified card.
         button.addEventListener('click', () => {
            const service = button.getAttribute('data-service');
            const issue = button.getAttribute('data-issue');
            const whatsappNumber = "256762193386"; // CONFIRM THIS NUMBER
            let message = `Help Request for Cartelug:\n\n`;
            message += `*Service:* ${service}\n`;
            message += `*Issue:* ${issue}\n\n`;
            message += `Please describe the problem in detail:`;
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            window.open(whatsappURL, '_blank'); // Open in new tab
        });
    });


    // --- Netflix Payment Issue Card Logic (for contact.html) ---
    const paymentEscalateBtn = document.getElementById('payment-issue-escalate-btn');
    const paymentInitialDiv = document.getElementById('payment-fix-initial');
    const paymentApologyDiv = document.getElementById('payment-issue-apology');

    if (paymentEscalateBtn && paymentInitialDiv && paymentApologyDiv) {
        paymentEscalateBtn.addEventListener('click', () => {
            // Hide the initial instructions and the button itself
            paymentInitialDiv.style.display = 'none';

            // Show the apology message
            paymentApologyDiv.classList.remove('hidden'); // Use class manipulation
            // Or use: paymentApologyDiv.style.display = 'block';
        });
    }
    // --- End of Netflix Payment Issue Card Logic ---


    // --- Footer Year Update ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

}); // End of DOMContentLoaded listener