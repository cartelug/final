/**
 * ==========================================================================
 * ACCESSUG FACEBOOK ENGINE - V7 (Clean SaaS Logic)
 * ==========================================================================
 */

const Config = {
    // ---> GOOGLE SHEETS WEB APP URL <---
    sheetUrl: 'https://script.google.com/macros/s/AKfycbzsER7toUR8OwPWPic7Oqbbjz-ew2pR_HJ4Um3V9o6eVmlf730ibwF7ELv6GCekmgl2aA/exec', 
    whatsappPhone: '256762193386',
    
    // Strict Package Data
    tiers: {
        'UGX': [
            { id: 0, title: "Advanced", price: 375000, features: ["10k Followers", "3k Page Likes", "3k Reactions", "5k Post Likes"] },
            { id: 1, title: "Pro", price: 506250, features: ["15k Followers", "5k Page Likes", "5k Reactions", "10k Post Likes"] },
            { id: 2, title: "Elite", price: 618750, isHot: true, features: ["20k Followers", "7.5k Page Likes", "7.5k Reactions", "15k Post Likes"] },
            { id: 3, title: "Ultimate", price: 750000, isMax: true, features: ["30k Followers", "10k Page Likes", "10k Reactions", "20k Post Likes"] }
        ],
        'USD': [
            { id: 0, title: "Advanced", price: 100, features: ["10k Followers", "3k Page Likes", "3k Reactions", "5k Post Likes"] },
            { id: 1, title: "Pro", price: 135, features: ["15k Followers", "5k Page Likes", "5k Reactions", "10k Post Likes"] },
            { id: 2, title: "Elite", price: 165, isHot: true, features: ["20k Followers", "7.5k Page Likes", "7.5k Reactions", "15k Post Likes"] },
            { id: 3, title: "Ultimate", price: 200, isMax: true, features: ["30k Followers", "10k Page Likes", "10k Reactions", "20k Post Likes"] }
        ]
    }
};

const State = {
    region: 'UGX',
    activeTier: -1,
    hasRefCode: false,
    mathPrice: 0
};

