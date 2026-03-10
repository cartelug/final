// --- FUNNEL & LOGIC ENGINE ---

const regionData = {
    UG: {
        currency: "UGX",
        prices: {
            "1year": { display: "180,000", raw: "180000" },
            "6mo": { display: "150,000", raw: "150000" },
            "3mo": { display: "120,000", raw: "120000" }
        },
        payments: ["MTN Mobile Money", "Airtel Money", "Cash in Office (Kampala)"]
    },
    SS: {
        currency: "USD",
        prices: {
            "1year": { display: "70", raw: "70" },
            "6mo": { display: "45", raw: "45" },
            "3mo": { display: "35", raw: "35" }
        },
        payments: ["Mobile Money Agent", "Cash in South Sudan"]
    },
    CD: {
        currency: "USD",
        prices: {
            "1year": { display: "70", raw: "70" },
            "6mo": { display: "45", raw: "45" },
            "3mo": { display: "35", raw: "35" }
        },
        payments: ["Mobile Money"]
    }
};

let currentRegion = null;
let selectedPlanName = '';
let selectedPlanRawPrice = '';
let calculatedExpiryText = '';

// --- CUSTOM ORDINAL DATE CALCULATOR ---
function getOrdinalNum(n) {
    return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
}

function formatPremiumDate(date) {
    const day = getOrdinalNum(date.getDate());
    const month = date.toLocaleDateString('en-GB', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

function calculateExpiryDates() {
    const today = new Date();

    // 3 Months
    let d3 = new Date(today); d3.setMonth(d3.getMonth() + 3);
    document.querySelector('.dynamic-date-3').innerHTML = `<i class="fas fa-sync-alt"></i> Renews on ${formatPremiumDate(d3)}`;

    // 6 Months
    let d6 = new Date(today); d6.setMonth(d6.getMonth() + 6);
    document.querySelector('.dynamic-date-6').innerHTML = `<i class="fas fa-sync-alt"></i> Renews on ${formatPremiumDate(d6)}`;

    // 12 Months
    let d12 = new Date(today); d12.setFullYear(d12.getFullYear() + 1);
    document.querySelector('.dynamic-date-12').innerHTML = `<span class="pulse-dot"></span><i class="fas fa-sync-alt"></i> Renews on ${formatPremiumDate(d12)}`;
}


// --- WIZARD / FUNNEL NAVIGATION ---

// User selects region on Step 0, instantly moves to Step 1
function setRegionAndNext(regionCode) {
    currentRegion = regionCode;
    const data = regionData[regionCode];

    if(navigator.vibrate) navigator.vibrate(40);

    // Calc Dates
    calculateExpiryDates();

    // Inject Prices into DOM
    document.getElementById('price-1year').textContent = data.prices["1year"].display;
    document.getElementById('price-6mo').textContent = data.prices["6mo"].display;
    document.getElementById('price-3mo').textContent = data.prices["3mo"].display;
    
    document.querySelectorAll('.currency').forEach(el => {
        el.textContent = (regionCode === 'SS' || regionCode === 'CD') ? '$' : data.currency + ' ';
    });

    // Populate Checkout Dropdown
    const paymentSelect = document.getElementById('paymentMethod');
    paymentSelect.innerHTML = `<option value="" disabled selected>Select an option...</option>`;
    data.payments.forEach(method => {
        let opt = document.createElement('option');
        opt.value = method;
        opt.textContent = method;
        paymentSelect.appendChild(opt);
    });

    // Move to next step
    nextStep(1);
}

function nextStep(stepNum) {
    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(el => {
        el.classList.remove('active');
    });
    
    // Show target step
    document.getElementById(`step-${stepNum}`).classList.add('active');
    
    if(navigator.vibrate) navigator.vibrate(30);
    
    // Scroll to top of card just in case
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function revealPricing() {
    // Expand the card horizontally on Desktop for the 3 columns
    document.getElementById('wizard-card').classList.add('expanded');
    nextStep(5);
}


// --- BOTTOM SHEET CHECKOUT ---
function openCheckout(planName, planId) {
    const data = regionData[currentRegion];
    selectedPlanName = planName;
    selectedPlanRawPrice = data.prices[planId].raw;

    // Grab exact expiry date text
    let durationClass = planId === '1year' ? '.dynamic-date-12' : planId === '6mo' ? '.dynamic-date-6' : '.dynamic-date-3';
    calculatedExpiryText = document.querySelector(durationClass).textContent.trim();

    // Populate Sheet
    document.getElementById('summary-plan-name').textContent = planName;
    document.getElementById('summary-expiry').innerHTML = `<i class="fas fa-sync-alt"></i> ${calculatedExpiryText}`;
    
    const prefix = (currentRegion === 'SS' || currentRegion === 'CD') ? '$' : data.currency + ' ';
    document.getElementById('summary-plan-price').textContent = `${prefix}${data.prices[planId].display}`;

    // Show
    document.getElementById('checkout-sheet').classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
    
    if(navigator.vibrate) navigator.vibrate([30, 50]); 
    setTimeout(() => document.getElementById('clientName').focus(), 300);
}

function closeCheckout(force = false) {
    if(force === true || event.target.id === 'checkout-sheet') {
        document.getElementById('checkout-sheet').classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// --- REFERRAL TOGGLE ---
function switchReferral(isYes) {
    const btnNo = document.getElementById('btn-ref-no');
    const btnYes = document.getElementById('btn-ref-yes');
    const slideBox = document.getElementById('ref-input-slide');
    const inputField = document.getElementById('referralCode');

    if (isYes) {
        btnNo.classList.remove('active');
        btnYes.classList.add('active');
        slideBox.classList.add('open');
        setTimeout(() => inputField.focus(), 200);
    } else {
        btnYes.classList.remove('active');
        btnNo.classList.add('active');
        slideBox.classList.remove('open');
        inputField.value = ""; 
    }
}

// --- SECURE DATA SUBMISSION ---
async function submitOrder(e) {
    e.preventDefault(); 

    const name = document.getElementById('clientName').value.trim();
    const rawNumber = document.getElementById('clientNumber').value.trim();
    const payment = document.getElementById('paymentMethod').value;
    const referrer = document.getElementById('referralCode').value.trim() || "Funnel Setup";

    if (rawNumber.length < 8) {
        alert("Please provide a valid WhatsApp number so our team can send the setup instructions.");
        return false;
    }

    // Processing UI
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> GENERATING SECURE LINK...';
    submitBtn.style.pointerEvents = 'none';

    if(navigator.vibrate) navigator.vibrate([100, 50, 100]);

    const cleanNumber = rawNumber.replace(/\D/g, ''); 
    const sheetNumber = "'" + cleanNumber; 
    const data = regionData[currentRegion];

    // --- GOOGLE SHEETS POST ---
    const formData = new URLSearchParams();
    formData.append('ClientName', name);
    formData.append('Number', sheetNumber);
    formData.append('Service', 'AccessUG LiveTV');
    formData.append('Package', selectedPlanName);
    formData.append('Price', selectedPlanRawPrice); 
    formData.append('Referrer', referrer);

    try {
        fetch("https://script.google.com/macros/s/AKfycbzsER7toUR8OwPWPic7Oqbbjz-ew2pR_HJ4Um3V9o6eVmlf730ibwF7ELv6GCekmgl2aA/exec", { 
            method: 'POST', body: formData, mode: 'no-cors' 
        });
    } catch (err) { }

    // --- WHATSAPP BUILDER ---
    const phone = "256762193386"; 
    
    let message = `*🟢 NEW LIVETV DEPLOYMENT [${currentRegion}]*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*Package:* ${selectedPlanName}\n`;
    message += `*Validity:* ${calculatedExpiryText.replace('Renews on ', '')}\n`; 
    message += `*Amount:* ${selectedPlanRawPrice} ${data.currency}\n\n`;
    
    message += `*Client Name:* ${name}\n`;
    message += `*WhatsApp:* ${cleanNumber}\n`;
    message += `*Payment Via:* ${payment}\n`;
    if(referrer !== "Funnel Setup") message += `*Referred By:* ${referrer}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `_Please assist with immediate device configuration._`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    setTimeout(() => { window.location.href = url; }, 500);
}