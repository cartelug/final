// --- 1. CORE DATA MATRIX ---
const rates = {
    'UGX': { followers: 75, views: 0.6, likes: 12, symbol: 'UGX' },
    'SSP': { followers: 20, views: 0.15, likes: 3, symbol: 'SSP' },
    'USD': { followers: 0.02, views: 0.00015, likes: 0.003, symbol: 'USD' }
};

// Adjusted to the exact 1k-10k limits you requested
const config = {
    followers: { min: 1000, max: 10000, step: 500, label: "Followers", color: "#20D5D2", allowSplit: false },
    likes: { min: 1000, max: 10000, step: 500, label: "Likes", color: "#FE2C55", allowSplit: true },
    views: { min: 10000, max: 500000, step: 10000, label: "Views", color: "#a855f7", allowSplit: true }
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

    // Change CSS Variables for Dynamic Theming
    document.documentElement.style.setProperty('--theme-active', settings.color);
    document.documentElement.style.setProperty('--theme-glow', `rgba(${hexToRgb(settings.color)}, 0.2)`);

    // Update Tabs
    document.querySelectorAll('.s-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${service}`).classList.add('active');

    // Update Text
    document.getElementById('slider-label').innerText = `2. Target Volume`;
    document.getElementById('metric-name').innerText = settings.label;

    // Update Main Slider
    const volSlider = document.getElementById('volume-slider');
    volSlider.min = settings.min;
    volSlider.max = settings.max;
    volSlider.step = settings.step;
    volSlider.value = settings.min;

    // Update Visual Ticks
    const formatTick = (val) => val >= 1000 ? (val/1000) + 'k' : val;
    document.getElementById('volume-ticks').innerHTML = `<span>${formatTick(settings.min)}</span><span>${formatTick(settings.max)}</span>`;

    // Handle Split Engine Visibility
    const splitEngine = document.getElementById('split-engine');
    if (settings.allowSplit) {
        splitEngine.classList.add('visible');
        document.getElementById('split-slider').value = 1; // Reset to 1
    } else {
        splitEngine.classList.remove('visible');
    }

    runCalculations();
}

// --- 3. CURRENCY ENGINE ---
function setCurrency(currency) {
    currentRegion = currency;
    
    document.querySelectorAll('.cur-pill').forEach(b => b.classList.remove('active'));
    document.getElementById(`curr-${currency}`).classList.add('active');
    
    document.getElementById('final-curr').innerText = rates[currency].symbol;
    runCalculations();
}

// --- 4. FLUID SLIDER SYNC ---
function syncVolume() {
    runCalculations();
}

function syncSplit() {
    runCalculations();
}

// --- 5. THE SMART MATH ENGINE ---
function runCalculations() {
    const settings = config[currentService];
    let volume = parseInt(document.getElementById('volume-slider').value) || settings.min;
    let splitCount = parseInt(document.getElementById('split-slider').value) || 1;

    // Output Main Volume
    document.getElementById('metric-output').innerText = volume.toLocaleString();

    // Output Split Logic
    if (settings.allowSplit) {
        document.getElementById('split-output').innerText = splitCount;
        const mathBox = document.getElementById('split-math');
        
        if (splitCount === 1) {
            mathBox.innerHTML = `<i class="fas fa-magic"></i> All engagement goes to your target link.`;
        } else {
            const perPost = Math.floor(volume / splitCount);
            mathBox.innerHTML = `<i class="fas fa-chart-pie"></i> ${perPost.toLocaleString()} ${settings.label} will be sent to your last ${splitCount} posts.`;
        }
    }

    // Calculate Price
    const rate = rates[currentRegion][currentService];
    let finalPrice = volume * rate;

    if (currentRegion === 'USD') {
        document.getElementById('final-price').innerText = `$${finalPrice.toFixed(2)}`;
        document.getElementById('final-curr').innerText = ""; 
    } else {
        document.getElementById('final-price').innerText = Math.floor(finalPrice).toLocaleString();
    }
}

// --- 6. REFERRAL ENGINE ---
let usesReferral = false;
function toggleReferral(isYes) {
    usesReferral = isYes;
    const btnNo = document.getElementById('ref-no');
    const btnYes = document.getElementById('ref-yes');
    const box = document.getElementById('ref-body');

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

// --- 7. DEPLOY TO WHATSAPP ---
function deployCampaign() {
    const settings = config[currentService];
    const volume = parseInt(document.getElementById('volume-slider').value);
    const splitCount = settings.allowSplit ? parseInt(document.getElementById('split-slider').value) : 1;
    const targetLink = document.getElementById('target-link').value.trim();
    const finalPrice = document.getElementById('final-price').innerText;
    const curr = currentRegion === 'USD' ? '' : rates[currentRegion].symbol;
    const referrer = usesReferral ? document.getElementById('referral-code').value.trim() || "None" : "Direct";

    if (!targetLink) {
        alert("Please enter the target username or link."); 
        document.getElementById('target-link').focus();
        return;
    }

    let msg = `*TIKTOK ELITE CAMPAIGN*\n\n`;
    msg += `*Service:* ${settings.label}\n`;
    msg += `*Volume:* ${volume.toLocaleString()}\n`;
    
    if (settings.allowSplit && splitCount > 1) {
        msg += `*Distribution:* Split across ${splitCount} posts (${Math.floor(volume/splitCount)} per post)\n`;
    } else {
        msg += `*Distribution:* Single Target\n`;
    }

    msg += `*Total Price:* ${finalPrice} ${curr}\n`;
    msg += `*Target:* ${targetLink}\n`;
    msg += `*Referrer:* ${referrer}\n`;

    const phone = "256762193386"; 
    window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

// Utility: Convert HEX to RGB for CSS Glows
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
}