// --- 1. THE EXACT TIER MATRIX & RULES ---
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

// --- 2. BOOT SEQUENCE ---
window.onload = () => {
    let saved = localStorage.getItem('accessug_loc');
    if (saved) {
        selectRegion(saved, false);
    } else {
        document.getElementById('region-sheet').classList.add('active');
    }
};

function selectRegion(reg, save = true) {
    if(save) localStorage.setItem('accessug_loc', reg);
    state.region = reg;
    
    document.getElementById('region-sheet').classList.remove('active');
    document.getElementById('nav-region').innerText = reg;
    
    // Default config
    state.services.followers.active = true;
    state.services.likes.active = false;
    state.services.followers.index = 0;
    state.services.likes.index = 0;
    
    document.getElementById('card-followers').classList.add('is-selected');
    document.getElementById('card-likes').classList.remove('is-selected');
    
    renderPills();
    calculateBill();
}

function resetRegion() {
    localStorage.removeItem('accessug_loc');
    document.getElementById('region-sheet').classList.add('active');
}

// --- 3. UI GENERATION ---
function renderPills() {
    const data = pricing[state.region];
    const formatVol = (v) => v >= 1000 ? (v/1000) + 'k' : v;
    const formatPrice = (p) => state.region === 'USD' ? `$${p}` : `${p.toLocaleString()} UGX`;

    const folGrid = document.getElementById('grid-followers');
    folGrid.innerHTML = '';
    data.followers.forEach((tier, idx) => {
        let sel = state.services.followers.index === idx ? 'active-pill' : '';
        folGrid.innerHTML += `
            <div class="price-pill ${sel}" onclick="setTier('followers', ${idx})">
                <span>${formatVol(tier.amount)}</span>
                <small>${formatPrice(tier.price)}</small>
            </div>
        `;
    });

    const likesGrid = document.getElementById('grid-likes');
    likesGrid.innerHTML = '';
    data.likes.forEach((tier, idx) => {
        let sel = state.services.likes.index === idx ? 'active-pill' : '';
        likesGrid.innerHTML += `
            <div class="price-pill ${sel}" onclick="setTier('likes', ${idx})">
                <span>${formatVol(tier.amount)}</span>
                <small>${formatPrice(tier.price)}</small>
            </div>
        `;
    });
}

// --- 4. INTERACTIONS ---
function toggleProduct(mod) {
    const el = document.getElementById(`card-${mod}`);
    state.services[mod].active = !state.services[mod].active;
    
    if (state.services[mod].active) {
        el.classList.add('is-selected');
    } else {
        el.classList.remove('is-selected');
    }
    calculateBill();
}

function setTier(mod, idx) {
    event.stopPropagation(); // Prevents collapsing the card
    state.services[mod].index = idx;
    
    if (!state.services[mod].active) toggleProduct(mod);
    
    renderPills();
    calculateBill();
}

function changeSplit(dir) {
    state.services.likes.split += dir;
    if (state.services.likes.split < 1) state.services.likes.split = 1;
    if (state.services.likes.split > 10) state.services.likes.split = 10;
    
    document.getElementById('split-number').innerText = state.services.likes.split;
    calculateBill();
}

function toggleReferral() {
    document.getElementById('ref-input-area').classList.toggle('open');
    const icon = document.getElementById('ref-icon');
    icon.classList.contains('fa-chevron-down') ? icon.classList.replace('fa-chevron-down', 'fa-chevron-up') : icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
}

