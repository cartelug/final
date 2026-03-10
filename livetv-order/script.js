/* ============================================================
   ACCESSUG LIVETV ORDER — script.js v1.0
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const REGION_DATA = {
    UG: {
        name: 'Uganda',
        currency: 'UGX',
        phone: '+256 700 000 000',
        prices: {
            '1year': { old: '400K', new: '180K', raw: '180,000' },
            '6mo':   { old: '250K', new: '150K', raw: '150,000' },
            '3mo':   { old: '180K', new: '120K', raw: '120,000' }
        },
        payments: ['MTN Mobile Money', 'Airtel Money', 'Cash in Office (Kampala)']
    },
    SS: {
        name: 'South Sudan',
        currency: 'USD',
        phone: '+211 000 000 000',
        prices: {
            '1year': { old: '$140', new: '$70', raw: '70' },
            '6mo':   { old: '$80',  new: '$45', raw: '45' },
            '3mo':   { old: '$60',  new: '$35', raw: '35' }
        },
        payments: ['MoMo - wire via agent', 'Cash in South Sudan']
    },
    CD: {
        name: 'DRC Congo',
        currency: 'USD',
        phone: '+243 000 000 000',
        prices: {
            '1year': { old: '$140', new: '$70', raw: '70' },
            '6mo':   { old: '$80',  new: '$45', raw: '45' },
            '3mo':   { old: '$60',  new: '$35', raw: '35' }
        },
        payments: ['Mobile Money']
    }
};

const FEATURES = [
    {
        icon: '🌍',
        glow: 'glow-blue',
        title: '21,000+ WORLDWIDE CHANNELS',
        desc: 'Entertainment, Sports, News, Kids — <strong>everything, everywhere, always.</strong> More channels than you\'ll ever need, in one place.'
    },
    {
        icon: '⚽',
        glow: 'glow-blue',
        title: 'EVERY SPORT THAT MATTERS',
        desc: '<strong>UEFA Champions League, Premier League, NBA, NFL</strong> — plus Catch-Up & EPG so you never miss a single kickoff. Ever.'
    },
    {
        icon: '🥊',
        glow: 'glow-red',
        title: 'PPV EVENTS — ALWAYS INCLUDED',
        desc: '<strong>Boxing, UFC, WWE</strong> — Pay-Per-View events are fully included. No extra charge. No extra app. It\'s all in, always.'
    },
    {
        icon: '🎬',
        glow: 'glow-blue',
        title: '180,000+ MOVIES & SERIES',
        desc: 'Blu-ray and Remux quality. Updated daily. <strong>Bigger and better than Netflix.</strong> Watch anything, on any device, anytime.'
    },
    {
        icon: '⚡',
        glow: 'glow-gold',
        title: 'ULTRA-STABLE. ZERO BUFFERING.',
        desc: 'Eagle IPTV\'s premium server infrastructure. <strong>Smooth on mobile data. Smooth on Wi-Fi.</strong> No freezing. No loading. Always live.'
    },
    {
        icon: '📱',
        glow: 'glow-blue',
        title: 'EVERY DEVICE YOU OWN',
        desc: '<strong>Smart TV, Android Box, iPhone, Firestick, MAG, PC</strong> — if it has a screen, we make it work. All devices, all setups.'
    },
    {
        icon: '✅',
        glow: 'glow-green',
        title: '100% FAMILY FRIENDLY',
        desc: 'No adult content. <strong>Safe for your home, your children, your TV.</strong> Clean and trusted content only. Always appropriate.'
    },
    {
        icon: '🛠️',
        glow: 'glow-red',
        title: 'WE SET IT UP FOR YOU.',
        desc: 'You don\'t download anything. You don\'t configure anything. You don\'t touch a single setting. <strong>Our team sets up everything on your device via WhatsApp — before you pay a single shilling. You just sit back and watch.</strong>',
        special: true
    }
];

const PLANS = [
    {
        id: '1year',
        label: '1 Year Access',
        tag: 'ULTIMATE VALUE',
        tagClass: 'tag-vip',
        pro: true,
        badges: ['📺 21K+ Channels', '🏆 Live Sports', '📱 All Devices', '🎬 VOD Library', '🔄 24/7 Support']
    },
    {
        id: '6mo',
        label: '6 Months Access',
        tag: 'BEST SELLER',
        tagClass: 'tag-gold',
        pro: false,
        badges: ['📺 21K+ Channels', '🏆 Live Sports', '📱 All Devices', '🎬 VOD Library']
    },
    {
        id: '3mo',
        label: '3 Months Access',
        tag: 'STARTER',
        tagClass: 'tag-grey',
        pro: false,
        badges: ['📺 21K+ Channels', '🏆 Live Sports', '📱 All Devices']
    }
];

/* ─────────────────────────────────────────
   STATE
───────────────────────────────────────── */
let currentRegion  = null;
let currentFeature = 0;
let currentPlanId  = null;
let currentPlanLabel = null;
let giftsUnlocked  = 0;
let currentStep    = 1;

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
document.body.style.overflow = 'hidden';

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    buildStoryBars();
    buildFeatureCards();
    buildPlanCards();
    initSwipe();
});

