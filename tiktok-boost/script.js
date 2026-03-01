// --- 1. THE EXACT TIER MATRIX (Strict Data Core) ---
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
        rules: { min: 50000, maxCap: 360000, curr: 'UGX' }
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
        rules: { min: 35, maxCap: 100, curr: '$' }
    }
};

let state = {
    region: 'UGX',
    folIndex: -1, // -1 means none selected
    likesIndex: -1
};

// --- 2. BOOT SEQUENCE ---
window.onload = () => {
    let saved = localStorage.getItem('elite_region');
    if (saved) {
        initRegion(saved, false);
    } else {
        openRegionSheet();
    }
};

function openRegionSheet() {
    document.getElementById('region-sheet').classList.add('active');
}

function initRegion(reg, save = true) {
    if(save) localStorage.setItem('elite_region', reg);
    state.region = reg;
    
    document.getElementById('region-sheet').classList.remove('active');
    document.getElementById('current-region').innerText = reg;
    
    // Reset selection on region change
    state.folIndex = -1;
    state.likesIndex = -1;
    
    renderTracks();
    computeMath();
}

// --- 3. FLUID UI GENERATION ---
function renderTracks() {
    const data = pricing[state.region];
    const formatVol = (v) => v >= 1000 ? (v/1000) + 'k' : v;
    const formatPrice = (p) => state.region === 'USD' ? `$${p}` : `${p.toLocaleString()} UGX`;

    // Render Followers Track
    const folTrack = document.getElementById('track-followers');
    folTrack.innerHTML = `<div class="mix-tile ${state.folIndex === -1 ? 'active-tile' : ''}" onclick="selectFol(-1)"><span>None</span><small>Skip</small></div>`;
    
    data.followers.forEach((tier, idx) => {
        let active = state.folIndex === idx ? 'active-tile' : '';
        folTrack.innerHTML += `
            <div class="mix-tile ${active}" onclick="selectFol(${idx})">
                <span>${formatVol(tier.amount)}</span>
                <small>${formatPrice(tier.price)}</small>
            </div>
        `;
    });

    // Render Likes Track
    const likesTrack = document.getElementById('track-likes');
    likesTrack.innerHTML = `<div class="mix-tile ${state.likesIndex === -1 ? 'active-tile' : ''}" onclick="selectLikes(-1)"><span>None</span><small>Skip</small></div>`;
    
    data.likes.forEach((tier, idx) => {
        let active = state.likesIndex === idx ? 'active-tile' : '';
        likesTrack.innerHTML += `
            <div class="mix-tile ${active}" onclick="selectLikes(${idx})">
                <span>${formatVol(tier.amount)}</span>
                <small>${formatPrice(tier.price)}</small>
            </div>
        `;
    });
}

// --- 4. HAPTIC SELECTIONS ---
function selectFol(idx) {
    state.folIndex = idx;
    renderTracks();
    computeMath();
}

function selectLikes(idx) {
    state.likesIndex = idx;
    renderTracks();
    computeMath();
}

// --- 5. THE YIELD ENGINE (Math & Rules) ---
function computeMath() {
    const data = pricing[state.region];
    let rawTotal = 0;
    let activeCount = 0;
    
    let bonusViews = 0;

    // Check Followers
    if (state.folIndex > -1) {
        rawTotal += data.followers[state.folIndex].price;
        activeCount++;
    }
    
    // Check Likes & Views
    if (state.likesIndex > -1) {
        rawTotal += data.likes[state.likesIndex].price;
        activeCount++;
        bonusViews = data.likes[state.likesIndex].amount * 2;
    }

    // Update Views Text dynamically
    const viewsLabel = document.getElementById('bonus-views-label');
    if (bonusViews > 0) {
        viewsLabel.innerHTML = `+ ${bonusViews.toLocaleString()} Free Views`;
        viewsLabel.style.color = '#10B981'; // Green
    } else {
        viewsLabel.innerHTML = `Includes Free Views`;
        viewsLabel.style.color = '#f59e0b'; // Gold
    }

    let finalTotal = rawTotal;
    const tagCombo = document.getElementById('tag-combo');
    const tagVip = document.getElementById('tag-vip');
    const oldPriceEl = document.getElementById('math-old');

    tagCombo.style.display = 'none';
    tagVip.style.display = 'none';
    oldPriceEl.innerText = '';

    // Apply 10% Bundle Discount
    if (activeCount === 2 && rawTotal > 0) {
        finalTotal = rawTotal * 0.90;
        tagCombo.style.display = 'inline-block';
        oldPriceEl.innerText = state.region === 'USD' ? `$${rawTotal}` : rawTotal.toLocaleString();
    }

    // Execute Hard Caps & Floors
    if (activeCount > 0) {
        if (finalTotal < data.rules.min) finalTotal = data.rules.min;
        if (finalTotal >= data.rules.maxCap) {
            finalTotal = data.rules.maxCap;
            tagCombo.style.display = 'none'; // Overwrite combo tag
            tagVip.style.display = 'inline-block'; // Trigger VIP tag
            oldPriceEl.innerText = ''; 
        }
    } else {
        finalTotal = 0;
    }

    // Render to Screen
    if (state.region === 'USD') {
        document.getElementById('math-final').innerText = `$${finalTotal}`;
        document.getElementById('math-curr').innerText = '';
    } else {
        document.getElementById('math-final').innerText = finalTotal.toLocaleString();
        document.getElementById('math-curr').innerText = 'UGX';
    }
}

