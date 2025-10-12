document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const steps = document.querySelectorAll('.step');
    const planTabs = document.querySelectorAll('.plan-tab');
    const planDetailsContainer = document.querySelector('.plan-details');
    const nextToDeviceBtn = document.getElementById('next-to-device');
    const deviceBtns = document.querySelectorAll('.device-btn');
    const tvTypeBtns = document.querySelectorAll('.tv-type-btn');
    const backBtns = document.querySelectorAll('.back-btn');
    const loginGuideContainer = document.querySelector('.login-guide');
    const loginTitle = document.getElementById('login-title');
    const countryPopup = document.getElementById('country-popup-overlay');
    const countryBtns = document.querySelectorAll('.country-btn');

    // --- STATE MANAGEMENT ---
    let selectedDevice = '';
    let selectedCountry = null; // Persisted for the session

    // --- DATA ---
    const plans = {
        basic: {
            duration: "2 Months Access",
            pricing: {
                uganda: { original: 100000, discounted: 50000, currency: "UGX" },
                sudan: { original: 180000, discounted: 90000, currency: "SSP" }
            },
            features: [ { icon: "fa-desktop", text: "2 Devices" }, { icon: "fa-video", text: "4K UHD" }, { icon: "fa-headset", text: "24/7 Support" } ]
        },
        standard: {
            duration: "3 Months Access",
            pricing: {
                uganda: { original: 140000, discounted: 70000, currency: "UGX" },
                sudan: { original: 252000, discounted: 126000, currency: "SSP" }
            },
            features: [ { icon: "fa-desktop", text: "2 Devices" }, { icon: "fa-video", text: "4K UHD" }, { icon: "fa-headset", text: "24/7 Support" } ]
        },
        premium: {
            duration: "6 Months Access",
            pricing: {
                uganda: { original: 240000, discounted: 120000, currency: "UGX" },
                sudan: { original: 432000, discounted: 216000, currency: "SSP" }
            },
            features: [ { icon: "fa-desktop", text: "2 Devices" }, { icon: "fa-video", text: "4K UHD" }, { icon: "fa-headset", text: "24/7 Support" } ],
            bonus: true
        },
        year: {
            duration: "1 Year Access",
            pricing: {
                uganda: { original: 400000, discounted: 200000, currency: "UGX" },
                sudan: { original: 720000, discounted: 360000, currency: "SSP" }
            },
            features: [ { icon: "fa-desktop", text: "2 Devices" }, { icon: "fa-video", text: "4K UHD" }, { icon: "fa-headset", text: "24/7 Support" } ],
            bonus: true
        }
    };

    // --- FUNCTIONS ---
    const formatCurrency = (amount) => new Intl.NumberFormat('en-US').format(amount);

    const updatePlanDetails = (planKey) => {
        if (!selectedCountry) return; // Don't run if country isn't selected
        const plan = plans[planKey];
        const prices = plan.pricing[selectedCountry];

        let featuresHTML = plan.features.map(f => `<li><i class="fas ${f.icon}"></i> ${f.text}</li>`).join('');
        let bonusHTML = plan.bonus ? `
            <div class="bonus">
                <p>+ Includes FREE:</p>
                <div class="bonus-logos">
                    <img src="../prime-video.png" alt="Prime Video">
                    <img src="../spotify.png" alt="Spotify">
                </div>
            </div>` : '';

        planDetailsContainer.innerHTML = `
            <div class="price-display">
                <del class="original-price">${formatCurrency(prices.original)} ${prices.currency}</del>
                <div class="discounted-price">${formatCurrency(prices.discounted)} <span class="currency">${prices.currency}</span></div>
            </div>
            <p class="duration">${plan.duration}</p>
            <ul class="features">${featuresHTML}</ul>
            ${bonusHTML}
        `;
    };

    const showStep = (stepId) => {
        steps.forEach(step => step.classList.remove('active'));
        document.getElementById(stepId)?.classList.add('active');
        window.scrollTo(0, 0);
    };
    
    const generateLoginGuide = (device, tvType = null) => {
        let guideHTML = '';
        let backTarget = 'step2';
        let finalDeviceName = tvType || device;

        if (device === 'TV' && tvType === 'Smart TV') {
            guideHTML += `<div class="visual-step"><div class="icon"><img src="../netflix.png" alt="Netflix Logo"></div><div class="text">Find and <strong>Open the Netflix App</strong> on your TV.</div></div><div class="visual-step"><div class="icon"><i class="fas fa-sign-in-alt"></i></div><div class="text">Important: Choose <strong>Sign In</strong>, not Sign Up.</div></div><div class="visual-step"><div class="icon"><i class="fas fa-gamepad"></i></div><div class="text">When asked, select <strong>'Sign in with your remote'</strong>.</div></div>`;
            backTarget = 'step2-5';
        } else {
             guideHTML += `<div class="visual-step"><div class="icon"><img src="../netflix.png" alt="Netflix Logo"></div><div class="text"><strong>Open the Netflix App</strong> or go to Netflix.com on your ${finalDeviceName}.</div></div>`;
        }
        
        const encodedMessage = encodeURIComponent("Hello Accessug! I’m on the profiles screen.");
        const whatsappLink = `https://wa.me/256762193386?text=${encodedMessage}`;

        guideHTML += `
            <div class="visual-step"><div class="icon"><i class="fas fa-at"></i></div><div class="text">Enter the Email Address<div class="credential-box"><span id="email">cartelug7@gmail.com</span><button class="copy-btn" data-copy="email"><i class="fas fa-copy"></i></button></div></div></div>
            <div class="visual-step"><div class="icon"><i class="fas fa-key"></i></div><div class="text">Enter the Password<div class="credential-box"><span id="password">cartelug10</span><button class="copy-btn" data-copy="password"><i class="fas fa-copy"></i></button></div></div></div>
            <div class="final-cta"><p class="cta-prompt">Once you see the profiles screen, tap below to activate your account!</p><a href="${whatsappLink}" target="_blank" class="whatsapp-btn"><i class="fab fa-whatsapp"></i> I'm at the Profiles Screen!</a></div>
        `;
        
        loginGuideContainer.innerHTML = guideHTML;
        loginTitle.textContent = `Login on Your ${finalDeviceName}`;
        document.querySelector('#step3 .back-btn').dataset.target = backTarget;
        addCopyButtonListeners();
    };

    const addCopyButtonListeners = () => {
        document.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const textToCopy = document.getElementById(button.dataset.copy).textContent;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const icon = button.querySelector('i');
                    icon.classList.remove('fa-copy');
                    icon.classList.add('fa-check');
                    button.style.backgroundColor = 'var(--green-accent)';
                    setTimeout(() => {
                        icon.classList.add('fa-copy');
                        icon.classList.remove('fa-check');
                        button.style.backgroundColor = '';
                    }, 2000);
                });
            });
        });
    };
    
    // --- EVENT LISTENERS ---
    planTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            planTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updatePlanDetails(tab.dataset.plan);
        });
    });

    countryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedCountry = btn.dataset.country;
            countryPopup.classList.remove('visible');
            const activePlanTab = document.querySelector('.plan-tab.active');
            updatePlanDetails(activePlanTab.dataset.plan);
        });
    });

    nextToDeviceBtn.addEventListener('click', () => showStep('step2'));

    deviceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedDevice = btn.dataset.deviceType;
            if (selectedDevice === 'TV') {
                showStep('step2-5');
            } else {
                generateLoginGuide(selectedDevice);
                showStep('step3');
            }
        });
    });
    
    tvTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tvType = btn.dataset.tvType;
            generateLoginGuide('TV', tvType);
            showStep('step3');
        });
    });

    backBtns.forEach(btn => {
        btn.addEventListener('click', () => showStep(btn.dataset.target));
    });

    // --- INITIALIZATION ---
    // The country popup is visible by default via CSS. 
    // The app remains in a waiting state until a country is chosen.
});
