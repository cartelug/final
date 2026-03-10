// --- SALES MACHINE LOGIC ENGINE ---
// Focused on speed, zero errors, and smooth data transfer

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
        payments: ["Mobile Money Agent", "Give cash in South Sudan"]
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

let currentRegion = 'UG'; // Default for least friction
let selectedPlanName = '';
let selectedPlanRawPrice = '';

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
    setRegion('UG'); // Set default region prices on load without a gatekeeper
});

// Smooth scroll to pricing
function scrollToPricing() {
    document.getElementById('pricing-target').scrollIntoView({ behavior: 'smooth' });
}

// --- 1. SEAMLESS REGION SWITCHING ---
function setRegion(regionCode) {
    currentRegion = regionCode;
    const data = regionData[regionCode];

    // Toggle button UI
    document.querySelectorAll('.region-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${regionCode}`).classList.add('active');

    // Update Prices
    document.getElementById('price-1year').textContent = data.prices["1year"].display;
    document.getElementById('price-6mo').textContent = data.prices["6mo"].display;
    document.getElementById('price-3mo').textContent = data.prices["3mo"].display;
    
    // Update Currencies
    document.querySelectorAll('.currency').forEach(el => {
        el.textContent = regionCode === 'SS' || regionCode === 'CD' ? '$' : data.currency + ' ';
    });

    // Populate Payment Dropdown for Checkout
    const paymentSelect = document.getElementById('paymentMethod');
    paymentSelect.innerHTML = `<option value="" disabled selected>Select an option...</option>`;
    data.payments.forEach(method => {
        let opt = document.createElement('option');
        opt.value = method;
        opt.textContent = method;
        paymentSelect.appendChild(opt);
    });
}

// --- 2. OPEN CHECKOUT MODAL ---
function selectPlan(planName, planId) {
    const data = regionData[currentRegion];
    selectedPlanName = planName;
    selectedPlanRawPrice = data.prices[planId].raw;

    // Update Summary in Modal
    document.getElementById('summary-plan-name').textContent = planName;
    const prefix = (currentRegion === 'SS' || currentRegion === 'CD') ? '$' : data.currency + ' ';
    document.getElementById('summary-plan-price').textContent = `${prefix}${data.prices[planId].display}`;

    // Show Modal
    document.getElementById('checkout-modal').classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Focus Name Input
    setTimeout(() => document.getElementById('clientName').focus(), 300);
}

function closeCheckout() {
    document.getElementById('checkout-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// --- 3. REFERRAL TOGGLE (Netflix Logic) ---
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

// --- 4. SECURE DATA SUBMISSION ---
async function submitOrder(e) {
    e.preventDefault(); // Prevent standard form reload

    const name = document.getElementById('clientName').value.trim();
    const rawNumber = document.getElementById('clientNumber').value.trim();
    const payment = document.getElementById('paymentMethod').value;
    const referrer = document.getElementById('referralCode').value.trim() || "Direct Organic";

    // Validate phone length (basic)
    if (rawNumber.length < 8) {
        alert("Please enter a valid WhatsApp number.");
        document.getElementById('clientNumber').focus();
        return false;
    }

    // Change button text to show action
    const submitBtn = document.querySelector('.btn-whatsapp-large');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Securing Line...';
    submitBtn.style.pointerEvents = 'none';

    const cleanNumber = rawNumber.replace(/\D/g, ''); 
    const sheetNumber = "'" + cleanNumber; // Append quote to prevent Excel formula errors
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
        // Fire asynchronously, do not await so user isn't kept waiting
        fetch("https://script.google.com/macros/s/AKfycbzsER7toUR8OwPWPic7Oqbbjz-ew2pR_HJ4Um3V9o6eVmlf730ibwF7ELv6GCekmgl2aA/exec", { 
            method: 'POST', body: formData, mode: 'no-cors' 
        });
    } catch (err) {
        console.log("Analytics sync delayed.");
    }

    // --- WHATSAPP REDIRECT BUILDER ---
    const phone = "256762193386"; 
    
    // Formatting a clean, professional order slip for the WhatsApp agent
    let message = `*🟢 NEW LIVETV ACTIVATION [${currentRegion}]*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*Package:* ${selectedPlanName}\n`;
    message += `*Price:* ${selectedPlanRawPrice} ${data.currency}\n\n`;
    
    message += `*Client Name:* ${name}\n`;
    message += `*WhatsApp:* ${cleanNumber}\n`;
    message += `*Payment:* ${payment}\n`;
    
    if(referrer !== "Direct Organic") {
        message += `*Agent/Ref:* ${referrer}\n`;
    }
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `_Please assist with device configuration._`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    // Tiny delay so user sees the "Securing line" text, increasing perceived security
    setTimeout(() => {
        window.location.href = url;
    }, 600);
}