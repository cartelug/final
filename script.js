// Wrap ALL DOM-dependent code in a SINGLE DOMContentLoaded listener
// This ensures the HTML is fully loaded before the script tries to find elements
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed"); // Debug log: Check if DOMContentLoaded fires

    // --- Mobile Menu Toggle ---
    try { // Add try...catch for debugging individual sections
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
            const navLinks = mainNav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';
                    const isAnchorLink = link.getAttribute('href').startsWith('#');
                    if (!isAnchorLink || !isHomePage) {
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
            console.log("Mobile Menu initialized."); // Debug log
        } else {
             console.warn("Mobile menu button or nav not found.");
        }
    } catch (error) {
        console.error("Error in Mobile Menu Logic:", error);
    } // End Mobile Menu Logic

    // --- Generic Modal Open/Close Functionality (Used on index.html) ---
    try {
        const setupModal = (buttonId, modalId) => {
            const startButton = document.getElementById(buttonId);
            const modal = document.getElementById(modalId);
            if (startButton && modal) {
                const modalCloseButton = modal.querySelector('.modal-close');
                const modalOverlay = modal.querySelector('.modal-overlay');
                const modalContent = modal.querySelector('.modal-content');
                const openModal = () => modal.classList.add('active');
                const closeModal = () => modal.classList.remove('active');
                startButton.addEventListener('click', (event) => { event.preventDefault(); openModal(); });
                if (modalCloseButton) modalCloseButton.addEventListener('click', closeModal);
                if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
                if (modalContent) modalContent.addEventListener('click', (event) => event.stopPropagation());
                 console.log(`Modal setup complete for: ${modalId}`); // Debug log
            } else {
                 // Don't log error if elements aren't expected on every page
                 // console.warn(`Modal trigger (${buttonId}) or modal (${modalId}) not found.`);
            }
        };
        setupModal('netflix-start-btn', 'netflix-modal');
        setupModal('prime-start-btn', 'prime-modal');
        setupModal('spotify-start-btn', 'spotify-modal');
    } catch (error) {
        console.error("Error in Generic Modal Logic:", error);
    } // End Modal Logic

    // --- Generic Order Form WhatsApp Redirect Function ---
    try {
        const setupOrderFormRedirect = (formId, serviceName) => {
            const orderForm = document.getElementById(formId);
            if (orderForm) {
                orderForm.addEventListener('submit', function(event) {
                    event.preventDefault();
                    const selectedPackageRadio = orderForm.querySelector('input[name="package"]:checked');
                    const clientNameInput = orderForm.querySelector('#clientName');
                    const selectedPaymentRadio = orderForm.querySelector('input[name="paymentMethod"]:checked');
                    const instaUsernameInput = orderForm.querySelector('#instaUsername');

                    // Validation checks... (keep existing validation)
                    if (!selectedPackageRadio) { alert("Please select a package."); return; }
                    if (instaUsernameInput && instaUsernameInput.required && instaUsernameInput.value.trim() === "") { alert("Please enter your Instagram Username."); return; }
                    if (!clientNameInput || clientNameInput.value.trim() === "") { alert("Please enter your name."); return; }
                    if (!selectedPaymentRadio) { alert("Please select a payment method."); return; }

                    const duration = selectedPackageRadio.value;
                    const price = selectedPackageRadio.getAttribute('data-price');
                    const clientName = clientNameInput ? clientNameInput.value.trim() : 'N/A';
                    const paymentMethod = selectedPaymentRadio.value;
                    const instagramUsername = instaUsernameInput ? instaUsernameInput.value.trim() : null;
                    const whatsappNumber = "256762193386";
                    let message = `Order for Cartelug:\n\n*Service:* ${serviceName}\n`;
                    if (instagramUsername) message += `*Instagram Username:* ${instagramUsername}\n`;
                    message += `*Package:* ${duration}\n`;
                    if (price) message += `*Price:* ${price}\n`;
                    message += `*Payment Method:* ${paymentMethod}\n*Name:* ${clientName}`;
                    const encodedMessage = encodeURIComponent(message);
                    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                    window.location.href = whatsappURL;
                });
                 console.log(`Order form redirect setup for: ${formId}`); // Debug log
            }
        };
        setupOrderFormRedirect('netflix-order-form', 'Netflix');
        setupOrderFormRedirect('prime-order-form', 'Prime Video');
        setupOrderFormRedirect('spotify-order-form', 'Spotify');
        setupOrderFormRedirect('instagram-boost-form', 'Instagram Likes Boost');
    } catch (error) {
        console.error("Error in Order Form Redirect Logic:", error);
    } // End Order Form Logic

    // --- Testimonial Swiper Initialization (Used on index.html) ---
    try {
        if (typeof Swiper !== 'undefined' && document.querySelector('.testimonial-swiper')) {
            const testimonialSwiper = new Swiper('.testimonial-swiper', {
                direction: 'horizontal', loop: true, slidesPerView: 1, spaceBetween: 30, grabCursor: true, autoHeight: true,
                pagination: { el: '.swiper-pagination', clickable: true },
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
                a11y: { enabled: true, prevSlideMessage: 'Previous testimonial', nextSlideMessage: 'Next testimonial', paginationBulletMessage: 'Go to testimonial slide {{index}}' },
                autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
            });
            console.log("Swiper initialized."); // Debug log
        } else if (document.querySelector('.testimonial-swiper')) {
             console.warn("Swiper container found, but Swiper library might not be loaded.");
        }
    } catch (error) {
        console.error("Swiper initialization failed:", error);
        const swiperContainer = document.querySelector('.testimonial-swiper');
        if (swiperContainer) swiperContainer.innerHTML = '<p style="text-align: center; color: var(--text-medium);">Testimonials could not be loaded.</p>';
    } // End Swiper Logic

    // --- Contact Page Issue Card WhatsApp Redirect Logic ---
    try {
        const issueButtons = document.querySelectorAll('.issue-card[data-service][data-issue]');
        if (issueButtons.length > 0) {
            issueButtons.forEach(button => {
                 // Check if the button is the one triggering the modal
                 if (button.id !== 'netflix-signed-out-card') { // Exclude modal trigger
                    button.addEventListener('click', () => {
                        const service = button.getAttribute('data-service');
                        const issue = button.getAttribute('data-issue');
                        const whatsappNumber = "256762193386";
                        let message = `Help Request for Cartelug:\n\n*Service:* ${service}\n*Issue:* ${issue}\n\nPlease describe the problem in detail:`;
                        const encodedMessage = encodeURIComponent(message);
                        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                        window.open(whatsappURL, '_blank');
                    });
                 }
            });
            console.log("Contact issue card listeners added."); // Debug log
        }
    } catch (error) {
        console.error("Error in Contact Issue Card Logic:", error);
    } // End Contact Issue Card Logic

    // --- Netflix Payment Issue Card Logic (Used on contact.html) ---
    try {
        const paymentEscalateBtn = document.getElementById('payment-issue-escalate-btn');
        const paymentInitialDiv = document.getElementById('payment-fix-initial');
        const paymentApologyDiv = document.getElementById('payment-issue-apology');
        if (paymentEscalateBtn && paymentInitialDiv && paymentApologyDiv) {
            paymentEscalateBtn.addEventListener('click', () => {
                paymentInitialDiv.style.display = 'none';
                paymentApologyDiv.classList.remove('hidden');
                paymentApologyDiv.style.display = 'block';
            });
            console.log("Netflix payment issue card logic initialized."); // Debug log
        }
    } catch (error) {
        console.error("Error in Netflix Payment Issue Logic:", error);
    } // End Netflix Payment Issue Card Logic

    // --- Footer Year Update ---
    try {
        const yearSpan = document.getElementById('year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    } catch (error) {
        console.error("Error updating footer year:", error);
    } // End Footer Year Logic


    // --- V2/V3 Renewal Page Logic --- //
    try {
        const renewalSectionV2 = document.querySelector('.renewal-section-v2');
        if (renewalSectionV2) {
            console.log("Renewal V2/V3 Script Initializing...");
            const serviceButtonsV2 = renewalSectionV2.querySelectorAll('.service-card-v2');
            const durationBlockV2 = renewalSectionV2.querySelector('#duration-block-v2');
            const durationOptionsContainerV2 = renewalSectionV2.querySelector('#duration-options-container-v2');
            const dynamicServiceLabelV2 = durationBlockV2?.querySelector('.dynamic-service-label');
            const summaryCardV2 = renewalSectionV2.querySelector('#summary-card-v2');
            const summaryServiceV2 = summaryCardV2?.querySelector('#summary-service-v2');
            const summaryDurationV2 = summaryCardV2?.querySelector('#summary-duration-v2');
            const summaryPriceV2 = summaryCardV2?.querySelector('#summary-price-v2');
            const whatsappConfirmBtnV2 = summaryCardV2?.querySelector('#whatsapp-confirm-btn-v2');
            const resetBtnV2 = summaryCardV2?.querySelector('#reset-renewal-btn-v2');
            const copyBtnsV2 = renewalSectionV2.querySelectorAll('.copy-btn-v2');

            const renewalPricesV2 = { /* Keep your price data here */
                "Netflix": [{ duration: "2 Months", price: "50,000 UGX" }, { duration: "3 Months", price: "75,000 UGX" }, { duration: "6 Months", price: "150,000 UGX" }],
                "Prime Video": [{ duration: "2 Months", price: "50,000 UGX" }, { duration: "3 Months", price: "75,000 UGX" }],
                "Spotify": [{ duration: "6 Months", price: "70,000 UGX" }, { duration: "1 Year", price: "120,000 UGX" }]
            };
            let currentServiceV2 = null, currentDurationV2 = null, currentPriceV2 = null;

            const updateSummaryV2 = () => { /* Keep updateSummaryV2 function here */
                if (!summaryServiceV2 || !summaryDurationV2 || !summaryPriceV2 || !whatsappConfirmBtnV2) return;
                summaryServiceV2.textContent = currentServiceV2 ? currentServiceV2 : 'Please select';
                summaryDurationV2.textContent = currentDurationV2 ? currentDurationV2 : 'Please select';
                summaryPriceV2.textContent = currentPriceV2 ? currentPriceV2 : '--';
                const isComplete = !!(currentServiceV2 && currentDurationV2 && currentPriceV2);
                whatsappConfirmBtnV2.disabled = !isComplete;
            };

            const populateDurationOptionsV2 = (serviceName) => { /* Keep populateDurationOptionsV2 function here */
                 if (!durationOptionsContainerV2 || !renewalPricesV2[serviceName]) {
                     if(durationOptionsContainerV2) durationOptionsContainerV2.innerHTML = '<p class="loading-text-v2">Options not available.</p>';
                     if(durationBlockV2) durationBlockV2.style.display = 'none';
                     return;
                 }
                 durationOptionsContainerV2.innerHTML = '';
                 const prices = renewalPricesV2[serviceName];
                 if (prices && prices.length > 0) {
                     prices.forEach((item, index) => {
                         const optionDiv = document.createElement('div');
                         optionDiv.className = 'duration-option-v2';
                         const inputId = `duration-v2-${serviceName.replace(/\s+/g, '-')}-${index}`;
                         optionDiv.innerHTML = `<input type="radio" id="${inputId}" name="renewal_duration_v2" value="${item.duration}" data-price="${item.price}"><label for="${inputId}"><span class="duration-text">${item.duration}</span><span class="price-text">${item.price}</span></label>`;
                         durationOptionsContainerV2.appendChild(optionDiv);
                     });
                     const durationRadios = durationOptionsContainerV2.querySelectorAll('input[name="renewal_duration_v2"]');
                     durationRadios.forEach(radio => {
                         radio.addEventListener('change', () => { if (radio.checked) { currentDurationV2 = radio.value; currentPriceV2 = radio.getAttribute('data-price'); updateSummaryV2(); } });
                     });
                     if (dynamicServiceLabelV2) dynamicServiceLabelV2.textContent = `for ${serviceName}`;
                     if(durationBlockV2) durationBlockV2.style.display = 'block';
                 } else {
                     durationOptionsContainerV2.innerHTML = '<p class="loading-text-v2">No durations found.</p>';
                     if(durationBlockV2) durationBlockV2.style.display = 'none';
                 }
            };

            const resetSelectionsV2 = () => { /* Keep resetSelectionsV2 function here */
                currentServiceV2 = null; currentDurationV2 = null; currentPriceV2 = null;
                serviceButtonsV2.forEach(btn => btn.classList.remove('selected'));
                if (durationBlockV2) durationBlockV2.style.display = 'none';
                if (durationOptionsContainerV2) durationOptionsContainerV2.innerHTML = '';
                if (dynamicServiceLabelV2) dynamicServiceLabelV2.textContent = '';
                updateSummaryV2();
            };

            serviceButtonsV2.forEach(button => { /* Keep service button listeners here */
                button.addEventListener('click', () => {
                    const selectedService = button.getAttribute('data-service');
                    currentServiceV2 = selectedService; currentDurationV2 = null; currentPriceV2 = null;
                    serviceButtonsV2.forEach(btn => btn.classList.remove('selected'));
                    button.classList.add('selected');
                    populateDurationOptionsV2(currentServiceV2);
                    updateSummaryV2();
                    if (durationBlockV2 && durationBlockV2.style.display !== 'none') {
                        setTimeout(() => { durationBlockV2.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
                    }
                });
            });

            if (whatsappConfirmBtnV2) { /* Keep WhatsApp button listener here */
                whatsappConfirmBtnV2.addEventListener('click', () => {
                    if (currentServiceV2 && currentDurationV2 && currentPriceV2) {
                        const whatsappNumber = "256762193386";
                        const message = `Hi Cartelug, I've paid ${currentPriceV2} to renew my ${currentServiceV2} for ${currentDurationV2}. Please confirm my renewal.`;
                        const encodedMessage = encodeURIComponent(message);
                        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                        window.location.href = whatsappURL;
                    } else { alert("Please complete selection."); }
                });
            }

            if (resetBtnV2) resetBtnV2.addEventListener('click', resetSelectionsV2); /* Keep Reset button listener here */

            if (typeof ClipboardJS !== 'undefined' && copyBtnsV2.length > 0) { /* Keep ClipboardJS logic here */
                 const clipboard = new ClipboardJS('.copy-btn-v2');
                 clipboard.on('success', function(e) { const o = e.trigger.innerHTML; e.trigger.innerHTML = `<i class="fas fa-check"></i> Copied`; e.trigger.disabled = true; setTimeout(() => { e.trigger.innerHTML = o; e.trigger.disabled = false; }, 1500); e.clearSelection(); });
                 clipboard.on('error', function(e) { console.error('ClipboardJS error:', e.action); const n = e.trigger.closest('.number-copy-wrapper-v2')?.querySelector('strong')?.textContent; alert(`Failed to copy. Please copy manually${n ? ': ' + n : '.'}`); });
                 console.log("Renewal ClipboardJS initialized."); // Debug log
            } else if (copyBtnsV2.length > 0) { console.warn("ClipboardJS library not loaded. Hiding copy buttons."); copyBtnsV2.forEach(btn => btn.style.display = 'none'); }

            resetSelectionsV2(); // Initial setup
            console.log("Renewal V2/V3 Script Initialized Successfully."); // Debug log
        }
    } catch (error) {
        console.error("Error in V2/V3 Renewal Page Logic:", error);
    } // End V2/V3 Renewal Logic

    // --- Netflix Signed Out Modal Logic --- //
    try { // Wrap in try...catch
        const signedOutCard = document.getElementById('netflix-signed-out-card');
        const modal = document.getElementById('signed-out-modal');

        // Only proceed if the trigger card and modal exist
        if (signedOutCard && modal) {
            console.log("Initializing Netflix Signed Out Modal..."); // Debug log

            // Get all necessary elements, adding checks for existence
            const modalCloseBtns = modal.querySelectorAll('.modal-close, .modal-close-final');
            const modalOverlay = modal.querySelector('.modal-overlay');
            const modalContent = modal.querySelector('.signed-out-modal-content');
            const steps = modal.querySelectorAll('.modal-step');
            const step1 = modal.querySelector('#modal-step-1');
            const step2 = modal.querySelector('#modal-step-2');
            const step3 = modal.querySelector('#modal-step-3');
            const step4TV = modal.querySelector('#modal-step-4-tv');
            const step4Phone = modal.querySelector('#modal-step-4-phone');

            // Check if core step elements exist before querying within them
            const emailOptionsContainer = step1 ? step1.querySelector('.email-options-container') : null;
            const step1NextBtn = step1 ? step1.querySelector('#modal-step1-next') : null;
            const selectedEmailDisplay = step2 ? step2.querySelector('#modal-selected-email') : null;
            const confirmYesBtn = step2 ? step2.querySelector('#modal-confirm-yes') : null;
            const confirmNoBtn = step2 ? step2.querySelector('#modal-confirm-no') : null;
            const selectTVBtn = step3 ? step3.querySelector('#modal-select-tv') : null;
            const selectPhoneBtn = step3 ? step3.querySelector('#modal-select-phone') : null;
            const tvInstructionEmail = step4TV ? step4TV.querySelector('#tv-instruction-email') : null;
            const phoneInstructionEmail = step4Phone ? step4Phone.querySelector('#phone-instruction-email') : null;
            const backButtons = modal.querySelectorAll('.modal-back-button');

            // Check if all crucial elements were found
            if (!step1 || !step2 || !step3 || !step4TV || !step4Phone || !emailOptionsContainer || !step1NextBtn || !selectedEmailDisplay || !confirmYesBtn || !confirmNoBtn || !selectTVBtn || !selectPhoneBtn || !tvInstructionEmail || !phoneInstructionEmail) {
                console.error("Error: One or more elements required for the Netflix Signed Out modal are missing in the HTML.");
                // Optionally disable the trigger card if setup fails
                if(signedOutCard) signedOutCard.style.opacity = '0.5'; signedOutCard.style.pointerEvents = 'none';
                return; // Stop executing this modal logic if elements are missing
            }

            // State
            let selectedEmail = null;

            // List of emails
            const emailList = [ /* Keep your email list here */
                "carteluganda0@gmail.com", "carteluganda1@gmail.com", "carteluganda2@gmail.com", "carteluganda3@gmail.com", "carteluganda4@gmail.com", "carteluganda5@gmail.com", "carteluganda6@gmail.com", "carteluganda7@gmail.com", "carteluganda8@gmail.com", "carteluganda9@gmail.com", "carteluganda10@gmail.com", "carteluganda11@gmail.com", "carteluganda12@gmail.com", "carteluganda13@gmail.com", "carteluganda14@gmail.com", "carteluganda15@gmail.com", "carteluganda16@gmail.com"
            ];

            // --- Functions ---
            const openModal = () => { resetModal(); modal.classList.add('active'); console.log("Modal opened"); };
            const closeModal = () => { modal.classList.remove('active'); setTimeout(resetModal, 300); console.log("Modal closed"); };
            const goToStep = (stepNum) => {
                steps.forEach(step => step.style.display = 'none');
                const targetStep = modal.querySelector(`#modal-step-${stepNum}`);
                if (targetStep) targetStep.style.display = 'block';
                else console.error(`Modal step ${stepNum} not found!`);
                 console.log("Navigated to step:", stepNum); // Debug log
            };
            const resetModal = () => {
                selectedEmail = null;
                const radios = emailOptionsContainer.querySelectorAll('input[type="radio"]');
                radios.forEach(radio => radio.checked = false);
                if(step1NextBtn) step1NextBtn.disabled = true;
                goToStep(1);
                 console.log("Modal reset"); // Debug log
            };
            const populateEmails = () => { /* Keep populateEmails function here */
                 if (!emailOptionsContainer) return;
                 emailOptionsContainer.innerHTML = '';
                 emailList.forEach((email, index) => {
                     const optionDiv = document.createElement('div');
                     optionDiv.className = 'email-option';
                     const inputId = `email-option-${index}`;
                     const formattedEmail = email.replace(/(\d+)/, '<b>$1</b>');
                     optionDiv.innerHTML = `<input type="radio" id="${inputId}" name="netflix_email" value="${email}"><label for="${inputId}">${formattedEmail}</label>`;
                     emailOptionsContainer.appendChild(optionDiv);
                     const radioInput = optionDiv.querySelector('input[type="radio"]');
                     if (radioInput) {
                         radioInput.addEventListener('change', () => { if (radioInput.checked) { selectedEmail = radioInput.value; if(step1NextBtn) step1NextBtn.disabled = false; } });
                     }
                 });
                 console.log("Email options populated."); // Debug log
            };

            // --- Event Listeners ---
            signedOutCard.addEventListener('click', openModal);
            modalCloseBtns.forEach(btn => btn.addEventListener('click', closeModal));
            if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
            if (modalContent) modalContent.addEventListener('click', (e) => e.stopPropagation());

            if (step1NextBtn) step1NextBtn.addEventListener('click', () => { if (selectedEmail) { if(selectedEmailDisplay) selectedEmailDisplay.innerHTML = selectedEmail.replace(/(\d+)/, '<b>$1</b>'); goToStep(2); } });
            if (confirmYesBtn) confirmYesBtn.addEventListener('click', () => { goToStep(3); });
            if (confirmNoBtn) confirmNoBtn.addEventListener('click', () => { goToStep(1); });
            if (selectTVBtn) selectTVBtn.addEventListener('click', () => { if(tvInstructionEmail) tvInstructionEmail.textContent = selectedEmail; goToStep('4-tv'); });
            if (selectPhoneBtn) selectPhoneBtn.addEventListener('click', () => { if(phoneInstructionEmail) phoneInstructionEmail.textContent = selectedEmail; goToStep('4-phone'); });

            backButtons.forEach(button => {
                button.addEventListener('click', () => { const targetStepNum = button.getAttribute('data-target-step'); if (targetStepNum) goToStep(targetStepNum); });
            });

            // --- Initial Setup ---
            populateEmails(); // Populate emails when script loads
            console.log("Netflix Signed Out Modal Initialized Successfully."); // Debug log

        } else {
            // Only log if the trigger card exists but the modal doesn't, or vice-versa
            if (signedOutCard || modal) {
                console.warn("Netflix Signed Out Card or Modal element missing. Modal logic skipped.");
            }
        }
    } catch (error) {
        console.error("Error in Netflix Signed Out Modal Logic:", error);
    } // --- End Netflix Signed Out Modal Logic --- //

    console.log("DOMContentLoaded finished executing all scripts."); // Debug log

}); // End of the SINGLE, main DOMContentLoaded listener


// --- Preloader ---
// Runs when the entire page (including images, stylesheets etc.) is fully loaded.
// Stays outside DOMContentLoaded because 'load' fires later.
window.addEventListener('load', () => {
    console.log("Window load event fired."); // Debug log: Check if load event fires
    try { // Add try...catch around preloader logic
        const preloader = document.getElementById('preloader');
        if (preloader) {
            console.log("Preloader found. Hiding..."); // Debug log
            // Start fade out slightly after the load event fires
            setTimeout(() => {
                preloader.classList.add('hidden'); // Add class to trigger CSS fade-out transition
                console.log("Preloader 'hidden' class added."); // Debug log
            }, 150); // 150ms delay

            // Optional: Remove the preloader element from the DOM after the fade-out transition completes
            preloader.addEventListener('transitionend', function handleTransitionEnd(event) {
                 // Ensure the transition that ended was for opacity or visibility
                 if (event.propertyName === 'opacity' || event.propertyName === 'visibility') {
                    // Double-check the class is still present (in case of multiple transitions)
                    if (preloader.classList.contains('hidden')) {
                       console.log("Preloader transition ended. Removing element (optional)."); // Debug log
                       // preloader.remove(); // Uncomment this line if you want to remove the preloader element entirely
                       // Clean up the event listener to prevent memory leaks
                       preloader.removeEventListener('transitionend', handleTransitionEnd);
                    }
                 }
            });
        } else {
            console.warn("Preloader element not found."); // Debug log
        }
    } catch(error) {
        console.error("Error in preloader hiding logic:", error);
        // Fallback: Force hide preloader if error occurs in its logic
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.display = 'none';
            console.warn("Force hiding preloader due to error.");
        }
    }
});
// --- End Preloader ---
