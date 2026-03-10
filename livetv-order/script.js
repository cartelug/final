// --- LIVE TV REGION & PRICING ENGINE ---
const regionData = {
    UG: {
        name: "Uganda",
        currency: "UGX",
        prices: {
            "1year": { display: "180,000", raw: "180000" },
            "6mo": { display: "150,000", raw: "150000" },
            "3mo": { display: "120,000", raw: "120000" }
        },
        payments: ["MTN Mobile Money", "Airtel Money", "Cash in Office (Kampala)"]
    },
    SS: {
        name: "South Sudan",
        currency: "USD",
        prices: {
            "1year": { display: "$70", raw: "70" },
            "6mo": { display: "$45", raw: "45" },
            "3mo": { display: "$35", raw: "35" }
        },
        payments: ["MoMo - wire via agent", "Give cash in South Sudan"]
    },
    CD: {
        name: "DRC Congo",
        currency: "USD",
        prices: {
            "1year": { display: "$70", raw: "70" },
            "6mo": { display: "$45", raw: "45" },
            "3mo": { display: "$35", raw: "35" }
        },
        payments: ["Mobile Money"]
    }
};

let currentRegion = null;
let selectedPlanName = null;
let selectedPlanRawPrice = null;

// --- NAVIGATION LOGIC ---
function goToStep(step) {
    const track = document.getElementById('slider-track');
    const percentage = (step - 1) * -33.333;
    track.style.transform = `translateX(${percentage}%)`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack(step) {
    goToStep(step);
}

// --- STEP 1: SET REGION ---
function setRegion(regionCode) {
    currentRegion = regionCode;
    const data = regionData[regionCode];

    // Inject Prices into DOM
    document.getElementById('price-1year').textContent = data.prices["1year"].display;
    document.getElementById('price-6mo').textContent = data.prices["6mo"].display;
    document.getElementById('price-3mo').textContent = data.prices["3mo"].display;
    
    // Inject Currencies
    document.querySelectorAll('.currency').forEach(el => {
        el.textContent = data.currency;
    });

    // Populate Payment Methods
    const paymentSelect = document.getElementById('paymentMethod');
    paymentSelect.innerHTML = "";
    data.payments.forEach(method => {
        let opt = document.createElement('option');
        opt.value = method;
        opt.textContent = method;
        paymentSelect.appendChild(opt);
    });

    // Adjust Phone Placeholder
    const phoneLabel = document.getElementById('phone-label');
    if (regionCode === 'UG') phoneLabel.textContent = "WhatsApp Number (e.g. +256...)";
    else if (regionCode === 'SS') phoneLabel.textContent = "WhatsApp Number (e.g. +211...)";
    else if (regionCode === 'CD') phoneLabel.textContent = "WhatsApp Number (e.g. +243...)";

    // Uncheck any previously selected plans if user goes back and changes region
    document.querySelectorAll('input[name="plan"]').forEach(radio => radio.checked = false);
    document.getElementById('btn-next-2').disabled = true;

    // Slide to Step 2
    goToStep(2);
}

// --- STEP 2: SELECT PLAN ---
function selectPlan(planName, planId) {
    const data = regionData[currentRegion];
    selectedPlanName = planName;
    selectedPlanRawPrice = data.prices[planId].raw;

    // Enable the Continue button
    document.getElementById('btn-next-2').disabled = false;

    // Update Summary on Step 3
    document.getElementById('summary-plan-name').textContent = planName;
    document.getElementById('summary-total').textContent = `${data.prices[planId].display} ${data.currency}`;
}

// --- REFERRAL TOGGLE ---
function toggleReferral() {
    const checkbox = document.getElementById('ref-checkbox');
    const container = document.getElementById('ref-container');
    const input = document.getElementById('referralCode');

    if (checkbox.checked) {
        container.classList.add('open');
        setTimeout(() => input.focus(), 300);
    } else {
        container.classList.remove('open');
        input.value = "";
    }
}

// --- FINAL SUBMISSION ---
async function processOrder() {
    const name = document.getElementById('clientName').value.trim();
    const rawNumber = document.getElementById('clientNumber').value.trim();
    const payment = document.getElementById('paymentMethod').value;
    const referrer = document.getElementById('referralCode')?.value.trim() || "None";

    // Simple Validation
    if (!name) {
        alert("Please enter your Full Name so we know who we are connecting.");
        document.getElementById('clientName').focus();
        return false;
    }
    if (rawNumber.length < 8) {
        alert("Please enter a valid WhatsApp Number.");
        document.getElementById('clientNumber').focus();
        return false;
    }

    const cleanNumber = rawNumber.replace(/\D/g, ''); 
    const sheetNumber = "'" + cleanNumber; 
    const data = regionData[currentRegion];

    // --- GOOGLE SHEETS POST ---
    const formData = new URLSearchParams();
    formData.append('ClientName', name);
    formData.append('Number', sheetNumber);
    formData.append('Service', 'LiveTV IPTV');
    formData.append('Package', selectedPlanName);
    formData.append('Price', selectedPlanRawPrice); 
    formData.append('Referrer', referrer);

    try {
        // Fire and forget, don't block WhatsApp redirect
        fetch("https://script.google.com/macros/s/AKfycbzsER7toUR8OwPWPic7Oqbbjz-ew2pR_HJ4Um3V9o6eVmlf730ibwF7ELv6GCekmgl2aA/exec", { 
            method: 'POST', body: formData, mode: 'no-cors' 
        });
    } catch (e) {
        console.log("Sheet sync failed, continuing to WA.");
    }

    // --- WHATSAPP REDIRECT ---
    const phone = "256762193386"; 
    let message = `*✨ NEW LIVETV SETUP [${data.name.toUpperCase()}]*\n\n`;
    message += `*Plan:* ${selectedPlanName}\n`;
    message += `*Price:* ${selectedPlanRawPrice} ${data.currency}\n`;
    message += `*Name:* ${name}\n`;
    message += `*WhatsApp:* ${cleanNumber}\n`;
    message += `*Payment:* ${payment}\n`;
    if(referrer !== "None") {
        message += `*Referrer:* ${referrer}\n`;
    }
    message += `\n_I am ready for my device to be connected._`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.location.href = url;
    return false;
}