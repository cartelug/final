// --- STATE MANAGEMENT ---
let user = {
    name: "",
    country: "UG",
    currency: "UGX",
    rate: 1,
    service: "",
    planTitle: "",
    device: ""
};

// --- PRICING & LOGIC DATA ---
const planData = {
    netflix: {
        features: [
            '<i class="fas fa-tv"></i> 4K UHD Quality',
            '<i class="fas fa-users"></i> 2+ Devices at Once',
            '<i class="fas fa-download"></i> Offline Downloads',
            '<i class="fas fa-headset"></i> 24/7 VIP Support'
        ],
        plans: [
            { title: "1 Year", price: 250000, giftHtml: `<img src="../IMAGES/prime-video.png" alt="Prime"> 1 Year Free Prime Video` },
            { title: "9 Months", price: 200000, giftHtml: `<i class="fas fa-gift"></i> 9 Months Free Prime` },
            { title: "6 Months", price: 150000, giftHtml: `<i class="fas fa-gift"></i> 6 Months Free Prime` },
            { title: "3 Months", price: 90000, giftHtml: `<i class="fas fa-gift"></i> 3 Months Free Prime` }
        ]
    },
    prime: {
        features: [
            '<i class="fas fa-crown"></i> Amazon Originals',
            '<i class="fas fa-tv"></i> 4K UHD Quality',
            '<i class="fas fa-mobile-alt"></i> Any Device'
        ],
        plans: [
            { title: "1 Year", price: 150000, giftHtml: `<img src="../IMAGES/netflix.png" alt="Netflix"> 1 Month Free Netflix` },
            { title: "6 Months", price: 120000, giftHtml: `<img src="../IMAGES/netflix.png" alt="Netflix"> 1 Month Free Netflix` },
            { title: "3 Months", price: 80000, giftHtml: `<img src="../IMAGES/netflix.png" alt="Netflix"> 1 Month Free Netflix` }
        ]
    }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    const countryBtns = document.querySelectorAll('.country-btn');
    countryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            countryBtns.forEach(b => b.classList.remove('active'));
            const target = e.currentTarget;
            target.classList.add('active');
            user.country = target.getAttribute('data-country');
            user.currency = target.getAttribute('data-currency');
            user.rate = parseFloat(target.getAttribute('data-rate'));
        });
    });
});

// --- NAVIGATION ---
function switchStep(fromId, toId) {
    document.getElementById(fromId).classList.remove('active');
    document.getElementById(toId).classList.add('active');
}

function goBack(toId) {
    document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
    document.getElementById(toId).classList.add('active');
}

// --- STEP 0: ONBOARD ---
function initiatePortal() {
    const nameInput = document.getElementById('userName').value.trim();
    if (!nameInput) {
        alert("Please enter your full name to continue.");
        return;
    }
    user.name = nameInput;
    switchStep('step-onboard', 'step-service');
}

// --- STEP 1: SERVICE ---
function selectService(service) {
    user.service = service;
    document.body.setAttribute('data-theme', service);
    
    if (service === 'spotify') {
        switchStep('step-service', 'step-spotify');
    } else {
        renderPlans(service);
        switchStep('step-service', 'step-plans');
    }
}

// --- STEP 2: PLANS ---
function renderPlans(service) {
    const data = planData[service];
    
    // Render Features as Pills
    const featContainer = document.getElementById('plan-features');
    featContainer.innerHTML = data.features.map(f => `<div class="f-pill">${f}</div>`).join('');

    // Render Pricing Cards
    const stack = document.getElementById('pricing-stack');
    stack.innerHTML = '';

    data.plans.forEach(plan => {
        let displayPrice = "";
        if (user.currency === "USD") {
            const usdVal = Math.round(plan.price * user.rate);
            displayPrice = `$${usdVal}`;
        } else {
            displayPrice = `${(plan.price / 1000)}K`;
        }

        const card = document.createElement('div');
        card.className = 'plan-card';
        card.onclick = () => {
            user.planTitle = plan.title;
            // Prime goes to WhatsApp. Netflix goes to device selection to get credentials.
            if (service === 'prime') {
                finishPrime();
            } else {
                switchStep('step-plans', 'step-device');
            }
        };

        card.innerHTML = `
            <div class="p-info">
                <h3>${plan.title} Access</h3>
                <div class="p-gift">${plan.giftHtml}</div>
            </div>
            <div class="p-price">
                ${displayPrice}
                <small>${user.currency}</small>
            </div>
        `;
        stack.appendChild(card);
    });
}

// --- STEP 3: DEVICE (NETFLIX ONLY) ---
function selectDevice(device) {
    user.device = device;
    finishNetflix(device);
}

