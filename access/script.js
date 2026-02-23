// --- STATE MANAGEMENT ---
let user = {
    name: "",
    country: "UG",
    currency: "UGX",
    rate: 1,
    service: "",
    planTitle: "",
    device: "",
    tvType: ""
};

// --- PRICING DATA (Base is UGX) ---
const planData = {
    netflix: {
        features: [
            '<i class="fas fa-tv"></i> 4K UHD Streaming',
            '<i class="fas fa-users"></i> 2+ Devices',
            '<i class="fas fa-download"></i> Offline Downloads',
            '<i class="fas fa-headset"></i> 24/7 VIP Support'
        ],
        plans: [
            { title: "1 Year", months: 12, price: 250000, gift: "1 Year Free Prime Video" },
            { title: "9 Months", months: 9, price: 200000, gift: "9 Months Free Prime Video" },
            { title: "6 Months", months: 6, price: 150000, gift: "6 Months Free Prime Video" },
            { title: "3 Months", months: 3, price: 90000, gift: "3 Months Free Prime Video" }
        ]
    },
    prime: {
        features: [
            '<i class="fas fa-crown"></i> Amazon Originals',
            '<i class="fas fa-tv"></i> 4K UHD',
            '<i class="fas fa-mobile-alt"></i> Any Device'
        ],
        plans: [
            { title: "1 Year", months: 12, price: 150000, gift: "1 Month Free Netflix" },
            { title: "6 Months", months: 6, price: 120000, gift: "1 Month Free Netflix" },
            { title: "3 Months", months: 3, price: 80000, gift: "1 Month Free Netflix" }
        ]
    }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Country Selection Logic
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

// --- NAVIGATION LOGIC ---
function switchStep(fromId, toId) {
    document.getElementById(fromId).classList.remove('active');
    document.getElementById(toId).classList.add('active');
}

function goBack(toId) {
    // Hide all steps, show target
    document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
    document.getElementById(toId).classList.add('active');
}

// --- STEP 0: ONBOARD ---
function initiatePortal() {
    const nameInput = document.getElementById('userName').value.trim();
    if (!nameInput) {
        alert("Please enter your name to continue.");
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
    
    // Render Features
    const featContainer = document.getElementById('plan-features');
    featContainer.innerHTML = data.features.map(f => `<div class="f-badge">${f}</div>`).join('');

    // Render Cards
    const stack = document.getElementById('pricing-stack');
    stack.innerHTML = '';

    data.plans.forEach(plan => {
        // Calculate Price based on Currency
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
            switchStep('step-plans', 'step-device');
        };

        card.innerHTML = `
            <div class="p-info">
                <h3>${plan.title} Access</h3>
                <div class="p-gift"><i class="fas fa-gift"></i> ${plan.gift}</div>
            </div>
            <div class="p-price">
                ${displayPrice}
                <small>${user.currency}</small>
            </div>
        `;
        stack.appendChild(card);
    });
}

// --- STEP 3/4: DEVICE & FINAL ---
function selectDevice(device) {
    user.device = device;
    if (user.service === 'netflix' && device === 'TV') {
        switchStep('step-device', 'step-tv-type');
    } else if (user.service === 'netflix') {
        finishNetflix(device);
    } else if (user.service === 'prime') {
        finishPrime();
    }
}

function finishNetflix(tvType) {
    if(tvType) user.tvType = tvType;
    document.getElementById('final-back-btn').setAttribute('onclick', "goBack('step-device')");
    
    // Custom Netflix Instructions based on device
    let instHtml = "";
    if (user.device === 'Mobile') {
        instHtml = `
            <div class="instruction-box">
                <h3><i class="fas fa-mobile-alt"></i> Mobile Login</h3>
                <p>1. Open your Netflix App.<br>2. Log out of any existing accounts.<br>3. Send us a message on WhatsApp to receive your premium Email and Password.</p>
            </div>
        `;
    } else if (user.device === 'PC') {
        instHtml = `
            <div class="instruction-box">
                <h3><i class="fas fa-laptop"></i> PC Login</h3>
                <p>1. Go to Netflix.com on your browser.<br>2. Clear your browser cookies if you have errors.<br>3. Message us on WhatsApp for credentials.</p>
            </div>
        `;
    } else {
        instHtml = `
            <div class="instruction-box">
                <h3><i class="fas fa-tv"></i> TV Login (${user.tvType})</h3>
                <p>1. Open the Netflix app on your TV.<br>2. Select "Sign In".<br>3. Message us on WhatsApp to get the credentials or Sign-in code.</p>
            </div>
        `;
    }

    const msg = encodeURIComponent(`Hello AccessUG, my name is ${user.name}. I selected Netflix ${user.planTitle} (${user.currency}). I am ready to login on my ${user.device} ${user.tvType ? `(${user.tvType})` : ''}.`);
    
    document.getElementById('final-content').innerHTML = `
        ${instHtml}
        <a href="https://wa.me/256762193386?text=${msg}" class="btn btn-whatsapp"><i class="fab fa-whatsapp"></i> Get Credentials</a>
    `;
    
    document.getElementById('final-title').innerText = "Netflix Setup Guide";
    
    // Hide step-tv-type if we came from there
    document.getElementById('step-tv-type').classList.remove('active');
    document.getElementById('step-device').classList.remove('active');
    document.getElementById('step-final').classList.add('active');
}

function finishPrime() {
    document.getElementById('final-back-btn').setAttribute('onclick', "goBack('step-device')");
    const msg = encodeURIComponent(`Hello AccessUG, my name is ${user.name}. I selected Prime Video ${user.planTitle} (${user.currency}). I'm ready for the password for Prime.`);
    
    document.getElementById('final-content').innerHTML = `
        <p style="color:#aaa; margin-bottom: 20px;">Your Prime Video package is ready for activation.</p>
        <a href="https://wa.me/256762193386?text=${msg}" class="btn btn-whatsapp"><i class="fab fa-whatsapp"></i> Request Prime Password</a>
    `;
    
    document.getElementById('final-title').innerText = "Prime Video Setup";
    switchStep('step-device', 'step-final');
}

// --- SPOTIFY ACTION ---
function sendSpotifyWhatsApp() {
    const msg = encodeURIComponent(`Hello AccessUG, my name is ${user.name}. I have accepted the invite, please send me the Address to join.`);
    window.location.href = `https://wa.me/256762193386?text=${msg}`;
}