/**
 * ==========================================================================
 * ACCESSUG FACEBOOK ENGINE (V5 - META BENTO LOGIC)
 * ==========================================================================
 * Strict Architecture:
 * 1. "Tap & Done" Bento Grid Selection (-1 = Skip, 0-3 = Packages)
 * 2. Hard Limits: $100 / 360,000 UGX
 * 3. 10% Combo Auto-Discount
 * 4. Facebook Specifics: 1k Likes = 2k Free Views + 100 Free Shares
 * 5. Google Sheets `URLSearchParams` -> WhatsApp Bridge
 * ==========================================================================
 */

const AppConfig = {
    // ---> THE LIVE GOOGLE SHEETS WEB APP URL <---
    googleSheetUrl: 'https://script.google.com/macros/s/AKfycbzsER7toUR8OwPWPic7Oqbbjz-ew2pR_HJ4Um3V9o6eVmlf730ibwF7ELv6GCekmgl2aA/exec', 
    whatsappNumber: '256762193386',
    
    // Strict Pricing Arrays mapped to exact requests
    prices: {
        'UGX': {
            followers: [ 
                { v: 1000, p: 75000 }, { v: 4000, p: 141000 }, 
                { v: 7000, p: 208000 }, { v: 10000, p: 250000 } 
            ],
            likes: [ 
                { v: 1000, p: 50000 }, { v: 4000, p: 83000 }, 
                { v: 7000, p: 116000 }, { v: 10000, p: 150000 } 
            ],
            rules: { floor: 50000, ceiling: 360000, symbol: 'UGX' }
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
            rules: { floor: 35, ceiling: 100, symbol: '$' }
        }
    }
};

const AppState = {
    country: 'UGX',
    folSelection: -1,   // -1 = Skipped/None
    likSelection: -1,   // -1 = Skipped/None
    videoSplits: 5,
    hasReferrer: false,
    isProcessing: false,
    finalMathematicalPrice: 0 // Clean integer stored for sheets
};

