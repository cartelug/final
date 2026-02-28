// --- 1. RATES & CONFIGURATION ---
// Base Rates configured to hit your 75k target when Followers + Likes are combined.
const rates = {
    'UGX': { followers: 60, likes: 100, views: 2, symbol: 'UGX' },
    'SSP': { followers: 16, likes: 25, views: 0.5, symbol: 'SSP' },
    'USD': { followers: 0.015, likes: 0.025, views: 0.0005, symbol: '$' }
};

const BUNDLE_DISCOUNT = 0.12; // 12% off if 2 or more services selected

// State Management
let state = {
    region: 'UGX',
    services: {
        followers: { active: true, volume: 1000 },
        likes: { active: true, volume: 250, split: 5 },
        views: { active: false, volume: 10000, split: 1 }
    }
};

window.onload = () => {
    // Initial Render
    document.getElementById('mod-followers').classList.add('active-mod');
    document.getElementById('mod-likes').classList.add('active-mod');
    updateMath();
};

// --- 2. INTERACTION CONTROLS ---
function setRegion(region) {
    state.region = region;
    document.querySelectorAll('.r-pill').forEach(b => b.classList.remove('active'));
    document.getElementById(`reg-${region}`).classList.add('active');
    updateMath();
}

function toggleService(service) {
    const mod = document.getElementById(`mod-${service}`);
    state.services[service].active = !state.services[service].active;
    
    if (state.services[service].active) {
        mod.classList.add('active-mod');
    } else {
        mod.classList.remove('active-mod');
    }
    updateMath();
}

function toggleReferralUI() {
    const trigger = document.querySelector('.ref-trigger');
    const content = document.getElementById('ref-content');
    trigger.classList.toggle('open');
    content.classList.toggle('open');
}

// --- 3. THE SMART MATH ENGINE ---
function updateMath() {
    // 1. Grab values from sliders
    state.services.followers.volume = parseInt(document.getElementById('slider-followers').value);
    
    state.services.likes.volume = parseInt(document.getElementById('slider-likes').value);
    state.services.likes.split = parseInt(document.getElementById('slider-split-likes').value);
    
    state.services.views.volume = parseInt(document.getElementById('slider-views').value);
    state.services.views.split = parseInt(document.getElementById('slider-split-views').value);

    // 2. Update UI Texts
    document.getElementById('val-followers').innerText = state.services.followers.volume.toLocaleString();
    
    document.getElementById('val-likes').innerText = state.services.likes.volume.toLocaleString();
    document.getElementById('split-likes').innerText = state.services.likes.split;
    document.getElementById('hint-likes').innerHTML = `<i class="fas fa-magic"></i> That's ${Math.floor(state.services.likes.volume / state.services.likes.split).toLocaleString()} likes per video.`;
    
    document.getElementById('val-views').innerText = state.services.views.volume.toLocaleString();
    document.getElementById('split-views').innerText = state.services.views.split;
    document.getElementById('hint-views').innerHTML = `<i class="fas fa-magic"></i> That's ${Math.floor(state.services.views.volume / state.services.views.split).toLocaleString()} views per video.`;

    // 3. Calculate Prices
    const rate = rates[state.region];
    let subtotal = 0;
    let activeCount = 0;
    
    const quoteBox = document.getElementById('quote-items');
    quoteBox.innerHTML = ''; // Clear old

    // Build Receipt Items
    Object.keys(state.services).forEach(key => {
        if (state.services[key].active) {
            activeCount++;
            let itemPrice = state.services[key].volume * rate[key];
            subtotal += itemPrice;

            // Format item price display
            let displayPrice = state.region === 'USD' ? `$${itemPrice.toFixed(2)}` : `${Math.floor(itemPrice).toLocaleString()}`;

            quoteBox.innerHTML += `
                <div class="q-item">
                    <span class="qi-name">${state.services[key].volume.toLocaleString()} ${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <span class="qi-price">${displayPrice}</span>
                </div>
            `;
        }
    });

    if (activeCount === 0) {
        quoteBox.innerHTML = `<div class="q-item" style="color: #94a3b8; justify-content:center;">Select a service to begin</div>`;
    }

    // 4. Apply Combo Discount logic
    const discountEl = document.getElementById('quote-discount');
    const oldPriceEl = document.getElementById('old-price');
    const finalPriceEl = document.getElementById('final-price');
    const finalCurrEl = document.getElementById('final-curr');

    let finalTotal = subtotal;

    if (activeCount >= 2 && subtotal > 0) {
        let discountAmt = subtotal * BUNDLE_DISCOUNT;
        finalTotal = subtotal - discountAmt;
        
        discountEl.style.display = 'flex';
        
        if (state.region === 'USD') {
            document.getElementById('discount-amount').innerText = `-$${discountAmt.toFixed(2)}`;
            oldPriceEl.innerText = `$${subtotal.toFixed(2)}`;
        } else {
            document.getElementById('discount-amount').innerText = `-${Math.floor(discountAmt).toLocaleString()} ${rate.symbol}`;
            oldPriceEl.innerText = `${Math.floor(subtotal).toLocaleString()}`;
        }
    } else {
        discountEl.style.display = 'none';
        oldPriceEl.innerText = '';
    }

    // 5. Final Output
    if (state.region === 'USD') {
        finalPriceEl.innerText = `$${finalTotal.toFixed(2)}`;
        finalCurrEl.innerText = '';
    } else {
        finalPriceEl.innerText = Math.floor(finalTotal).toLocaleString();
        finalCurrEl.innerText = rate.symbol;
    }
}

// --- 4. CHECKOUT ---
function deployOrder() {
    let activeCount = Object.keys(state.services).filter(k => state.services[k].active).length;
    if (activeCount === 0) {
        alert("Please toggle on at least one service."); return;
    }

    const targetLink = document.getElementById('target-link').value.trim();
    if (!targetLink) {
        alert("Please enter the target username or video link."); 
        document.getElementById('target-link').focus(); return;
    }

    const ref = document.getElementById('referral-code').value.trim() || "None";
    const finalStr = document.getElementById('final-price').innerText + " " + document.getElementById('final-curr').innerText;

    let msg = `*NEW BUILDER CAMPAIGN [${state.region}]*\n\n`;
    
    if (state.services.followers.active) msg += `🚀 *Followers:* ${state.services.followers.volume.toLocaleString()}\n`;
    if (state.services.likes.active) msg += `❤️ *Likes:* ${state.services.likes.volume.toLocaleString()} (Split: ${state.services.likes.split})\n`;
    if (state.services.views.active) msg += `👁️ *Views:* ${state.services.views.volume.toLocaleString()} (Split: ${state.services.views.split})\n`;

    if (activeCount >= 2) msg += `\n🎁 *Bundle Discount Applied*\n`;

    msg += `\n*Total:* ${finalStr.trim()}\n`;
    msg += `*Target:* ${targetLink}\n`;
    msg += `*Referrer:* ${ref}`;

    const phone = "256762193386"; 
    window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}