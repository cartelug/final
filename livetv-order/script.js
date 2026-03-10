// --- LIVE TV BENTO ENGINE ---

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
        payments: ["Mobile Money Agent", "Give cash in South Sudan"]
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

// Lock scrolling on load
document.body.style.overflow = 'hidden';

// --- STEP 1: REGION SELECT ---
function setRegion(regionCode) {
    currentRegion = regionCode;
    const data = regionData[regionCode];

    // Inject Prices
    document.getElementById('price-1year').textContent = data.prices["1year"].display;
    document.getElementById('price-6mo').textContent = data.prices["6mo"].display;
    document.getElementById('price-3mo').textContent = data.prices["3mo"].display;
    
    // Inject Currencies
    document.querySelectorAll('.currency').forEach(el => {
        el.textContent = data.currency;
    });

    // Populate Payment Dropdown
    const paymentSelect = document.getElementById('paymentMethod');
    paymentSelect.innerHTML = "";
    data.payments.forEach(method => {
        let opt = document.createElement('option');
        opt.value = method;
        opt.textContent = method;
        paymentSelect.appendChild(opt);
    });

    // Close Gatekeeper
    const gatekeeper = document.getElementById('region-gatekeeper');
    gatekeeper.style.opacity = '0';
    setTimeout(() => {
        gatekeeper.style.display = 'none';
        document.body.style.overflow = 'auto'; // Unlock scroll
    }, 400);
}

// --- STEP 2: PLAN SELECT ---
function selectPlan(planName, planId) {
    const data = regionData[currentRegion];
    selectedPlanName = planName;
    selectedPlanRawPrice = data.prices[planId].raw;

    // Activate the Checkout Section
    const checkout = document.getElementById('checkout-area');
    checkout.classList.add('active');

    // Smooth scroll down to the form
    setTimeout(() => {
        checkout.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Focus the name input automatically for ease of use
        document.getElementById('clientName').focus();
    }, 200);
}

// --- STEP 3: SUBMIT TO WHATSAPP & SHEETS ---
async function submitOrder() {
    const name = document.getElementById('clientName').value.trim();
    const rawNumber = document.getElementById('clientNumber').value.trim();
    const payment = document.getElementById('paymentMethod').value;
    const referrer = document.getElementById('referralCode').value.trim() || "None";

    // Friendly Validation
    if (!name) {
        alert("Please let us know your name so we can assist you properly.");
        document.getElementById('clientName').focus();
        return false;
    }
    if (rawNumber.length < 8) {
        alert("Please provide a valid WhatsApp number so our tech team can reach you.");
        document.getElementById('clientNumber').focus();
        return false;
    }

    // Format number for Sheets
    const cleanNumber = rawNumber.replace(/\D/g, ''); 
    const sheetNumber = "'" + cleanNumber; 
    const data = regionData[currentRegion];

    // --- 1. GOOGLE SHEETS POST (Silent background sync) ---
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
    } catch (e) {
        console.log("Sheet sync failed, continuing to WA.");
    }

    // --- 2. WHATSAPP REDIRECT ---
    const phone = "256762193386"; 
    let message = `*📺 NEW LIVETV SETUP [${data.name.toUpperCase()}]*\n\n`;
    message += `*Plan:* ${selectedPlanName}\n`;
    message += `*Price:* ${selectedPlanRawPrice} ${data.currency}\n\n`;
    
    message += `*Client Details:*\n`;
    message += `*Name:* ${name}\n`;
    message += `*WhatsApp:* ${cleanNumber}\n`;
    message += `*Payment:* ${payment}\n`;
    
    if(referrer !== "None") {
        message += `*Referrer:* ${referrer}\n`;
    }
    
    message += `\n_I am ready for the team to set up my device._`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.location.href = url;
    
    return false;
}