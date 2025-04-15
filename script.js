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
                // Only close if the link is not for the current page's section
                if (!link.getAttribute('href').startsWith('#') || window.location.pathname === '/' || window.location.pathname === '/index.html') {
                     if (mainNav.classList.contains('active')) {
                        mainNav.classList.remove('active');
                        const icon = menuButton.querySelector('i');
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                        menuButton.setAttribute('aria-label', 'Open Menu');
                    }
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

                // Basic Validation (can be enhanced)
                if (!selectedPackageRadio) {
                    alert("Please select a package.");
                    return;
                }
                 if (instaUsernameInput && instaUsernameInput.value.trim() === "") {
                     alert("Please enter your Instagram Username.");
                     instaUsernameInput.focus();
                     return;
                 }
                 if (!clientNameInput || clientNameInput.value.trim() === "") {
                    alert("Please enter your name.");
                    if(clientNameInput) clientNameInput.focus();
                    return;
                }
                if (!selectedPaymentRadio) {
                    alert("Please select a payment method.");
                    return;
                }

                // Get form data
                const duration = selectedPackageRadio.value;
                const price = selectedPackageRadio.getAttribute('data-price');
                const clientName = clientNameInput ? clientNameInput.value.trim() : 'N/A';
                const paymentMethod = selectedPaymentRadio.value;
                const instagramUsername = instaUsernameInput ? instaUsernameInput.value.trim() : null;

                // Construct WhatsApp message
                const whatsappNumber = "256762193386"; // Your WhatsApp Number
                let message = `Order for Cartelug:\n\n`;
                message += `*Service:* ${serviceName}\n`;
                if (instagramUsername) {
                    message += `*Instagram Username:* ${instagramUsername}\n`;
                }
                message += `*Package:* ${duration}\n`;
                message += `*Price:* ${price}\n`;
                message += `*Payment Method:* ${paymentMethod}\n`;
                message += `*Name:* ${clientName}`;

                // Encode and redirect
                const encodedMessage = encodeURIComponent(message);
                const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

                // Redirect (consider window.open for new tab)
                 window.location.href = whatsappURL;
                 // window.open(whatsappURL, '_blank'); // Opens in new tab

                 // Optional: Reset form after trying to send
                 // orderForm.reset();
            });
        }
    };
    // Setup redirects for all order forms
    setupOrderFormRedirect('netflix-order-form', 'Netflix');
    setupOrderFormRedirect('prime-order-form', 'Prime Video');
    setupOrderFormRedirect('spotify-order-form', 'Spotify');
    setupOrderFormRedirect('instagram-boost-form', 'Instagram Likes Boost');

    // --- Testimonial Swiper Initialization (for index.html) ---
    if (typeof Swiper !== 'undefined' && document.querySelector('.testimonial-swiper')) {
        try {
            const testimonialSwiper = new Swiper('.testimonial-swiper', {
                direction: 'horizontal',
                loop: true,
                slidesPerView: 1,
                spaceBetween: 30,
                grabCursor: true,
                autoHeight: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                 a11y: {
                     prevSlideMessage: 'Previous slide',
                     nextSlideMessage: 'Next slide',
                     paginationBulletMessage: 'Go to slide {{index}}',
                 },
                 autoplay: { // Optional autoplay
                    delay: 5000, // 5 seconds
                    disableOnInteraction: false, // Keep playing after user interaction
                 },
            });
        } catch (error) {
            console.error("Swiper initialization failed:", error);
            // Optionally display a fallback message if Swiper fails
            const swiperContainer = document.querySelector('.testimonial-swiper');
            if (swiperContainer) {
                swiperContainer.innerHTML = '<p style="text-align: center; color: var(--text-medium);">Testimonials could not be loaded.</p>';
            }
        }
    }


    // --- Contact Page Issue Card WhatsApp Redirect Logic ---
    // Select buttons specifically designed for WhatsApp redirect (using data attributes)
    const issueButtons = document.querySelectorAll('.issue-card[data-service][data-issue]');
    issueButtons.forEach(button => {
         button.addEventListener('click', () => {
            const service = button.getAttribute('data-service');
            const issue = button.getAttribute('data-issue');
            const whatsappNumber = "256762193386"; // Your WhatsApp Number
            let message = `Help Request for Cartelug:\n\n`;
            message += `*Service:* ${service}\n`;
            message += `*Issue:* ${issue}\n\n`;
            message += `Please describe the problem in detail:`;
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            window.open(whatsappURL, '_blank'); // Open in new tab is usually better for support links
        });
    });


    // --- Netflix Payment Issue Card Logic (for contact.html) ---
    const paymentEscalateBtn = document.getElementById('payment-issue-escalate-btn');
    const paymentInitialDiv = document.getElementById('payment-fix-initial');
    const paymentApologyDiv = document.getElementById('payment-issue-apology');

    if (paymentEscalateBtn && paymentInitialDiv && paymentApologyDiv) {
        paymentEscalateBtn.addEventListener('click', () => {
            paymentInitialDiv.style.display = 'none'; // Hide initial instructions
            paymentApologyDiv.classList.remove('hidden'); // Show apology/resolution message
            paymentApologyDiv.style.display = 'block'; // Ensure it's visible if hidden class doesn't use !important
        });
    }
    // --- End of Netflix Payment Issue Card Logic ---


    // --- Footer Year Update ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

}); // End of DOMContentLoaded listener


// --- Preloader ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Add a small delay before starting fade-out for smoother visual effect
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 150); // Adjust delay if needed (e.g., 150ms)

        // Optional: Remove the preloader from DOM after transition ends to free up resources
        preloader.addEventListener('transitionend', function handleTransitionEnd(event) {
            // Ensure the event is for the opacity or visibility transition
             if (event.propertyName === 'opacity' || event.propertyName === 'visibility') {
                if (preloader.classList.contains('hidden')) {
                   // preloader.remove(); // Uncomment this line if you want to remove it completely
                   // Remove the listener to prevent it firing multiple times if other transitions occur
                   preloader.removeEventListener('transitionend', handleTransitionEnd);
                }
             }
        });
    }
});
// --- End Preloader ---
