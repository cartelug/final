// --- APP-LIKE LOGIC ENGINE ---

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

let currentRegion = 'UG'; 
let selectedPlanName = '';
let selectedPlanRawPrice = '';

document.addEventListener("DOMContentLoaded", () => {
    setRegion('UG'); // Default state
    setupScrollListener(); // Mobile Sticky CTA logic
});

function scrollToPricing() {
    document.getElementById('pricing-target').scrollIntoView({ behavior: 'smooth' });
}

// Show/Hide Sticky Button on scroll past hero
function setupScrollListener() {
    const hero = document.querySelector('.hero');
    const stickyCta = document.getElementById('sticky-cta');
    
    window.addEventListener('scroll', () => {
        if(window.scrollY > hero.offsetHeight - 50) {
            stickyCta.classList.add('visible');
        } else {
            stickyCta.classList.remove('visible');
        }
    });
}

// --- REGION TABS ---
function setRegion(regionCode) {
    currentRegion = regionCode;
    const data = regionData[regionCode];

    // Native App Tab Switch UI
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${regionCode}`).classList.add('active');

    // Haptic feedback
    if(navigator.vibrate) navigator.vibrate(30);

    // Update Prices
    document.getElementById('price-1year').textContent = data.prices["1year"].display;
    document.getElementById('price-6mo').textContent = data.prices["6mo"].display;
    document.getElementById('price-3mo').textContent = data.prices["3mo"].display;
    
    document.querySelectorAll('.currency').forEach(el => {
        el.textContent = (regionCode === 'SS' || regionCode === 'CD') ? '$' : data.currency + ' ';
    });

    // Populate Payment Dropdown
    const paymentSelect = document.getElementById('paymentMethod');
    paymentSelect.innerHTML = `<option value="" disabled selected></option>`;
    data.payments.forEach(method => {
        let opt = document.createElement('option');
        opt.value = method;
        opt.textContent = method;
        paymentSelect.appendChild(opt);
    });
}

// --- BOTTOM SHEET MODAL LOGIC ---
function openCheckout(planName, planId) {
    const data = regionData[currentRegion];
    selectedPlanName = planName;
    selectedPlanRawPrice = data.prices[planId].raw;

    // Update Sheet UI
    document.getElementById('summary-plan-name').textContent = planName;
    const prefix = (currentRegion === 'SS' || currentRegion === 'CD') ? '$' : data.currency + ' ';
    document.getElementById('summary-plan-price').textContent = `${prefix}${data.prices[planId].display}`;

    // Show Sheet
    document.getElementById('app-sheet-overlay').classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
    
    if(navigator.vibrate) navigator.vibrate(50);
}

function closeCheckout(force = false) {
    // If event is passed, check if they clicked the overlay background
    if(force === true || event.target.id === 'app-sheet-overlay') {
        document.getElementById('app-sheet-overlay').classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// --- MINIMAL REFERRAL TOGGLE ---
function toggleReferral() {
    const slide = document.getElementById('ref-slide');
    const icon = document.getElementById('ref-icon');
    const input = document.getElementById('referralCode');

    if(slide.classList.contains('open')) {
        slide.classList.remove('open');
        icon.className = 'fas fa-plus';
        input.value = '';
    } else {
        slide.classList.add('open');
        icon.className = 'fas fa-minus';
        setTimeout(() => input.focus(), 200);
    }
}

// --- SECURE SUBMISSION (Zero Friction) ---
async function submitOrder(e) {
    e.preventDefault(); 

    const name = document.getElementById('clientName').value.trim();
    const rawNumber = document.getElementById('clientNumber').value.trim();
    const payment = document.getElementById('paymentMethod').value;
    const referrer = document.getElementById('referralCode').value.trim() || "Organic App";

    if (rawNumber.length < 8) {
        alert("Please provide a valid WhatsApp number.");
        return false;
    }

    // Visual loading state
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Initializing...';
    submitBtn.style.opacity = '0.8';
    submitBtn.style.pointerEvents = 'none';

    if(navigator.vibrate) navigator.vibrate([100, 50, 100]);

    const cleanNumber = rawNumber.replace(/\D/g, ''); 
    const sheetNumber = "'" + cleanNumber; 
    const data = regionData[currentRegion];

    // GOOGLE SHEETS POST
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
    } catch (err) { console.log("Silent error handled."); }

    // WHATSAPP BUILDER
    const phone = "256762193386"; 
    let message = `*⚡ NEW APP ACTIVATION [${currentRegion}]*\n\n`;
    message += `*Plan:* ${selectedPlanName}\n`;
    message += `*Price:* ${selectedPlanRawPrice} ${data.currency}\n\n`;
    message += `*Name:* ${name}\n`;
    message += `*WhatsApp:* ${cleanNumber}\n`;
    message += `*Payment:* ${payment}\n`;
    if(referrer !== "Organic App") message += `*Ref:* ${referrer}\n`;
    message += `\n_Client is ready for immediate setup._`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    // Smooth redirect
    setTimeout(() => { window.location.href = url; }, 500);
}