/* ─────────────────────────────────────────
   PARTICLES
───────────────────────────────────────── */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 28 : 60;

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];

    class Particle {
        constructor(init) {
            this.reset(init);
        }
        reset(init) {
            this.x       = Math.random() * canvas.width;
            this.y       = init ? Math.random() * canvas.height : canvas.height + 10;
            this.radius  = Math.random() * 2 + 0.4;
            this.speed   = Math.random() * 0.38 + 0.12;
            this.alpha   = Math.random() * 0.45 + 0.08;
            this.alphaDir= 0.004;
            this.color   = Math.random() > 0.55 ? '#00D4FF' : '#ffffff';
            this.blurred = this.radius > 1.8;
        }
        update() {
            this.y    -= this.speed;
            this.alpha += this.alphaDir;
            if (this.alpha > 0.55 || this.alpha < 0.06) this.alphaDir *= -1;
            if (this.y < -8) this.reset(false);
        }
        draw() {
            ctx.save();
            if (this.blurred) ctx.filter = 'blur(2px)';
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle   = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Particle(true));

    (function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    })();
}

/* ─────────────────────────────────────────
   STAT COUNTER ANIMATIONS
───────────────────────────────────────── */
function runCounters() {
    document.querySelectorAll('.stat-num').forEach(el => {
        const target   = parseInt(el.dataset.target, 10);
        const suffix   = el.dataset.suffix || '';
        const duration = 1700;
        const t0       = performance.now();

        (function tick(now) {
            const pct   = Math.min((now - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - pct, 3);
            el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
            if (pct < 1) requestAnimationFrame(tick);
        })(performance.now());
    });

    // Typewriter: ZERO
    const zeroEl = document.getElementById('stat-zero');
    if (zeroEl) {
        const word = 'ZERO';
        zeroEl.textContent = '';
        let i = 0;
        const type = () => {
            if (i < word.length) { zeroEl.textContent += word[i++]; setTimeout(type, 110); }
        };
        setTimeout(type, 300);
    }
}

/* ─────────────────────────────────────────
   REGION / GATEKEEPER
───────────────────────────────────────── */
function setRegion(code) {
    currentRegion = code;
    const rd = REGION_DATA[code];

    // Populate payment methods
    const sel = document.getElementById('paymentMethod');
    if (sel) {
        sel.innerHTML = rd.payments.map(p => `<option>${p}</option>`).join('');
    }

    // Phone label hint
    const lbl = document.getElementById('phone-label');
    if (lbl) lbl.textContent = `WhatsApp (e.g. ${rd.phone})`;

    // Inject prices into plan cards with flip animation
    PLANS.forEach((plan, idx) => {
        const card = document.getElementById('pc-' + plan.id);
        if (!card) return;
        const pd = rd.prices[plan.id];
        const delay = idx * 100;
        flipText(card.querySelector('.plan-old-price'), pd.old, delay);
        flipText(card.querySelector('.plan-new-price'), pd.new, delay + 60);
        flipText(card.querySelector('.plan-currency'), rd.currency, delay + 120);
    });

    // Close gatekeeper
    const gate = document.getElementById('gatekeeper');
    gate.style.opacity = '0';
    gate.style.pointerEvents = 'none';
    setTimeout(() => {
        gate.style.display = 'none';
        document.body.style.overflow = '';
        runCounters();
    }, 480);
}

/* ─────────────────────────────────────────
   FLIP ANIMATION (airport board)
───────────────────────────────────────── */
function flipText(el, newVal, delay) {
    if (!el) return;
    setTimeout(() => {
        el.animate(
            [{ transform: 'rotateX(0)', opacity: 1 },
             { transform: 'rotateX(90deg)', opacity: 0 }],
            { duration: 140 }
        ).onfinish = () => {
            el.textContent = newVal;
            el.animate(
                [{ transform: 'rotateX(-90deg)', opacity: 0 },
                 { transform: 'rotateX(0)', opacity: 1 }],
                { duration: 140 }
            );
        };
    }, delay);
}

/* ─────────────────────────────────────────
   FEATURE TOUR
───────────────────────────────────────── */
function buildStoryBars() {
    const wrap = document.getElementById('story-bars');
    if (!wrap) return;
    FEATURES.forEach((_, i) => {
        const bar  = document.createElement('div');
        bar.className = 'story-bar' + (i === 0 ? ' bar-active' : '');
        bar.id = 'sbar-' + i;
        bar.innerHTML = '<div class="story-fill"></div>';
        wrap.appendChild(bar);
    });
}

function buildFeatureCards() {
    const stage = document.getElementById('feature-stage');
    if (!stage) return;

    FEATURES.forEach((f, i) => {
        const card = document.createElement('div');
        card.className = 'feature-card-item' + (f.special ? ' fc-special' : '') + (i === 0 ? ' fc-active' : '');
        card.id = 'fcard-' + i;
        card.innerHTML = `
            <div class="fc-icon-wrap ${f.glow}">${f.icon}</div>
            <div class="fc-title">${f.title}</div>
            <p class="fc-desc">${f.desc}</p>
        `;
        stage.appendChild(card);
    });
    refreshFeatureUI();
}

function refreshFeatureUI() {
    const current = document.getElementById('fc-current');
    if (current) current.textContent = currentFeature + 1;

    // Prev button
    const prevBtn = document.getElementById('fnav-prev');
    if (prevBtn) prevBtn.disabled = (currentFeature === 0);

    // Next button label
    const nextBtn = document.getElementById('fnav-next');
    const nextLbl = document.getElementById('fnav-label');
    if (nextLbl) {
        if (currentFeature === FEATURES.length - 1) {
            nextLbl.textContent = 'See Plans & Pricing';
            nextBtn && nextBtn.classList.add('fnav-final');
        } else {
            nextLbl.textContent = 'Next';
            nextBtn && nextBtn.classList.remove('fnav-final');
        }
    }

    // Story bars
    FEATURES.forEach((_, i) => {
        const bar = document.getElementById('sbar-' + i);
        if (!bar) return;
        bar.classList.remove('bar-done', 'bar-active');
        if (i < currentFeature)  bar.classList.add('bar-done');
        if (i === currentFeature) bar.classList.add('bar-active');
    });
}

function showFeature(idx, dir) {
    const outCard = document.getElementById('fcard-' + currentFeature);
    const inCard  = document.getElementById('fcard-' + idx);
    if (!outCard || !inCard) return;

    // Exit current
    outCard.classList.remove('fc-active');
    outCard.classList.add(dir === 'forward' ? 'fc-exit-left' : 'fc-exit-right');
    setTimeout(() => outCard.classList.remove('fc-exit-left', 'fc-exit-right'), 300);

    // Enter new
    inCard.classList.add(dir === 'forward' ? 'fc-enter-right' : 'fc-enter-left');
    // Force reflow
    void inCard.offsetWidth;
    inCard.classList.remove('fc-enter-right', 'fc-enter-left');
    inCard.classList.add('fc-active');

    currentFeature = idx;
    refreshFeatureUI();
}

function nextFeature() {
    if (currentFeature < FEATURES.length - 1) {
        showFeature(currentFeature + 1, 'forward');
    } else {
        goStep(2);
    }
}

function prevFeature() {
    if (currentFeature > 0) {
        showFeature(currentFeature - 1, 'backward');
    }
}

/* ─────────────────────────────────────────
   SWIPE SUPPORT (feature stage)
───────────────────────────────────────── */
function initSwipe() {
    const stage = document.getElementById('feature-stage');
    if (!stage) return;
    let sx = 0;

    stage.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => {
        const dx = sx - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 45) {
            if (dx > 0) nextFeature();
            else prevFeature();
        }
    }, { passive: true });
}

