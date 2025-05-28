document.addEventListener('DOMContentLoaded', () => {
    const emailOptionButtons = document.querySelectorAll('.email-option-button');
    const instructionDetailsContainer = document.getElementById('instructionDetails');
    const emailOptionSelectionContainer = document.getElementById('emailOptionSelection');
    const instructionTitle = document.getElementById('instructionTitle');
    const gmailAppInstructionsList = document.getElementById('gmailAppInstructions');
    // const gmailWebInstructionsList = document.getElementById('gmailWebInstructions'); // Removed
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
        // gmailWeb instructions removed
    };

    function populateInstructions(emailAddress) {
        if (!gmailAppInstructionsList) return; 

        gmailAppInstructionsList.innerHTML = '';
        // gmailWebInstructionsList.innerHTML = ''; // Removed

        instructionsData.gmailApp.forEach(step => {
            const li = document.createElement('li');
            li.innerHTML = step.replace(/{EMAIL}/g, emailAddress);
            gmailAppInstructionsList.appendChild(li);
        });
    }

    if (emailOptionButtons.length > 0 && instructionDetailsContainer && emailOptionSelectionContainer && instructionTitle) {
        emailOptionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Add a class to the clicked button for 'active' state
                emailOptionButtons.forEach(btn => btn.classList.remove('active-option'));
                button.classList.add('active-option');

                const selectedEmail = button.dataset.email;
                const selectedOption = button.dataset.option;

                instructionTitle.textContent = `Setup for: ${selectedEmail}`;
                populateInstructions(selectedEmail);

                emailOptionSelectionContainer.classList.add('fade-out- rýchlo'); // Custom class for quick fade
                instructionDetailsContainer.classList.remove('fade-out-rýchlo'); // Ensure it's not fading out
                
                setTimeout(() => {
                    emailOptionSelectionContainer.style.display = 'none';
                    instructionDetailsContainer.style.display = 'block';
                    instructionDetailsContainer.classList.add('fade-in-slide-up'); // Custom class for entry
                    instructionDetailsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 250); // Match CSS transition time for fade-out
            });
        });
    }

    if (backToOptionsButton && instructionDetailsContainer && emailOptionSelectionContainer) {
        backToOptionsButton.addEventListener('click', () => {
            instructionDetailsContainer.classList.remove('fade-in-slide-up');
            instructionDetailsContainer.classList.add('fade-out-rýchlo');
            
            setTimeout(() => {
                instructionDetailsContainer.style.display = 'none';
                emailOptionSelectionContainer.style.display = 'grid'; // Assuming it was grid
                emailOptionSelectionContainer.classList.remove('fade-out-rýchlo');
                emailOptionSelectionContainer.classList.add('fade-in-slide-up');
                emailOptionButtons.forEach(btn => btn.classList.remove('active-option')); // Reset active button
                emailOptionSelectionContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 250);
        });
    }

    // Add fade-in classes to CSS for smoother transitions
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        .fade-in-slide-up { animation: fadeInSlideUp 0.5s ease-out forwards; }
        .fade-out-rýchlo { animation: fadeOutRýchlo 0.25s ease-out forwards !important; }
        @keyframes fadeInSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeOutRýchlo { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-10px); } }
        .email-option-button.active-option { transform: translateY(-5px) scale(1.05); box-shadow: 0 12px 25px rgba(var(--theme-primary), 0.4); }
    `;
    document.head.appendChild(styleSheet);
});
