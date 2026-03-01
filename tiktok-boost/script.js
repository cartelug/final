/**
 * ==========================================================================
 * ACCESSUG TIKTOK ENGINE - STRICT LOGIC CONTROLLER
 * ==========================================================================
 * Architecture:
 * - Reactive state management.
 * - Exact mathematical matrix rendering (UGX/USD).
 * - Exact Google Sheets `URLSearchParams` + `no-cors` synchronization.
 * - Formatted WhatsApp output matching Netflix legacy logic.
 * - Dual-Pill Referrer system.
 * ==========================================================================
 */

const Config = {
    // ---> CRITICAL: YOUR GOOGLE APPS SCRIPT WEB APP URL HERE <---
    googleSheetUrl: 'https://script.google.com/macros/s/AKfycbzsER7toUR8OwPWPic7Oqbbjz-ew2pR_HJ4Um3V9o6eVmlf730ibwF7ELv6GCekmgl2aA/exec', 
    whatsappNumber: '256762193386',
    
    // Strict nonlinear mathematical constraints
    matrices: {
        'UGX': {
            followers: [ 
                { v: 1000, p: 75000 }, { v: 4000, p: 141000 }, 
                { v: 7000, p: 208000 }, { v: 10000, p: 250000 } 
            ],
            likes: [ 
                { v: 1000, p: 50000 }, { v: 4000, p: 83000 }, 
                { v: 7000, p: 116000 }, { v: 10000, p: 150000 } 
            ],
            rules: { minFloor: 50000, maxCeiling: 360000, curr: 'UGX' }
        },
        'USD': {
            followers: [ 
                { v: 3000, p: 35 }, { v: 5000, p: 50 }, 
                { v: 8000, p: 75 }, { v: 10000, p: 100 } 
            ],
            likes: [ 
                { v: 2500, p: 35 }, { v: 5000, p: 50 }, 
                { v: 7500, p: 75 }, { v: 10000, p: 100 } 
            ],
            rules: { minFloor: 35, maxCeiling: 100, curr: '$' }
        }
    }
};

const State = {
    region: 'UGX',
    folIndex: -1,     // -1 indicates unselected
    likesIndex: -1,
    splitCount: 5,
    hasReferrer: false, // Tracks the [No] [Yes] pill state
    isTransmitting: false
};

