// --- ADVANCED LIVETV ENGINE ---

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

// Prevent scroll until region selected
document.body.style.overflow = 'hidden';

// --- VISUAL EFFECTS ENGINE ---

// 1. Scroll Reveal Observer
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

// 2. 3D Mouse Tracking Tilt
function initTiltEffects() {
    // Only apply on non-touch devices
    if(window.matchMedia("(pointer: fine)").matches) {
        const tiltCards = document.querySelectorAll('.tilt-card');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element
                const y = e.clientY - rect.top;  // y position within the element
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate rotation (max 10 degrees)
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    }
}

// --- CORE LOGIC ---

function setRegion(regionCode) {
    currentRegion = regionCode;
    const data = regionData[regionCode];

    // Inject Prices
    document.getElementById('price-1year').textContent = data.prices["1year"].display;
    document.getElementById('price-6mo').textContent = data.prices["6mo"].display;
    document.getElementById('price-3mo').textContent = data.prices["3mo"].display;
    
    document.querySelectorAll('.currency').forEach(el => el.textContent = data.currency);

    // Populate Payments
    const paymentSelect = document.getElementById('paymentMethod');
    paymentSelect.innerHTML = "";
    data.payments.forEach(method => {
        let opt = document.createElement('option');
        opt.value = method;
        opt.textContent = method;
        paymentSelect.appendChild(opt);
    });

    // Close Gatekeeper smoothly
    const gatekeeper = document.getElementById('region-gatekeeper');
    gatekeeper.style.opacity = '0';
    setTimeout(() => {
        gatekeeper.style.display = 'none';
        document.body.style.overflow = 'auto'; // Unlock scroll
        
        // Start Observers and Effects after load
        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
        initTiltEffects();
    }, 500);
}

function selectPlan(planName, planId) {
    const data = regionData[currentRegion];
    selectedPlanName = planName;
    selectedPlanRawPrice = data.prices[planId].raw;

    const checkout = document.getElementById('checkout-area');
    checkout.classList.add('active');

    // Haptic feedback
    if(navigator.vibrate) navigator.vibrate(50);

    setTimeout(() => {
        checkout.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => document.getElementById('clientName').focus(), 500);
    }, 200);
}

// --- DUAL-PILL REFERRAL LOGIC (Matching Netflix Structure) ---
function switchReferral(isYes) {
    const btnNo = document.getElementById('btn-ref-no');
    const btnYes = document.getElementById('btn-ref-yes');
    const slideBox = document.getElementById('ref-input-slide');
    const inputField = document.getElementById('referralCode');

    if (isYes) {
        btnNo.classList.remove('active');
        btnYes.classList.add('active');
        slideBox.classList.add('open');
        setTimeout(() => inputField.focus(), 300);
    } else {
        btnYes.classList.remove('active');
        btnNo.classList.add('active');
        slideBox.classList.remove('open');
        inputField.value = ""; 
    }
}

// --- SUBMIT TO WHATSAPP & SHEETS ---
async function submitOrder() {
    const name = document.getElementById('clientName').value.trim();
    const rawNumber = document.getElementById('clientNumber').value.trim();
    const payment = document.getElementById('paymentMethod').value;
    const referrer = document.getElementById('referralCode').value.trim() || "Direct"; // Smart defaulting

    if (!name) {
        alert("Commander Name is required for setup.");
        document.getElementById('clientName').focus();
        return false;
    }
    if (rawNumber.length < 8) {
        alert("Please provide a valid WhatsApp number.");
        document.getElementById('clientNumber').focus();
        return false;
    }

    if(navigator.vibrate) navigator.vibrate([100, 50, 100]); // Final confirm haptic

    const cleanNumber = rawNumber.replace(/\D/g, ''); 
    const sheetNumber = "'" + cleanNumber; 
    const data = regionData[currentRegion];

    // 1. SILENT GOOGLE SHEETS POST
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
        console.log("Sheet sync bypassed.");
    }

    // 2. WHATSAPP BUILDER
    const phone = "256762193386"; 
    let message = `*📺 NEW LIVETV DEPLOYMENT [${data.name.toUpperCase()}]*\n\n`;
    message += `*Plan Selected:* ${selectedPlanName}\n`;
    message += `*Authorized Price:* ${selectedPlanRawPrice} ${data.currency}\n\n`;
    
    message += `*Commander Details:*\n`;
    message += `*Name:* ${name}\n`;
    message += `*Comms (WA):* ${cleanNumber}\n`;
    message += `*Payment:* ${payment}\n`;
    message += `*Referrer:* ${referrer}\n\n`;
    
    message += `_Device ready for configuration._`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.location.href = url;
    
    return false;
}