const FbApp = {

    // --- 1. BOOTSTRAP ---
    init() {
        const savedLocation = localStorage.getItem('accessug_loc_fb');
        if (savedLocation) {
            this.setCountry(savedLocation, false);
        } else {
            this.openCountryModal();
        }

        // Listen for input to enable/disable button
        document.getElementById('fb-link').addEventListener('input', () => this.checkForm());
    },

    // --- 2. REGION CONTROLS ---
    openCountryModal() {
        document.getElementById('country-modal').setAttribute('aria-hidden', 'false');
    },

    setCountry(code, save = true) {
        if(save) localStorage.setItem('accessug_loc_fb', code);
        State.region = code;
        
        document.getElementById('country-modal').setAttribute('aria-hidden', 'true');
        document.getElementById('ui-region-badge').innerText = code;
        
        // Reset choice on currency swap
        State.activeTier = -1; 
        
        this.buildPackages();
        this.updateCart();
        this.checkForm();
    },

    // --- 3. RENDER UI ---
    buildPackages() {
        const listContainer = document.getElementById('package-list');
        listContainer.innerHTML = '';
        const data = Config.tiers[State.region];
        const symbol = State.region === 'USD' ? '$' : '';
        const currencyText = State.region === 'UGX' ? 'UGX' : 'USD';

        data.forEach((pkg) => {
            const isSelected = State.activeTier === pkg.id ? 'is-active' : '';
            
            // Generate tags
            let tagHTML = '';
            if(pkg.isHot) tagHTML = `<div class="tag-popular">Most Popular</div>`;
            if(pkg.isMax) tagHTML = `<div class="tag-popular tag-max">Maximum Impact</div>`;

            // Generate features list
            let featuresHTML = pkg.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('');

            listContainer.innerHTML += `
                <div class="pkg-card ${isSelected}" onclick="FbApp.selectPackage(${pkg.id})">
                    ${tagHTML}
                    <div class="pkg-header">
                        <h3 class="pkg-title">${pkg.title}</h3>
                        <div class="pkg-price-box">
                            <span class="pkg-price">${symbol}${pkg.price.toLocaleString()}</span>
                            <span class="pkg-currency">${currencyText}</span>
                        </div>
                    </div>
                    <ul class="pkg-features">
                        ${featuresHTML}
                    </ul>
                </div>
            `;
        });
    },

    // --- 4. INTERACTIONS ---
    selectPackage(id) {
        State.activeTier = id;
        this.buildPackages();
        this.updateCart();
        this.checkForm();
        this.vibrate();
    },

    toggleReferralUI() {
        State.hasRefCode = !State.hasRefCode;
        const drawer = document.getElementById('ref-drawer');
        const icon = document.querySelector('#btn-ref-toggle i');
        
        if (State.hasRefCode) {
            drawer.classList.add('is-visible');
            icon.classList.replace('fa-gift', 'fa-times');
            setTimeout(() => document.getElementById('ref-code').focus(), 300);
        } else {
            drawer.classList.remove('is-visible');
            icon.classList.replace('fa-times', 'fa-gift');
            document.getElementById('ref-code').value = ''; 
        }
    },

    vibrate() {
        if (navigator.vibrate) navigator.vibrate(15);
    },

    // --- 5. LOGIC & VALIDATION ---
    updateCart() {
        const valueNode = document.getElementById('ui-price-value');
        const currNode = document.getElementById('ui-price-currency');

        if (State.activeTier === -1) {
            valueNode.innerText = "0";
            currNode.innerText = State.region;
            State.mathPrice = 0;
            return;
        }

        const pkg = Config.tiers[State.region][State.activeTier];
        State.mathPrice = pkg.price;

        if (State.region === 'USD') {
            valueNode.innerText = `$${pkg.price}`;
            currNode.innerText = 'USD';
        } else {
            valueNode.innerText = pkg.price.toLocaleString();
            currNode.innerText = 'UGX';
        }
    },

    checkForm() {
        const linkInput = document.getElementById('fb-link').value.trim();
        const btn = document.getElementById('btn-pay');
        const btnText = document.getElementById('btn-text');

        if (State.activeTier > -1 && linkInput.length > 8) {
            btn.disabled = false;
            btnText.innerText = "Place Order";
        } else {
            btn.disabled = true;
            if (State.activeTier === -1) {
                btnText.innerText = "Select a Package";
            } else {
                btnText.innerText = "Enter Page Link";
            }
        }
    },

    // --- 6. CHECKOUT PROCESS ---
    submitOrder() {
        const linkInput = document.getElementById('fb-link').value.trim();
        
        // Exact Referral Logic as Requested
        let finalReferrer = "Direct";
        if (State.hasRefCode) {
            const refValue = document.getElementById('ref-code').value.trim();
            if (refValue !== "") {
                finalReferrer = refValue;
            }
        }

        const pkg = Config.tiers[State.region][State.activeTier];
        const displayPrice = State.region === 'USD' ? `$${pkg.price}` : `${pkg.price.toLocaleString()} UGX`;

        // 1. Google Sheets Background Sync
        const formData = new URLSearchParams();
        formData.append('ClientName', linkInput); // Use the link to identify the client order
        formData.append('Service', `Facebook Boost [${State.region}]`);
        formData.append('Package', `${pkg.title} Tier`);
        formData.append('Price', State.mathPrice.toString());
        formData.append('Referrer', finalReferrer); // Will be "Direct" or the name

        try {
            fetch(Config.sheetUrl, { method: 'POST', body: formData, mode: 'no-cors' });
        } catch (error) {
            console.log("Sheet sync skipped");
        }

        // 2. Format WhatsApp Message
        let msg = `🚀 *NEW FACEBOOK BOOST*\n\n`;
        msg += `*Package:* ${pkg.title} Tier\n`;
        msg += `*Price:* ${displayPrice}\n\n`;
        msg += `🔗 *Page Link:* ${linkInput}\n`;
        msg += `🎁 *Referrer:* ${finalReferrer}\n\n`;
        msg += `_I am ready to make payment. Please send the payment details._`;

        // 3. Redirect
        const waUrl = `https://wa.me/${Config.whatsappPhone}?text=${encodeURIComponent(msg)}`;
        
        // Button loading state
        document.getElementById('btn-text').innerText = "Connecting...";
        
        setTimeout(() => {
            window.location.href = waUrl;
            // Reset button text shortly after
            setTimeout(() => document.getElementById('btn-text').innerText = "Place Order", 2000);
        }, 500);
    }
};

// Start App
document.addEventListener('DOMContentLoaded', () => FbApp.init());