/* ─────────────────────────────────────────
   HERO CTA → SCROLL
───────────────────────────────────────── */
function scrollToJourney() {
    const journey = document.getElementById('journey');
    if (journey) {
        journey.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/* ─────────────────────────────────────────
   JOURNEY STEP NAVIGATION
───────────────────────────────────────── */
function goStep(step) {
    // Deactivate current
    const currentStepEl = document.getElementById('jstep-' + currentStep);
    if (currentStepEl) currentStepEl.classList.remove('active-step');

    // Update progress bar
    document.querySelectorAll('.jp-item').forEach(item => {
        const n = parseInt(item.dataset.step, 10);
        item.classList.remove('active', 'done');
        if (n < step)  item.classList.add('done');
        if (n === step) item.classList.add('active');
    });

    // Update connectors
    document.querySelectorAll('.jp-connector').forEach((line, i) => {
        if (i < step - 1) line.classList.add('done');
        else              line.classList.remove('done');
    });

    // Activate new step
    const newStepEl = document.getElementById('jstep-' + step);
    if (newStepEl) newStepEl.classList.add('active-step');

    currentStep = step;

    // Scroll card into view
    const card = document.getElementById('journey-card');
    if (card) {
        setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    }
}

/* ─────────────────────────────────────────
   PLAN CARDS
───────────────────────────────────────── */
function buildPlanCards() {
    const stack = document.getElementById('plan-stack');
    if (!stack) return;

    PLANS.forEach(plan => {
        const card = document.createElement('div');
        card.className = 'plan-card-lv';
        card.id = 'pc-' + plan.id;
        card.setAttribute('onclick', `selectPlan(this, '${plan.label}', '${plan.id}')`);

        const proHTML    = plan.pro ? ' <span class="badge-pro">PRO</span>' : '';
        const badgesHTML = plan.badges.map(b => `<span class="p-badge">${b}</span>`).join('');

        card.innerHTML = `
            <div class="plan-tag-badge ${plan.tagClass}">${plan.tag}</div>
            <div class="plan-main-row">
                <div class="plan-label">${plan.label}${proHTML}</div>
                <div class="plan-price-col">
                    <span class="plan-old-price">—</span>
                    <span class="plan-new-price">—</span>
                    <span class="plan-currency">—</span>
                </div>
            </div>
            <div class="plan-badges-row">${badgesHTML}</div>
        `;

        // Shockwave ripple
        card.addEventListener('mousemove', e => {
            const rect   = card.getBoundingClientRect();
            const ripple = document.createElement('div');
            const size   = 90;
            ripple.className = 'ripple-wave';
            ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px;`;
            card.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });

        stack.appendChild(card);
    });
}

function selectPlan(el, label, id) {
    // Deselect all
    document.querySelectorAll('.plan-card-lv').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');

    currentPlanId    = id;
    currentPlanLabel = label;

    // Update summary
    if (currentRegion) {
        const rd = REGION_DATA[currentRegion];
        const pd = rd.prices[id];
        const sumPkg = document.getElementById('sum-pkg');
        const sumTot = document.getElementById('sum-total');
        if (sumPkg) sumPkg.textContent = label;
        if (sumTot) sumTot.textContent = pd.raw + ' ' + rd.currency;
    }

    // Update gift 1 duration label
    const g1dur = document.getElementById('gift-1-dur');
    if (g1dur) g1dur.textContent = label + ' Free';

    // Enable continue button
    const btn = document.getElementById('btn-plan');
    if (btn) btn.classList.remove('disabled');

    // Effects
    stadiumFlash();
    if (navigator.vibrate) navigator.vibrate(55);

    // Scroll to button
    setTimeout(() => {
        if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 320);
}

/* ─────────────────────────────────────────
   STADIUM FLASH
───────────────────────────────────────── */
function stadiumFlash() {
    const flash = document.getElementById('stadium-flash');
    if (!flash) return;
    flash.style.opacity = '1';
    flash.animate(
        [{ opacity: 0.9 }, { opacity: 0 }],
        { duration: 340, easing: 'ease-out' }
    ).onfinish = () => { flash.style.opacity = '0'; };
}

/* ─────────────────────────────────────────
   GIFT UNLOCK
───────────────────────────────────────── */
function unlockGift(id) {
    const el = document.getElementById('gift-' + id);
    if (!el || el.classList.contains('unlocked')) return;

    el.classList.remove('locked');
    el.classList.add('unlocked', 'do-shimmer');
    const statusEl = el.querySelector('.gift-cta');
    if (statusEl) statusEl.textContent = '✓ CLAIMED';

    setTimeout(() => el.classList.remove('do-shimmer'), 700);

    giftsUnlocked++;
    if (navigator.vibrate) navigator.vibrate([28, 18, 28]);

    if (giftsUnlocked >= 2) {
        const btn = document.getElementById('btn-gifts');
        if (btn) btn.classList.remove('disabled');
    }
}

/* ─────────────────────────────────────────
   REFERRAL TOGGLE
───────────────────────────────────────── */
function switchRef(isYes) {
    const btnNo  = document.getElementById('ref-no');
    const btnYes = document.getElementById('ref-yes');
    const slide  = document.getElementById('ref-slide');
    const input  = document.getElementById('referralCode');

    if (isYes) {
        if (btnNo)  btnNo.classList.remove('active');
        if (btnYes) btnYes.classList.add('active');
        if (slide)  slide.classList.add('open');
        if (input)  setTimeout(() => input.focus(), 160);
    } else {
        if (btnYes) btnYes.classList.remove('active');
        if (btnNo)  btnNo.classList.add('active');
        if (slide)  slide.classList.remove('open');
        if (input)  input.value = '';
    }
}

/* ─────────────────────────────────────────
   VALIDATE & SEND (WhatsApp + Sheets)
───────────────────────────────────────── */
function validateAndSend() {
    const nameEl   = document.getElementById('clientName');
    const phoneEl  = document.getElementById('clientPhone');
    const deviceEl = document.getElementById('deviceType');
    const payEl    = document.getElementById('paymentMethod');
    const refEl    = document.getElementById('referralCode');

    const name    = nameEl  ? nameEl.value.trim()  : '';
    const rawNum  = phoneEl ? phoneEl.value.trim()  : '';
    const device  = deviceEl ? deviceEl.value : '—';
    const payment = payEl   ? payEl.value    : '—';
    const referrer = (refEl && refEl.value.trim()) ? refEl.value.trim() : 'Direct';

    if (!name) {
        alert('Please enter your full name.');
        if (nameEl) nameEl.focus();
        return;
    }
    if (rawNum.length < 8) {
        alert('Please enter a valid WhatsApp number.');
        if (phoneEl) phoneEl.focus();
        return;
    }
    if (!currentPlanId) {
        alert('Please select a plan first.');
        goStep(2);
        return;
    }

    const rd  = REGION_DATA[currentRegion];
    const pd  = rd.prices[currentPlanId];
    const cleanNum  = rawNum.replace(/\D/g, '');
    const sheetNum  = "'" + cleanNum;
    const priceRaw  = pd.raw.replace(/,/g, '');

    // Google Sheets integration
    const form = new URLSearchParams();
    form.append('ClientName', name);
    form.append('Number',     sheetNum);
    form.append('Service',    'AccessUG LiveTV');
    form.append('Package',    currentPlanLabel);
    form.append('Price',      priceRaw);
    form.append('Device',     device);
    form.append('Region',     rd.name);
    form.append('Referrer',   referrer);

    fetch(
        'https://script.google.com/macros/s/AKfycbzsER7toUR8OwPWPic7Oqbbjz-ew2pR_HJ4Um3V9o6eVmlf730ibwF7ELv6GCekmgl2aA/exec',
        { method: 'POST', body: form, mode: 'no-cors' }
    ).catch(() => {});

    // Build WhatsApp message
    let msg = `*🔴 NEW ORDER — ACCESSUG LIVETV*\n\n`;
    msg += `*Service:* AccessUG LiveTV\n`;
    msg += `*Package:* ${currentPlanLabel}\n`;
    msg += `*Price:* ${pd.raw} ${rd.currency}\n`;
    msg += `*Region:* ${rd.name}\n`;
    msg += `*Device:* ${device}\n`;
    msg += `*Payment:* ${payment}\n`;
    msg += `*Referrer:* ${referrer}\n\n`;
    msg += `*Client Name:* ${name}\n`;
    msg += `*WhatsApp:* +${cleanNum}`;

    if (navigator.vibrate) navigator.vibrate(80);

    window.location.href = `https://wa.me/256762193386?text=${encodeURIComponent(msg)}`;
}