// --- 1. CORE DATA MATRIX ---
const rates = {
    'UGX': { followers: 75, views: 0.6, likes: 12, symbol: 'UGX' },
    'SSP': { followers: 20, views: 0.15, likes: 3, symbol: 'SSP' },
    'USD': { followers: 0.02, views: 0.00015, likes: 0.003, symbol: 'USD' }
};

const config = {
    followers: { min: 1000, max: 50000, step: 1000, label: "Followers", color: "#00f2fe", start: "1k", end: "50k" },
    views: { min: 100000, max: 2000000, step: 50000, label: "Views", color: "#a855f7", start: "100k", end: "2M" },
    likes: { min: 5000, max: 50000, step: 1000, label: "Likes", color: "#fe0979", start: "5k", end: "50k" }
};

let currentRegion = 'UGX';
let currentService = 'followers';

// Initialize
window.onload = () => {
    setCurrency('UGX');
    setService('followers');
};

// --- 2. THEME & SERVICE ENGINE ---
function setService(service) {
    currentService = service;
    const settings = config[service];

    // Change the Global Accent Color
    document.documentElement.style.setProperty('--theme-color', settings.color);
    document.documentElement.style.setProperty('--theme-glow', `rgba(${hexToRgb(settings.color)}, 0.4)`);

    // UI Updates
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));
    document.getElementById(`card-${service}`).classList.add('active');

    document.getElementById('slider-title').innerText = `2. How many ${settings.label}?`;
    document.getElementById('metric-label').innerText = settings.label;

    // Setup Slider Data
    const slider = document.getElementById('amount-slider');
    const input = document.getElementById('manual-input');
    
    slider.min = settings.min;
    slider.max = settings.max;
    slider.step = settings.step;
    
    slider.value = settings.min;
    input.value = settings.min;

    // Update the visual milestones under the slider
    document.getElementById('milestones').innerHTML = `<span>${settings.start}</span><span>${settings.end}</span>`;

    runCalculations();
}

// --- 3. CURRENCY ENGINE ---
function setCurrency(currency) {
    currentRegion = currency;
    
    document.querySelectorAll('.curr-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`curr-${currency}`).classList.add('active');
    
    document.getElementById('live-currency').innerText = rates[currency].symbol;
    runCalculations();
}

// --- 4. FLUID INPUT SYNC ---
function syncFromSlider() {
    document.getElementById('manual-input').value = document.getElementById('amount-slider').value;
    runCalculations();
}

function syncFromInput() {
    let val = parseInt(document.getElementById('manual-input').value) || 0;
    const settings = config[currentService];
    
    if (val >= settings.min && val <= settings.max) {
        document.getElementById('amount-slider').value = val;
    }
    runCalculations();
}

// --- 5. REAL-TIME RECEIPT CALCULATOR ---
function runCalculations() {
    const settings = config[currentService];
    let amount = parseInt(document.getElementById('manual-input').value) || settings.min;
    
    // Prevent going below minimum in calculations
    if (amount < settings.min) amount = settings.min;

    // Calculate cost based on region
    const rate = rates[currentRegion][currentService];
    let finalPrice = amount * rate;

    // Format the text
    document.getElementById('receipt-amount').innerText = `${amount.toLocaleString()} ${settings.label}`;
    
    // Format the price
    if (currentRegion === 'USD') {
        document.getElementById('live-price').innerText = `$${finalPrice.toFixed(2)}`;
        document.getElementById('live-currency').innerText = ""; // Hide USD text since we use $
    } else {
        document.getElementById('live-price').innerText = Math.floor(finalPrice).toLocaleString();
    }
}

// --- 6. DUAL PILL REFERRAL ---
let usesReferral = false;
function toggleReferral(isYes) {
    usesReferral = isYes;
    const btnNo = document.getElementById('ref-no');
    const btnYes = document.getElementById('ref-yes');
    const box = document.getElementById('ref-box');

    if (isYes) {
        btnNo.classList.remove('active');
        btnYes.classList.add('active');
        box.classList.add('open');
        setTimeout(() => document.getElementById('referral-code').focus(), 150);
    } else {
        btnYes.classList.remove('active');
        btnNo.classList.add('active');
        box.classList.remove('open');
        document.getElementById('referral-code').value = "";
    }
}

// --- 7. CHECKOUT TO WHATSAPP ---
function processOrder() {
    const settings = config[currentService];
    const amount = parseInt(document.getElementById('manual-input').value) || 0;
    const targetLink = document.getElementById('target-link').value.trim();
    const finalPrice = document.getElementById('live-price').innerText;
    const curr = currentRegion === 'USD' ? '' : rates[currentRegion].symbol;
    
    const referrer = usesReferral ? document.getElementById('referral-code').value.trim() || "None" : "Direct";

    if (amount < settings.min) {
        alert(`Minimum order is ${settings.min.toLocaleString()}`); return;
    }
    if (!targetLink) {
        alert("Please enter the target username or link."); 
        document.getElementById('target-link').focus();
        return;
    }

    let msg = `*NEW CUSTOM ALGORITHM BOOST*\n\n`;
    msg += `*Service:* ${settings.label}\n`;
    msg += `*Amount:* ${amount.toLocaleString()}\n`;
    msg += `*Total Price:* ${finalPrice} ${curr}\n`;
    msg += `*Target:* ${targetLink}\n`;
    msg += `*Referrer:* ${referrer}\n`;

    const phone = "256762193386"; // VIP Number
    window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

// Helper: Converts hex colors so we can create transparent glows
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
}