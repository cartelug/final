/**
 * ==========================================================================
 * ACCESSUG TIKTOK ENGINE
 * ==========================================================================
 * Features:
 * - Strict Pricing Arrays (No sliding math, snaps to exact points)
 * - Dynamic Free Views Injection (1k Likes = 2k Views)
 * - Combo Discounting (10% if both active)
 * - Absolute Limits ($35/50k Min, $100/360k Max)
 * - Asynchronous Google Sheets Sync (Strict Column Order)
 * - WhatsApp Bridge
 * ==========================================================================
 */

const AccessConfig = {
    // ---> IMPORTANT: REPLACE WITH YOUR GOOGLE SCRIPT WEB APP URL <---
    googleSheetUrl: 'YOUR_GOOGLE_SCRIPT_URL_HERE', 
    whatsappNumber: '256762193386',
    
    // The exact mathematical arrays provided by the business logic
    prices: {
        'UGX': {
            followers: [ 
                { volume: 1000, cost: 75000 }, 
                { volume: 4000, cost: 141000 }, 
                { volume: 7000, cost: 208000 }, 
                { volume: 10000, cost: 250000 } 
            ],
            likes: [ 
                { volume: 1000, cost: 50000 }, 
                { volume: 4000, cost: 83000 }, 
                { volume: 7000, cost: 116000 }, 
                { volume: 10000, cost: 150000 } 
            ],
            rules: { minFloor: 50000, maxCeiling: 360000, currency: 'UGX' }
        },
        'USD': {
            followers: [ 
                { volume: 3000, cost: 35 }, 
                { volume: 5000, cost: 50 }, 
                { volume: 8000, cost: 75 }, 
                { volume: 10000, cost: 100 } 
            ],
            likes: [ 
                { volume: 2500, cost: 35 }, 
                { volume: 5000, cost: 50 }, 
                { volume: 7500, cost: 75 }, 
                { volume: 10000, cost: 100 } 
            ],
            rules: { minFloor: 35, maxCeiling: 100, currency: '$' }
        }
    }
};

// Global App State
const AppState = {
    countryMode: 'UGX',
    packages: {
        followers: { isActive: true, selectedIndex: 0 },
        likes: { isActive: false, selectedIndex: 0, splitVideos: 5 }
    },
    isSubmitting: false
};

