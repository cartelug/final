// --- REGION & PRICING ENGINE FOR LIVETV ---
const regionData = {
    UG: {
        name: "Uganda",
        currency: "UGX",
        prices: {
            "1year": { val: "180,000", rawValue: "180,000" },
            "6mo": { val: "150,000", rawValue: "150,000" },
            "3mo": { val: "120,000", rawValue: "120,000" }
        },
        payments: ["MTN Mobile Money", "Airtel Money"],
        phonePlaceholder: "e.g. +256 700 000 000"
    },
    SS: {
        name: "South Sudan",
        currency: "USD",
        prices: {
            "1year": { val: "$70", rawValue: "70" },
            "6mo": { val: "$45", rawValue: "45" },
            "3mo": { val: "$35", rawValue: "35" }
        },
        payments: ["MoMo - wire via agent", "Give cash in South Sudan"],
        phonePlaceholder: "e.g. +211 000 000 000"
    },
    CD: {
        name: "DRC Congo",
        currency: "USD",
        prices: {
            "1year": { val: "$70", rawValue: "70" },
            "6mo": { val: "$45", rawValue: "45" },
            "3mo": { val: "$35", rawValue: "35" }
        },
        payments: ["Mobile Money"],
        phonePlaceholder: "e.g. +243 000 000 000"
    }
};

let currentRegion = null;
let currentPlanName = null;
let currentPlanDuration = null; 
let unlockedGifts = 0;

document.body.style.overflow = 'hidden';

// --- STADIUM LIGHTS PARTICLE SYSTEM ---
const canvas = document.getElementById('stadiumLights');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = Math.random() * -1 - 0.2; // Float slowly upwards
        this.color = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 212, 255, 0.3)';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y < 0) {
            this.y = canvas.height;
            this.x = Math.random() * canvas.width;
        }
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        // Add glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
    }
}

for (let i = 0; i < 50; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// --- STAT COUNTERS ANIMATION ---
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Ease out expo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(easeProgress * (end - start) + start);
        obj.innerHTML = current.toLocaleString() + (end > 20000 ? "+" : "");
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// --- INITIALIZE REGION ---
function setRegion(regionCode) {
    currentRegion = regionCode;
    const data = regionData[regionCode];

    // Trigger Stat Counters on Region Select
    animateValue(document.getElementById("stat-channels"), 0, 21000, 2500);
    animateValue(document.getElementById("stat-vod"), 0, 180000, 3000);

    // Setup Plans
    const plans = document.querySelectorAll('.plan-card');
    
    // 1 Year
    plans[0].setAttribute('onclick', `selectPlan(this, '1 Year Ultimate', '1year')`);
    plans[0].querySelector('.new-price').textContent = data.prices["1year"].val;
    plans[0].querySelector('.currency').textContent = data.currency;

    // 6 Months
    plans[1].setAttribute('onclick', `selectPlan(this, '6 Months Pro', '6mo')`);
    plans[1].querySelector('.new-price').textContent = data.prices["6mo"].val;
    plans[1].querySelector('.currency').textContent = data.currency;

    // 3 Months
    plans[2].setAttribute('onclick', `selectPlan(this, '3 Months Basic', '3mo')`);
    plans[2].querySelector('.new-price').textContent = data.prices["3mo"].val;
    plans[2].querySelector('.currency').textContent = data.currency;

    // Populate Payment Methods
    const paymentSelect = document.getElementById('paymentMethod');
    paymentSelect.innerHTML = "";
    data.payments.forEach(method => {
        let opt = document.createElement('option');
        opt.value = method;
        opt.textContent = method;
        paymentSelect.appendChild(opt);
    });

    // Dynamic Labels & Placeholders
    document.getElementById('phone-label').textContent = `WhatsApp Number (${data.name})`;

    const gatekeeper = document.getElementById('region-gatekeeper');
    gatekeeper.style.opacity = '0';
    gatekeeper.style.pointerEvents = 'none';
    setTimeout(() => {
        gatekeeper.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 500);
}

// --- CARD HOVER & CLICK LOGIC ---
document.querySelectorAll('.plan-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--y', `${e.clientY - rect.top}px`);
    });
});

