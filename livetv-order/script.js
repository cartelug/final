// --- LIVE TV REGION & PRICING ENGINE ---
const regionData = {
    UG: {
        name: "Uganda",
        currency: "UGX",
        prices: {
            "1year": { new: "180K", rawValue: "180,000" },
            "6mo": { new: "150K", rawValue: "150,000" },
            "3mo": { new: "120K", rawValue: "120,000" }
        },
        payments: ["MTN Mobile Money", "Airtel Money", "Cash in Office (Kampala)"]
    },
    SS: {
        name: "South Sudan",
        currency: "USD",
        prices: {
            "1year": { new: "$70", rawValue: "70" },
            "6mo": { new: "$45", rawValue: "45" },
            "3mo": { new: "$35", rawValue: "35" }
        },
        payments: ["MoMo - wire via agent", "Give cash in South Sudan"]
    },
    CD: {
        name: "DRC Congo",
        currency: "USD",
        prices: {
            "1year": { new: "$70", rawValue: "70" },
            "6mo": { new: "$45", rawValue: "45" },
            "3mo": { new: "$35", rawValue: "35" }
        },
        payments: ["Mobile Money"]
    }
};

let currentRegion = null;
let currentPlanName = null;
let currentPlanDuration = null; 
let unlockedGifts = 0;

document.body.style.overflow = 'hidden';

// --- INITIALIZE SETUP ---
function setRegion(regionCode) {
    currentRegion = regionCode;
    const data = regionData[regionCode];

    const plans = document.querySelectorAll('.plan-card');
    
    // 1 Year
    plans[0].setAttribute('onclick', `selectPlan(this, '1 Year Access', '1year')`);
    plans[0].querySelector('.new-price').textContent = data.prices["1year"].new;
    plans[0].querySelector('.currency').textContent = data.currency;

    // 6 Months
    plans[1].setAttribute('onclick', `selectPlan(this, '6 Months Access', '6mo')`);
    plans[1].querySelector('.new-price').textContent = data.prices["6mo"].new;
    plans[1].querySelector('.currency').textContent = data.currency;

    // 3 Months
    plans[2].setAttribute('onclick', `selectPlan(this, '3 Months Access', '3mo')`);
    plans[2].querySelector('.new-price').textContent = data.prices["3mo"].new;
    plans[2].querySelector('.currency').textContent = data.currency;

    // Populate Payments
    const paymentSelect = document.getElementById('paymentMethod');
    paymentSelect.innerHTML = "";
    data.payments.forEach(method => {
        let opt = document.createElement('option');
        opt.value = method;
        opt.textContent = method;
        paymentSelect.appendChild(opt);
    });

    // Placeholders
    const phoneLabel = document.getElementById('phone-label');
    if (phoneLabel) {
        if (regionCode === 'UG') phoneLabel.textContent = "WhatsApp Number (e.g. +256 700 000 000)";
        else if (regionCode === 'SS') phoneLabel.textContent = "WhatsApp Number (e.g. +211 000 000 000)";
        else if (regionCode === 'CD') phoneLabel.textContent = "WhatsApp Number (e.g. +243 000 000 000)";
    }

    // Gatekeeper Fade
    const gatekeeper = document.getElementById('region-gatekeeper');
    gatekeeper.style.opacity = '0';
    gatekeeper.style.pointerEvents = 'none';
    setTimeout(() => {
        gatekeeper.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Start Counter Animations when entering
        animateValue("stat-channels", 0, 21000, 2000);
        animateValue("stat-vod", 0, 180000, 2500);
    }, 500);
}

// --- VISUAL EFFECTS ---

// 1. Stat Counters (requestAnimationFrame)
function animateValue(id, start, end, duration) {
    if (start === end) return;
    let obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Ease Out Quart
        const easeProgress = 1 - Math.pow(1 - progress, 4); 
        obj.innerHTML = Math.floor(easeProgress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end.toLocaleString();
        }
    };
    window.requestAnimationFrame(step);
}

// 2. Shockwave Ripple on Hover
document.querySelectorAll('.plan-card').forEach(card => {
    // Create ripple element
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    card.appendChild(ripple);

    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.width = '300px';
        ripple.style.height = '300px';
        ripple.style.opacity = '1';
    });

    card.addEventListener('mouseleave', () => {
        ripple.style.width = '0px';
        ripple.style.height = '0px';
        ripple.style.opacity = '0';
    });
});