// --- 6. SHADOW-SYNC DATABASE & PAYLOAD ---
function executePayload() {
    if (state.folIndex === -1 && state.likesIndex === -1) {
        alert("Please select a Follower or Like package to proceed."); return;
    }

    const clientData = document.getElementById('client-name').value.trim();
    if (!clientData) {
        alert("Please enter your Name or TikTok Handle."); 
        document.getElementById('client-name').focus(); return;
    }

    // Loading State
    const btn = document.getElementById('btn-execute');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    const btnSpinner = document.getElementById('btn-spinner');

    btn.disabled = true;
    btnText.innerText = "Processing...";
    btnIcon.style.display = 'none';
    btnSpinner.style.display = 'block';

    // Compile Exact Data
    const data = pricing[state.region];
    let packageStr = "";
    let waPackageStr = "";
    
    if (state.folIndex > -1) {
        let fAmt = data.followers[state.folIndex].amount;
        packageStr += `${fAmt} Followers. `;
        waPackageStr += `🚀 *Followers:* ${fAmt.toLocaleString()}\n`;
    }
    if (state.likesIndex > -1) {
        let lAmt = data.likes[state.likesIndex].amount;
        let vAmt = lAmt * 2;
        packageStr += `${lAmt} Likes + ${vAmt} Free Views.`;
        waPackageStr += `❤️ *Likes:* ${lAmt.toLocaleString()}\n`;
        waPackageStr += `👁️ *Bonus Views:* ${vAmt.toLocaleString()}\n`;
    }

    const finalBill = document.getElementById('math-final').innerText + " " + document.getElementById('math-curr').innerText;

    // --- EXACT GOOGLE SHEETS MAPPING ---
    // Rule: Date, Client Name, Service, Package, Price, Referrer
    const formData = new FormData();
    formData.append('Client Name', clientData);
    formData.append('Service', 'TikTok Boost');
    formData.append('Package', packageStr.trim());
    formData.append('Price', finalBill.trim());
    formData.append('Referrer', 'N/A'); // Safely passing logic to preserve sheet structure

    // REPLACE WITH YOUR WEB APP URL
    const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL_HERE'; 

    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            // Build WhatsApp Payload
            let msg = `*NEW TIKTOK ORDER [${state.region}]*\n\n`;
            msg += `*Client/Account:* ${clientData}\n\n`;
            msg += waPackageStr;
            
            if (state.folIndex > -1 && state.likesIndex > -1) {
                let raw = data.followers[state.folIndex].price + data.likes[state.likesIndex].price;
                if ((raw * 0.90) >= data.rules.maxCap) {
                    msg += `\n👑 *VIP Max Cap Applied*\n`;
                } else {
                    msg += `\n🎁 *10% Bundle Discount*\n`;
                }
            }

            msg += `\n*Total Due:* ${finalBill.trim()}`;

            const waPhone = "256762193386"; 
            window.location.href = `https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`;
        })
        .catch(error => {
            console.error('Transmission Error', error);
            alert("Network connection weak. Please verify your internet and try again.");
            
            // Revert UI
            btn.disabled = false;
            btnText.innerText = "Secure Order";
            btnIcon.style.display = 'inline-block';
            btnSpinner.style.display = 'none';
        });
}