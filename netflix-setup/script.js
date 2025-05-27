document.addEventListener('DOMContentLoaded', () => {
    // --- START: NETFLIX CREDENTIALS & WHATSAPP NUMBER ---
    const NETFLIX_EMAIL = "carteluganda10@gmail.com";
    const NETFLIX_PASSWORD = "thecartelug";
    const WHATSAPP_NUMBER = "256762193386";
    // --- END: CREDENTIALS ---

    const setupContainer = document.querySelector('.interactive-setup-container');
    const steps = Array.from(document.querySelectorAll('.interactive-step'));
    const progressBar = document.querySelector('.progress-bar');
    const currentStepNumberDisplay = document.getElementById('current-step-number');
    const totalStepNumberDisplay = document.getElementById('total-step-number');
    
    let currentPath = null; // 'mobile' or 'tv'
    let currentGlobalStepIndex = 0;
    let pathSteps = [];

    function updateProgress() {
        const activeStepEl = steps.find(step => step.classList.contains('active'));
        if (!activeStepEl) return;

        currentGlobalStepIndex = steps.indexOf(activeStepEl);
        
        let visibleStepIndexInPath = 0;
        let totalVisibleStepsInPath = 0;

        if (currentPath) {
            const pathFilteredSteps = steps.filter(step => {
                const stepId = step.dataset.stepId;
                if (stepId === 'initialDeviceChoice') return true; // Always part of paths implicitly
                if (currentPath === 'mobile') return stepId.startsWith('mobilePcPath');
                if (currentPath === 'tv') {
                    if (stepId.startsWith('tvPath_typeChoice')) return true;
                    // Further filter TV path based on Smart/Normal if a sub-selection is made
                    const tvSubType = setupContainer.dataset.tvSubType; // e.g., 'smart' or 'normal'
                    if (tvSubType === 'smart') return stepId.startsWith('smartTvPath');
                    if (tvSubType === 'normal') return stepId.startsWith('normalTvPath');
                    return stepId.startsWith('tvPath_'); // Before sub-selection
                }
                return false;
            });

            pathSteps = [steps[0], ...pathFilteredSteps.filter(s => s.dataset.stepId !== 'initialDeviceChoice')]; // Ensure unique steps
            pathSteps = [...new Set(pathSteps)]; // Remove duplicates if any from filtering logic

            visibleStepIndexInPath = pathSteps.indexOf(activeStepEl);
            totalVisibleStepsInPath = pathSteps.length;
        } else { // Initial device choice step
            pathSteps = [steps[0]];
            visibleStepIndexInPath = 0;
            totalVisibleStepsInPath = 1; // Only this step is considered initially
        }
        
        const progressPercentage = totalVisibleStepsInPath > 1 ? ((visibleStepIndexInPath) / (totalVisibleStepsInPath -1)) * 100 : 0;
        if (progressBar) progressBar.style.width = `${progressPercentage}%`;
        if (currentStepNumberDisplay) currentStepNumberDisplay.textContent = visibleStepIndexInPath + 1;
        if (totalStepNumberDisplay) totalStepNumberDisplay.textContent = totalVisibleStepsInPath;

         // Special handling for total steps if on initial choice page
        if (activeStepEl.dataset.stepId === 'initialDeviceChoice' && totalStepNumberDisplay) {
             totalStepNumberDisplay.textContent = pathSteps.length > 1 ? pathSteps.length : 'X'; // Show X or current if no path selected
        }
    }


    function showStep(stepId) {
        let foundStep = false;
        steps.forEach(step => {
            if (step.dataset.stepId === stepId) {
                step.classList.add('active');
                foundStep = true;
            } else {
                step.classList.remove('active');
            }
        });
        if (foundStep) {
            updateProgress();
            // Scroll to the top of the setup container
            if (setupContainer) {
                setupContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            console.warn(`Step with ID ${stepId} not found.`);
        }
    }

    function initializeStaticCredentials() {
        // Mobile/PC Path
        const mpEmailEl = document.getElementById('mp_netflix_email_static');
        const mpPasswordInputEl = document.getElementById('mp_netflix_password_static_input');
        if (mpEmailEl) mpEmailEl.textContent = NETFLIX_EMAIL;
        if (mpPasswordInputEl) mpPasswordInputEl.value = NETFLIX_PASSWORD;

        // Normal TV Path
        const ntEmailEl = document.getElementById('nt_netflix_email_static');
        const ntPasswordEl = document.getElementById('nt_netflix_password_static');
        if (ntEmailEl) ntEmailEl.textContent = NETFLIX_EMAIL;
        if (ntPasswordEl) ntPasswordEl.textContent = NETFLIX_PASSWORD;
        
        // Setup WhatsApp links
        const pinRequestMessage = `Hi Cartelug Team, I need my PIN for Netflix. My setup email is ${NETFLIX_EMAIL}.`;
        const smartTVCodeMessage = `Hi Cartelug Team, I'm signing into Netflix on my Smart TV and have a code on screen.`;

        const mpWhatsappLink = document.getElementById('mp_whatsappLink');
        const ntWhatsappLink = document.getElementById('nt_whatsappLink');
        const stWhatsappLink = document.getElementById('st_whatsappLink');

        if (mpWhatsappLink) mpWhatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(pinRequestMessage)}`;
        if (ntWhatsappLink) ntWhatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(pinRequestMessage)}`;
        if (stWhatsappLink) stWhatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(smartTVCodeMessage)}`;
    }

    setupContainer.addEventListener('click', (e) => {
        const targetButton = e.target.closest('button');
        if (!targetButton) return;

        if (targetButton.classList.contains('option-button') || targetButton.classList.contains('nav-button')) {
            const nextStepId = targetButton.dataset.nextStep;
            const prevStepId = targetButton.dataset.prevStep;
            const path = targetButton.dataset.path;
            
            if (path) { // If it's an initial path selection button
                currentPath = path;
                // Reset tvSubType if a main path is chosen
                if (path === 'mobile' || path === 'tv') {
                    delete setupContainer.dataset.tvSubType;
                }
            }
            
            // Store TV sub-type if such a button is clicked
            if (nextStepId && (nextStepId.startsWith('smartTvPath') || nextStepId.startsWith('normalTvPath'))) {
                setupContainer.dataset.tvSubType = nextStepId.startsWith('smartTvPath') ? 'smart' : 'normal';
            }


            if (nextStepId) {
                showStep(nextStepId);
            } else if (prevStepId) {
                 // If going back to initial choice, reset path and TV subtype
                if (prevStepId === 'initialDeviceChoice') {
                    currentPath = null;
                    delete setupContainer.dataset.tvSubType;
                }
                // If going back from a specific TV type path to the TV type choice
                else if ((currentPath === 'tv' && setupContainer.dataset.tvSubType) && prevStepId === 'tvPath_typeChoice') {
                     delete setupContainer.dataset.tvSubType; // Reset subtype when going back to TV type choice
                }
                showStep(prevStepId);
            }
        }
    });

    // Toggle Password Visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', () => {
            const passwordInput = button.previousElementSibling; // Assumes input is just before button
            if (passwordInput && (passwordInput.type === 'password' || passwordInput.type === 'text')) {
                const isPassword = passwordInput.type === 'password';
                passwordInput.type = isPassword ? 'text' : 'password';
                button.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
            }
        });
    });
    
    // ClipboardJS Initialization
    if (typeof ClipboardJS !== 'undefined') {
        const clipboardButtons = new ClipboardJS('.copy-button-interactive');
        clipboardButtons.on('success', function(e) {
            const originalText = e.trigger.innerHTML;
            e.trigger.innerHTML = '<i class="fas fa-check"></i> Copied!';
            e.trigger.disabled = true;
            setTimeout(() => {
                e.trigger.innerHTML = originalText;
                e.trigger.disabled = false;
            }, 1500);
            e.clearSelection();
        });

        clipboardButtons.on('error', function(e) {
            alert('Failed to copy. Please copy manually.');
        });
        
        // Special handler for copying from input (for password)
        document.querySelectorAll('.copy-button-interactive[data-clipboard-text-from-input]').forEach(btn => {
            btn.addEventListener('click', () => {
                const inputSelector = btn.dataset.clipboardTextFromInput;
                const inputElement = document.querySelector(inputSelector);
                if (inputElement) {
                    // Temporarily change to text to copy
                    const originalType = inputElement.type;
                    if (originalType === 'password') inputElement.type = 'text';
                    
                    inputElement.select();
                    inputElement.setSelectionRange(0, 99999); // For mobile devices
                    
                    try {
                        document.execCommand('copy');
                        const originalHTML = btn.innerHTML;
                        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                        btn.disabled = true;
                        setTimeout(() => {
                            btn.innerHTML = originalHTML;
                            btn.disabled = false;
                        }, 1500);
                    } catch (err) {
                        alert('Failed to copy password. Please copy manually.');
                    }
                    
                    if (originalType === 'password') inputElement.type = 'password'; // Revert type
                    window.getSelection().removeAllRanges(); // Deselect
                }
            });
        });

    } else {
        console.warn('ClipboardJS not loaded. Copy buttons will not work as expected.');
    }

    // Initial setup
    initializeStaticCredentials();
    showStep('initialDeviceChoice'); // Show the first step
});
