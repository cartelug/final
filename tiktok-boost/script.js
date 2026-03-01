// --- 1. THE EXACT TIER MATRIX & IMMUTABLE RULES ---
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

// --- 2. BOOT & REGION LOGIC ---
window.onload = () => {
    let saved = localStorage.getItem('accessug_region');
    if (saved) {
        selectRegion(saved, false);
    } else {
        document.getElementById('region-sheet').classList.add('active');
    }
};

function selectRegion(reg, save = true) {
    if(save) localStorage.setItem('accessug_region', reg);
    state.region = reg;
    
    document.getElementById('region-sheet').classList.remove('active');
    document.getElementById('nav-region-label').innerText = reg;
    
    // Hard reset UI states
    state.services.followers.active = true;
    state.services.likes.active = false;
    state.services.followers.index = 0;
    state.services.likes.index = 0;
    
    document.getElementById('card-followers').classList.add('is-active');
    document.getElementById('card-likes').classList.remove('is-active');
    
    renderPills();
    executeCoreMath();
}

function resetRegion() {
    localStorage.removeItem('accessug_region');
    document.getElementById('region-sheet').classList.add('active');
}

// --- 3. DYNAMIC UI GENERATION ---
function renderPills() {
    const data = pricing[state.region];
    const formatVol = (v) => v >= 1000 ? (v/1000) + 'k' : v;
    const formatPrice = (p) => state.region === 'USD' ? `$${p}` : `${p.toLocaleString()} UGX`;

    const folGrid = document.getElementById('grid-followers');
    folGrid.innerHTML = '';
    data.followers.forEach((tier, idx) => {
        let sel = state.services.followers.index === idx ? 'active-pill' : '';
        folGrid.innerHTML += `
            <div class="h-pill ${sel}" onclick="setTier('followers', ${idx})">
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
            <div class="h-pill ${sel}" onclick="setTier('likes', ${idx})">
                <span>${formatVol(tier.amount)}</span>
                <small>${formatPrice(tier.price)}</small>
            </div>
        `;
    });
}

// --- 4. HAPTIC INTERACTIONS ---
function toggleAsset(mod) {
    const el = document.getElementById(`card-${mod}`);
    state.services[mod].active = !state.services[mod].active;
    
    if (state.services[mod].active) el.classList.add('is-active');
    else el.classList.remove('is-active');
    
    executeCoreMath();
}

function setTier(mod, idx) {
    event.stopPropagation();
    state.services[mod].index = idx;
    if (!state.services[mod].active) toggleAsset(mod);
    
    renderPills();
    executeCoreMath();
}

function modifySplit(dir) {
    state.services.likes.split += dir;
    if (state.services.likes.split < 1) state.services.likes.split = 1;
    if (state.services.likes.split > 10) state.services.likes.split = 10;
    document.getElementById('split-number').innerText = state.services.likes.split;
    executeCoreMath();
}

function toggleReferral() {
    document.getElementById('ref-drop').classList.toggle('open');
    const icon = document.getElementById('ref-chevron');
    icon.classList.contains('fa-chevron-down') ? icon.classList.replace('fa-chevron-down', 'fa-chevron-up') : icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
}

// --- 5. THE CORE ENGINE (MATH, DISCOUNTS, CAPS) ---
function executeCoreMath() {
    const data = pricing[state.region];
    const fTier = data.followers[state.services.followers.index];
    const lTier = data.likes[state.services.likes.index];

    // YIELD BONUS LOGIC (Likes * 2 = Free Views)
    const freeViews = lTier.amount * 2;
    document.getElementById('free-views-text').innerText = `Includes ${freeViews.toLocaleString()} Free Views`;

    const likesPerPost = Math.floor(lTier.amount / state.services.likes.split);
    const viewsPerPost = Math.floor(freeViews / state.services.likes.split);
    document.getElementById('likes-per-video').innerText = `~${likesPerPost.toLocaleString()} likes & ${viewsPerPost.toLocaleString()} views per video`;

    // BILLING CALCULATION
    let rawTotal = 0;
    let activeCount = 0;

    if (state.services.followers.active) { rawTotal += fTier.price; activeCount++; }
    if (state.services.likes.active) { rawTotal += lTier.price; activeCount++; }

    let finalTotal = rawTotal;
    const badgeCombo = document.getElementById('badge-combo');
    const badgeVip = document.getElementById('badge-vip');
    const oldPriceEl = document.getElementById('math-strike');

    badgeCombo.style.display = 'none';
    badgeVip.style.display = 'none';
    oldPriceEl.innerText = '';

    // Apply 10% Combo Filter
    if (activeCount === 2 && rawTotal > 0) {
        finalTotal = rawTotal * 0.90;
        badgeCombo.style.display = 'block';
        oldPriceEl.innerText = state.region === 'USD' ? `$${rawTotal}` : rawTotal.toLocaleString();
    }

    // STRICT RULES FILTER (Min / Max Cap Overrides)
    if (activeCount > 0) {
        if (finalTotal < data.rules.min) finalTotal = data.rules.min;
        if (finalTotal >= data.rules.maxCap) {
            finalTotal = data.rules.maxCap;
            badgeCombo.style.display = 'none';
            badgeVip.style.display = 'block'; // Triggers VIP Tag
            oldPriceEl.innerText = ''; 
        }
    } else {
        finalTotal = 0;
    }

    // OUTPUT RENDERING
    if (state.region === 'USD') {
        document.getElementById('math-final').innerText = `$${finalTotal}`;
        document.getElementById('math-curr').innerText = '';
    } else {
        document.getElementById('math-final').innerText = finalTotal.toLocaleString();
        document.getElementById('math-curr').innerText = 'UGX';
    }
}

