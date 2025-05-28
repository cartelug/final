document.addEventListener('DOMContentLoaded', () => {
    const emailOptionButtons = document.querySelectorAll('.email-option-button');
    const instructionDetailsContainer = document.getElementById('instructionDetails');
    const emailOptionSelectionContainer = document.getElementById('emailOptionSelection');
    const instructionTitle = document.getElementById('instructionTitle');
    const gmailAppInstructionsList = document.getElementById('gmailAppInstructions');
    const backToOptionsButton = document.getElementById('backToOptionsButton');
    const whatsappHelpLink = document.getElementById('whatsappHelpLink');

    const YOUR_WHATSAPP_NUMBER = "256762193386"; // Your WhatsApp number here
    if (whatsappHelpLink) {
        whatsappHelpLink.href = `https://wa.me/${YOUR_WHATSAPP_NUMBER}?text=I%20need%20help%20with%20the%20Netflix%20email%20viewer%20setup.`;
    }

    const instructionsData = {
        gmailApp: [
            "Open your Gmail App. <a href='googlegmail:///' class='app-link' target='_blank' rel='noopener noreferrer'>(Tap here to try opening Gmail App)</a> If it doesn't open, please find and open it manually on your phone.",
            "In Gmail, tap your <strong>Profile Picture</strong> (usually top right).",
            "Tap '<strong>Add another account</strong>'.",
            "Select '<strong>Google</strong>' from the list.",
            "Enter Email: <strong class='highlight-email'>{EMAIL}</strong> then tap <strong>Next</strong>.",
            "Enter the <strong>Password</strong> (provided by Cartelug Support) then tap <strong>Next</strong>.",
            "Follow any on-screen prompts to complete adding the account.",
            "Once successfully added, open the <strong>{EMAIL}</strong> inbox by selecting it from your list of accounts in Gmail.",
            "Look for the latest email from Netflix with a subject like '<strong>Your temporary access code</strong>'.",
            "Open that email and click the '<strong>Get Code</strong>' button found inside it. This will show you the Netflix code."
        ]
    };

    function populateInstructions(emailAddress) {
        if (!gmailAppInstructionsList) {
            console.error("gmailAppInstructionsList element not found!");
            return;
        }
        gmailAppInstructionsList.innerHTML = '';
        instructionsData.gmailApp.forEach(step => {
            const li = document.createElement('li');
            li.innerHTML = step.replace(/{EMAIL}/g, emailAddress);
            gmailAppInstructionsList.appendChild(li);
        });
    }

    // Check if all critical elements are found
    if (!emailOptionSelectionContainer) console.error("Element with ID 'emailOptionSelection' not found.");
    if (!instructionDetailsContainer) console.error("Element with ID 'instructionDetails' not found.");
    if (!instructionTitle) console.error("Element with ID 'instructionTitle' not found.");
    if (emailOptionButtons.length === 0) console.error("No elements with class 'email-option-button' found.");


    emailOptionButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!instructionDetailsContainer || !emailOptionSelectionContainer || !instructionTitle) {
                console.error("One or more essential containers for switching views are missing.");
                return;
            }

            emailOptionButtons.forEach(btn => btn.classList.remove('active-option'));
            button.classList.add('active-option');

            const selectedEmail = button.dataset.email;
            const selectedOption = button.dataset.option;

            instructionTitle.textContent = `Setup for: ${selectedEmail}`;
            populateInstructions(selectedEmail);

            emailOptionSelectionContainer.style.display = 'none';
            instructionDetailsContainer.style.display = 'block';
            
            // Scroll into view smoothly
            instructionDetailsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    if (backToOptionsButton) {
        backToOptionsButton.addEventListener('click', () => {
            if (!instructionDetailsContainer || !emailOptionSelectionContainer) {
                console.error("One or more essential containers for switching views are missing for 'back' button.");
                return;
            }
            instructionDetailsContainer.style.display = 'none';
            emailOptionSelectionContainer.style.display = 'grid'; // Assuming it was grid
            emailOptionButtons.forEach(btn => btn.classList.remove('active-option'));
            emailOptionSelectionContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    } else {
        console.error("Element with ID 'backToOptionsButton' not found.");
    }

    // The animation styles previously injected via JS should be in your style.css
    // If you want the fade/slide animations, ensure these classes and @keyframes are in your style.css:
    // .fade-in-slide-up { animation: fadeInSlideUp 0.5s ease-out forwards; }
    // .fade-out-rýchlo { animation: fadeOutRýchlo 0.25s ease-out forwards !important; }
    // @keyframes fadeInSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    // @keyframes fadeOutRýchlo { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-10px); } }
    // .email-option-button.active-option { transform: translateY(-5px) scale(1.05); /* ... existing shadow */ }
});
