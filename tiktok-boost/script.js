// --- 1. THE EXACT PRICING MATRIX (Snapping Nodes) ---
const pricing = {
    'UGX': {
        followers: [ 
            {amount: 1000, price: 75000}, {amount: 4000, price: 141000}, 
            {amount: 7000, price: 208000}, {amount: 10000, price: 250000} 
        ],
        likes: [ 
            {amount: 1000, price: 50000}, {amount: 4000, price: 83000}, 
            {amount: 7000, price: 116000}, {amount: 10000, price: 150000} 
        ],
        views: [ 
            {amount: 5000, price: 35000}, {amount: 20000, price: 80000}, 
            {amount: 50000, price: 130000}, {amount: 100000, price: 180000}, 
            {amount: 250000, price: 230000}, {amount: 500000, price: 300000}, 
            {amount: 1000000, price: 370000} 
        ],
        rules: { minViewsOnly: 35000, minOther: 50000, maxCap: 360000 }
    },
    'USD': {
        followers: [ 
            {amount: 3000, price: 35}, {amount: 5000, price: 50}, 
            {amount: 8000, price: 75}, {amount: 10000, price: 100} 
        ],
        likes: [ 
            {amount: 7000, price: 35}, {amount: 10000, price: 50}, 
            {amount: 15000, price: 75}, {amount: 20000, price: 100} 
        ],
        views: [ 
            {amount: 50000, price: 20}, {amount: 100000, price: 40}, 
            {amount: 250000, price: 70}, {amount: 500000, price: 100} 
        ],
        rules: { minViewsOnly: 20, minOther: 35, maxCap: 100 }
    }
};

let state = {
    region: 'UGX',
    services: {
        followers: { active: true, index: 0, volume: 0, price: 0, split: 1 },
        likes: { active: true, index: 0, volume: 0, price: 0, split: 5 },
        views: { active: false, index: 0, volume: 0, price: 0, split: 1 }
    }
};

// --- 2. INITIALIZATION & OVERLAY ---
window.onload = () => {
    let savedRegion = localStorage.getItem('tiktokRegion');
    if (savedRegion) {
        selectRegion(savedRegion, false);
    } else {
        document.getElementById('region-overlay').classList.add('visible');
    }
};

function selectRegion(region, save = true) {
    if(save) localStorage.setItem('tiktokRegion', region);
    state.region = region;
    document.getElementById('region-overlay').classList.remove('visible');
    
    // Set up the exact index range sliders depending on the mapped arrays
    setupSliders();
    
    // Ensure initial active states match UI
    document.getElementById('mod-followers').classList.add('active-mod');
    document.getElementById('mod-likes').classList.add('active-mod');
    document.getElementById('mod-views').classList.remove('active-mod');
    
    updateMath();
}

function resetRegion() {
    localStorage.removeItem('tiktokRegion');
    document.getElementById('region-overlay').classList.add('visible');
}

function setupSliders() {
    const data = pricing[state.region];
    document.getElementById('slider-followers').max = data.followers.length - 1;
    document.getElementById('slider-followers').value = 0;
    
    document.getElementById('slider-likes').max = data.likes.length - 1;
    document.getElementById('slider-likes').value = 0;
    
    document.getElementById('slider-views').max = data.views.length - 1;
    document.getElementById('slider-views').value = 0;
}

// --- 3. INTERACTION CONTROLS ---
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

// Helper to format currency correctly
const formatPrice = (amount) => {
    return state.region === 'USD' ? `$${amount}` : `${amount.toLocaleString()}`;
};

