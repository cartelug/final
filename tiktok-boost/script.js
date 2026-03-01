// --- 1. THE EXACT TIER MATRIX ---
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
        // Adjusted to ensure Max is exactly 10,000 while keeping prices relative
        likes: [ 
            {amount: 2500, price: 35}, {amount: 5000, price: 50}, 
            {amount: 7500, price: 75}, {amount: 10000, price: 100} 
        ],
        rules: { min: 35, maxCap: 100 }
    }
};

let state = {
    region: 'UGX',
    services: {
        followers: { active: true, index: 0 },
        likes: { active: false, index: 0, split: 5 }
    }
};

// --- 2. INITIALIZATION ---
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
    document.getElementById('nav-region-badge').innerText = region;
    
    // Reset defaults on region switch
    state.services.followers.active = true;
    state.services.likes.active = false;
    state.services.followers.index = 0;
    state.services.likes.index = 0;
    
    document.getElementById('card-followers').classList.add('active-card');
    document.getElementById('card-likes').classList.remove('active-card');
    
    renderTiers();
    updateCalculations();
}

function resetRegion() {
    localStorage.removeItem('tiktokRegion');
    document.getElementById('region-sheet').classList.add('visible');
}

// --- 3. RENDERING THE HAPTIC PILLS ---
function renderTiers() {
    const data = pricing[state.region];
    
    const formatAmt = (val) => val >= 1000 ? (val/1000) + 'k' : val;
    const formatPrice = (price) => state.region === 'USD' ? `$${price}` : `${price.toLocaleString()} UGX`;

    // Render Followers
    const folContainer = document.getElementById('tiers-followers');
    folContainer.innerHTML = '';
    data.followers.forEach((tier, idx) => {
        let isSelected = state.services.followers.index === idx ? 'selected' : '';
        folContainer.innerHTML += `
            <div class="tier-pill ${isSelected}" onclick="setTier('followers', ${idx})">
                <span>${formatAmt(tier.amount)}</span>
                <small>${formatPrice(tier.price)}</small>
            </div>
        `;
    });

    // Render Likes
    const likesContainer = document.getElementById('tiers-likes');
    likesContainer.innerHTML = '';
    data.likes.forEach((tier, idx) => {
        let isSelected = state.services.likes.index === idx ? 'selected' : '';
        likesContainer.innerHTML += `
            <div class="tier-pill ${isSelected}" onclick="setTier('likes', ${idx})">
                <span>${formatAmt(tier.amount)}</span>
                <small>${formatPrice(tier.price)}</small>
            </div>
        `;
    });
}

// --- 4. INTERACTIONS ---
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

function setTier(service, index) {
    state.services[service].index = index;
    // Force the service active if they tap a pill
    state.services[service].active = true; 
    document.getElementById(`card-${service}`).classList.add('active-card');
    
    renderTiers(); // Re-render to update selected classes
    updateCalculations();
}

function adjustSplit(direction) {
    let current = state.services.likes.split;
    current += direction;
    if (current < 1) current = 1;
    if (current > 10) current = 10;
    
    state.services.likes.split = current;
    document.getElementById('split-val').innerText = current;
    updateCalculations();
}

function toggleReferral() {
    const header = document.querySelector('.ref-trigger');
    const body = document.getElementById('ref-expand');
    const icon = document.getElementById('ref-icon');
    
    header.classList.toggle('active');
    body.classList.toggle('open');
    if(body.classList.contains('open')) {
        icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
    } else {
        icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
    }
}

// --- 5. THE STRICT CALCULATOR ---
function updateCalculations() {
    const regionData = pricing[state.region];
    
    // Get Current Volumes & Prices
    const folTier = regionData.followers[state.services.followers.index];
    const likesTier = regionData.likes[state.services.likes.index];

    // Update Likes Split Math Text
    const perPost = Math.floor(likesTier.amount / state.services.likes.split);
    document.getElementById('likes-per-post-hint').innerHTML = `<i class="fas fa-bolt"></i> Approx. <b>${perPost.toLocaleString()}</b> likes per post`;

    // Calculate Subtotal
    let subtotal = 0;
    let activeCount = 0;

    if (state.services.followers.active) {
        subtotal += folTier.price;
        activeCount++;
    }
    if (state.services.likes.active) {
        subtotal += likesTier.price;
        activeCount++;
    }

    const discountPill = document.getElementById('discount-pill');
    const oldPriceEl = document.getElementById('old-price');
    const finalPriceEl = document.getElementById('final-price');
    const finalCurrEl = document.getElementById('final-curr');

    let finalTotal = subtotal;

    // Apply 10% Combo Discount if both are selected
    if (activeCount === 2 && subtotal > 0) {
        finalTotal = subtotal * 0.90;
        discountPill.style.display = 'block';
        oldPriceEl.innerText = state.region === 'USD' ? `$${subtotal}` : subtotal.toLocaleString();
    } else {
        discountPill.style.display = 'none';
        oldPriceEl.innerText = '';
    }

    // STRICT RULES (Floors and Caps)
    let rules = regionData.rules;
    if (activeCount > 0) {
        if (finalTotal < rules.min) finalTotal = rules.min;
        if (finalTotal > rules.maxCap) finalTotal = rules.maxCap;
    } else {
        finalTotal = 0;
    }

    // Render Final Display
    if (state.region === 'USD') {
        finalPriceEl.innerText = `$${finalTotal}`;
        finalCurrEl.innerText = '';
    } else {
        finalPriceEl.innerText = finalTotal.toLocaleString();
        finalCurrEl.innerText = 'UGX';
    }
}

// --- 6. CHECKOUT ---
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

    const regionData = pricing[state.region];
    const folVol = regionData.followers[state.services.followers.index].amount;
    const likesVol = regionData.likes[state.services.likes.index].amount;

    const ref = document.getElementById('referral-code').value.trim() || "None";
    const finalStr = document.getElementById('final-price').innerText + " " + document.getElementById('final-curr').innerText;

    let msg = `*TIKTOK ELITE VIP [${state.region}]*\n\n`;
    
    if (state.services.followers.active) {
        msg += `🚀 *Followers:* ${folVol.toLocaleString()}\n`;
    }
    if (state.services.likes.active) {
        msg += `❤️ *Likes:* ${likesVol.toLocaleString()} (Across ${state.services.likes.split} posts)\n`;
    }

    if (activeCount === 2) msg += `\n🎁 *10% Bundle Discount Applied*\n`;

    msg += `\n*Total Due:* ${finalStr.trim()}\n`;
    msg += `*Target Profile:* ${targetLink}\n`;
    msg += `*Referrer:* ${ref}`;

    const phone = "256762193386"; 
    window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}