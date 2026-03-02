/**
 * ==========================================================================
 * ACCESSUG FACEBOOK ENGINE (V6 - BENTO BUNDLE LOGIC)
 * ==========================================================================
 */

const AppConfig = {
    // ---> GOOGLE SHEETS WEB APP URL <---
    googleSheetUrl: 'https://script.google.com/macros/s/AKfycbzsER7toUR8OwPWPic7Oqbbjz-ew2pR_HJ4Um3V9o6eVmlf730ibwF7ELv6GCekmgl2aA/exec', 
    whatsappNumber: '256762193386',
    
    // Exact Specifications Provided
    packages: {
        'UGX': [
            { id: 0, name: "Advanced", price: 375000, specs: ["10k Followers", "3k Page Likes", "3k Reactions", "5k Post Likes (1-5 posts)"] },
            { id: 1, name: "Pro", price: 506250, specs: ["15k Followers", "5k Page Likes", "5k Reactions", "10k Post Likes (1-10 posts)"] },
            { id: 2, name: "Elite", price: 618750, isPopular: true, specs: ["20k Followers", "7.5k Page Likes", "7.5k Reactions", "15k Post Likes (1-10 posts)"] },
            { id: 3, name: "Ultimate", price: 750000, isMax: true, specs: ["30k Followers", "10k Page Likes", "10k Reactions", "20k Post Likes (1-15 posts)"] }
        ],
        'USD': [
            { id: 0, name: "Advanced", price: 100, specs: ["10k Followers", "3k Page Likes", "3k Reactions", "5k Post Likes (1-5 posts)"] },
            { id: 1, name: "Pro", price: 135, specs: ["15k Followers", "5k Page Likes", "5k Reactions", "10k Post Likes (1-10 posts)"] },
            { id: 2, name: "Elite", price: 165, isPopular: true, specs: ["20k Followers", "7.5k Page Likes", "7.5k Reactions", "15k Post Likes (1-10 posts)"] },
            { id: 3, name: "Ultimate", price: 200, isMax: true, specs: ["30k Followers", "10k Page Likes", "10k Reactions", "20k Post Likes (1-15 posts)"] }
        ]
    }
};

const AppState = {
    country: 'UGX',
    selectedTierId: -1,
    hasReferrer: false,
    isProcessing: false,
    finalMathematicalPrice: 0
};

