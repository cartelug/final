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


    // --- Improved Renewal Page Logic (Single View) ---
    // Get elements for the improved renewal page
    const serviceCardsV2 = document.querySelectorAll('.service-card-v2');
    const detailsSection = document.getElementById('details-section');
    const detailsPlaceholder = detailsSection?.querySelector('.details-placeholder'); // Use optional chaining
    const detailsContent = detailsSection?.querySelector('.details-content');
    const detailsServiceNameSpan = document.getElementById('details-service-name');
    const detailsPricingListUl = document.getElementById('details-pricing-list');
    const whatsappConfirmBtnV2 = document.getElementById('whatsapp-confirm-btn-v2');
    const detailsTitle = detailsSection?.querySelector('.details-title');

    // Define renewal prices
    const renewalPricesV2 = {
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

    // Check if we are on the improved renewal page
    if (serviceCardsV2.length > 0 && detailsSection && detailsContent && detailsPricingListUl) {

        // Function to display prices in the details section
        const displayPricesV2 = (serviceName) => {
            detailsPricingListUl.innerHTML = ''; // Clear existing list
            const prices = renewalPricesV2[serviceName];
            if (prices && prices.length > 0) {
                prices.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span class="duration">${item.duration}</span>
                        <span class="price">${item.price}</span>
                    `;
                    detailsPricingListUl.appendChild(li);
                });
            } else {
                // Optionally display a message if no prices are found
                detailsPricingListUl.innerHTML = '<li>No pricing available for this service.</li>';
                console.warn(`No renewal prices found for service: ${serviceName}`);
            }
        };

        // Add click listeners to service cards
        serviceCardsV2.forEach(card => {
            card.addEventListener('click', () => {
                const selectedService = card.getAttribute('data-service');
                const serviceColor = card.getAttribute('data-color') || 'var(--cta-blue)'; // Get color or default

                // Remove 'selected' class from all cards
                serviceCardsV2.forEach(c => {
                    c.classList.remove('selected');
                    c.style.removeProperty('--service-color'); // Remove custom properties
                    c.style.removeProperty('--service-shadow-color');
                    c.style.removeProperty('--service-bg-color');
                });
                // Update details section content
                if (detailsServiceNameSpan) detailsServiceNameSpan.textContent = selectedService;
                if (whatsappConfirmBtnV2) whatsappConfirmBtnV2.setAttribute('data-service', selectedService);

                // Update title color (optional, using class)
                if (detailsTitle) {
                    detailsTitle.className = 'details-title'; // Reset
                    if (selectedService.toLowerCase().includes('netflix')) detailsTitle.classList.add('netflix');
                    else if (selectedService.toLowerCase().includes('spotify')) detailsTitle.classList.add('spotify');
                    else if (selectedService.toLowerCase().includes('prime')) detailsTitle.classList.add('prime');
                }

                // Display prices
                displayPricesV2(selectedService);

                // Hide placeholder, show content, and reveal the details section
                if (detailsPlaceholder) detailsPlaceholder.style.display = 'none';
                if (detailsContent) detailsContent.style.display = 'block';
                detailsSection.classList.add('visible'); // Trigger transition

                 // Scroll the details section into view smoothly (optional)
                 setTimeout(() => {
                     detailsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                 }, 100); // Slight delay after transition starts

            });
        });

        // WhatsApp Confirmation Button Logic
        if (whatsappConfirmBtnV2) {
            whatsappConfirmBtnV2.addEventListener('click', () => {
                const service = whatsappConfirmBtnV2.getAttribute('data-service');
                if (service) {
                    const whatsappNumber = "256762193386";
                    // Updated, more instructive message
                    const message = `Hi Cartelug, I've renewed my ${service}. Please check and confirm.`;
                    const encodedMessage = encodeURIComponent(message);
                    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                    window.location.href = whatsappURL; // Redirect
                } else {
                    alert("Please select a service first before confirming payment."); // Guide user
                }
            });
        }

        // --- ClipboardJS Initialization ---
        // Check if ClipboardJS is loaded
        if (typeof ClipboardJS !== 'undefined') {
            const clipboard = new ClipboardJS('.copy-btn');

            clipboard.on('success', function(e) {
                console.log('Copied:', e.text);
                const originalText = e.trigger.innerHTML; // Store original button content
                // Provide visual feedback
                e.trigger.innerHTML = '<i class="fas fa-check"></i> Copied!';
                e.trigger.disabled = true; // Briefly disable button

                // Reset button text after a short delay
                setTimeout(() => {
                    e.trigger.innerHTML = originalText;
                    e.trigger.disabled = false;
                }, 1500); // Reset after 1.5 seconds

                e.clearSelection(); // Deselect text
            });

            clipboard.on('error', function(e) {
                console.error('Copy failed:', e.action);
                // Optionally provide fallback feedback
                alert('Failed to copy. Please copy manually.');
            });
        } else {
            console.warn("ClipboardJS library not loaded. Copy buttons will not work.");
            // Hide copy buttons if library isn't loaded
            document.querySelectorAll('.copy-btn').forEach(btn => btn.style.display = 'none');
        }
        // --- End ClipboardJS ---

    } // End check for improved renewal page elements
    // --- End Improved Renewal Page Logic ---


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