// 3. Red Flash & Flip on Plan Select
function selectPlan(cardElement, planName, planId) {
    // Flash Bang
    const flash = document.createElement('div');
    flash.className = 'flash-bang active';
    document.body.appendChild(flash);
    setTimeout(() => flash.classList.remove('active'), 50);
    setTimeout(() => flash.remove(), 200);

    // Standard Logic
    document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');

    currentPlanName = planName;
    currentPlanDuration = planName.replace(" Access", ""); 
    
    const data = regionData[currentRegion];
    const rawPrice = data.prices[planId].rawValue;

    const sumEl = document.getElementById('sum-total');
    sumEl.textContent = `${rawPrice} ${data.currency}`;
    
    // Trigger Airport Flip
    triggerFlip(sumEl);

    document.getElementById('prime-duration').textContent = `${currentPlanDuration} Free`;

    const btn = document.getElementById('btn-step-1');
    btn.classList.remove('disabled');

    setTimeout(() => {
        btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 350);
}

function triggerFlip(element) {
    element.classList.remove('flip-anim');
    void element.offsetWidth; // Trigger reflow
    element.classList.add('flip-anim');
}

// --- WIZARD LOGIC ---
function unlockBonus(id) {
    const el = document.getElementById('bonus-' + id);
    if(el.classList.contains('unlocked')) return;

    el.classList.remove('locked');
    el.classList.add('unlocked');
    el.querySelector('.status').textContent = "CLAIMED";
    
    // Double pulse Haptic
    if(navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
    
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

async function validateAndSend() {
    const name = document.getElementById('clientName').value.trim();
    const rawNumber = document.getElementById('clientNumber').value.trim();
    const payment = document.getElementById('paymentMethod').value;
    const referrer = document.getElementById('referralCode')?.value.trim() || "Direct";

    if (!name || rawNumber.length < 8) {
        alert("Please provide Commander Name and a valid WhatsApp Number.");
        return false;
    }

    // Vibrate on submit
    if(navigator.vibrate) navigator.vibrate(80);

    const cleanNumber = rawNumber.replace(/\D/g, ''); 
    const sheetNumber = "'" + cleanNumber; 
    const data = regionData[currentRegion];
    
    let rawPrice = "0";
    if (currentPlanName.includes("1 Year")) rawPrice = data.prices["1year"].rawValue;
    else if (currentPlanName.includes("6 Months")) rawPrice = data.prices["6mo"].rawValue;
    else if (currentPlanName.includes("3 Months")) rawPrice = data.prices["3mo"].rawValue;

    // GOOGLE SHEETS POST
    const formData = new URLSearchParams();
    formData.append('ClientName', name);
    formData.append('Number', sheetNumber);
    formData.append('Service', 'LiveTV IPTV');
    formData.append('Package', currentPlanName);
    formData.append('Price', rawPrice.replace(/,/g, '')); 
    formData.append('Referrer', referrer);

    try {
        fetch("https://script.google.com/macros/s/AKfycbzsER7toUR8OwPWPic7Oqbbjz-ew2pR_HJ4Um3V9o6eVmlf730ibwF7ELv6GCekmgl2aA/exec", { 
            method: 'POST', body: formData, mode: 'no-cors' 
        });
    } catch (e) { console.log("Sheets sync failed, proceeding to WhatsApp."); }

    // WHATSAPP REDIRECT
    const phone = "256762193386"; 
    let message = `*🔥 NEW LIVETV ORDER [${data.name.toUpperCase()}]*\n\n`;
    message += `*Service:* AccessUG LiveTV\n`;
    message += `*Package:* ${currentPlanName}\n`;
    message += `*Price:* ${rawPrice} ${data.currency}\n`;
    message += `*Referrer:* ${referrer}\n\n`;
    message += `*Name:* ${name}\n`;
    message += `*WhatsApp:* ${cleanNumber}\n`;
    message += `*Payment Method:* ${payment}\n\n`;
    message += `_Ready for deployment instructions._`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.location.href = url;
    return false;
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
        setTimeout(() => inputField.focus(), 150);
    } else {
        btnYes.classList.remove('active');
        btnNo.classList.add('active');
        slideBox.classList.remove('open');
        inputField.value = ""; 
    }
}

// --- CANVAS PARTICLES (STADIUM DUST) ---
const canvas = document.getElementById('stadium-dust');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * -0.5 - 0.2;
        this.color = Math.random() > 0.8 ? 'rgba(0, 212, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)';
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
    }
}

function initParticles() {
    particlesArray = [];
    let numParticles = window.innerWidth < 768 ? 50 : 100;
    for (let i = 0; i < numParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

initParticles();
animateParticles();