const FbApp = {

    // --- 1. INITIALIZATION ---
    init() {
        const savedRegion = localStorage.getItem('accessug_loc_fb');
        if (savedRegion) {
            this.setCountry(savedRegion, false);
        } else {
            this.openCountryModal();
        }

        // Real-time validation for button state
        document.getElementById('target-page').addEventListener('input', () => this.validateState());
    },

    // --- 2. REGION/MODAL HANDLING ---
    openCountryModal() {
        document.getElementById('country-modal').setAttribute('aria-hidden', 'false');
    },

    setCountry(code, saveToMemory = true) {
        if(saveToMemory) localStorage.setItem('accessug_loc_fb', code);
        AppState.country = code;
        
        document.getElementById('country-modal').setAttribute('aria-hidden', 'true');
        document.getElementById('ui-region-badge').innerText = code;
        
        // Reset selection on currency change to avoid visual bugs
        AppState.selectedTierId = -1;
        
        this.renderPackages();
        this.updateDock();
        this.validateState();
    },

    // --- 3. UI RENDERING ---
    renderPackages() {
        const grid = document.getElementById('grid-packages');
        grid.innerHTML = '';
        const matrix = AppConfig.packages[AppState.country];
        const symbol = AppState.country === 'USD' ? '$' : '';
        const suffix = AppState.country === 'UGX' ? ' UGX' : '';

        matrix.forEach((tier) => {
            const isActive = AppState.selectedTierId === tier.id ? 'selected' : '';
            
            // Build Specification List
            let specsHTML = '';
            const icons = ['fa-users', 'fa-thumbs-up', 'fa-heart', 'fa-comment-dots'];
            tier.specs.forEach((spec, i) => {
                specsHTML += `<li><i class="fas ${icons[i] || 'fa-check'}"></i> ${spec}</li>`;
            });

            // Special Tags
            let tagHTML = '';
            if(tier.isPopular) tagHTML = `<div class="pkg-tag elite">Most Popular</div>`;
            if(tier.isMax) tagHTML = `<div class="pkg-tag">Max Impact</div>`;

            grid.innerHTML += `
                <div class="package-btn ${isActive}" onclick="FbApp.selectTier(${tier.id})">
                    ${tagHTML}
                    <div class="pkg-header">
                        <span class="pkg-name">${tier.name}</span>
                        <span class="pkg-price">${symbol}${tier.price.toLocaleString()}${suffix}</span>
                    </div>
                    <ul class="pkg-specs">
                        ${specsHTML}
                    </ul>
                </div>
            `;
        });
    },

    // --- 4. INTERACTIONS ---
    selectTier(id) {
        if (AppState.isProcessing) return;
        AppState.selectedTierId = id;
        
        this.renderPackages();
        this.updateDock();
        this.validateState();
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

    // --- 5. STATE VALIDATION & MATH ---
    updateDock() {
        const btnSubmit = document.getElementById('btn-submit');
        const btnText = document.getElementById('btn-text');

        if (AppState.selectedTierId === -1) {
            document.getElementById('ui-tier-name').innerText = "None Selected";
            document.getElementById('ui-final-price').innerText = "0";
            document.getElementById('ui-final-curr').innerText = AppState.country;
            btnText.innerText = "Select a Tier";
            AppState.finalMathematicalPrice = 0;
            return;
        }

        const selectedPackage = AppConfig.packages[AppState.country][AppState.selectedTierId];
        AppState.finalMathematicalPrice = selectedPackage.price;

        document.getElementById('ui-tier-name').innerText = `${selectedPackage.name} Tier`;
        
        if (AppState.country === 'USD') {
            document.getElementById('ui-final-price').innerText = `$${selectedPackage.price}`;
            document.getElementById('ui-final-curr').innerText = '';
        } else {
            document.getElementById('ui-final-price').innerText = selectedPackage.price.toLocaleString();
            document.getElementById('ui-final-curr').innerText = 'UGX';
        }
    },

    validateState() {
        const btnNode = document.getElementById('btn-submit');
        const pageLink = document.getElementById('target-page').value.trim();
        const btnText = document.getElementById('btn-text');

        if (AppState.selectedTierId > -1 && pageLink.length > 5) {
            btnNode.disabled = false;
            btnText.innerText = "Place Order";
        } else {
            btnNode.disabled = true;
            if(AppState.selectedTierId === -1) {
                btnText.innerText = "Select a Tier";
            } else {
                btnText.innerText = "Enter Page Link";
            }
        }
    },

    // --- 6. CHECKOUT PIPELINE ---
    async processCheckout() {
        if (AppState.isProcessing) return;

        const pageLink = document.getElementById('target-page').value.trim();
        const postLinks = document.getElementById('target-posts').value.trim() || "None provided";
        let referrerText = "Direct";
        
        if (AppState.hasReferrer) {
            const inputVal = document.getElementById('referrer-name').value.trim();
            if (inputVal) referrerText = inputVal;
        }

        this.setLoading(true);

        const matrix = AppConfig.packages[AppState.country];
        const pkg = matrix[AppState.selectedTierId];
        
        // --- GOOGLE SHEETS INTEGRATION ---
        const formData = new URLSearchParams();
        formData.append('ClientName', pageLink); // Using link as identifier
        formData.append('Service', `Facebook Authority [${AppState.country}]`);
        formData.append('Package', `${pkg.name} Tier`);
        formData.append('Price', AppState.finalMathematicalPrice.toString());
        formData.append('Referrer', referrerText);

        try {
            // Background sync (Fire & Forget)
            fetch(AppConfig.googleSheetUrl, { 
                method: 'POST', 
                body: formData, 
                mode: 'no-cors' 
            });
        } catch (e) { 
            console.log("Sheet sync bypassed"); 
        }

        // --- WHATSAPP REDIRECTION ---
        const waTotalDisplay = AppState.country === 'USD' ? `$${pkg.price}` : `${pkg.price.toLocaleString()} UGX`;
        
        let message = `🚀 *NEW FACEBOOK ORDER*\n\n`;
        message += `*Tier:* ${pkg.name} Authority\n`;
        message += `*Price:* ${waTotalDisplay}\n\n`;
        message += `🔗 *Page Link:* ${pageLink}\n`;
        message += `📌 *Post Links:* ${postLinks}\n`;
        message += `🎁 *Referrer:* ${referrerText}\n\n`;
        message += `_I am ready to complete payment. Please provide gateway info._`;

        setTimeout(() => {
            window.location.href = `https://wa.me/${AppConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
            this.setLoading(false); // Reset UI after delay
        }, 800);
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
            this.validateState(); // Restores text properly
            btnIcon.style.display = 'inline-block';
            btnSpinner.style.display = 'none';
        }
    }
};

// Ignite App
document.addEventListener('DOMContentLoaded', () => FbApp.init());