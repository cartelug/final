document.addEventListener('DOMContentLoaded', () => {
    // --- START: NETFLIX CREDENTIALS - UPDATE THESE VALUES AS NEEDED ---
    const NETFLIX_EMAIL = "carteluganda10@gmail.com"; // Replace with the current email
    const NETFLIX_PASSWORD = "thecartelug";         // Replace with the current password
    // --- END: NETFLIX CREDENTIALS ---

    const WHATSAPP_NUMBER = "256762193386"; // Your WhatsApp number

    // Get step containers
    const steps = document.querySelectorAll('.setup-step');
    const deviceChoiceStep = document.getElementById('deviceChoiceStep');
    const mobilePCInstructionsStep = document.getElementById('mobilePCInstructionsStep');
    const tvTypeChoiceStep = document.getElementById('tvTypeChoiceStep');
    const normalTVInstructionsStep = document.getElementById('normalTVInstructionsStep');
    const smartTVInstructionsStep = document.getElementById('smartTVInstructionsStep');

    // Get buttons
    const btnMobilePC = document.getElementById('btnMobilePC');
    const btnTV = document.getElementById('btnTV');
    const btnSmartTV = document.getElementById('btnSmartTV');
    const btnNormalTV = document.getElementById('btnNormalTV');
    const backButtons = document.querySelectorAll('.back-button');

    // Get display elements for credentials
    const emailDisplayMobile = document.getElementById('netflixEmailDisplayMobile');
    const passwordDisplayMobile = document.getElementById('netflixPasswordDisplayMobile');
    const emailDisplayNormalTV = document.getElementById('netflixEmailDisplayNormalTV');
    const passwordDisplayNormalTV = document.getElementById('netflixPasswordDisplayNormalTV');

    // Get WhatsApp link elements
    const whatsappLinkMobile = document.getElementById('whatsappLinkMobile');
    const whatsappLinkNormalTV = document.getElementById('whatsappLinkNormalTV');
    const whatsappLinkSmartTV = document.getElementById('whatsappLinkSmartTV');

    // Function to show a specific step and hide others
    function showStep(stepIdToShow) {
        steps.forEach(step => {
            if (step.id === stepIdToShow) {
                step.classList.add('active-step');
            } else {
                step.classList.remove('active-step');
            }
        });
        // Scroll to the top of the container smoothly
        const setupContainer = document.querySelector('.setup-container');
        if (setupContainer) {
            setupContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Function to set credentials and WhatsApp links
    function initializeCredentialsAndLinks() {
        // Display credentials
        if (emailDisplayMobile) emailDisplayMobile.textContent = NETFLIX_EMAIL.replace('@', ' @');
        if (passwordDisplayMobile) passwordDisplayMobile.textContent = NETFLIX_PASSWORD;
        if (emailDisplayNormalTV) emailDisplayNormalTV.textContent = NETFLIX_EMAIL.replace('@', ' @');
        if (passwordDisplayNormalTV) passwordDisplayNormalTV.textContent = NETFLIX_PASSWORD;

        // Set WhatsApp links
        const pinRequestMessage = `Hi Accessug Team, I'm at the 'Who’s Watching?' screen for Netflix with email ${NETFLIX_EMAIL}. Please send my PIN.`;
        const smartTVCodeMessage = `Hi Accessug Team, I'm signing into Netflix on my Smart TV and have a code on the screen. I'm sending a picture of it now.`;

        if (whatsappLinkMobile) whatsappLinkMobile.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(pinRequestMessage)}`;
        if (whatsappLinkNormalTV) whatsappLinkNormalTV.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(pinRequestMessage)}`;
        if (whatsappLinkSmartTV) whatsappLinkSmartTV.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(smartTVCodeMessage)}`;
    }

    // Event Listeners for main choice buttons
    if (btnMobilePC) {
        btnMobilePC.addEventListener('click', () => {
            showStep('mobilePCInstructionsStep');
        });
    }

    if (btnTV) {
        btnTV.addEventListener('click', () => {
            showStep('tvTypeChoiceStep');
        });
    }

    // Event Listeners for TV type choice buttons
    if (btnSmartTV) {
        btnSmartTV.addEventListener('click', () => {
            showStep('smartTVInstructionsStep');
        });
    }

    if (btnNormalTV) {
        btnNormalTV.addEventListener('click', () => {
            showStep('normalTVInstructionsStep');
        });
    }

    // Event Listeners for back buttons
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetStepId = button.getAttribute('data-target');
            if (targetStepId) {
                showStep(targetStepId);
            }
        });
    });

    // ClipboardJS Initialization
    if (typeof ClipboardJS !== 'undefined') {
        const clipboard = new ClipboardJS('.copy-button');
        clipboard.on('success', function(e) {
            const originalText = e.trigger.innerHTML;
            e.trigger.innerHTML = `<i class="fas fa-check"></i> Copied!`;
            e.trigger.disabled = true;
            setTimeout(() => {
                e.trigger.innerHTML = originalText;
                e.trigger.disabled = false;
            }, 1500);
            e.clearSelection();
        });
        clipboard.on('error', function(e) {
            alert('Failed to copy. Please copy manually.');
        });
    } else {
        console.warn('ClipboardJS not loaded. Copy buttons will not work.');
        document.querySelectorAll('.copy-button').forEach(btn => btn.style.display = 'none');
    }


    // Initial setup
    initializeCredentialsAndLinks();
    if(deviceChoiceStep) showStep('deviceChoiceStep'); // Show the first step initially

});
