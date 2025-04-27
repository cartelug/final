// Wrap ALL DOM-dependent code in a SINGLE DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    // Handles opening and closing the mobile navigation menu
    const menuButton = document.getElementById('mobile-menu-button');
    const mainNav = document.getElementById('main-nav');
    if (menuButton && mainNav) {
        menuButton.addEventListener('click', () => {
            mainNav.classList.toggle('active'); // Toggle visibility class
            const icon = menuButton.querySelector('i'); // Get the icon (bars/times)
            // Change icon and accessibility label based on menu state
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
        // Optional: Close mobile menu when a navigation link is clicked
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Only close if it's not an anchor link on the same page (or if it's a main page link)
                if (!link.getAttribute('href').startsWith('#') || window.location.pathname === '/' || window.location.pathname === '/index.html') {
                     if (mainNav.classList.contains('active')) { // Check if menu is open
                        mainNav.classList.remove('active'); // Close menu
                        // Reset icon and label
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
    // Sets up event listeners for buttons that open modals and the modal's close mechanisms
    const setupModal = (buttonId, modalId) => {
        const startButton = document.getElementById(buttonId); // Button that triggers the modal
        const modal = document.getElementById(modalId);       // The modal element itself
        if (startButton && modal) { // Ensure both elements exist
            const modalCloseButton = modal.querySelector('.modal-close'); // The 'x' button inside the modal
            const modalOverlay = modal.querySelector('.modal-overlay');   // The background overlay
            const modalContent = modal.querySelector('.modal-content');   // The modal content area

            // Function to open the modal
            const openModal = () => modal.classList.add('active');
            // Function to close the modal
            const closeModal = () => modal.classList.remove('active');

            // Event listener for the trigger button
            startButton.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default action (like following a link if it's an <a> tag)
                openModal();
            });
            // Event listener for the close ('x') button
            if (modalCloseButton) modalCloseButton.addEventListener('click', closeModal);
            // Event listener for the overlay (clicking outside the modal content closes it)
            if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
            // Prevent modal from closing if the user clicks *inside* the content area
            if (modalContent) modalContent.addEventListener('click', (event) => event.stopPropagation());
        }
    };
    // Initialize modals for each service on the homepage
    setupModal('netflix-start-btn', 'netflix-modal');
    setupModal('prime-start-btn', 'prime-modal');
    setupModal('spotify-start-btn', 'spotify-modal');

    // --- Generic Order Form WhatsApp Redirect Function ---
    // Handles submitting order forms and redirecting to WhatsApp with pre-filled info
    const setupOrderFormRedirect = (formId, serviceName) => {
        const orderForm = document.getElementById(formId); // Get the specific order form
        if (orderForm) { // Check if the form exists on the current page
            orderForm.addEventListener('submit', function(event) {
                event.preventDefault(); // Stop the default form submission

                // Find checked radio buttons and input fields within this specific form
                const selectedPackageRadio = orderForm.querySelector('input[name="package"]:checked');
                const clientNameInput = orderForm.querySelector('#clientName');
                const selectedPaymentRadio = orderForm.querySelector('input[name="paymentMethod"]:checked');
                const instaUsernameInput = orderForm.querySelector('#instaUsername'); // Specific to Instagram form

                // --- Basic Form Validation ---
                if (!selectedPackageRadio) {
                    alert("Please select a package."); // Alert if no package is chosen
                    // Try to focus the first package radio for user convenience
                    const firstPackageRadio = orderForm.querySelector('input[name="package"]');
                    if(firstPackageRadio) firstPackageRadio.focus();
                    return; // Stop processing
                }
                 // Check Instagram username only if the input exists and is required
                 if (instaUsernameInput && instaUsernameInput.required && instaUsernameInput.value.trim() === "") {
                     alert("Please enter your Instagram Username.");
                     instaUsernameInput.focus();
                     return; // Stop processing
                 }
                 // Check client name
                 if (!clientNameInput || clientNameInput.value.trim() === "") {
                    alert("Please enter your name.");
                    if(clientNameInput) clientNameInput.focus(); // Focus the name field
                    return; // Stop processing
                }
                // Check payment method
                if (!selectedPaymentRadio) {
                    alert("Please select a payment method.");
                     // Try to focus the first payment radio
                    const firstPaymentRadio = orderForm.querySelector('input[name="paymentMethod"]');
                    if(firstPaymentRadio) firstPaymentRadio.focus();
                    return; // Stop processing
                }
                // --- End Validation ---

                // Get the selected values from the form
                const duration = selectedPackageRadio.value;
                const price = selectedPackageRadio.getAttribute('data-price'); // Get price from data attribute
                const clientName = clientNameInput ? clientNameInput.value.trim() : 'N/A';
                const paymentMethod = selectedPaymentRadio.value;
                const instagramUsername = instaUsernameInput ? instaUsernameInput.value.trim() : null;

                // Construct the WhatsApp message
                const whatsappNumber = "256762193386"; // Your WhatsApp Number
                let message = `Order for Cartelug:\n\n`; // Start message
                message += `*Service:* ${serviceName}\n`; // Add service name
                if (instagramUsername) { // Add Instagram username if provided
                    message += `*Instagram Username:* ${instagramUsername}\n`;
                }
                message += `*Package:* ${duration}\n`; // Add selected package
                if (price) { // Add price if available
                    message += `*Price:* ${price}\n`;
                }
                message += `*Payment Method:* ${paymentMethod}\n`; // Add payment method
                message += `*Name:* ${clientName}`; // Add client name

                // Encode the message for use in a URL
                const encodedMessage = encodeURIComponent(message);
                // Create the WhatsApp URL
                const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

                // Redirect the user to the WhatsApp URL
                 window.location.href = whatsappURL;
                 // Alternative: Open in a new tab: window.open(whatsappURL, '_blank');

                 // Optional: Reset the form after submission attempt
                 // orderForm.reset();
            });
        }
    };
    // Initialize the redirect logic for all potential order forms across the site
    setupOrderFormRedirect('netflix-order-form', 'Netflix');
    setupOrderFormRedirect('prime-order-form', 'Prime Video');
    setupOrderFormRedirect('spotify-order-form', 'Spotify');
    setupOrderFormRedirect('instagram-boost-form', 'Instagram Likes Boost');

    // --- Testimonial Swiper Initialization (for index.html) ---
    // Checks if the Swiper library is loaded and the '.testimonial-swiper' element exists
    if (typeof Swiper !== 'undefined' && document.querySelector('.testimonial-swiper')) {
        try {
            // Initialize Swiper with options
            const testimonialSwiper = new Swiper('.testimonial-swiper', {
                direction: 'horizontal', // Default, slides left/right
                loop: true,              // Enable continuous looping
                slidesPerView: 1,        // Show one slide at a time
                spaceBetween: 30,        // Gap between slides (if slidesPerView > 1)
                grabCursor: true,        // Show grab cursor on hover
                autoHeight: true,        // Adjust slider height to fit the current slide's content
                pagination: {            // Configure pagination dots
                    el: '.swiper-pagination', // CSS selector for pagination container
                    clickable: true,          // Allow clicking dots to navigate
                },
                navigation: {            // Configure navigation arrows
                    nextEl: '.swiper-button-next', // CSS selector for next arrow
                    prevEl: '.swiper-button-prev', // CSS selector for previous arrow
                },
                 a11y: {                  // Accessibility enhancements
                     enabled: true,
                     prevSlideMessage: 'Previous testimonial',
                     nextSlideMessage: 'Next testimonial',
                     paginationBulletMessage: 'Go to testimonial slide {{index}}',
                 },
                 autoplay: {              // Configure autoplay
                    delay: 5000,             // Time (ms) between slide transitions
                    disableOnInteraction: false, // Don't stop autoplay if user interacts (swipes)
                    pauseOnMouseEnter: true, // Pause autoplay when the mouse is over the slider
                 },
            });
        } catch (error) {
            // Log error if Swiper fails to initialize
            console.error("Swiper initialization failed:", error);
            // Optional: Display a fallback message to the user
            const swiperContainer = document.querySelector('.testimonial-swiper');
            if (swiperContainer) {
                swiperContainer.innerHTML = '<p style="text-align: center; color: var(--text-medium);">Testimonials could not be loaded.</p>';
            }
        }
    }


    // --- Contact Page Issue Card WhatsApp Redirect Logic ---
    // Adds click listeners to the specific issue cards on the contact page
    const issueButtons = document.querySelectorAll('.issue-card[data-service][data-issue]');
    issueButtons.forEach(button => {
         button.addEventListener('click', () => {
            // Get service and issue details from the card's data attributes
            const service = button.getAttribute('data-service');
            const issue = button.getAttribute('data-issue');
            const whatsappNumber = "256762193386"; // Your WhatsApp Number
            // Prepare a pre-filled message for WhatsApp support
            let message = `Help Request for Cartelug:\n\n`;
            message += `*Service:* ${service}\n`;
            message += `*Issue:* ${issue}\n\n`;
            message += `Please describe the problem in detail:`; // Prompt user for details
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            // Open WhatsApp in a new browser tab
            window.open(whatsappURL, '_blank');
        });
    });


    // --- Netflix Payment Issue Card Logic (for contact.html) ---
    // Handles the "Still can't watch?" button interaction on the contact page
    const paymentEscalateBtn = document.getElementById('payment-issue-escalate-btn');
    const paymentInitialDiv = document.getElementById('payment-fix-initial'); // Initial instructions div
    const paymentApologyDiv = document.getElementById('payment-issue-apology'); // Apology/resolution div

    // Check if all relevant elements exist on the page
    if (paymentEscalateBtn && paymentInitialDiv && paymentApologyDiv) {
        // Add click listener to the button
        paymentEscalateBtn.addEventListener('click', () => {
            paymentInitialDiv.style.display = 'none';    // Hide the initial instructions
            paymentApologyDiv.classList.remove('hidden'); // Make the apology div visible (removes CSS class)
            paymentApologyDiv.style.display = 'block';   // Ensure it's displayed (in case 'hidden' used !important)
        });
    }
    // --- End of Netflix Payment Issue Card Logic ---


    // --- Footer Year Update ---
    // Finds the element with ID 'year' and sets its text content to the current year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }


    // --- Multi-Step Renewal Page Logic (V3) ---
    // Select all relevant elements for the multi-step renewal process
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const serviceCardsV3 = document.querySelectorAll('.service-card-v3');
    const durationOptionsContainer = document.getElementById('duration-options-container');
    const durationNextBtn = document.getElementById('duration-next-btn');
    const paymentAmountSpan = document.getElementById('payment-amount');
    const paymentDurationSpan = document.getElementById('payment-duration');
    const paymentServiceSpan = document.getElementById('payment-service');
    const whatsappConfirmBtnV3 = document.getElementById('whatsapp-confirm-btn-v3');
    const startOverBtn = document.getElementById('start-over-btn');
    const backBtns = document.querySelectorAll('.step-back-btn');
    const dynamicServiceNameSpans = document.querySelectorAll('.dynamic-service-name');

    // Store the renewal price data
    const renewalPricesV3 = {
        "Netflix": [
            { duration: "2 Months", price: "50,000 UGX" },
            { duration: "3 Months", price: "75,000 UGX" },
            { duration: "6 Months", price: "150,000 UGX" }
        ],
        "Prime Video": [
             { duration: "2 Months", price: "50,000 UGX" },
             { duration: "3 Months", price: "75,000 UGX" }
        ],
        "Spotify": [
            { duration: "6 Months", price: "70,000 UGX" },
            { duration: "1 Year", price: "120,000 UGX" }
        ]
    };

    // Store the currently selected service and duration/price details
    let selectedService = null;
    let selectedDuration = null;
    let selectedPrice = null;

    // Function to navigate between steps with animation
    const goToStep = (stepToShow) => {
        const steps = [step1, step2, step3];
        steps.forEach(step => {
            if (step) { // Check if step exists
                if (step.id === `step-${stepToShow}`) {
                    // Show the target step
                    step.classList.remove('exiting-step');
                    step.classList.add('active-step');
                } else if (step.classList.contains('active-step')) {
                    // Mark the current step as exiting
                    step.classList.add('exiting-step');
                    step.classList.remove('active-step');
                } else {
                     // Ensure other steps are hidden and reset
                     step.classList.remove('exiting-step');
                     step.classList.remove('active-step');
                }
            }
        });
    };

    // Function to populate duration options for Step 2
    const populateDurationOptions = (serviceName) => {
        durationOptionsContainer.innerHTML = ''; // Clear previous options
        const prices = renewalPricesV3[serviceName];

        if (prices && prices.length > 0) {
            prices.forEach((item, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'duration-option';

                const inputId = `duration-${serviceName.replace(/\s+/g, '-')}-${index}`; // Unique ID

                optionDiv.innerHTML = `
                    <input type="radio" id="${inputId}" name="renewal_duration" value="${item.duration}" data-price="${item.price}">
                    <label for="${inputId}">
                        <span class="duration-text">${item.duration}</span>
                        <span class="price-text">${item.price}</span>
                    </label>
                `;
                durationOptionsContainer.appendChild(optionDiv);
            });

            // Add event listener to enable Next button when a duration is selected
            const durationRadios = durationOptionsContainer.querySelectorAll('input[name="renewal_duration"]');
            durationRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    if (durationNextBtn) durationNextBtn.disabled = false; // Enable Next button
                    // Store selected details
                    const selectedRadio = durationOptionsContainer.querySelector('input[name="renewal_duration"]:checked');
                    if (selectedRadio) {
                        selectedDuration = selectedRadio.value;
                        selectedPrice = selectedRadio.getAttribute('data-price');
                    }
                });
            });

        } else {
            durationOptionsContainer.innerHTML = '<p class="loading-text">No duration options available.</p>';
            if (durationNextBtn) durationNextBtn.disabled = true; // Disable next if no options
        }
        // Update dynamic service name in the step title
        dynamicServiceNameSpans.forEach(span => span.textContent = serviceName);
        if (durationNextBtn) durationNextBtn.disabled = true; // Ensure Next is disabled initially
    };

    // Function to populate payment details for Step 3
    const populatePaymentDetails = () => {
        if (paymentAmountSpan) paymentAmountSpan.textContent = selectedPrice || 'Amount';
        if (paymentDurationSpan) paymentDurationSpan.textContent = selectedDuration || 'Duration';
        if (paymentServiceSpan) paymentServiceSpan.textContent = selectedService || 'Service';

        // Set data attributes for the WhatsApp button
        if (whatsappConfirmBtnV3) {
            whatsappConfirmBtnV3.setAttribute('data-service', selectedService || '');
            whatsappConfirmBtnV3.setAttribute('data-duration', selectedDuration || '');
            whatsappConfirmBtnV3.setAttribute('data-price', selectedPrice || '');
        }
    };

    // --- Event Listeners for Multi-Step Renewal ---
    // Only run if Step 1 exists (i.e., we are on the renewal page)
    if (step1) {
        // Service Card Clicks (Go to Step 2)
        serviceCardsV3.forEach(card => {
            card.addEventListener('click', () => {
                selectedService = card.getAttribute('data-service');
                if (selectedService) {
                    populateDurationOptions(selectedService);
                    goToStep(2); // Go to duration selection
                }
            });
        });

        // Duration Next Button Click (Go to Step 3)
        if (durationNextBtn) {
            durationNextBtn.addEventListener('click', () => {
                // Double check a duration was selected
                 const selectedRadio = durationOptionsContainer.querySelector('input[name="renewal_duration"]:checked');
                 if (selectedRadio) {
                     selectedDuration = selectedRadio.value;
                     selectedPrice = selectedRadio.getAttribute('data-price');
                     populatePaymentDetails();
                     goToStep(3); // Go to payment/confirmation
                 } else {
                     alert("Please select a duration."); // Should not happen if button is enabled correctly
                 }
            });
        }

        // Back Button Clicks
        backBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetStep = btn.getAttribute('data-target-step');
                if (targetStep) {
                    goToStep(parseInt(targetStep));
                }
            });
        });

        // Start Over Button Click
        if (startOverBtn) {
            startOverBtn.addEventListener('click', () => {
                // Reset stored selections
                selectedService = null;
                selectedDuration = null;
                selectedPrice = null;
                // Reset duration options
                durationOptionsContainer.innerHTML = '<p class="loading-text">Loading options...</p>';
                if (durationNextBtn) durationNextBtn.disabled = true;
                // Go back to step 1
                goToStep(1);
            });
        }

        // WhatsApp Confirmation Button Click (Step 3)
        if (whatsappConfirmBtnV3) {
            whatsappConfirmBtnV3.addEventListener('click', () => {
                // Get details from the button's data attributes (set when step 3 was populated)
                const service = whatsappConfirmBtnV3.getAttribute('data-service');
                // const duration = whatsappConfirmBtnV3.getAttribute('data-duration'); // Not needed for message
                // const price = whatsappConfirmBtnV3.getAttribute('data-price'); // Not needed for message

                if (service) {
                    const whatsappNumber = "256762193386";
                    // Updated confirmation message
                    const message = `Hi , I've just renewed my ${service}. Please check and confirm.`;
                    const encodedMessage = encodeURIComponent(message);
                    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                    window.location.href = whatsappURL; // Redirect
                } else {
                    alert("An error occurred. Please start over."); // Fallback
                }
            });
        }

        // --- ClipboardJS Initialization for Renewal Page ---
        if (typeof ClipboardJS !== 'undefined') {
            const clipboard = new ClipboardJS('.copy-btn-v3'); // Target new copy buttons

            clipboard.on('success', function(e) {
                const originalButtonHtml = e.trigger.innerHTML; // Store original icon + text
                e.trigger.innerHTML = '<i class="fas fa-check"></i> Copied!'; // Change to checkmark
                e.trigger.disabled = true; // Disable briefly

                setTimeout(() => {
                    e.trigger.innerHTML = originalButtonHtml; // Restore original content
                    e.trigger.disabled = false; // Re-enable
                }, 1500); // Reset after 1.5 seconds

                e.clearSelection();
            });

            clipboard.on('error', function(e) {
                console.error('ClipboardJS error:', e.action, e.trigger);
                alert('Failed to copy. Please copy the number manually.');
            });
        } else {
            console.warn("ClipboardJS library not loaded. Copy buttons will not work.");
            document.querySelectorAll('.copy-btn-v3').forEach(btn => btn.style.display = 'none'); // Hide buttons
        }
        // --- End ClipboardJS ---

        // Initial state: Show Step 1 on page load
        goToStep(1);

    } // End check for renewal page elements
    // --- End Multi-Step Renewal Page Logic ---


}); // End of the SINGLE, main DOMContentLoaded listener


// --- Preloader ---
// Runs when the entire page (including images) is loaded. Stays outside DOMContentLoaded.
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => preloader.classList.add('hidden'), 150); // Fade out after delay
        preloader.addEventListener('transitionend', function handleTransitionEnd(event) {
             if (event.propertyName === 'opacity' || event.propertyName === 'visibility') {
                if (preloader.classList.contains('hidden')) {
                   // preloader.remove(); // Optional: remove element after fade
                   preloader.removeEventListener('transitionend', handleTransitionEnd); // Clean up
                }
             }
        });
    }
});
// --- End Preloader ---