function selectPlan(cardElement, planName, planId) {
    // Red Flash Effect
    const flash = document.getElementById('red-flash');
    flash.classList.add('active');
    setTimeout(() => flash.classList.remove('active'), 150);

    // Shockwave Ripple
    cardElement.classList.remove('ripple-active');
    void cardElement.offsetWidth; // Trigger reflow
    cardElement.classList.add('ripple-active');

    document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');

    currentPlanName = planName;
    const data = regionData[currentRegion];
    const rawPrice = data.prices[planId].rawValue;

    // Flip animation on price
    const priceSpan = cardElement.querySelector('.new-price');
    priceSpan.animate([
        { transform: 'rotateX(0deg)', opacity: 1 },
        { transform: 'rotateX(90deg)', opacity: 0, offset: 0.5 },
        { transform: 'rotateX(0deg)', opacity: 1 }
    ], { duration: 300, easing: 'ease-in-out' });

    // Staggered departure board effect (simulate)
    setTimeout(() => {
        document.getElementById('sum-total').textContent = `${data.prices[planId].val} ${data.currency}`;
    }, 150);

    const btn = document.getElementById('btn-step-1');
    btn.classList.remove('disabled');

    setTimeout(() => {
        btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);
}

// --- GIFTS & HAPTICS ---
function tryVibrate(pattern) {
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch(e) {}
}

function unlockBonus(id) {
    const el = document.getElementById('bonus-' + id);
    if(el.classList.contains('unlocked')) return;

    el.classList.remove('locked');
    el.classList.add('unlocked');
    el.classList.add('shimmer'); // Trigger gold sweep
    el.querySelector('.status').textContent = "CLAIMED";
    
    tryVibrate([50, 50, 50]); // Double pulse haptic
    
    unlockedGifts++;
    if(unlockedGifts >= 2) {
        document.getElementById('btn-step-2').classList.remove('disabled');
    }
}

// --- NAVIGATION ---
function goToStep(stepNumber) {
    document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active-step'));
    document.getElementById('step-' + stepNumber).classList.add('active-step');
    
    // Update SVG progress track
    document.querySelectorAll('.step').forEach(s => {
        const stepIdx = parseInt(s.dataset.step);
        s.classList.toggle('active', stepIdx <= stepNumber);
        if(stepIdx < stepNumber) s.classList.add('completed');
    });

    document.querySelector('.wizard-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- FORM & CHECKOUT ---
function switchReferral(isYes) {
    const btnNo = document.getElementById('btn-ref-no');
    const btnYes = document.getElementById('btn-ref-yes');
    const slideBox = document.getElementById('ref-input-slide');
    const inputField = document.getElementById('referralCode');

    if (isYes) {
        btnNo.classList.remove('active');
        btnYes.classList.add('active');
        slideBox.classList.add('open');
        setTimeout(() => inputField.focus(), 150);
    } else {
        btnYes.classList.remove('active');
        btnNo.classList.add('active');
        slideBox.classList.remove('open');
        inputField.value = ""; 
    }
}

async function validateAndSend() {
    tryVibrate(80); // Strong submit haptic

    const name = document.getElementById('clientName').value.trim();
    const rawNumber = document.getElementById('clientNumber').value.trim();
    const payment = document.getElementById('paymentMethod').value;
    const referrer = document.getElementById('referralCode')?.value.trim() || "Direct";

    if (!name) { alert("Please enter your Full Name."); document.getElementById('clientName').focus(); return false; }
    if (rawNumber.length < 8) { alert("Please enter a valid WhatsApp Number."); document.getElementById('clientNumber').focus(); return false; }

    const cleanNumber = rawNumber.replace(/\D/g, ''); 
    const sheetNumber = "'" + cleanNumber; 
    const data = regionData[currentRegion];
    
    let rawPrice = "0";
    if (currentPlanName.includes("1 Year")) rawPrice = data.prices["1year"].rawValue;
    else if (currentPlanName.includes("6 Months")) rawPrice = data.prices["6mo"].rawValue;
    else if (currentPlanName.includes("3 Months")) rawPrice = data.prices["3mo"].rawValue;

    const formData = new URLSearchParams();
    formData.append('ClientName', name);
    formData.append('Number', sheetNumber);
    formData.append('Service', 'AccessUG LiveTV (IPTV)');
    formData.append('Package', currentPlanName);
    formData.append('Price', rawPrice.replace(/,/g, '')); 
    formData.append('Referrer', referrer);

    try {
        fetch("https://script.google.com/macros/s/AKfycbzsER7toUR8OwPWPic7Oqbbjz-ew2pR_HJ4Um3V9o6eVmlf730ibwF7ELv6GCekmgl2aA/exec", { 
            method: 'POST', body: formData, mode: 'no-cors' 
        });
    } catch (e) { console.log("Sheets sync failed, proceeding to WhatsApp."); }

    const phone = "256762193386"; 
    
    let message = `*🚨 NEW LIVETV ORDER [${data.name.toUpperCase()}] 🚨*\n\n`;
    message += `*Service:* AccessUG LiveTV (The DSTV Killer)\n`;
    message += `*Package:* ${currentPlanName}\n`;
    message += `*Price:* ${rawPrice} ${data.currency}\n`;
    message += `*Referrer:* ${referrer}\n\n`;
    message += `*Name:* ${name}\n`;
    message += `*WhatsApp:* ${cleanNumber}\n`;
    message += `*Payment:* ${payment}\n\n`;
    message += `_Ready for setup. I will not pay until connection is confirmed._`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.location.href = url;
    return false;
}