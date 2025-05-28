document.addEventListener('DOMContentLoaded', () => {
    const emailOptionButtons = document.querySelectorAll('.email-option-button');
    const instructionDetailsContainer = document.getElementById('instructionDetails');
    const emailOptionSelectionContainer = document.getElementById('emailOptionSelection');
    const instructionTitle = document.getElementById('instructionTitle');
    const gmailAppInstructionsList = document.getElementById('gmailAppInstructions');
    const gmailWebInstructionsList = document.getElementById('gmailWebInstructions');
    const backToOptionsButton = document.getElementById('backToOptionsButton');
    const whatsappHelpButton = document.querySelector('.whatsapp-help-button'); // Assuming only one

    // Replace with your actual WhatsApp number
    const YOUR_WHATSAPP_NUMBER = "256762193386"; 
    if (whatsappHelpButton) {
        whatsappHelpButton.href = `https://wa.me/${YOUR_WHATSAPP_NUMBER}?text=I%20need%20help%20with%20the%20Netflix%20email%20viewer%20setup.`;
    }


    const instructionsData = {
        gmailApp: [
            "Open your Gmail App.",
            "Tap on your profile picture (usually top right).",
            "Tap '<strong>Add another account</strong>'.",
            "Choose '<strong>Google</strong>'.",
            "Enter the email address: <strong>{EMAIL}</strong> and tap Next.",
            "Enter the password provided by Cartelug Support and tap Next.",
            "Follow any on-screen prompts to complete adding the account.",
            "Once added, switch to the <strong>{EMAIL}</strong> inbox within your Gmail app.",
            "Look for recent emails from Netflix with a subject like '<strong>Your temporary access code</strong>'.",
            "Open the latest relevant email and click the '<strong>Get Code</strong>' button inside it to see your Netflix code."
        ],
        gmailWeb: [
            "Open your web browser (like Chrome, Safari, Firefox).",
            `Go to <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">https://mail.google.com</a> (opens in a new tab).`,
            "If you're already signed into a Gmail account, click your profile picture (usually top right).",
            "Click '<strong>Add another account</strong>'. (If not signed in, just proceed to enter email).",
            "Enter the email address: <strong>{EMAIL}</strong> and click Next.",
            "Enter the password provided by Cartelug Support and click Next.",
            "Follow any on-screen prompts to sign in.",
            "Once signed in, you'll be in the <strong>{EMAIL}</strong> inbox.",
            "Look for recent emails from Netflix with a subject like '<strong>Your temporary access code</strong>'.",
            "Open the latest relevant email and click the '<strong>Get Code</strong>' button inside it to see your Netflix code."
        ]
    };

    function populateInstructions(emailAddress) {
        gmailAppInstructionsList.innerHTML = '';
        gmailWebInstructionsList.innerHTML = '';

        instructionsData.gmailApp.forEach(step => {
            const li = document.createElement('li');
            li.innerHTML = step.replace(/{EMAIL}/g, emailAddress);
            gmailAppInstructionsList.appendChild(li);
        });

        instructionsData.gmailWeb.forEach(step => {
            const li = document.createElement('li');
            li.innerHTML = step.replace(/{EMAIL}/g, emailAddress);
            gmailWebInstructionsList.appendChild(li);
        });
    }

    emailOptionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedEmail = button.dataset.email;
            const selectedOption = button.dataset.option;

            instructionTitle.textContent = `Instructions for Source ${selectedOption} (${selectedEmail})`;
            populateInstructions(selectedEmail);

            emailOptionSelectionContainer.style.display = 'none';
            instructionDetailsContainer.style.display = 'block';
            instructionDetailsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    if (backToOptionsButton) {
        backToOptionsButton.addEventListener('click', () => {
            instructionDetailsContainer.style.display = 'none';
            emailOptionSelectionContainer.style.display = 'block';
            emailOptionSelectionContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Preloader (if you have one in base.css and global script.js)
    // The global script.js should handle the preloader if it's the same ID.
    // If you need specific preloader logic for this page, add it here.
});
