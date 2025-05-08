// Wrap ALL DOM-dependent code in a SINGLE DOMContentLoaded listener
// This ensures the HTML is fully loaded before the script tries to find elements
document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    // Handles opening and closing the mobile navigation menu
    const menuButton = document.getElementById('mobile-menu-button');
    const mainNav = document.getElementById('main-nav');
    if (menuButton && mainNav) {
        menuButton.addEventListener('click', () => {
            mainNav.classList.toggle('active'); // Toggle the 'active' class to show/hide menu
            const icon = menuButton.querySelector('i'); // Get the icon element (bars/times)

            // Change the icon and accessibility label based on the menu's state
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars'); // Change to 'X' icon
                icon.classList.add('fa-times');
                menuButton.setAttribute('aria-label', 'Close Menu'); // Update accessibility label
            } else {
                icon.classList.remove('fa-times'); // Change back to 'bars' icon
                icon.classList.add('fa-bars');
                menuButton.setAttribute('aria-label', 'Open Menu'); // Update accessibility label
            }
        });

        // Optional: Close mobile menu when a navigation link is clicked
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Only close if it's not an anchor link on the same page (e.g., /#services)
                // OR if it's a link navigating away from the homepage
                const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';
                const isAnchorLink = link.getAttribute('href').startsWith('#');

                if (!isAnchorLink || !isHomePage) {
                     // Check if the menu is currently active/open
                     if (mainNav.classList.contains('active')) {
                        mainNav.classList.remove('active'); // Close the menu
                        // Reset the menu button icon and label
                        const icon = menuButton.querySelector('i');
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                        menuButton.setAttribute('aria-label', 'Open Menu');
                    }
                }
                // If it IS an anchor link on the homepage, let the default scroll happen without closing the menu immediately
            });
        });
    } // End Mobile Menu Logic

    // --- Generic Modal Open/Close Functionality (Used on index.html) ---
    /**
     * Sets up event listeners for a button to open a specific modal,
     * and listeners for closing the modal (via close button or overlay click).
     * @param {string} buttonId - The ID of the button that triggers the modal.
     * @param {string} modalId - The ID of the modal element.
     */
    const setupModal = (buttonId, modalId) => {
        const startButton = document.getElementById(buttonId); // Button that triggers the modal
        const modal = document.getElementById(modalId);       // The modal element itself

        // Ensure both the button and the modal exist in the HTML
        if (startButton && modal) {
            const modalCloseButton = modal.querySelector('.modal-close'); // The 'x' button inside the modal
            const modalOverlay = modal.querySelector('.modal-overlay');   // The background overlay element
            const modalContent = modal.querySelector('.modal-content');   // The modal's content area

            // Function to open the modal by adding the 'active' class
            const openModal = () => modal.classList.add('active');
            // Function to close the modal by removing the 'active' class
            const closeModal = () => modal.classList.remove('active');

            // Add listener to the button that opens the modal
            startButton.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior if the button is an <a> tag
                openModal();
            });

            // Add listener to the modal's close ('x') button
            if (modalCloseButton) {
                modalCloseButton.addEventListener('click', closeModal);
            }

            // Add listener to the overlay - clicking outside the content closes the modal
            if (modalOverlay) {
                modalOverlay.addEventListener('click', closeModal);
            }

            // Prevent the modal from closing if the user clicks *inside* the modal content area
            // (stops the click event from bubbling up to the overlay)
            if (modalContent) {
                modalContent.addEventListener('click', (event) => event.stopPropagation());
            }
        }
    };
    // Initialize the modal functionality for each service on the homepage
    setupModal('netflix-start-btn', 'netflix-modal');
    setupModal('prime-start-btn', 'prime-modal');
    setupModal('spotify-start-btn', 'spotify-modal');
    // End Modal Logic

    // --- Generic Order Form WhatsApp Redirect Function ---
    /**
     * Handles validation and submission of order forms, redirecting
     * the user to WhatsApp with pre-filled order details.
     * @param {string} formId - The ID of the order form element.
     * @param {string} serviceName - The name of the service being ordered.
     */
    const setupOrderFormRedirect = (formId, serviceName) => {
        const orderForm = document.getElementById(formId); // Get the specific order form

        // Only proceed if the form exists on the current page
        if (orderForm) {
            orderForm.addEventListener('submit', function(event) {
                event.preventDefault(); // Prevent the browser's default form submission

                // --- Find form elements within *this specific form* ---
                const selectedPackageRadio = orderForm.querySelector('input[name="package"]:checked');
                const clientNameInput = orderForm.querySelector('#clientName');
                const selectedPaymentRadio = orderForm.querySelector('input[name="paymentMethod"]:checked');
                // Instagram username field is specific to one form
                const instaUsernameInput = orderForm.querySelector('#instaUsername');

                // --- Simple Form Validation ---
                // Check if a package is selected
                if (!selectedPackageRadio) {
                    alert("Please select a package.");
                    // Try to focus the first package radio for user convenience
                    const firstPackageRadio = orderForm.querySelector('input[name="package"]');
                    if(firstPackageRadio) firstPackageRadio.focus();
                    return; // Stop processing if validation fails
                }
                 // Check Instagram username only if the input exists and is required
                 if (instaUsernameInput && instaUsernameInput.required && instaUsernameInput.value.trim() === "") {
                     alert("Please enter your Instagram Username.");
                     instaUsernameInput.focus();
                     return; // Stop processing
                 }
                 // Check if client name is entered
                 if (!clientNameInput || clientNameInput.value.trim() === "") {
                    alert("Please enter your name.");
                    if(clientNameInput) clientNameInput.focus(); // Focus the name field
                    return; // Stop processing
                }
                // Check if a payment method is selected
                if (!selectedPaymentRadio) {
                    alert("Please select a payment method.");
                     // Try to focus the first payment radio
                    const firstPaymentRadio = orderForm.querySelector('input[name="paymentMethod"]');
                    if(firstPaymentRadio) firstPaymentRadio.focus();
                    return; // Stop processing
                }
                // --- End Validation ---

                // --- Gather selected data ---
                const duration = selectedPackageRadio.value;
                const price = selectedPackageRadio.getAttribute('data-price'); // Get price from data attribute
                const clientName = clientNameInput ? clientNameInput.value.trim() : 'N/A'; // Use trim() to remove whitespace
                const paymentMethod = selectedPaymentRadio.value;
                const instagramUsername = instaUsernameInput ? instaUsernameInput.value.trim() : null; // Get username if present

                // --- Construct WhatsApp message ---
                const whatsappNumber = "256762193386"; // IMPORTANT: Replace with your actual WhatsApp number
                let message = `Order for Cartelug:\n\n`; // Start message with double newline
                message += `*Service:* ${serviceName}\n`; // Add service name
                if (instagramUsername) { // Add Instagram username only if it was entered
                    message += `*Instagram Username:* ${instagramUsername}\n`;
                }
                message += `*Package:* ${duration}\n`; // Add selected package duration/name
                if (price) { // Add price if available in the data attribute
                    message += `*Price:* ${price}\n`;
                }
                message += `*Payment Method:* ${paymentMethod}\n`; // Add selected payment method
                message += `*Name:* ${clientName}`; // Add client name

                // --- Create WhatsApp URL and Redirect ---
                const encodedMessage = encodeURIComponent(message); // Encode the message for the URL
                const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

                // Redirect the user's browser to the WhatsApp URL
                 window.location.href = whatsappURL;
                 // Alternative: Open WhatsApp in a new tab: window.open(whatsappURL, '_blank');

                 // Optional: Reset the form after submission (might be confusing for user)
                 // orderForm.reset();
            });
        }
    };
    // Initialize the redirect logic for all potential order forms across the site
    setupOrderFormRedirect('netflix-order-form', 'Netflix');
    setupOrderFormRedirect('prime-order-form', 'Prime Video');
    setupOrderFormRedirect('spotify-order-form', 'Spotify');
    setupOrderFormRedirect('instagram-boost-form', 'Instagram Likes Boost');
    // End Order Form Logic

    // --- Testimonial Swiper Initialization (Used on index.html) ---
    // Check if the Swiper library is loaded and if the swiper container element exists
    if (typeof Swiper !== 'undefined' && document.querySelector('.testimonial-swiper')) {
        try {
            // Initialize Swiper with configuration options
            const testimonialSwiper = new Swiper('.testimonial-swiper', {
                // Basic Swiper Options
                direction: 'horizontal', // Slide horizontally (default)
                loop: true,              // Enable continuous looping of slides
                slidesPerView: 1,        // Show one slide at a time
                spaceBetween: 30,        // Gap between slides (more relevant if slidesPerView > 1)
                grabCursor: true,        // Show a "grab" cursor on hover
                autoHeight: true,        // Adjust slider height automatically to fit the current slide's content

                // Pagination (the dots)
                pagination: {
                    el: '.swiper-pagination', // CSS selector for the pagination container
                    clickable: true,          // Allow clicking on dots to navigate to slides
                },

                // Navigation (the arrows)
                navigation: {
                    nextEl: '.swiper-button-next', // CSS selector for the 'next' arrow
                    prevEl: '.swiper-button-prev', // CSS selector for the 'previous' arrow
                },

                 // Accessibility Features
                 a11y: {
                     enabled: true, // Enable accessibility features
                     prevSlideMessage: 'Previous testimonial', // ARIA label for previous button
                     nextSlideMessage: 'Next testimonial',     // ARIA label for next button
                     paginationBulletMessage: 'Go to testimonial slide {{index}}', // ARIA label for pagination dots
                 },

                 // Autoplay Configuration
                 autoplay: {
                    delay: 5000,             // Time (in ms) between slide transitions (5 seconds)
                    disableOnInteraction: false, // Keep autoplaying even if user interacts (swipes)
                    pauseOnMouseEnter: true, // Pause autoplay when the mouse pointer is over the slider
                 },
            });
        } catch (error) {
            // Log an error if Swiper initialization fails
            console.error("Swiper initialization failed:", error);
            // Optional: Display a fallback message to the user if Swiper fails
            const swiperContainer = document.querySelector('.testimonial-swiper');
            if (swiperContainer) {
                swiperContainer.innerHTML = '<p style="text-align: center; color: var(--text-medium);">Testimonials could not be loaded.</p>';
            }
        }
    } // End Swiper Logic

    // --- Contact Page Issue Card WhatsApp Redirect Logic ---
    // Adds click listeners to specific issue cards on the contact page to open WhatsApp
    // *** Excludes the Netflix Signed Out card ***
    const issueButtons = document.querySelectorAll('.issue-card[data-service][data-issue]'); // Select cards with specific data attributes
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
            message += `Please describe the problem in detail:`; // Prompt user to add details

            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            // Open the WhatsApp link in a new browser tab
            window.open(whatsappURL, '_blank');
        });
    }); // End Contact Issue Card Logic

    // --- Netflix Payment Issue Card Logic (Used on contact.html) ---
    // Handles the interaction for the specific Netflix payment issue card
    const paymentEscalateBtn = document.getElementById('payment-issue-escalate-btn');
    const paymentInitialDiv = document.getElementById('payment-fix-initial'); // Div with initial instructions
    const paymentApologyDiv = document.getElementById('payment-issue-apology'); // Div shown after clicking button

    // Check if all relevant elements exist on the current page
    if (paymentEscalateBtn && paymentInitialDiv && paymentApologyDiv) {
        // Add click listener to the "Still can't watch?" button
        paymentEscalateBtn.addEventListener('click', () => {
            paymentInitialDiv.style.display = 'none';    // Hide the initial instructions
            paymentApologyDiv.classList.remove('hidden'); // Make the apology div visible (removes CSS class)
            paymentApologyDiv.style.display = 'block';   // Ensure it's displayed (in case 'hidden' used !important)
        });
    }
    // --- End of Netflix Payment Issue Card Logic ---

    // --- Footer Year Update ---
    // Automatically updates the year in the footer copyright notice
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear(); // Set text to current year
    } // End Footer Year Logic


    // --- V2/V3 Renewal Page Logic --- //
    // This section handles the interactivity for the redesigned renewal page (renew/index.html with renew-v2.css)

    const renewalSectionV2 = document.querySelector('.renewal-section-v2'); // Check if we are on the renewal page

    // Only run this logic if the main renewal section element exists
    if (renewalSectionV2) {

        console.log("Renewal V2/V3 Script Initializing..."); // Debug log

        // Get references to all interactive elements on the page
        const serviceButtonsV2 = renewalSectionV2.querySelectorAll('.service-card-v2');
        const durationBlockV2 = renewalSectionV2.querySelector('#duration-block-v2');
        const durationOptionsContainerV2 = renewalSectionV2.querySelector('#duration-options-container-v2');
        const dynamicServiceLabelV2 = durationBlockV2?.querySelector('.dynamic-service-label'); // Use optional chaining

        // Summary Card Elements - Use optional chaining for robustness
        const summaryCardV2 = renewalSectionV2.querySelector('#summary-card-v2');
        const summaryServiceV2 = summaryCardV2?.querySelector('#summary-service-v2');
        const summaryDurationV2 = summaryCardV2?.querySelector('#summary-duration-v2');
        const summaryPriceV2 = summaryCardV2?.querySelector('#summary-price-v2');
        const whatsappConfirmBtnV2 = summaryCardV2?.querySelector('#whatsapp-confirm-btn-v2');
        const resetBtnV2 = summaryCardV2?.querySelector('#reset-renewal-btn-v2'); // Reset button inside summary

        // Payment Copy Buttons
        const copyBtnsV2 = renewalSectionV2.querySelectorAll('.copy-btn-v2');

        // --- Data for Renewal Options ---
        // Store prices and durations for each service. Update these if your prices change.
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
            // Add other services here following the same structure if needed
        };

        // --- State Variables ---
        // Keep track of the user's current selections
        let currentServiceV2 = null;
        let currentDurationV2 = null;
        let currentPriceV2 = null;

        // --- Functions ---

        /**
         * Updates the text content of the summary card based on current selections.
         * Enables/disables the WhatsApp confirmation button.
         */
        const updateSummaryV2 = () => {
            // Ensure summary elements exist before trying to update them
            if (!summaryServiceV2 || !summaryDurationV2 || !summaryPriceV2 || !whatsappConfirmBtnV2) {
                 console.error("One or more summary elements not found!");
                 return;
            }
            console.log("Updating Summary:", { service: currentServiceV2, duration: currentDurationV2, price: currentPriceV2 }); // Debug log

            // Update text fields, showing defaults if nothing is selected
            summaryServiceV2.textContent = currentServiceV2 ? currentServiceV2 : 'Please select';
            summaryDurationV2.textContent = currentDurationV2 ? currentDurationV2 : 'Please select';
            summaryPriceV2.textContent = currentPriceV2 ? currentPriceV2 : '--';

            // Enable the WhatsApp button only if service, duration, AND price are all selected (truthy)
            const isComplete = !!(currentServiceV2 && currentDurationV2 && currentPriceV2);
            whatsappConfirmBtnV2.disabled = !isComplete;
             console.log("WhatsApp button disabled:", !isComplete); // Debug log
        };

        /**
         * Clears and populates the duration options block based on the selected service.
         * Adds event listeners to the newly created duration radio buttons.
         * @param {string} serviceName - The name of the service selected (e.g., "Netflix").
         */
        const populateDurationOptionsV2 = (serviceName) => {
            console.log("Populating durations for:", serviceName); // Debug log
            // Ensure the container and price data exist
            if (!durationOptionsContainerV2 || !renewalPricesV2[serviceName]) {
                 console.error("Duration container or price data missing for", serviceName);
                 if(durationOptionsContainerV2) durationOptionsContainerV2.innerHTML = '<p class="loading-text-v2">Options not available.</p>';
                 if(durationBlockV2) durationBlockV2.style.display = 'none'; // Hide block if no options
                return;
            }

            durationOptionsContainerV2.innerHTML = ''; // Clear any previous options
            const prices = renewalPricesV2[serviceName]; // Get the price array for this service

            // Check if there are any price options for this service
            if (prices && prices.length > 0) {
                // Create and append a radio button option for each price item
                prices.forEach((item, index) => {
                    const optionDiv = document.createElement('div');
                    optionDiv.className = 'duration-option-v2'; // Apply CSS class
                    // Create a unique ID for the radio input and its label
                    const inputId = `duration-v2-${serviceName.replace(/\s+/g, '-')}-${index}`;

                    // Set the inner HTML for the radio button and label
                    optionDiv.innerHTML = `
                        <input type="radio" id="${inputId}" name="renewal_duration_v2" value="${item.duration}" data-price="${item.price}">
                        <label for="${inputId}">
                            <span class="duration-text">${item.duration}</span>
                            <span class="price-text">${item.price}</span>
                        </label>
                    `;
                    durationOptionsContainerV2.appendChild(optionDiv); // Add the new option to the container
                });

                 // IMPORTANT: Add event listeners *after* creating the radio buttons
                 const durationRadios = durationOptionsContainerV2.querySelectorAll('input[name="renewal_duration_v2"]');
                 console.log(`Found ${durationRadios.length} duration radios to add listeners to.`); // Debug log
                 durationRadios.forEach(radio => {
                     radio.addEventListener('change', () => {
                         console.log("Duration changed:", radio.value, radio.checked); // Debug log
                         if (radio.checked) { // When a duration is selected
                             currentDurationV2 = radio.value; // Update state variable
                             currentPriceV2 = radio.getAttribute('data-price'); // Update state variable
                             updateSummaryV2(); // Update the summary card display
                         }
                     });
                 });

                // Update the dynamic label in the heading (e.g., "for Netflix")
                if (dynamicServiceLabelV2) dynamicServiceLabelV2.textContent = `for ${serviceName}`;
                 // Make the duration block visible
                 if(durationBlockV2) {
                     console.log("Showing duration block"); // Debug log
                     durationBlockV2.style.display = 'block';
                 }


            } else {
                // If no prices are found for the service
                console.log("No durations found for", serviceName); // Debug log
                durationOptionsContainerV2.innerHTML = '<p class="loading-text-v2">No durations found for this service.</p>';
                if(durationBlockV2) durationBlockV2.style.display = 'none'; // Hide the block
            }
        };

        /**
         * Resets all selections and the UI back to the initial state.
         */
        const resetSelectionsV2 = () => {
            console.log("Resetting selections..."); // Debug log
            // Clear state variables
            currentServiceV2 = null;
            currentDurationV2 = null;
            currentPriceV2 = null;

            // Remove 'selected' class from all service buttons
            serviceButtonsV2.forEach(btn => btn.classList.remove('selected'));

            // Hide the duration block and clear its content
            if (durationBlockV2) durationBlockV2.style.display = 'none';
            if (durationOptionsContainerV2) durationOptionsContainerV2.innerHTML = ''; // Clear options
            if (dynamicServiceLabelV2) dynamicServiceLabelV2.textContent = ''; // Clear dynamic label


            // Update the summary card (this will reset text and disable the button)
            updateSummaryV2();

            // Optional: Scroll the user back to the top of the renewal section
            // renewalSectionV2.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        // --- Event Listeners Setup ---

        // 1. Service Button Clicks
        serviceButtonsV2.forEach(button => {
            button.addEventListener('click', () => {
                const selectedService = button.getAttribute('data-service');
                console.log("Service selected:", selectedService); // Debug log

                // Optional: Prevent re-processing if the same button is clicked again
                // if (selectedService === currentServiceV2) return;

                // Update state
                currentServiceV2 = selectedService;
                currentDurationV2 = null; // Reset duration when service changes
                currentPriceV2 = null;    // Reset price

                // Update UI: Highlight the clicked button
                serviceButtonsV2.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');

                // Load the duration options for the selected service
                populateDurationOptionsV2(currentServiceV2);

                // Update summary (will show service, but reset duration/price)
                updateSummaryV2();

                 // Scroll the duration block into view smoothly if it became visible
                if (durationBlockV2 && durationBlockV2.style.display !== 'none') {
                    // Use a small timeout to ensure the block is rendered before scrolling
                    setTimeout(() => {
                        // Scroll so the center of the block is in the center of the viewport
                        durationBlockV2.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100); // 100ms delay
                 }
            });
        });

        // 2. WhatsApp Confirmation Button Click
        if (whatsappConfirmBtnV2) {
            whatsappConfirmBtnV2.addEventListener('click', () => {
                console.log("WhatsApp button clicked. State:", { service: currentServiceV2, duration: currentDurationV2, price: currentPriceV2 }); // Debug log
                // Double-check that all necessary info is selected (although button should be disabled otherwise)
                if (currentServiceV2 && currentDurationV2 && currentPriceV2) {
                    const whatsappNumber = "256762193386"; // IMPORTANT: Replace with your actual WhatsApp number
                    // Construct the pre-filled message
                    const message = `Hi Cartelug, I've paid ${currentPriceV2} to renew my subscription for ${currentDurationV2}. Please confirm my renewal.`;
                    const encodedMessage = encodeURIComponent(message); // Encode for URL
                    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

                    // Redirect the user to WhatsApp
                    window.location.href = whatsappURL;
                    // Or open in a new tab: window.open(whatsappURL, '_blank');
                } else {
                    // Fallback alert if somehow clicked while disabled or state is inconsistent
                    console.error("WhatsApp button clicked with incomplete selections.");
                    alert("Please complete your service and duration selection first.");
                }
            });
        } else {
             console.error("WhatsApp confirmation button (#whatsapp-confirm-btn-v2) not found!");
        }


        // 3. Reset Button Click
        if (resetBtnV2) {
            resetBtnV2.addEventListener('click', resetSelectionsV2);
        } else {
             console.error("Reset button (#reset-renewal-btn-v2) not found!");
        }


        // 4. ClipboardJS Initialization (for copy buttons)
        // Check if ClipboardJS library is loaded and if copy buttons exist
        if (typeof ClipboardJS !== 'undefined' && copyBtnsV2.length > 0) {
             console.log("Initializing ClipboardJS..."); // Debug log
            // Initialize ClipboardJS on all elements with the class '.copy-btn-v2'
            const clipboard = new ClipboardJS('.copy-btn-v2');

            // On successful copy
            clipboard.on('success', function(e) {
                console.log("Text copied successfully:", e.text); // Debug log
                const originalText = e.trigger.innerHTML; // Store original button content (icon + text)
                e.trigger.innerHTML = `<i class="fas fa-check"></i> Copied`; // Change text to "Copied" with check icon
                e.trigger.disabled = true; // Temporarily disable button

                // Set a timeout to revert the button text and enable it again
                setTimeout(() => {
                    e.trigger.innerHTML = originalText; // Restore original text/icon
                    e.trigger.disabled = false; // Re-enable button
                }, 1500); // Revert after 1.5 seconds

                e.clearSelection(); // Deselect the copied text
            });

            // On copy error
            clipboard.on('error', function(e) {
                console.error('ClipboardJS error:', e.action, e.trigger);
                // Attempt to get the number to show in the alert for manual copying
                const numberToCopy = e.trigger.closest('.number-copy-wrapper-v2')?.querySelector('strong')?.textContent;
                alert(`Failed to copy automatically. Please copy manually${numberToCopy ? ': ' + numberToCopy : '.'}`);
            });
        } else if (copyBtnsV2.length > 0) {
            // If buttons exist but ClipboardJS is not loaded, hide the buttons and log a warning
             console.warn("ClipboardJS library not loaded or no copy buttons found. Hiding copy buttons.");
             copyBtnsV2.forEach(btn => btn.style.display = 'none');
        } else {
             console.log("No copy buttons found on this page."); // Debug log
        }

        // --- Initial Page Setup ---
        resetSelectionsV2(); // Ensure the form starts in a clean, reset state when the page loads

    } // --- End of check for V2/V3 renewal page elements ---

    // --- End V2/V3 Renewal Page Logic --- //

// --- Netflix Signed Out Modal Logic --- //
    const signedOutHelpBtn = document.getElementById('netflix-signed-out-help-btn'); // Get the button by its new ID
    const modal = document.getElementById('signed-out-modal');

    if (signedOutHelpBtn && modal) { // Check if the button and modal exist
        const modalCloseBtns = modal.querySelectorAll('.modal-close, .modal-close-final');
        const modalOverlay = modal.querySelector('.modal-overlay');
        const modalContent = modal.querySelector('.signed-out-modal-content');

        // Step containers and elements
        const steps = modal.querySelectorAll('.modal-step');
        const step1 = modal.querySelector('#modal-step-1');
        const step2 = modal.querySelector('#modal-step-2');
        const step3 = modal.querySelector('#modal-step-3');
        const step4TV = modal.querySelector('#modal-step-4-tv');
        const step4Phone = modal.querySelector('#modal-step-4-phone');

        // Step 1 elements
        const emailOptionsContainer = step1.querySelector('.email-options-container');
        const step1NextBtn = step1.querySelector('#modal-step1-next');

        // Step 2 elements
        const selectedEmailDisplay = step2.querySelector('#modal-selected-email');
        const confirmYesBtn = step2.querySelector('#modal-confirm-yes');
        const confirmNoBtn = step2.querySelector('#modal-confirm-no');

        // Step 3 elements
        const selectTVBtn = step3.querySelector('#modal-select-tv');
        const selectPhoneBtn = step3.querySelector('#modal-select-phone');

        // Step 4 elements
        const tvInstructionEmail = step4TV.querySelector('#tv-instruction-email');
        const phoneInstructionEmail = step4Phone.querySelector('#phone-instruction-email');

        // Back buttons (selecting all with this class)
        const backButtons = modal.querySelectorAll('.modal-back-button');

        // State
        let selectedEmail = null;

        // List of emails
        const emailList = [
            "carteluganda0@gmail.com", "carteluganda1@gmail.com", "carteluganda2@gmail.com",
            "carteluganda3@gmail.com", "carteluganda4@gmail.com", "carteluganda5@gmail.com",
            "carteluganda6@gmail.com", "carteluganda7@gmail.com", "carteluganda8@gmail.com",
            "carteluganda9@gmail.com", "carteluganda10@gmail.com", "carteluganda11@gmail.com",
            "carteluganda12@gmail.com", "carteluganda13@gmail.com", "carteluganda14@gmail.com",
            "carteluganda15@gmail.com", "carteluganda16@gmail.com"
        ];

        // --- Functions ---
        const openModal = () => {
            resetModal(); // Reset to step 1 when opening
            modal.classList.add('active');
        };

        const closeModal = () => {
            modal.classList.remove('active');
            // Optional: slight delay before reset to avoid visual glitch during fade-out
            setTimeout(resetModal, 300);
        };

        const goToStep = (stepId) => { // Changed to accept step ID (e.g., '1', '2', '4-tv')
            steps.forEach(step => step.style.display = 'none'); // Hide all steps
            const targetStep = modal.querySelector(`#modal-step-${stepId}`); // Use ID selector
            if (targetStep) {
                targetStep.style.display = 'block'; // Show the target step
            } else {
                console.error(`Modal step #modal-step-${stepId} not found!`);
            }
        };

        const resetModal = () => {
            selectedEmail = null;
            // Uncheck all radio buttons
            if (emailOptionsContainer) { // Check if container exists
                const radios = emailOptionsContainer.querySelectorAll('input[type="radio"]');
                radios.forEach(radio => radio.checked = false);
            }
            if (step1NextBtn) step1NextBtn.disabled = true; // Disable next button safely
            goToStep('1'); // Go back to the first step
        };

        // Populate email options in Step 1 and add bold formatting
        const populateEmails = () => {
            if (!emailOptionsContainer) return; // Exit if container not found
            emailOptionsContainer.innerHTML = ''; // Clear existing options
            emailList.forEach((email, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'email-option';
                const inputId = `email-option-${index}`;

                // Format email with bold number using regex replace
                const formattedEmail = email.replace(/(\d+)/, '<b>$1</b>');

                optionDiv.innerHTML = `
                    <input type="radio" id="${inputId}" name="netflix_email" value="${email}">
                    <label for="${inputId}">${formattedEmail}</label>
                `;
                emailOptionsContainer.appendChild(optionDiv);

                // Add event listener to each radio button
                const radioInput = optionDiv.querySelector('input[type="radio"]');
                radioInput.addEventListener('change', () => {
                    if (radioInput.checked) {
                        selectedEmail = radioInput.value;
                        if (step1NextBtn) step1NextBtn.disabled = false; // Enable Next button safely
                    }
                });
            });
        };

        // --- Event Listeners ---

        // Open modal when the "GET HELP" button is clicked
        signedOutHelpBtn.addEventListener('click', openModal); // Attach listener to the button

        // Close modal listeners
        modalCloseBtns.forEach(btn => btn.addEventListener('click', closeModal));
        if(modalOverlay) {
            modalOverlay.addEventListener('click', closeModal);
        }
        if(modalContent) {
            modalContent.addEventListener('click', (e) => e.stopPropagation()); // Prevent closing when clicking inside content
        }

        // Step 1 Next Button
        if (step1NextBtn) {
            step1NextBtn.addEventListener('click', () => {
                if (selectedEmail && selectedEmailDisplay) {
                    // Display selected email in Step 2 (with bold numbers)
                    selectedEmailDisplay.innerHTML = selectedEmail.replace(/(\d+)/, '<b>$1</b>');
                    goToStep('2');
                }
            });
        }

        // Step 2 Confirmation Buttons
        if (confirmYesBtn) {
            confirmYesBtn.addEventListener('click', () => {
                goToStep('3'); // Go to device selection
            });
        }
        if (confirmNoBtn) {
            confirmNoBtn.addEventListener('click', () => {
                goToStep('1'); // Go back to email selection
            });
        }

        // Step 3 Device Selection Buttons
        if (selectTVBtn) {
            selectTVBtn.addEventListener('click', () => {
                if (tvInstructionEmail && selectedEmail) {
                     tvInstructionEmail.textContent = selectedEmail; // Show selected email (plain text)
                }
                goToStep('4-tv');
            });
        }
        if (selectPhoneBtn) {
            selectPhoneBtn.addEventListener('click', () => {
                if (phoneInstructionEmail && selectedEmail) {
                     phoneInstructionEmail.textContent = selectedEmail; // Show selected email (plain text)
                }
                goToStep('4-phone');
            });
        }

        // Back Buttons (Handles all buttons with the class)
        backButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetStepId = button.getAttribute('data-target-step'); // Get the target step ID (e.g., '2', '3')
                if (targetStepId) {
                    goToStep(targetStepId);
                }
            });
        });

        // --- Initial Setup ---
        populateEmails(); // Create email radio buttons on load

    } else {
         // Optional: Log if the trigger button or modal itself isn't found on the page
         // if (!signedOutHelpBtn) console.log("Netflix Signed Out 'GET HELP' button (#netflix-signed-out-help-btn) not found.");
         // if (!modal) console.log("Netflix Signed Out Modal container (#signed-out-modal) not found.");
    }
    // --- End Netflix Signed Out Modal Logic --- //


}); // End of the SINGLE, main DOMContentLoaded listener


// --- Preloader ---
// Runs when the entire page (including images, stylesheets etc.) is fully loaded.
// ** MODIFIED CODE STARTS HERE **
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        try {
            console.log("Window loaded. Attempting to hide preloader."); // Log message
            // Apply the hidden class after a short delay to allow rendering
            setTimeout(() => {
                preloader.classList.add('hidden');
                console.log("Applied 'hidden' class to preloader."); // Log success
                // We keep the transition defined in base.css to handle the fade-out.
                // The transitionend listener is removed as it's not essential for hiding.
            }, 150); // 150ms delay
        } catch (error) {
            console.error("Error hiding preloader:", error); // Log any errors during this process
            // Fallback: Force hide if there was an error applying the class smoothly
            preloader.style.display = 'none';
        }
    } else {
        console.warn("Preloader element not found."); // Log if preloader div is missing
    }
});
// ** MODIFIED CODE ENDS HERE **
// --- End Preloader ---