// --- 4. THE SMART MATH ENGINE ---
function updateMath() {
    let regionData = pricing[state.region];
    
    // 1. Grab indices from sliders
    state.services.followers.index = parseInt(document.getElementById('slider-followers').value);
    state.services.likes.index = parseInt(document.getElementById('slider-likes').value);
    state.services.likes.split = parseInt(document.getElementById('slider-split-likes').value);
    state.services.views.index = parseInt(document.getElementById('slider-views').value);
    state.services.views.split = parseInt(document.getElementById('slider-split-views').value);

    // 2. Map indices to actual volume and price
    state.services.followers.volume = regionData.followers[state.services.followers.index].amount;
    state.services.followers.price = regionData.followers[state.services.followers.index].price;
    
    state.services.likes.volume = regionData.likes[state.services.likes.index].amount;
    state.services.likes.price = regionData.likes[state.services.likes.index].price;
    
    state.services.views.volume = regionData.views[state.services.views.index].amount;
    state.services.views.price = regionData.views[state.services.views.index].price;

    // 3. Update UI Texts for Volume/Split
    document.getElementById('val-followers').innerText = state.services.followers.volume.toLocaleString();
    
    document.getElementById('val-likes').innerText = state.services.likes.volume.toLocaleString();
    document.getElementById('split-likes').innerText = state.services.likes.split;
    document.getElementById('hint-likes').innerHTML = `<i class="fas fa-magic"></i> That's ${Math.floor(state.services.likes.volume / state.services.likes.split).toLocaleString()} likes per video.`;
    
    document.getElementById('val-views').innerText = state.services.views.volume.toLocaleString();
    document.getElementById('split-views').innerText = state.services.views.split;
    document.getElementById('hint-views').innerHTML = `<i class="fas fa-magic"></i> That's ${Math.floor(state.services.views.volume / state.services.views.split).toLocaleString()} views per video.`;

    // 4. Calculate Prices & Discounts
    let subtotal = 0;
    let activeCount = 0;
    let viewsOnly = true;
    
    const quoteBox = document.getElementById('quote-items');
    quoteBox.innerHTML = ''; 

    Object.keys(state.services).forEach(key => {
        if (state.services[key].active) {
            activeCount++;
            subtotal += state.services[key].price;
            if (key !== 'views') viewsOnly = false;

            quoteBox.innerHTML += `
                <div class="q-item">
                    <span class="qi-name">${state.services[key].volume.toLocaleString()} ${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <span class="qi-price">${formatPrice(state.services[key].price)}</span>
                </div>
            `;
        }
    });

    if (activeCount === 0) {
        quoteBox.innerHTML = `<div class="q-item" style="color: #94a3b8; justify-content:center;">Select a service to begin</div>`;
    }

    // Discount Application
    const discountEl = document.getElementById('quote-discount');
    const oldPriceEl = document.getElementById('old-price');
    const finalPriceEl = document.getElementById('final-price');
    const finalCurrEl = document.getElementById('final-curr');
    const discountLabel = document.getElementById('discount-label');

    let finalTotal = subtotal;

    if (activeCount >= 2 && subtotal > 0) {
        let discountPct = activeCount === 3 ? 0.20 : 0.10;
        let discountAmt = subtotal * discountPct;
        finalTotal = subtotal - discountAmt;
        
        discountEl.style.display = 'flex';
        discountLabel.innerHTML = `<i class="fas fa-tag"></i> ${discountPct * 100}% Combo Discount`;
        document.getElementById('discount-amount').innerText = `-${formatPrice(discountAmt)}`;
        oldPriceEl.innerText = formatPrice(subtotal);
    } else {
        discountEl.style.display = 'none';
        oldPriceEl.innerText = '';
    }

    // 5. Hard Min / Max Overrides Rule
    let rules = regionData.rules;
    if (activeCount > 0) {
        if (viewsOnly && finalTotal < rules.minViewsOnly) finalTotal = rules.minViewsOnly;
        else if (!viewsOnly && finalTotal < rules.minOther) finalTotal = rules.minOther;
        
        if (finalTotal > rules.maxCap) finalTotal = rules.maxCap;
    } else {
        finalTotal = 0;
    }

    // 6. Final Outputs
    if (state.region === 'USD') {
        finalPriceEl.innerText = `$${finalTotal}`;
        finalCurrEl.innerText = '';
    } else {
        finalPriceEl.innerText = finalTotal.toLocaleString();
        finalCurrEl.innerText = 'UGX';
    }
}

// --- 5. CHECKOUT ---
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

    if (activeCount >= 2) msg += `\n🎁 *${activeCount===3 ? '20' : '10'}% Bundle Discount Applied*\n`;

    msg += `\n*Total:* ${finalStr.trim()}\n`;
    msg += `*Target:* ${targetLink}\n`;
    msg += `*Referrer:* ${ref}`;

    const phone = "256762193386"; 
    window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}