const TikTokApp = {
    
    // --- 1. BOOTSTRAP ---
    init() {
        // Check if user has visited before
        const savedCountry = localStorage.getItem('access_tiktok_country');
        if (savedCountry) {
            this.setCountry(savedCountry, false);
        } else {
            this.openCountryModal();
        }

        // Add easy 'Enter' key submit for the input
        document.getElementById('user-tiktok-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitOrder();
        });
    },

    // --- 2. COUNTRY MANAGEMENT ---
    openCountryModal() {
        document.getElementById('country-modal').setAttribute('aria-hidden', 'false');
    },

    setCountry(countryCode, saveToStorage = true) {
        if (saveToStorage) localStorage.setItem('access_tiktok_country', countryCode);
        AppState.countryMode = countryCode;
        
        // Close modal and update top nav text
        document.getElementById('country-modal').setAttribute('aria-hidden', 'true');
        document.getElementById('nav-currency-label').innerText = countryCode;
        
        // Reset selections to defaults when switching countries
        AppState.packages.followers.isActive = true;
        AppState.packages.likes.isActive = false;
        AppState.packages.followers.selectedIndex = 0;
        AppState.packages.likes.selectedIndex = 0;
        
        this.renderInterface();
    },

    // --- 3. UI RENDERING (Building the buttons) ---
    renderInterface() {
        // Toggle the visual state of the massive cards
        const cardFol = document.getElementById('section-followers');
        const cardLik = document.getElementById('section-likes');
        
        AppState.packages.followers.isActive ? cardFol.classList.add('active-card') : cardFol.classList.remove('active-card');
        AppState.packages.likes.isActive ? cardLik.classList.add('active-card') : cardLik.classList.remove('active-card');

        // Draw the buttons
        this.drawButtons('followers');
        this.drawButtons('likes');

        // Calculate and update the bottom bar
        this.runCalculations();
    },

    drawButtons(serviceName) {
        const matrix = AccessConfig.prices[AppState.countryMode][serviceName];
        const container = document.getElementById(`grid-${serviceName}`);
        container.innerHTML = ''; // Clear old buttons

        matrix.forEach((tier, idx) => {
            // Check if this specific button is the selected one
            const isSelected = AppState.packages[serviceName].selectedIndex === idx ? 'is-selected' : '';
            
            // Format numbers nicely (e.g., 1000 -> 1k)
            const displayVolume = tier.volume >= 1000 ? (tier.volume / 1000) + 'k' : tier.volume;
            const displayPrice = AppState.countryMode === 'USD' ? `$${tier.cost}` : `${tier.cost.toLocaleString()} UGX`;
            
            container.innerHTML += `
                <div class="pack-btn ${isSelected}" onclick="TikTokApp.pickPackage('${serviceName}', ${idx})">
                    <span class="p-amount">${displayVolume}</span>
                    <span class="p-price">${displayPrice}</span>
                </div>
            `;
        });
    },

    // --- 4. USER INTERACTIONS ---
    toggleService(serviceName) {
        if (AppState.isSubmitting) return;
        AppState.packages[serviceName].isActive = !AppState.packages[serviceName].isActive;
        this.renderInterface();
    },

    pickPackage(serviceName, idx) {
        if (AppState.isSubmitting) return;
        event.stopPropagation(); // Stops the big card from toggling off
        
        AppState.packages[serviceName].selectedIndex = idx;
        
        // If they click a button inside an inactive card, turn the card on automatically
        if (!AppState.packages[serviceName].isActive) {
            AppState.packages[serviceName].isActive = true;
        }
        
        this.renderInterface();
    },

    changeSplit(direction) {
        if (AppState.isSubmitting) return;
        
        let currentSplit = AppState.packages.likes.splitVideos;
        currentSplit += direction;
        
        // Keep split between 1 and 10 videos
        if (currentSplit < 1) currentSplit = 1;
        if (currentSplit > 10) currentSplit = 10;
        
        AppState.packages.likes.splitVideos = currentSplit;
        document.getElementById('split-display').innerText = currentSplit;
        
        this.runCalculations(); // Update the math text
    },

    // --- 5. THE BRAIN (Math, Discounts, Limits) ---
    runCalculations() {
        const matrix = AccessConfig.prices[AppState.countryMode];
        const folData = matrix.followers[AppState.packages.followers.selectedIndex];
        const likData = matrix.likes[AppState.packages.likes.selectedIndex];

        // 1. Calculate Free Views and Video Splitting text
        const freeViewsAmount = likData.volume * 2;
        const splitCount = AppState.packages.likes.splitVideos;
        
        document.getElementById('free-views-text').innerText = `You get ${freeViewsAmount.toLocaleString()} free views with this package.`;
        
        const likesPerVideo = Math.floor(likData.volume / splitCount);
        const viewsPerVideo = Math.floor(freeViewsAmount / splitCount);
        document.getElementById('split-math-text').innerText = `Around ${likesPerVideo.toLocaleString()} likes & ${viewsPerVideo.toLocaleString()} views per video`;

        // 2. Calculate Base Price
        let rawPrice = 0;
        let activeServices = 0;

        if (AppState.packages.followers.isActive) {
            rawPrice += folData.cost;
            activeServices++;
        }
        if (AppState.packages.likes.isActive) {
            rawPrice += likData.cost;
            activeServices++;
        }

        let finalPriceToPay = rawPrice;
        
        // UI Elements
        const uiComboTag = document.getElementById('tag-combo');
        const uiMaxTag = document.getElementById('tag-max');
        const uiOldPrice = document.getElementById('ui-old-price');
        const uiFinalPrice = document.getElementById('ui-final-price');
        const uiCurrency = document.getElementById('ui-currency');

        // Reset UI
        uiComboTag.style.display = 'none';
        uiMaxTag.style.display = 'none';
        uiOldPrice.innerText = '';

        // 3. Apply 10% Bundle Discount
        if (activeServices === 2 && rawPrice > 0) {
            finalPriceToPay = rawPrice * 0.90;
            uiComboTag.style.display = 'flex';
            uiOldPrice.innerText = AppState.countryMode === 'USD' ? `$${rawPrice}` : rawPrice.toLocaleString();
        }

        // 4. Enforce Hard Limits
        if (activeServices > 0) {
            // Floor Check
            if (finalPriceToPay < matrix.rules.minFloor) {
                finalPriceToPay = matrix.rules.minFloor;
            }
            // Ceiling Check
            if (finalPriceToPay >= matrix.rules.maxCeiling) {
                finalPriceToPay = matrix.rules.maxCeiling;
                uiComboTag.style.display = 'none'; // Max Tag takes priority over Combo Tag
                uiMaxTag.style.display = 'flex';
                uiOldPrice.innerText = ''; 
            }
        } else {
            finalPriceToPay = 0;
        }

        // 5. Render Final Numbers
        if (AppState.countryMode === 'USD') {
            uiFinalPrice.innerText = `$${finalPriceToPay}`;
            uiCurrency.innerText = '';
        } else {
            uiFinalPrice.innerText = finalPriceToPay.toLocaleString();
            uiCurrency.innerText = 'UGX';
        }
    },

    // --- 6. FORM SUBMISSION & API SYNC ---
    submitOrder() {
        if (AppState.isSubmitting) return;

        // Validate Services
        let activeServices = Object.keys(AppState.packages).filter(key => AppState.packages[key].isActive).length;
        if (activeServices === 0) {
            this.triggerToast("Please choose Followers or Likes first.", "error");
            return;
        }

        // Validate Input
        const clientIdentifier = document.getElementById('user-tiktok-name').value.trim();
        if (!clientIdentifier) {
            this.triggerToast("We need your TikTok Username.", "error");
            document.getElementById('user-tiktok-name').focus();
            return;
        }

        // Engage Loading State
        this.setLoading(true);

        // Compile Data for Google Sheets
        const matrix = AccessConfig.prices[AppState.countryMode];
        let sheetPackageString = "";
        let waMessageBody = "";
        
        if (AppState.packages.followers.isActive) {
            let fVol = matrix.followers[AppState.packages.followers.selectedIndex].volume;
            sheetPackageString += `${fVol} Followers. `;
            waMessageBody += `🚀 *Followers:* ${fVol.toLocaleString()}\n`;
        }
        
        if (AppState.packages.likes.isActive) {
            let lVol = matrix.likes[AppState.packages.likes.selectedIndex].volume;
            let vVol = lVol * 2;
            let splits = AppState.packages.likes.splitVideos;
            sheetPackageString += `${lVol} Likes (Split ${splits}) + ${vVol} Views.`;
            waMessageBody += `❤️ *Likes:* ${lVol.toLocaleString()} (Across ${splits} videos)\n`;
            waMessageBody += `👁️ *Free Views:* ${vVol.toLocaleString()}\n`;
        }

        const finalBillText = document.getElementById('ui-final-price').innerText + " " + document.getElementById('ui-currency').innerText;

        // Construct Google Sheet Columns exactly as requested:
        // [Date (auto)], [Client Name], [Service], [Package], [Price], [Referrer]
        const sheetData = new FormData();
        sheetData.append('Client Name', clientIdentifier);
        sheetData.append('Service', `TikTok Boost [${AppState.countryMode}]`);
        sheetData.append('Package', sheetPackageString.trim());
        sheetData.append('Price', finalBillText.trim());
        sheetData.append('Referrer', 'Direct UI'); // Safe default

        // Async fetch to Google
        fetch(AccessConfig.sheetsEndpoint, { method: 'POST', body: sheetData })
            .then(response => {
                
                // Build clean WhatsApp message based on previous template structures
                let waMessage = `*NEW TIKTOK ORDER [${AppState.countryMode}]*\n\n`;
                waMessage += `*Username:* ${clientIdentifier}\n\n`;
                waMessage += waMessageBody;
                
                if (activeServices === 2) {
                    let rawCost = matrix.followers[AppState.packages.followers.selectedIndex].cost + matrix.likes[AppState.packages.likes.selectedIndex].cost;
                    if ((rawCost * 0.90) >= matrix.rules.maxCeiling) {
                        waMessage += `\n👑 *VIP Best Price Applied*\n`;
                    } else {
                        waMessage += `\n🎁 *10% Bundle Discount*\n`;
                    }
                }

                waMessage += `\n*Total Due:* ${finalBillText.trim()}`;

                // Redirect to WhatsApp
                window.location.href = `https://wa.me/${AccessConfig.whatsappNumber}?text=${encodeURIComponent(waMessage)}`;
            })
            .catch(error => {
                console.error('Sheet Sync Failed:', error);
                this.triggerToast("Check your internet connection and try again.", "error");
                this.setLoading(false);
            });
    },

    // --- 7. UTILITY FUNCTIONS ---
    setLoading(isLoading) {
        AppState.isSubmitting = isLoading;
        const btnNode = document.getElementById('btn-submit-order');
        const btnText = document.getElementById('btn-submit-text');
        const btnIcon = document.getElementById('btn-submit-icon');
        const btnSpinner = document.getElementById('btn-loading-spinner');

        if (isLoading) {
            btnNode.disabled = true;
            btnText.innerText = "Saving Order...";
            btnIcon.style.display = 'none';
            btnSpinner.style.display = 'block';
        } else {
            btnNode.disabled = false;
            btnText.innerText = "Order Now";
            btnIcon.style.display = 'inline-block';
            btnSpinner.style.display = 'none';
        }
    },

    triggerToast(message, type = 'error') {
        const wrapper = document.getElementById('toast-wrapper');
        const toast = document.createElement('div');
        toast.className = `toast-msg ${type}-toast`;
        
        const iconClass = type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        toast.innerHTML = `<i class="fas ${iconClass}"></i> <span>${message}</span>`;
        
        wrapper.appendChild(toast);

        // Vibrate if on mobile for errors
        if (navigator.vibrate) navigator.vibrate(20);

        setTimeout(() => {
            toast.classList.add('hide-toast');
            toast.addEventListener('animationend', () => toast.remove());
        }, 3500);
    }
};

// Start the App
TikTokApp.init();