const Engine = {
    
    // --- 1. INITIALIZATION ---
    init() {
        const savedRegion = localStorage.getItem('accessug_tiktok_region');
        if (savedRegion) {
            this.initRegion(savedRegion, false);
        } else {
            this.openRegionSheet();
        }

        // Global Enter Key Listener for rapid checkout
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !State.isTransmitting) {
                if(document.activeElement.tagName === 'INPUT') {
                    this.transmitPayload();
                }
            }
        });
    },

    // --- 2. REGION CALIBRATION ---
    openRegionSheet() {
        document.getElementById('region-sheet').setAttribute('aria-hidden', 'false');
    },

    initRegion(reg, save = true) {
        if(save) localStorage.setItem('accessug_tiktok_region', reg);
        State.region = reg;
        
        document.getElementById('region-sheet').setAttribute('aria-hidden', 'true');
        document.getElementById('current-region-display').innerText = reg;
        
        // Reset selections on region swap
        State.folIndex = -1;
        State.likesIndex = -1;
        State.splitCount = 5;
        
        this.renderTracks();
        this.calculateYield();
    },

    // --- 3. UI GENERATION (The Fluid Tracks) ---
    renderTracks() {
        const matrix = Config.matrices[State.region];
        const formatVol = (v) => v >= 1000 ? (v/1000) + 'k' : v;
        const formatPrice = (p) => State.region === 'USD' ? `$${p}` : `${p.toLocaleString()} UGX`;

        // 3a. Generate Followers Track
        const folTrack = document.getElementById('track-followers');
        // Inject "None" tile first
        folTrack.innerHTML = `
            <div class="mix-tile ${State.folIndex === -1 ? 'active-tile' : ''}" onclick="Engine.selectItem('fol', -1)">
                <span class="tile-vol">None</span>
                <span class="tile-price">Skip Module</span>
            </div>
        `;
        
        matrix.followers.forEach((tier, idx) => {
            let active = State.folIndex === idx ? 'active-tile' : '';
            folTrack.innerHTML += `
                <div class="mix-tile ${active}" onclick="Engine.selectItem('fol', ${idx})">
                    <span class="tile-vol">${formatVol(tier.v)}</span>
                    <span class="tile-price">${formatPrice(tier.p)}</span>
                </div>
            `;
        });

        // 3b. Generate Likes Track
        const likTrack = document.getElementById('track-likes');
        likTrack.innerHTML = `
            <div class="mix-tile ${State.likesIndex === -1 ? 'active-tile' : ''}" onclick="Engine.selectItem('lik', -1)">
                <span class="tile-vol">None</span>
                <span class="tile-price">Skip Module</span>
            </div>
        `;
        
        matrix.likes.forEach((tier, idx) => {
            let active = State.likesIndex === idx ? 'active-tile' : '';
            
            // Generate Bonus Views text directly inside tile
            let views = tier.v * 2;
            let displayViews = views >= 1000 ? (views/1000) + 'k' : views;
            
            likTrack.innerHTML += `
                <div class="mix-tile ${active}" onclick="Engine.selectItem('lik', ${idx})">
                    <span class="tile-vol">${formatVol(tier.v)}</span>
                    <span class="tile-sub">+ ${displayViews} Views</span>
                    <span class="tile-price">${formatPrice(tier.p)}</span>
                </div>
            `;
        });

        // Manage Stepper Visibility
        const stepper = document.getElementById('distribution-module');
        if (State.likesIndex > -1) {
            stepper.style.display = 'flex';
        } else {
            stepper.style.display = 'none';
        }
    },

    // --- 4. HAPTIC INTERACTIONS ---
    selectItem(type, idx) {
        if (State.isTransmitting) return;
        
        if (type === 'fol') State.folIndex = idx;
        if (type === 'lik') State.likesIndex = idx;
        
        this.renderTracks();
        this.calculateYield();
        this.fireHaptic();
    },

    modifySplit(direction) {
        if (State.isTransmitting) return;
        
        State.splitCount += direction;
        if (State.splitCount < 1) State.splitCount = 1;
        if (State.splitCount > 10) State.splitCount = 10;
        
        document.getElementById('split-counter-display').innerText = State.splitCount;
        this.calculateYield();
        this.fireHaptic();
    },

    setReferrerState(hasReferrer) {
        if (State.isTransmitting) return;
        State.hasReferrer = hasReferrer;
        
        const pillNo = document.getElementById('ref-pill-no');
        const pillYes = document.getElementById('ref-pill-yes');
        const drawer = document.getElementById('referrer-drawer');
        
        if (hasReferrer) {
            pillNo.classList.remove('active');
            pillYes.classList.add('active');
            drawer.classList.add('is-open');
            // Auto focus input for seamless UX
            setTimeout(() => document.getElementById('referrer-name').focus(), 300);
        } else {
            pillYes.classList.remove('active');
            pillNo.classList.add('active');
            drawer.classList.remove('is-open');
            document.getElementById('referrer-name').value = ''; // Clear value
        }
    },

    fireHaptic() {
        if (navigator.vibrate) navigator.vibrate(10);
    },

    // --- 5. MATHEMATICAL ENGINE (Caps & Combos) ---
    calculateYield() {
        const matrix = Config.matrices[State.region];
        let rawPrice = 0;
        let activeNodes = 0;

        // Process Followers
        if (State.folIndex > -1) {
            rawPrice += matrix.followers[State.folIndex].p;
            activeNodes++;
        }
        
        // Process Likes & Distribute Math
        if (State.likesIndex > -1) {
            const lTier = matrix.likes[State.likesIndex];
            rawPrice += lTier.p;
            activeNodes++;
            
            const freeViews = lTier.v * 2;
            const lPerVid = Math.floor(lTier.v / State.splitCount);
            const vPerVid = Math.floor(freeViews / State.splitCount);
            
            document.getElementById('split-math-readout').innerText = `~${lPerVid.toLocaleString()} likes & ${vPerVid.toLocaleString()} views per video`;
        }

        // Apply Rules
        let finalOutput = rawPrice;
        const uiCombo = document.getElementById('ui-tag-combo');
        const uiVip = document.getElementById('ui-tag-vip');
        const uiStrike = document.getElementById('ui-price-strike');

        uiCombo.style.display = 'none';
        uiVip.style.display = 'none';
        uiStrike.innerText = '';

        // 1. Combo Discount
        if (activeNodes === 2 && rawPrice > 0) {
            finalOutput = rawPrice * 0.90;
            uiCombo.style.display = 'flex';
            uiStrike.innerText = State.region === 'USD' ? `$${rawPrice}` : rawPrice.toLocaleString();
        }

        // 2. Strict Absolute Limits
        if (activeNodes > 0) {
            if (finalOutput < matrix.rules.minFloor) finalOutput = matrix.rules.minFloor;
            
            if (finalOutput >= matrix.rules.maxCeiling) {
                finalOutput = matrix.rules.maxCeiling;
                uiCombo.style.display = 'none'; // Overwrite Combo UI
                uiVip.style.display = 'flex';   // Trigger VIP UI
                uiStrike.innerText = ''; 
            }
        } else {
            finalOutput = 0;
        }

        // Render Math
        if (State.region === 'USD') {
            document.getElementById('ui-price-final').innerText = `$${finalOutput}`;
            document.getElementById('ui-price-currency').innerText = '';
        } else {
            document.getElementById('ui-price-final').innerText = finalOutput.toLocaleString();
            document.getElementById('ui-price-currency').innerText = 'UGX';
        }
        
        // Store for global access during submit
        State.finalComputedPrice = finalOutput;
    },

    // --- 6. SHADOW-SYNC TO SHEETS & WHATSAPP ---
    async transmitPayload() {
        if (State.isTransmitting) return;

        // Validation Check
        if (State.folIndex === -1 && State.likesIndex === -1) {
            alert("Please select a Follower or Like package to proceed.");
            return;
        }

        const targetClient = document.getElementById('client-target').value.trim();
        if (!targetClient) {
            alert("Please provide the target TikTok username.");
            document.getElementById('client-target').focus();
            return;
        }

        // Process Referrer String
        let referrerVal = "Direct";
        if (State.hasReferrer) {
            const inputVal = document.getElementById('referrer-name').value.trim();
            if (inputVal) referrerVal = inputVal;
        }

        // UI Loading Transformation
        this.setUIState(true);

        // Compile String Data
        const matrix = Config.matrices[State.region];
        let packageDesc = "";
        let waDesc = "";
        
        if (State.folIndex > -1) {
            let folAmt = matrix.followers[State.folIndex].v;
            packageDesc += `${folAmt} Followers. `;
            waDesc += `🚀 *Followers:* ${folAmt.toLocaleString()}\n`;
        }
        
        if (State.likesIndex > -1) {
            let likAmt = matrix.likes[State.likesIndex].v;
            let vAmt = likAmt * 2;
            packageDesc += `${likAmt} Likes (Split ${State.splitCount}) + ${vAmt} Free Views.`;
            waDesc += `❤️ *Likes:* ${likAmt.toLocaleString()} (Across ${State.splitCount} videos)\n`;
            waDesc += `👁️ *Free Views:* ${vAmt.toLocaleString()}\n`;
        }

        // --- EXACT GOOGLE SHEETS INTEGRATION (URLSearchParams) ---
        const formData = new URLSearchParams();
        formData.append('ClientName', targetClient); // Input serves as Name/ID
        formData.append('Service', `TikTok Boost [${State.region}]`);
        formData.append('Package', packageDesc.trim());
        // Clean mathematical price format for Sheet calculation
        formData.append('Price', State.finalComputedPrice.toString()); 
        formData.append('Referrer', referrerVal);

        try {
            // Shadow Sync (No-CORS background fetch)
            await fetch(Config.googleSheetUrl, { 
                method: 'POST', 
                body: formData, 
                mode: 'no-cors' 
            });
        } catch (e) { 
            console.log("Sheet sync delayed/failed, proceeding to WhatsApp for redundancy."); 
        }

        // --- FORMATTED WHATSAPP BRIDGE (Netflix Template Match) ---
        const displayTotal = State.region === 'USD' ? `$${State.finalComputedPrice}` : `${State.finalComputedPrice.toLocaleString()} UGX`;
        
        let message = `*NEW ORDER [${targetClient.toUpperCase()}]*\n\n`;
        message += `*Service:* TikTok Boost\n`;
        message += `*Package:* ${packageDesc.trim()}\n`;
        message += `*Price:* ${displayTotal}\n`;
        message += `*Referrer:* ${referrerVal}\n`;
        message += `*Name/Target:* ${targetClient}`;

        window.location.href = `https://wa.me/${Config.whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        // Failsafe UI reset
        setTimeout(() => this.setUIState(false), 5000);
    },

    // --- 7. UTILITY ---
    setUIState(isLoading) {
        State.isTransmitting = isLoading;
        const btn = document.getElementById('btn-execute');
        const btnLabel = document.getElementById('btn-label');
        const btnIcon = document.getElementById('btn-icon');
        const btnSpinner = document.getElementById('btn-spinner');

        if (isLoading) {
            btn.disabled = true;
            btnLabel.innerText = "Securing...";
            btnIcon.style.display = 'none';
            btnSpinner.style.display = 'block';
        } else {
            btn.disabled = false;
            btnLabel.innerText = "Place Order";
            btnIcon.style.display = 'inline-block';
            btnSpinner.style.display = 'none';
        }
    }
};

// Initialize Architecture
Engine = TikTokApp; // Alias for HTML bindings
Engine.init();