// --- UTILITY: COPY TO CLIPBOARD ---
function copyText(elementId, btnElement) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btnElement.innerHTML;
        btnElement.innerHTML = `<i class="fas fa-check"></i> Copied`;
        btnElement.classList.add('copied');
        setTimeout(() => {
            btnElement.innerHTML = originalText;
            btnElement.classList.remove('copied');
        }, 2000);
    });
}

// --- FINAL INSTRUCTIONS ---
function finishNetflix(device) {
    document.getElementById('final-back-btn').setAttribute('onclick', "goBack('step-device')");
    
    const vaultHtml = `
        <div class="credential-vault">
            <div class="cred-row">
                <div class="cred-info">
                    <span>Email Address</span>
                    <strong id="nf-email">cartelug6@gmail.com</strong>
                </div>
                <button class="btn-copy" onclick="copyText('nf-email', this)"><i class="far fa-copy"></i> Copy</button>
            </div>
            <div class="cred-row">
                <div class="cred-info">
                    <span>Password</span>
                    <strong id="nf-pass">cartel261</strong>
                </div>
                <button class="btn-copy" onclick="copyText('nf-pass', this)"><i class="far fa-copy"></i> Copy</button>
            </div>
        </div>
    `;

    let stepsHtml = "";
    if (device === 'Smart TV') {
        stepsHtml = `
            <div class="step-timeline">
                <div class="t-step"><div class="t-num">1</div><div class="t-text">Open the Netflix app on your TV and select <b>Sign In</b>.</div></div>
                <div class="t-step"><div class="t-num">2</div><div class="t-text">If a code appears on the screen, ignore it and choose <b>"Use Remote"</b> instead.</div></div>
                <div class="t-step"><div class="t-num">3</div><div class="t-text">If asked to send a link, select <b>"Use Password Instead"</b>.</div></div>
                <div class="t-step"><div class="t-num">4</div><div class="t-text">Enter the Email and Password shown above, then select your profile.</div></div>
            </div>
        `;
    } else if (device === 'Normal TV') {
        stepsHtml = `
            <div class="step-timeline">
                <div class="t-step"><div class="t-num">1</div><div class="t-text">Using your connected device remote (Firestick/Console), open Netflix.</div></div>
                <div class="t-step"><div class="t-num">2</div><div class="t-text">Select <b>Sign In</b>. If a code appears, select <b>"Use Remote"</b>.</div></div>
                <div class="t-step"><div class="t-num">3</div><div class="t-text">If prompted, choose <b>"Use Password Instead"</b>.</div></div>
                <div class="t-step"><div class="t-num">4</div><div class="t-text">Enter the Email and Password shown above, then select your profile.</div></div>
            </div>
        `;
    } else {
        // Mobile / PC
        stepsHtml = `
            <div class="step-timeline">
                <div class="t-step"><div class="t-num">1</div><div class="t-text">Open Netflix and log out of any existing accounts.</div></div>
                <div class="t-step"><div class="t-num">2</div><div class="t-text">Click <b>Sign In</b> and enter the Email and Password shown above.</div></div>
                <div class="t-step"><div class="t-num">3</div><div class="t-text">Select your profile and start watching!</div></div>
            </div>
        `;
    }

    document.getElementById('final-content').innerHTML = `
        <div class="guide-wrapper">
            ${vaultHtml}
            ${stepsHtml}
        </div>
    `;
    
    document.getElementById('final-title').innerHTML = `Netflix <span class="dynamic-color">Unlocked</span>`;
    document.getElementById('final-subtitle').innerText = "Use the exact details below to sign in immediately.";
    
    document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
    document.getElementById('step-final').classList.add('active');
}

function finishPrime() {
    document.getElementById('final-back-btn').setAttribute('onclick', "goBack('step-plans')");
    const msg = encodeURIComponent(`Hello AccessUG, my name is ${user.name}. I selected Prime Video ${user.planTitle} (${user.currency}). I'm ready for the password for Prime.`);
    
    document.getElementById('final-content').innerHTML = `
        <div style="padding: 30px 0;">
            <p style="color:#ccc; font-size: 1.1rem; margin-bottom: 25px;">Your Prime Video package is ready. Message us on WhatsApp to receive your private password securely.</p>
            <a href="https://wa.me/256762193386?text=${msg}" class="btn btn-whatsapp"><i class="fab fa-whatsapp"></i> Request Prime Password</a>
        </div>
    `;
    
    document.getElementById('final-title').innerHTML = `Prime <span class="dynamic-color">Ready</span>`;
    document.getElementById('final-subtitle').innerText = "Secure your connection via WhatsApp.";
    switchStep('step-plans', 'step-final');
}

// --- SPOTIFY ACTION ---
function sendSpotifyWhatsApp() {
    const msg = encodeURIComponent(`Hello AccessUG, my name is ${user.name}. I have accepted the invite, please send me the Address to join.`);
    window.location.href = `https://wa.me/256762193386?text=${msg}`;
}