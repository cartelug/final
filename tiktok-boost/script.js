// --- 1. THE EXACT PRICING NODES (Caps & Snaps) ---
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
        rules: { min: 50000, maxCap: 360000 }
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
        rules: { min: 35, maxCap: 100 }
    }
};

let state = {
    region: 'UGX',
    services: {
        followers: { active: true, index: 0, volume: 0, price: 0 },
        likes: { active: false, index: 0, volume: 0, price: 0, split: 5 }
    }
};

// --- 2. INITIALIZATION & OVERLAY ---
window.onload = () => {
    let savedRegion = localStorage.getItem('tiktokRegion');
    if (savedRegion) {
        selectRegion(savedRegion, false);
    } else {
        document.getElementById('region-sheet').classList.add('visible');
    }
};

function selectRegion(region, save = true) {
    if(save) localStorage.setItem('tiktokRegion', region);
    state.region = region;
    
    document.getElementById('region-sheet').classList.remove('visible');
    document.getElementById('current-region-badge').innerText = region;
    
    setupSliders();
    
    // Default: Followers ON, Likes OFF
    document.getElementById('card-followers').classList.add('active-card');
    document.getElementById('card-likes').classList.remove('active-card');
    state.services.followers.active = true;
    state.services.likes.active = false;
    
    updateCalculations();
}

function resetRegion() {
    localStorage.removeItem('tiktokRegion');
    document.getElementById('region-sheet').classList.add('visible');
}

function setupSliders() {
    const data = pricing[state.region];
    document.getElementById('slider-followers').max = data.followers.length - 1;
    document.getElementById('slider-followers').value = 0;
    
    document.getElementById('slider-likes').max = data.likes.length - 1;
    document.getElementById('slider-likes').value = 0;
}

// --- 3. UI INTERACTIONS ---
function toggleService(service) {
    const card = document.getElementById(`card-${service}`);
    state.services[service].active = !state.services[service].active;
    
    if (state.services[service].active) {
        card.classList.add('active-card');
    } else {
        card.classList.remove('active-card');
    }
    updateCalculations();
}

function toggleReferral() {
    const header = document.querySelector('.ref-header');
    const body = document.getElementById('ref-body');
    const icon = document.getElementById('ref-icon');
    
    header.classList.toggle('active');
    body.classList.toggle('open');
    if(body.classList.contains('open')) {
        icon.classList.replace('fa-plus', 'fa-minus');
    } else {
        icon.classList.replace('fa-minus', 'fa-plus');
    }
}

// --- 4. THE SMART CALCULATOR ENGINE ---
function updateCalculations() {
    let regionData = pricing[state.region];
    
    // 1. Get Slider Values
    state.services.followers.index = parseInt(document.getElementById('slider-followers').value);
    state.services.likes.index = parseInt(document.getElementById('slider-likes').value);
    state.services.likes.split = parseInt(document.getElementById('slider-split-likes').value);

    // 2. Map to actual Volume and Price
    state.services.followers.volume = regionData.followers[state.services.followers.index].amount;
    state.services.followers.price = regionData.followers[state.services.followers.index].price;
    
    state.services.likes.volume = regionData.likes[state.services.likes.index].amount;
    state.services.likes.price = regionData.likes[state.services.likes.index].price;

    // 3. Update Text Displays
    document.getElementById('val-followers').innerText = state.services.followers.volume.toLocaleString();
    document.getElementById('val-likes').innerText = state.services.likes.volume.toLocaleString();
    
    document.getElementById('split-likes').innerText = state.services.likes.split;
    document.getElementById('likes-per-post').innerText = Math.floor(state.services.likes.volume / state.services.likes.split).toLocaleString();

    // 4. Calculate Subtotal & Discounts
    let subtotal = 0;
    let activeCount = 0;

    if (state.services.followers.active) {
        subtotal += state.services.followers.price;
        activeCount++;
    }
    if (state.services.likes.active) {
        subtotal += state.services.likes.price;
        activeCount++;
    }

    const discountBadge = document.getElementById('discount-badge');
    const oldPriceEl = document.getElementById('old-price');
    const finalPriceEl = document.getElementById('final-price');
    const finalCurrEl = document.getElementById('final-curr');

    let finalTotal = subtotal;

    // Apply 10% Combo Discount if both are selected
    if (activeCount === 2 && subtotal > 0) {
        finalTotal = subtotal * 0.90;
        discountBadge.style.display = 'block';
        oldPriceEl.innerText = state.region === 'USD' ? `$${subtotal}` : subtotal.toLocaleString();
    } else {
        discountBadge.style.display = 'none';
        oldPriceEl.innerText = '';
    }

    // 5. ENFORCE STRICT LIMITS (Min Floor & Max Cap)
    let rules = regionData.rules;
    if (activeCount > 0) {
        if (finalTotal < rules.min) finalTotal = rules.min;
        if (finalTotal > rules.maxCap) finalTotal = rules.maxCap;
    } else {
        finalTotal = 0;
    }

    // 6. Update Final Display
    if (state.region === 'USD') {
        finalPriceEl.innerText = `$${finalTotal}`;
        finalCurrEl.innerText = '';
    } else {
        finalPriceEl.innerText = finalTotal.toLocaleString();
        finalCurrEl.innerText = 'UGX';
    }
}

// --- 5. CHECKOUT TO WHATSAPP ---
function deployOrder() {
    let activeCount = Object.keys(state.services).filter(k => state.services[k].active).length;
    if (activeCount === 0) {
        alert("Please select Followers or Likes to continue."); return;
    }

    const targetLink = document.getElementById('target-link').value.trim();
    if (!targetLink) {
        alert("Please enter the target username."); 
        document.getElementById('target-link').focus(); return;
    }

    const ref = document.getElementById('referral-code').value.trim() || "None";
    const finalStr = document.getElementById('final-price').innerText + " " + document.getElementById('final-curr').innerText;

    let msg = `*TIKTOK ELITE ORDER [${state.region}]*\n\n`;
    
    if (state.services.followers.active) msg += `🚀 *Followers:* ${state.services.followers.volume.toLocaleString()}\n`;
    if (state.services.likes.active) msg += `❤️ *Likes:* ${state.services.likes.volume.toLocaleString()} (Across ${state.services.likes.split} posts)\n`;

    if (activeCount === 2) msg += `\n🎁 *10% Bundle Discount Applied*\n`;

    msg += `\n*Total Due:* ${finalStr.trim()}\n`;
    msg += `*Target Profile:* ${targetLink}\n`;
    msg += `*Referrer:* ${ref}`;

    const phone = "256762193386"; 
    window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}