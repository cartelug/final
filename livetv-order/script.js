// --- HIGH-CONVERSION ENGINE ---
// Features: Date Calculation, Zero-Friction Flow, Haptic Feedback

const regionData = {
    UG: {
        currency: "UGX",
        prices: {
            "1year": { display: "180,000", raw: "180000" },
            "6mo": { display: "150,000", raw: "150000" },
            "3mo": { display: "120,000", raw: "120000" }
        },
        payments: ["MTN Mobile Money", "Airtel Money", "Cash in Office"]
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
let calculatedExpiryText = ''; // To pass to summary

document.body.style.overflow = 'hidden';

// --- MAGIC DATE CALCULATOR ---
// Calculates exact future date: e.g. "Active until 10 Mar 2027"
function calculateExpiryDates() {
    const today = new Date();
    
    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', { 
            day: 'numeric', month: 'short', year: 'numeric' 
        });
    };

    // 3 Months
    let d3 = new Date(today); d3.setMonth(d3.getMonth() + 3);
    document.querySelector('.dynamic-date-3').innerHTML = `<i class="far fa-calendar-check"></i> Active until ${formatDate(d3)}`;

    // 6 Months
    let d6 = new Date(today); d6.setMonth(d6.getMonth() + 6);
    document.querySelector('.dynamic-date-6').innerHTML = `<i class="far fa-calendar-check"></i> Active until ${formatDate(d6)}`;

    // 12 Months
    let d12 = new Date(today); d12.setFullYear(d12.getFullYear() + 1);
    document.querySelector('.dynamic-date-12').innerHTML = `<i class="far fa-calendar-check"></i> Active until ${formatDate(d12)}`;
}

// --- GATEKEEPER ENTRY ---
function enterPortal(regionCode) {
    currentRegion = regionCode;
    const data = regionData[regionCode];

    if(navigator.vibrate) navigator.vibrate(50);

    // Calculate Dates dynamically
    calculateExpiryDates();

    // Inject Prices
    document.getElementById('price-1year').textContent = data.prices["1year"].display;
    document.getElementById('price-6mo').textContent = data.prices["6mo"].display;
    document.getElementById('price-3mo').textContent = data.prices["3mo"].display;
    
    document.querySelectorAll('.currency').forEach(el => {
        el.textContent = (regionCode === 'SS' || regionCode === 'CD') ? '$' : data.currency + ' ';
    });

    // Populate Payment Dropdown
    const paymentSelect = document.getElementById('paymentMethod');
    paymentSelect.innerHTML = `<option value="" disabled selected>Select Payment Method</option>`;
    data.payments.forEach(method => {
        let opt = document.createElement('option');
        opt.value = method;
        opt.textContent = method;
        paymentSelect.appendChild(opt);
    });

    // Animate Gatekeeper Away
    const gatekeeper = document.getElementById('region-gatekeeper');
    gatekeeper.style.opacity = '0';
    setTimeout(() => {
        gatekeeper.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reveal Main UI Smoothly
        document.getElementById('main-content').classList.add('visible');
    }, 400);
}

// --- BOTTOM SHEET CHECKOUT ---
function triggerCheckout(planName, planId) {
    const data = regionData[currentRegion];
    selectedPlanName = planName;
    selectedPlanRawPrice = data.prices[planId].raw;

    // Grab the pre-calculated expiry date string from the clicked card
    let durationClass = planId === '1year' ? '.dynamic-date-12' : planId === '6mo' ? '.dynamic-date-6' : '.dynamic-date-3';
    calculatedExpiryText = document.querySelector(durationClass).textContent;

    // Populate Sheet
    document.getElementById('summary-name').textContent = planName;
    document.getElementById('summary-expiry').textContent = calculatedExpiryText;
    
    const prefix = (currentRegion === 'SS' || currentRegion === 'CD') ? '$' : data.currency + ' ';
    document.getElementById('summary-price').textContent = `${prefix}${data.prices[planId].display}`;

    // Show Sheet
    document.getElementById('checkout-sheet').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if(navigator.vibrate) navigator.vibrate([30, 50]); // double tap feel
}

function closeCheckout(force = false) {
    if(force === true || event.target.id === 'checkout-sheet') {
        document.getElementById('checkout-sheet').classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// --- REFERRAL TOGGLE ---
function toggleReferral(isYes) {
    const btnNo = document.getElementById('ref-no');
    const btnYes = document.getElementById('ref-yes');
    const slideBox = document.getElementById('ref-input-box');
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

// --- FINAL SUBMISSION LOGIC ---
async function finalizeOrder(e) {
    e.preventDefault(); 

    const name = document.getElementById('clientName').value.trim();
    const rawNumber = document.getElementById('clientNumber').value.trim();
    const payment = document.getElementById('paymentMethod').value;
    const referrer = document.getElementById('referralCode').value.trim() || "Portal App";

    if (rawNumber.length < 8) {
        alert("A valid WhatsApp number is required for the technical team to connect you.");
        return false;
    }

    // Button UI Feedback
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerHTML = '<i class="fas fa-satellite-dish fa-spin"></i> GENERATING LINK...';
    submitBtn.style.pointerEvents = 'none';

    if(navigator.vibrate) navigator.vibrate([100, 50, 100]);

    const cleanNumber = rawNumber.replace(/\D/g, ''); 
    const sheetNumber = "'" + cleanNumber; 
    const data = regionData[currentRegion];

    // --- 1. SILENT ANALYTICS (Sheets) ---
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
    } catch (err) {}

    // --- 2. WHATSAPP PAYLOAD BUILDER ---
    const phone = "256762193386"; 
    
    let message = `*🟢 PREMIUM ACCESS REQUEST [${currentRegion}]*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*Plan:* ${selectedPlanName}\n`;
    message += `*Valid:* ${calculatedExpiryText.replace('Active until ', '')}\n`; // Pushing calculated date to agents
    message += `*Amount:* ${selectedPlanRawPrice} ${data.currency}\n\n`;
    
    message += `*Commander:* ${name}\n`;
    message += `*Contact:* ${cleanNumber}\n`;
    message += `*Payment:* ${payment}\n`;
    if(referrer !== "Portal App") message += `*Agent Ref:* ${referrer}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `_Please configure my device now._`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    setTimeout(() => { window.location.href = url; }, 400);
}