const FbApp = {

    // --- 1. BOOTSTRAP ---
    init() {
        const savedRegion = localStorage.getItem('accessug_loc_fb');
        if (savedRegion) {
            this.setCountry(savedRegion, false);
        } else {
            this.openCountryModal();
        }

        // Enter key listener for rapid checkout
        document.getElementById('target-username').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !AppState.isProcessing) this.processCheckout();
        });
        document.getElementById('referrer-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !AppState.isProcessing) this.processCheckout();
        });
    },

    // --- 2. COUNTRY MANAGEMENT ---
    openCountryModal() {
        document.getElementById('country-modal').setAttribute('aria-hidden', 'false');
    },

    setCountry(code, saveToMemory = true) {
        if(saveToMemory) localStorage.setItem('accessug_loc_fb', code);
        AppState.country = code;
        
        document.getElementById('country-modal').setAttribute('aria-hidden', 'true');
        document.getElementById('ui-region-badge').innerText = code;
        
        // Reset selections to clean defaults
        AppState.folSelection = 0;
        AppState.likSelection = -1;
        AppState.videoSplits = 5;
        
        this.renderBentoGrids();
        this.calculateMath();
    },

    // --- 3. BENTO UI RENDERING ---
    renderBentoGrids() {
        const matrix = AppConfig.prices[AppState.country];
        const formatVol = (v) => v >= 1000 ? (v/1000) + 'k' : v;
        const formatPrice = (p) => AppState.country === 'USD' ? `$${p}` : `${p.toLocaleString()} UGX`;

        // 3a. Render Followers Grid
        const gridFol = document.getElementById('grid-followers');
        gridFol.innerHTML = '';
        
        matrix.followers.forEach((tier, index) => {
            let activeClass = AppState.folSelection === index ? 'selected-navy' : '';
            gridFol.innerHTML += `
                <div class="pack-btn ${activeClass}" onclick="FbApp.selectTier('fol', ${index})">
                    <span class="p-vol">${formatVol(tier.v)}</span>
                    <span class="p-price">${formatPrice(tier.p)}</span>
                </div>
            `;
        });
        
        let skipFolClass = AppState.folSelection === -1 ? 'selected-skip' : '';
        gridFol.innerHTML += `
            <div class="pack-btn skip-btn ${skipFolClass}" onclick="FbApp.selectTier('fol', -1)" style="grid-column: span 2;">
                <span class="p-vol">I don't need Followers</span>
            </div>
        `;

        // 3b. Render Likes Grid (Includes Shares Logic)
        const gridLik = document.getElementById('grid-likes');
        gridLik.innerHTML = '';
        
        matrix.likes.forEach((tier, index) => {
            let activeClass = AppState.likSelection === index ? 'selected-blue' : '';
            
            // Facebook specific logic: 2x Views and 10% Shares
            let freeViews = formatVol(tier.v * 2);
            let freeShares = formatVol(tier.v * 0.1); 
            
            gridLik.innerHTML += `
                <div class="pack-btn ${activeClass}" onclick="FbApp.selectTier('lik', ${index})">
                    <span class="p-vol">${formatVol(tier.v)}</span>
                    <span class="p-views">+ ${freeViews} Views & ${freeShares} Shares</span>
                    <span class="p-price">${formatPrice(tier.p)}</span>
                </div>
            `;
        });

        let skipLikClass = AppState.likSelection === -1 ? 'selected-skip' : '';
        gridLik.innerHTML += `
            <div class="pack-btn skip-btn ${skipLikClass}" onclick="FbApp.selectTier('lik', -1)" style="grid-column: span 2;">
                <span class="p-vol">I don't need Likes</span>
            </div>
        `;

        // Toggle Video Splitter UI Visibility
        const splitterUI = document.getElementById('split-ui-box');
        if (AppState.likSelection > -1) {
            splitterUI.style.display = 'flex';
        } else {
            splitterUI.style.display = 'none';
        }
    },

    // --- 4. TACTILE INTERACTIONS ---
    selectTier(type, index) {
        if (AppState.isProcessing) return;
        
        if (type === 'fol') AppState.folSelection = index;
        if (type === 'lik') AppState.likSelection = index;
        
        this.renderBentoGrids();
        this.calculateMath();
        this.triggerVibration();
    },

    adjustSplit(direction) {
        if (AppState.isProcessing) return;
        
        AppState.videoSplits += direction;
        if (AppState.videoSplits < 1) AppState.videoSplits = 1;
        if (AppState.videoSplits > 10) AppState.videoSplits = 10;
        
        document.getElementById('split-counter-ui').innerText = AppState.videoSplits;
        this.calculateMath();
        this.triggerVibration();
    },

    toggleReferrer(hasFriend) {
        if (AppState.isProcessing) return;
        AppState.hasReferrer = hasFriend;
        
        const btnNo = document.getElementById('ref-no');
        const btnYes = document.getElementById('ref-yes');
        const drawer = document.getElementById('referrer-drawer');
        
        if (hasFriend) {
            btnNo.classList.remove('active');
            btnYes.classList.add('active');
            drawer.classList.add('is-open');
            setTimeout(() => document.getElementById('referrer-name').focus(), 250);
        } else {
            btnYes.classList.remove('active');
            btnNo.classList.add('active');
            drawer.classList.remove('is-open');
            document.getElementById('referrer-name').value = ''; 
        }
    },

    triggerVibration() {
        if (navigator.vibrate) navigator.vibrate(10);
    },

    // --- 5. THE CORE MATHEMATICS ENGINE ---
    calculateMath() {
        const matrix = AppConfig.prices[AppState.country];
        let runningTotal = 0;
        let activeCategories = 0;

        // Add Followers Math
        if (AppState.folSelection > -1) {
            runningTotal += matrix.followers[AppState.folSelection].p;
            activeCategories++;
        }
        
        // Add Likes Math & Update Split Text
        if (AppState.likSelection > -1) {
            const likObj = matrix.likes[AppState.likSelection];
            runningTotal += likObj.p;
            activeCategories++;
            
            // Facebook specific split helper text
            const likesPerPost = Math.floor(likObj.v / AppState.videoSplits);
            const sharesPerPost = Math.floor((likObj.v * 0.1) / AppState.videoSplits);
            
            document.getElementById('split-math-output').innerText = `~${likesPerPost.toLocaleString()} Likes & ${sharesPerPost.toLocaleString()} Shares per post`;
        }

        // Apply Business Rules
        let finalPrice = runningTotal;
        
        const tagCombo = document.getElementById('ui-badge-combo');
        const tagMax = document.getElementById('ui-badge-max');
        const textStrike = document.getElementById('ui-strike-price');

        tagCombo.style.display = 'none';
        tagMax.style.display = 'none';
        textStrike.innerText = '';

        // Rule 1: 10% Bundle Discount
        if (activeCategories === 2 && runningTotal > 0) {
            finalPrice = runningTotal * 0.90;
            tagCombo.style.display = 'flex';
            textStrike.innerText = AppState.country === 'USD' ? `$${runningTotal}` : runningTotal.toLocaleString();
        }

        // Rule 2: Strict Min Floor & Max Ceiling Overrides
        if (activeCategories > 0) {
            if (finalPrice < matrix.rules.floor) finalPrice = matrix.rules.floor;
            if (finalPrice >= matrix.rules.ceiling) {
                finalPrice = matrix.rules.ceiling;
                tagCombo.style.display = 'none'; 
                tagMax.style.display = 'flex';
                textStrike.innerText = ''; 
            }
        } else {
            finalPrice = 0;
        }

        // Output to DOM
        if (AppState.country === 'USD') {
            document.getElementById('ui-final-price').innerText = `$${finalPrice}`;
            document.getElementById('ui-final-curr').innerText = '';
        } else {
            document.getElementById('ui-final-price').innerText = finalPrice.toLocaleString();
            document.getElementById('ui-final-curr').innerText = 'UGX';
        }
        
        // Save to state for payload
        AppState.finalMathematicalPrice = finalPrice;
    },

    // --- 6. SHADOW-SYNC & WHATSAPP BRIDGE ---
    async processCheckout() {
        if (AppState.isProcessing) return;

        // 1. Validations
        if (AppState.folSelection === -1 && AppState.likSelection === -1) {
            this.showToast("Please select a Follower or Like package.", "error");
            return;
        }

        const clientUsername = document.getElementById('target-username').value.trim();
        if (!clientUsername) {
            this.showToast("Please enter your Facebook Profile/Page link.", "error");
            document.getElementById('target-username').focus();
            return;
        }

        // 2. Format Referrer
        let referrerText = "Direct";
        if (AppState.hasReferrer) {
            const inputVal = document.getElementById('referrer-name').value.trim();
            if (inputVal) referrerText = inputVal;
        }

        // 3. Engage Loading UI
        this.setLoading(true);

        // 4. Construct Strings (Facebook specific metrics)
        const matrix = AppConfig.prices[AppState.country];
        let sheetPackageStr = "";
        let waPackageStr = "";
        
        if (AppState.folSelection > -1) {
            let folVol = matrix.followers[AppState.folSelection].v;
            sheetPackageStr += `${folVol} Followers. `;
            waPackageStr += `🚀 *Followers:* ${folVol.toLocaleString()}\n`;
        }
        
        if (AppState.likSelection > -1) {
            let likVol = matrix.likes[AppState.likSelection].v;
            let freeViews = likVol * 2;
            let freeShares = likVol * 0.1;
            let splits = AppState.videoSplits;
            
            sheetPackageStr += `${likVol} Likes (Split ${splits}) + ${freeViews} Views + ${freeShares} Shares.`;
            waPackageStr += `❤️ *Likes:* ${likVol.toLocaleString()} (Across ${splits} posts)\n`;
            waPackageStr += `👁️ *Free Views:* ${freeViews.toLocaleString()}\n`;
            waPackageStr += `🔄 *Free Shares:* ${freeShares.toLocaleString()}\n`;
        }

        const finalBillDisplay = document.getElementById('ui-final-price').innerText + " " + document.getElementById('ui-final-curr').innerText;

        // --- GOOGLE SHEETS INTEGRATION (EXACT MATCH) ---
        // Requires: Date (auto in Apps Script), ClientName, Service, Package, Price, Referrer
        const formData = new URLSearchParams();
        formData.append('ClientName', clientUsername);
        formData.append('Service', `Facebook Boost [${AppState.country}]`);
        formData.append('Package', sheetPackageStr.trim());
        formData.append('Price', AppState.finalMathematicalPrice.toString()); // Raw number for math
        formData.append('Referrer', referrerText);

        try {
            await fetch(AppConfig.googleSheetUrl, { 
                method: 'POST', 
                body: formData, 
                mode: 'no-cors' 
            });
        } catch (e) { 
            console.log("Sheet sync bypassed/failed, proceeding to WhatsApp."); 
        }

        // --- WHATSAPP REDIRECTION (LEGACY TEMPLATE MATCH) ---
        const waTotalDisplay = AppState.country === 'USD' ? `$${AppState.finalMathematicalPrice}` : `${AppState.finalMathematicalPrice.toLocaleString()} UGX`;
        
        let message = `*NEW FACEBOOK ORDER [${clientUsername.toUpperCase()}]*\n\n`;
        message += `*Service:* Facebook Boost\n`;
        message += `*Package:* \n${waPackageStr}\n`;
        message += `*Price:* ${waTotalDisplay}\n`;
        message += `*Referrer:* ${referrerText}\n`;
        message += `*Username/Link:* ${clientUsername}`;

        window.location.href = `https://wa.me/${AppConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        // Failsafe UI reset
        setTimeout(() => this.setLoading(false), 5000);
    },

    // --- 7. UTILITIES ---
    setLoading(isLoading) {
        AppState.isProcessing = isLoading;
        const btnNode = document.getElementById('btn-submit');
        const btnText = document.getElementById('btn-text');
        const btnIcon = document.getElementById('btn-icon');
        const btnSpinner = document.getElementById('btn-spinner');

        if (isLoading) {
            btnNode.disabled = true;
            btnText.innerText = "Securing Order...";
            btnIcon.style.display = 'none';
            btnSpinner.style.display = 'block';
        } else {
            btnNode.disabled = false;
            btnText.innerText = "Place Order";
            btnIcon.style.display = 'inline-block';
            btnSpinner.style.display = 'none';
        }
    },

    showToast(message, type = 'error') {
        const wrapper = document.getElementById('toast-wrapper');
        const toast = document.createElement('div');
        toast.className = `toast-msg ${type}-toast`;
        
        const iconClass = type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle';
        toast.innerHTML = `<i class="fas ${iconClass}"></i> <span>${message}</span>`;
        
        wrapper.appendChild(toast);
        this.triggerVibration();

        setTimeout(() => {
            toast.classList.add('hide-toast');
            toast.addEventListener('animationend', () => toast.remove());
        }, 3500);
    }
};

// Ignite the Engine
FbApp.init();