/**
 * ==========================================================================
 * 1000x ELITE DIGITAL ARCHITECTURE - TIKTOK GROWTH ENGINE
 * ==========================================================================
 * Strict Rules Engaged:
 * 1. Exact nonlinear pricing arrays mapped.
 * 2. 10% Combo logic embedded.
 * 3. $100 / 360,000 UGX hard ceilings enforced.
 * 4. Min floors ($35 / 50k) enforced.
 * 5. 1k Likes = 2k Views logic baked into UI.
 * 6. One-input form ("Client Name / Target").
 * 7. Google Sheets columns matched exactly.
 * ==========================================================================
 */

const Config = {
    sheetsEndpoint: 'YOUR_GOOGLE_SCRIPT_URL_HERE', // <-- REQUIRED: Insert Web App URL
    waPhone: '256762193386',
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
            rules: { min: 50000, max: 360000, curr: 'UGX' }
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
            rules: { min: 35, max: 100, curr: '$' }
        }
    }
};

const State = {
    region: 'UGX',
    assets: {
        followers: { active: true, index: 0 },
        likes: { active: false, index: 0 }
    },
    isProcessing: false
};

const App = {
    
    // --- 1. BOOTSTRAP & INITIALIZATION ---
    init() {
        const cachedRegion = localStorage.getItem('accessug_elite_region');
        if (cachedRegion) {
            this.setRegion(cachedRegion, false);
        } else {
            this.openRegionVeil();
        }
        
        // Setup Haptic Input Listeners
        document.getElementById('client-identifier').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.processOrder();
        });
    },

    // --- 2. REGION CALIBRATION ---
    openRegionVeil() {
        document.getElementById('region-veil').setAttribute('aria-hidden', 'false');
    },

    setRegion(reg, save = true) {
        if(save) localStorage.setItem('accessug_elite_region', reg);
        State.region = reg;
        
        document.getElementById('region-veil').setAttribute('aria-hidden', 'true');
        document.getElementById('ui-current-region').innerText = reg;
        
        // Reset state for new regional matrix
        State.assets.followers.active = true;
        State.assets.likes.active = false;
        State.assets.followers.index = 0;
        State.assets.likes.index = 0;
        
        this.renderUI();
    },

    // --- 3. REACTIVE UI RENDERING ---
    renderUI() {
        // Toggle Module Classes
        const folMod = document.getElementById('module-followers');
        const likMod = document.getElementById('module-likes');
        
        State.assets.followers.active ? folMod.classList.add('is-active') : folMod.classList.remove('is-active');
        State.assets.likes.active ? likMod.classList.add('is-active') : likMod.classList.remove('is-active');

        // Build Matrices
        this.buildMatrix('followers');
        this.buildMatrix('likes');

        // Run Math Engine
        this.computeYield();
    },

    buildMatrix(asset) {
        const matrixData = Config.matrices[State.region][asset];
        const container = document.getElementById(`matrix-${asset}`);
        container.innerHTML = '';

        matrixData.forEach((tier, idx) => {
            const isSelected = State.assets[asset].index === idx ? 'selected' : '';
            
            // Formatting logic
            const volDisplay = tier.v >= 1000 ? (tier.v / 1000) + 'k' : tier.v;
            const priceDisplay = State.region === 'USD' ? `$${tier.p}` : `${tier.p.toLocaleString()} UGX`;
            
            // If it's Likes, inject the Free Views logic directly into the cell
            let viewsHtml = '';
            if (asset === 'likes') {
                const freeViews = (tier.v * 2) >= 1000 ? ((tier.v * 2) / 1000) + 'k' : (tier.v * 2);
                viewsHtml = `<span class="mc-views">+ ${freeViews} Views</span>`;
            }

            container.innerHTML += `
                <div class="matrix-cell ${isSelected}" onclick="App.selectTier('${asset}', ${idx})">
                    <span class="mc-vol">${volDisplay}</span>
                    ${viewsHtml}
                    <span class="mc-price">${priceDisplay}</span>
                </div>
            `;
        });
    },

    // --- 4. HAPTIC INTERACTIONS ---
    toggleService(asset) {
        if(State.isProcessing) return;
        State.assets[asset].active = !State.assets[asset].active;
        this.renderUI();
        this.triggerHaptic();
    },

    selectTier(asset, idx) {
        if(State.isProcessing) return;
        event.stopPropagation(); // Prevent module toggle
        State.assets[asset].index = idx;
        
        // Auto-activate if cell clicked while inactive
        if (!State.assets[asset].active) State.assets[asset].active = true;
        
        this.renderUI();
        this.triggerHaptic();
    },

    triggerHaptic() {
        if (navigator.vibrate) navigator.vibrate(15);
    },

    // --- 5. THE SMART-YIELD MATH ENGINE ---
    computeYield() {
        const data = Config.matrices[State.region];
        const folTier = data.followers[State.assets.followers.index];
        const likTier = data.likes[State.assets.likes.index];

        let rawSubtotal = 0;
        let activeNodes = 0;

        if (State.assets.followers.active) {
            rawSubtotal += folTier.p;
            activeNodes++;
        }
        if (State.assets.likes.active) {
            rawSubtotal += likTier.p;
            activeNodes++;
        }

        let finalPayload = rawSubtotal;
        
        // UI Handles
        const domCombo = document.getElementById('badge-combo');
        const domVip = document.getElementById('badge-vip');
        const domOldPrice = document.getElementById('ui-old-price');
        const domFinalPrice = document.getElementById('ui-final-price');
        const domCurr = document.getElementById('ui-final-curr');

        // Reset Visibilities
        domCombo.style.display = 'none';
        domVip.style.display = 'none';
        domOldPrice.innerText = '';

        // Strategy 1: Apply 10% Combo Synergy
        if (activeNodes === 2 && rawSubtotal > 0) {
            finalPayload = rawSubtotal * 0.90;
            domCombo.style.display = 'flex';
            domOldPrice.innerText = State.region === 'USD' ? `$${rawSubtotal}` : rawSubtotal.toLocaleString();
        }

        // Strategy 2: Enforce Strict Caps & Floors
        if (activeNodes > 0) {
            if (finalPayload < data.rules.min) finalPayload = data.rules.min;
            if (finalPayload >= data.rules.max) {
                finalPayload = data.rules.max;
                domCombo.style.display = 'none'; // VIP overrides Combo visual
                domVip.style.display = 'flex';
                domOldPrice.innerText = ''; // Clean UI
            }
        } else {
            finalPayload = 0;
        }

        // Strategy 3: Render Math to Interface
        if (State.region === 'USD') {
            domFinalPrice.innerText = `$${finalPayload}`;
            domCurr.innerText = '';
        } else {
            domFinalPrice.innerText = finalPayload.toLocaleString();
            domCurr.innerText = 'UGX';
        }
    },

    // --- 6. SHADOW-SYNC & PAYLOAD DELIVERY ---
    processOrder() {
        if (State.isProcessing) return;

        let activeNodes = Object.keys(State.assets).filter(k => State.assets[k].active).length;
        if (activeNodes === 0) {
            this.showToast('Please activate an asset to proceed.', 'error');
            return;
        }

        const clientInput = document.getElementById('client-identifier').value.trim();
        if (!clientInput) {
            this.showToast('Target destination required.', 'error');
            document.getElementById('client-identifier').focus();
            return;
        }

        this.setLoadingState(true);

        // Compile Deep Data
        const data = Config.matrices[State.region];
        let packageString = "";
        let whatsappBody = "";
        
        if (State.assets.followers.active) {
            let fVal = data.followers[State.assets.followers.index].v;
            packageString += `${fVal} Followers. `;
            whatsappBody += `🚀 *Followers:* ${fVal.toLocaleString()}\n`;
        }
        if (State.assets.likes.active) {
            let lVal = data.likes[State.assets.likes.index].v;
            let vVal = lVal * 2; // 2x Free Views Rule
            packageString += `${lVal} Likes + ${vVal} Free Views.`;
            whatsappBody += `❤️ *Likes:* ${lVal.toLocaleString()}\n`;
            whatsappBody += `👁️ *Free Views:* ${vVal.toLocaleString()}\n`;
        }

        const finalInvestment = document.getElementById('ui-final-price').innerText + " " + document.getElementById('ui-final-curr').innerText;

        // --- EXACT GOOGLE SHEETS ALIGNMENT ---
        // Rule constraints: Date (auto), Client Name, Service, Package, Price, Referrer
        const formData = new FormData();
        formData.append('Client Name', clientInput); // Single input serves as Name/ID
        formData.append('Service', `TikTok [${State.region}]`);
        formData.append('Package', packageString.trim());
        formData.append('Price', finalInvestment.trim());
        formData.append('Referrer', 'Direct'); // Handled automatically per strict rules

        // Async Transmission
        fetch(Config.sheetsEndpoint, { method: 'POST', body: formData })
            .then(response => {
                // Build VIP WhatsApp Bridge
                let msg = `*ELITE ALGORITHM PUSH [${State.region}]*\n\n`;
                msg += `*Target:* ${clientInput}\n\n`;
                msg += whatsappBody;
                
                if (activeNodes === 2) {
                    let raw = data.followers[State.assets.followers.index].p + data.likes[State.assets.likes.index].p;
                    if ((raw * 0.90) >= data.rules.max) {
                        msg += `\n👑 *VIP Max Cap Secured*\n`;
                    } else {
                        msg += `\n🎁 *10% Synergy Discount*\n`;
                    }
                }

                msg += `\n*Total Investment:* ${finalInvestment.trim()}`;

                window.location.href = `https://wa.me/${Config.waPhone}?text=${encodeURIComponent(msg)}`;
            })
            .catch(error => {
                console.error('Shadow-Sync Error:', error);
                this.showToast('Network interference. Please retry.', 'error');
                this.setLoadingState(false);
            });
    },

    // --- 7. UTILITIES ---
    setLoadingState(isLoading) {
        State.isProcessing = isLoading;
        const btnText = document.getElementById('btn-execute-text');
        const btnIcon = document.getElementById('btn-execute-icon');
        const btnSpinner = document.getElementById('btn-execute-spinner');
        const btnNode = document.getElementById('btn-execute');

        if (isLoading) {
            btnNode.disabled = true;
            btnText.innerText = "Encrypting...";
            btnIcon.style.display = 'none';
            btnSpinner.style.display = 'block';
        } else {
            btnNode.disabled = false;
            btnText.innerText = "Secure Order";
            btnIcon.style.display = 'inline-block';
            btnSpinner.style.display = 'none';
        }
    },

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
        
        container.appendChild(toast);
        this.triggerHaptic();

        setTimeout(() => {
            toast.classList.add('toast-leave');
            toast.addEventListener('animationend', () => toast.remove());
        }, 3000);
    }
};

// Initialize App
App.init();