// --- 6. SHADOW-SYNC DATABASE LINK (Validate & Send) ---
function executeOrder() {
    let activeCount = Object.keys(state.services).filter(k => state.services[k].active).length;
    if (activeCount === 0) {
        alert("Please activate Followers or Likes to proceed."); return;
    }

    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const target = document.getElementById('target-account').value.trim();
    
    if (!name) { alert("Please enter your Full Name."); document.getElementById('client-name').focus(); return; }
    if (!phone) { alert("Please enter your WhatsApp Number."); document.getElementById('client-phone').focus(); return; }
    if (!target) { alert("Please provide the target TikTok account."); document.getElementById('target-account').focus(); return; }

    // UI Transformation to Loading State
    const btn = document.getElementById('deploy-btn');
    const btnLabel = document.getElementById('btn-label');
    const btnIcon = document.getElementById('btn-icon');
    const btnLoader = document.getElementById('btn-loader');

    btn.disabled = true;
    btnLabel.innerText = "Processing...";
    btnIcon.style.display = 'none';
    btnLoader.style.display = 'block';

    // Construct Payload
    const data = pricing[state.region];
    const fAmt = data.followers[state.services.followers.index].amount;
    const lAmt = data.likes[state.services.likes.index].amount;
    const vAmt = lAmt * 2; 
    
    const finalBill = document.getElementById('math-final').innerText + " " + document.getElementById('math-curr').innerText;
    const ref = document.getElementById('referral-code').value.trim() || "None";
    
    let planString = `TikTok Elite [${state.region}]: `;
    if (state.services.followers.active) planString += `${fAmt} Followers. `;
    if (state.services.likes.active) planString += `${lAmt} Likes (${state.services.likes.split} posts) + ${vAmt} Free Views. `;
    planString += `Total: ${finalBill.trim()}`;

    // --- YOUR GOOGLE SCRIPT URL ---
    const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL_HERE'; 

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('device', target); 
    formData.append('plan', planString);
    formData.append('referral', ref);

    // Asynchronous Database Sync
    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            // Build Formatted WhatsApp Transfer
            let msg = `*NEW ELITE PROTOCOL [${state.region}]*\n\n`;
            msg += `*Client:* ${name}\n`;
            msg += `*Contact:* ${phone}\n\n`;
            
            if (state.services.followers.active) msg += `🚀 *Followers:* ${fAmt.toLocaleString()}\n`;
            if (state.services.likes.active) {
                msg += `❤️ *Likes:* ${lAmt.toLocaleString()} (Across ${state.services.likes.split} posts)\n`;
                msg += `👁️ *Bonus Views:* ${vAmt.toLocaleString()}\n`;
            }

            msg += `\n*Total Due:* ${finalBill.trim()}\n`;
            msg += `*Target:* ${target}\n`;
            msg += `*Referrer:* ${ref}`;

            const waPhone = "256762193386"; 
            window.location.href = `https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`;
        })
        .catch(error => {
            console.error('Transmission Error', error.message);
            alert("Network interference detected. Please verify connection and retry.");
            
            // Revert UI State
            btn.disabled = false;
            btnLabel.innerText = "Place Order";
            btnIcon.style.display = 'inline-block';
            btnLoader.style.display = 'none';
        });
}