// --- 5. THE STRICT CALCULATOR ---
function calculateBill() {
    const data = pricing[state.region];
    
    const fTier = data.followers[state.services.followers.index];
    const lTier = data.likes[state.services.likes.index];

    // FREE VIEWS LOGIC (1k likes = 2k views)
    const freeViews = lTier.amount * 2;
    document.getElementById('free-views-text').innerText = `Includes ${freeViews.toLocaleString()} Free Views!`;

    // SPLIT LOGIC
    const likesPerPost = Math.floor(lTier.amount / state.services.likes.split);
    const viewsPerPost = Math.floor(freeViews / state.services.likes.split);
    document.getElementById('likes-per-video').innerText = `~${likesPerPost.toLocaleString()} likes & ${viewsPerPost.toLocaleString()} views per video`;

    // BILLING MATH
    let rawTotal = 0;
    let activeCount = 0;

    if (state.services.followers.active) {
        rawTotal += fTier.price;
        activeCount++;
    }
    if (state.services.likes.active) {
        rawTotal += lTier.price;
        activeCount++;
    }

    let finalTotal = rawTotal;
    const badgeCombo = document.getElementById('combo-badge');
    const oldPriceEl = document.getElementById('old-price');

    badgeCombo.style.display = 'none';
    oldPriceEl.innerText = '';

    // Apply 10% Discount
    if (activeCount === 2 && rawTotal > 0) {
        finalTotal = rawTotal * 0.90;
        badgeCombo.style.display = 'block';
        oldPriceEl.innerText = state.region === 'USD' ? `$${rawTotal}` : rawTotal.toLocaleString();
    }

    // STRICT CAPS & FLOORS
    if (activeCount > 0) {
        if (finalTotal < data.rules.min) finalTotal = data.rules.min;
        if (finalTotal >= data.rules.maxCap) {
            finalTotal = data.rules.maxCap;
            badgeCombo.innerHTML = `<i class="fas fa-crown"></i> VIP Limit Unlocked`; // Changes text if they hit max cap
            badgeCombo.style.display = 'block';
            oldPriceEl.innerText = ''; // Clears old price for cleanliness
        }
    } else {
        finalTotal = 0;
    }

    // OUTPUT
    if (state.region === 'USD') {
        document.getElementById('final-price').innerText = `$${finalTotal}`;
        document.getElementById('final-curr').innerText = '';
    } else {
        document.getElementById('final-price').innerText = finalTotal.toLocaleString();
        document.getElementById('final-curr').innerText = 'UGX';
    }
}

// --- 6. CHECKOUT TO WHATSAPP ---
function submitOrder() {
    let activeCount = Object.keys(state.services).filter(k => state.services[k].active).length;
    if (activeCount === 0) {
        alert("Please select Followers or Likes to continue."); return;
    }

    const target = document.getElementById('target-username').value.trim();
    if (!target) {
        alert("Please enter your TikTok username."); 
        document.getElementById('target-username').focus(); return;
    }

    const data = pricing[state.region];
    const fAmt = data.followers[state.services.followers.index].amount;
    const lAmt = data.likes[state.services.likes.index].amount;
    const vAmt = lAmt * 2; // Free views
    
    const ref = document.getElementById('referral-code').value.trim() || "None";
    const finalBill = document.getElementById('final-price').innerText + " " + document.getElementById('final-curr').innerText;

    let msg = `*NEW TIKTOK ORDER [${state.region}]*\n\n`;
    
    if (state.services.followers.active) msg += `🚀 *Followers:* ${fAmt.toLocaleString()}\n`;
    if (state.services.likes.active) {
        msg += `❤️ *Likes:* ${lAmt.toLocaleString()} (Across ${state.services.likes.split} posts)\n`;
        msg += `👁️ *Free Views:* ${vAmt.toLocaleString()}\n`;
    }

    if (activeCount === 2) {
        let raw = data.followers[state.services.followers.index].price + data.likes[state.services.likes.index].price;
        if ((raw * 0.90) >= data.rules.maxCap) {
            msg += `\n👑 *VIP Max Cap Applied*\n`;
        } else {
            msg += `\n🎁 *10% Bundle Discount*\n`;
        }
    }

    msg += `\n*Total Due:* ${finalBill.trim()}\n`;
    msg += `*Username:* ${target}\n`;
    msg += `*Referrer:* ${ref}`;

    const phone = "256762193386"; 
    window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}