// --- REGION & PRICING ENGINE ---
const regionData = {
    UG: {
        name: "Uganda",
        currency: "UGX",
        prices: {
            "1year": { old: "500K", new: "250K", rawValue: "250,000" },
            "9mo": { old: "400K", new: "200K", rawValue: "200,000" },
            "6mo": { old: "300K", new: "150K", rawValue: "150,000" }
        },
        payments: ["MTN Mobile Money", "Airtel Money", "Cash in Office (Kampala)"]
    },
    SS: {
        name: "South Sudan",
        currency: "USD",
        prices: {
            "1year": { old: "$180", new: "$100", rawValue: "100" },
            "9mo": { old: "$140", new: "$80", rawValue: "80" },
            "6mo": { old: "$90", new: "$50", rawValue: "50" }
        },
        payments: ["MoMo - wire via agent", "Give cash in South Sudan"]
    },
    CD: {
        name: "DRC Congo",
        currency: "USD",
        prices: {
            "1year": { old: "$180", new: "$100", rawValue: "100" },
            "9mo": { old: "$140", new: "$80", rawValue: "80" },
            "6mo": { old: "$90", new: "$50", rawValue: "50" }
        },
        payments: ["Mobile Money"]
    }
};

let currentRegion = null;
let currentPlanName = null;
let currentPlanDuration = null; 
let unlockedGifts = 0;

// Prevent scrolling while gatekeeper is open
document.body.style.overflow = 'hidden';

// --- INITIALIZE REGION ---
function setRegion(regionCode) {
    currentRegion = regionCode;
    const data = regionData[regionCode];

    // 1. Inject Prices into the DOM dynamically
    const plans = document.querySelectorAll('.plan-card');
    
    // Ultimate Value (1 Year)
    plans[0].setAttribute('onclick', `selectPlan(this, '1 Year', '1year')`);
    plans[0].querySelector('.old-price').textContent = data.prices["1year"].old;
    plans[0].querySelector('.new-price').textContent = data.prices["1year"].new;
    plans[0].querySelector('.currency').textContent = data.currency;

    // Best Seller (9 Months)
    plans[1].setAttribute('onclick', `selectPlan(this, '9 Months', '9mo')`);
    plans[1].querySelector('.old-price').textContent = data.prices["9mo"].old;
    plans[1].querySelector('.new-price').textContent = data.prices["9mo"].new;
    plans[1].querySelector('.currency').textContent = data.currency;

    // Starter (6 Months)
    plans[2].setAttribute('onclick', `selectPlan(this, '6 Months', '6mo')`);
    plans[2].querySelector('.old-price').textContent = data.prices["6mo"].old;
    plans[2].querySelector('.new-price').textContent = data.prices["6mo"].new;
    plans[2].querySelector('.currency').textContent = data.currency;

    // 2. Populate Payment Methods
    const paymentSelect = document.getElementById('paymentMethod');
    paymentSelect.innerHTML = "";
    data.payments.forEach(method => {
        let opt = document.createElement('option');
        opt.value = method;
        opt.textContent = method;
        paymentSelect.appendChild(opt);
    });

    // 3. Clear Gatekeeper with smooth fade
    const gatekeeper = document.getElementById('region-gatekeeper');
    gatekeeper.style.opacity = '0';
    gatekeeper.style.pointerEvents = 'none';
    setTimeout(() => {
        gatekeeper.style.display = 'none';
        document.body.style.overflow = 'auto'; // Allow scrolling again
    }, 500);
}

// --- WIZARD LOGIC ---
function selectPlan(cardElement, planName, planId) {
    // 1. Visual selection
    document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');

    // 2. Store data
    currentPlanName = planName;
    currentPlanDuration = planName; 
    
    const data = regionData[currentRegion];
    const rawPrice = data.prices[planId].rawValue;

    // 3. Update Summary
    document.getElementById('sum-total').textContent = `${rawPrice} ${data.currency}`;

    // 4. Update the Netflix Gift text dynamically!
    document.querySelector('#bonus-1 p').textContent = `${currentPlanDuration} Free`;

    // 5. Enable button text
    const btn = document.getElementById('btn-step-1');
    btn.classList.remove('disabled');
    btn.innerHTML = `Continue <i class="fas fa-arrow-right"></i>`;

    // 6. Smooth scroll
    setTimeout(() => {
        btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 350);
}

function unlockBonus(id) {
    const el = document.getElementById('bonus-' + id);
    if(el.classList.contains('unlocked')) return;

    el.classList.remove('locked');
    el.classList.add('unlocked');
    el.querySelector('.status').textContent = "CLAIMED";
    
    unlockedGifts++;

    if(unlockedGifts >= 2) {
        document.getElementById('btn-step-2').classList.remove('disabled');
    }
}

function goToStep(stepNumber) {
    document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active-step'));
    document.getElementById('step-' + stepNumber).classList.add('active-step');
    
    document.querySelectorAll('.step').forEach(s => {
        s.classList.toggle('active', parseInt(s.dataset.step) <= stepNumber);
    });

    document.querySelector('.wizard-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function validateAndSend() {
    const name = document.getElementById('clientName').value.trim();
    const payment = document.getElementById('paymentMethod').value;

    if (!name) {
        alert("Please enter your Full Name.");
        document.getElementById('clientName').focus();
        return false;
    }

    const data = regionData[currentRegion];
    
    let rawPrice = "0";
    if (currentPlanName.includes("1 Year")) rawPrice = data.prices["1year"].rawValue;
    else if (currentPlanName.includes("9 Months")) rawPrice = data.prices["9mo"].rawValue;
    else if (currentPlanName.includes("6 Months")) rawPrice = data.prices["6mo"].rawValue;

    const phone = "256762193386"; 
    
    let message = `*NEW ORDER [${data.name.toUpperCase()}]*\n\n`;
    message += `*Service:* Prime Video Premium\n`;
    message += `*Package:* ${currentPlanName}\n`;
    message += `*Bonuses:* Netflix (${currentPlanDuration}), Spotify (1 Mo)\n`;
    message += `*Price:* ${rawPrice} ${data.currency}\n`;
    message += `*Name:* ${name}\n`;
    message += `*Payment Method:* ${payment}`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.location.href = url;
    return false;
}