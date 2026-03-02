/**
 * ==========================================================================
 * ACCESSUG ELITE YOUTUBE ENGINE (CINEMATIC OBSIDIAN)
 * Features: Trust Slider, Plain Text WhatsApp Sync, Lock-in
 * ==========================================================================
 */

const SysConfig = {
    // ⚠️ Replace with your deployed Web App URL
    sheetURL: 'https://script.google.com/macros/s/AKfycbzsER7toUR8OwPWPic7Oqbbjz-ew2pR_HJ4Um3V9o6eVmlf730ibwF7ELv6GCekmgl2aA/exec', 
    whatsapp: '256762193386',
    
    // Core YouTube Tiers
    matrix: {
        'UGX': [
            { id: 0, title: "Starter", price: 262500, perks: ["1k Subscribers", "5k Views", "2k Likes", "1-5 Videos"] },
            { id: 1, title: "Kickstart", price: 412500, perks: ["2k Subscribers", "7k Views", "3.5k Likes", "1-5 Videos"] },
            { id: 2, title: "Growth", price: 600000, isHot: true, perks: ["3.5k Subscribers", "9k Views", "5k Likes", "1-10 Videos"] },
            { id: 3, title: "Authority", price: 862500, perks: ["5.5k Subscribers", "11k Views", "6.5k Likes", "1-10 Videos"] },
            { id: 4, title: "Viral", price: 1162500, perks: ["7.5k Subscribers", "13k Views", "8k Likes", "1-10 Videos"] },
            { id: 5, title: "Domination", price: 1500000, isMax: true, perks: ["10k Subscribers", "15k Views", "10k Likes", "1-10 Videos"] }
        ],
        'USD': [
            { id: 0, title: "Starter", price: 70, perks: ["1k Subscribers", "5k Views", "2k Likes", "1-5 Videos"] },
            { id: 1, title: "Kickstart", price: 110, perks: ["2k Subscribers", "7k Views", "3.5k Likes", "1-5 Videos"] },
            { id: 2, title: "Growth", price: 160, isHot: true, perks: ["3.5k Subscribers", "9k Views", "5k Likes", "1-10 Videos"] },
            { id: 3, title: "Authority", price: 230, perks: ["5.5k Subscribers", "11k Views", "6.5k Likes", "1-10 Videos"] },
            { id: 4, title: "Viral", price: 310, perks: ["7.5k Subscribers", "13k Views", "8k Likes", "1-10 Videos"] },
            { id: 5, title: "Domination", price: 400, isMax: true, perks: ["10k Subscribers", "15k Views", "10k Likes", "1-10 Videos"] }
        ]
    }
};

const State = {
    geo: 'UGX',
    countryCode: 'UG',
    selectedId: -1,
    refActive: false,
    calcPrice: 0
};

const YtApp = {

    init() {
        const savedGeo = localStorage.getItem('accessug_curr_yt');
        const savedCode = localStorage.getItem('accessug_code_yt');
        
        if (savedGeo && savedCode) {
            this.setCountry(savedGeo, savedCode, false);
        } else {
            document.getElementById('country-modal').setAttribute('aria-hidden', 'false');
        }

        // Live Event Listeners
        document.getElementById('client-name').addEventListener('input', () => this.validateFlow());
        document.getElementById('client-number').addEventListener('input', () => this.validateFlow());
        document.getElementById('yt-link').addEventListener('input', () => this.validateFlow());
    },

    setCountry(currency, code, save = true) {
        if(save) {
            localStorage.setItem('accessug_curr_yt', currency);
            localStorage.setItem('accessug_code_yt', code);
        }
        State.geo = currency;
        State.countryCode = code;
        
        document.getElementById('country-modal').setAttribute('aria-hidden', 'true');
        
        const phoneInput = document.getElementById('client-number');
        if (code === 'UG') phoneInput.placeholder = "E.g. +256 700 000 000";
        else if (code === 'SS') phoneInput.placeholder = "E.g. +211 000 000 000";
        else if (code === 'CD') phoneInput.placeholder = "E.g. +243 000 000 000";

        State.selectedId = -1; 
        
        this.renderGrid();
        this.updateDock();
        this.validateFlow();
    },

    renderGrid() {
        const grid = document.getElementById('package-list');
        grid.innerHTML = '';
        
        const tiers = SysConfig.matrix[State.geo];
        const sym = State.geo === 'USD' ? '$' : '';
        const cur = State.geo === 'UGX' ? 'UGX' : 'USD';

        tiers.forEach((tier) => {
            const isAct = State.selectedId === tier.id ? 'active' : '';
            
            let tag = '';
            if(tier.isHot) tag = `<div class="badge-tag hot">Most Popular</div>`;
            if(tier.isMax) tag = `<div class="badge-tag max">Max Authority</div>`;

            let icons = ['fa-users', 'fa-eye', 'fa-thumbs-up', 'fa-video'];
            let listHTML = tier.perks.map((p, i) => `<li><i class="fas ${icons[i]} f-icon"></i> ${p}</li>`).join('');

            grid.innerHTML += `
                <div class="pack-card ${isAct}" onclick="YtApp.selectTier(${tier.id})">
                    ${tag}
                    <div class="pack-header">
                        <h3 class="pack-name">${tier.title}</h3>
                        <div class="pack-price-box">
                            <span class="pack-price">${sym}${tier.price.toLocaleString()}</span>
                            <span class="pack-curr">${cur}</span>
                        </div>
                    </div>
                    <ul class="pack-features">
                        ${listHTML}
                    </ul>
                </div>
            `;
        });
    },

    selectTier(id) {
        State.selectedId = id;
        this.renderGrid();
        this.updateDock();
        this.validateFlow();
        
        if (navigator.vibrate) navigator.vibrate(15);
        
        setTimeout(() => {
            document.getElementById('details-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
    },

    toggleReferral() {
        State.refActive = !State.refActive;
        const drawer = document.getElementById('ref-drawer');
        const btn = document.getElementById('ref-btn');
        
        if (State.refActive) {
            drawer.classList.add('show');
            btn.classList.add('active');
            setTimeout(() => document.getElementById('ref-code').focus(), 300);
        } else {
            drawer.classList.remove('show');
            btn.classList.remove('active');
            document.getElementById('ref-code').value = ''; 
        }
    },

    updateDock() {
        const valUI = document.getElementById('ui-val');
        const curUI = document.getElementById('ui-curr');

        if (State.selectedId === -1) {
            valUI.innerText = "0";
            curUI.innerText = State.geo;
            State.calcPrice = 0;
            return;
        }

        const tier = SysConfig.matrix[State.geo][State.selectedId];
        State.calcPrice = tier.price;

        if (State.geo === 'USD') {
            valUI.innerText = `$${tier.price}`;
            curUI.innerText = 'USD';
        } else {
            valUI.innerText = tier.price.toLocaleString();
            curUI.innerText = 'UGX';
        }
    },

    validateFlow() {
        const nameVal = document.getElementById('client-name').value.trim();
        const numVal = document.getElementById('client-number').value.trim();
        const linkVal = document.getElementById('yt-link').value.trim();
        const btn = document.getElementById('btn-submit');
        const txt = document.getElementById('btn-text');

        if (State.selectedId > -1 && nameVal.length > 2 && numVal.length > 8 && linkVal.length > 2) {
            btn.disabled = false;
            txt.innerText = "Place Order";
        } else {
            btn.disabled = true;
            if (State.selectedId === -1) txt.innerText = "Select Package";
            else if (nameVal.length <= 2) txt.innerText = "Enter Your Name";
            else if (numVal.length <= 8) txt.innerText = "Enter WhatsApp Number";
            else txt.innerText = "Enter YouTube Handle/Link";
        }
    },

    openTrustModal() {
        if (document.getElementById('btn-submit').disabled) return;
        
        const tier = SysConfig.matrix[State.geo][State.selectedId];
        const displayPrice = State.geo === 'USD' ? `$${tier.price}` : `${tier.price.toLocaleString()} UGX`;
        const targetName = document.getElementById('yt-link').value.trim();

        document.getElementById('sum-target').innerText = targetName;
        document.getElementById('sum-package').innerText = `${tier.title} Tier`;
        document.getElementById('sum-price').innerText = displayPrice;

        this.nextSlide(1);
        document.getElementById('trust-modal').setAttribute('aria-hidden', 'false');
    },

    closeTrustModal() {
        document.getElementById('trust-modal').setAttribute('aria-hidden', 'true');
    },

    nextSlide(stepNumber) {
        document.querySelectorAll('.slider-pane').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.dot').forEach(el => el.classList.remove('active'));
        
        document.getElementById(`slide-${stepNumber}`).classList.add('active');
        document.getElementById(`dot-${stepNumber}`).classList.add('active');
    },

    finalizeOrder() {
        const clientName = document.getElementById('client-name').value.trim();
        const rawNumber = document.getElementById('client-number').value.trim();
        const pageLink = document.getElementById('yt-link').value.trim();
        const refInput = document.getElementById('ref-code').value.trim();
        
        // Plain text sanitizer
        const cleanNumber = rawNumber.replace(/\D/g, ''); 
        const sheetNumber = "'" + cleanNumber; 

        const finalReferrer = (State.refActive && refInput !== "") ? refInput : "Direct";

        const tier = SysConfig.matrix[State.geo][State.selectedId];
        const displayPrice = State.geo === 'USD' ? `$${tier.price}` : `${tier.price.toLocaleString()} UGX`;

        // 1. Google Sheets Sync
        const payload = new URLSearchParams();
        payload.append('ClientName', clientName);
        payload.append('Number', sheetNumber);
        payload.append('Service', `YouTube Boost [${State.geo}]`);
        payload.append('Package', `${tier.title} Tier`);
        payload.append('Price', State.calcPrice.toString());
        payload.append('Referrer', finalReferrer);

        try {
            fetch(SysConfig.sheetURL, { method: 'POST', body: payload, mode: 'no-cors' });
        } catch (err) {
            console.log("Sheet sync bypassed");
        }

        // 2. WhatsApp Bridge
        let msg = `🚀 *NEW YOUTUBE BOOST*\n\n`;
        msg += `*Client Name:* ${clientName}\n`;
        msg += `*WhatsApp:* ${cleanNumber}\n`;
        msg += `*Package:* ${tier.title} Tier\n`;
        msg += `*Total:* ${displayPrice}\n\n`;
        msg += `🎥 *Channel Link:* ${pageLink}\n`;
        msg += `🎁 *Referrer:* ${finalReferrer}\n\n`;
        msg += `_I have accepted the terms and am ready to pay the 30% deposit._`;

        const btn = document.getElementById('btn-final-confirm');
        document.getElementById('final-btn-text').innerText = "Securing...";
        btn.querySelector('i').classList.replace('fa-whatsapp', 'fa-circle-notch');
        btn.querySelector('i').classList.add('fa-spin');
        btn.style.opacity = '0.8';
        btn.style.pointerEvents = 'none';
        
        setTimeout(() => {
            window.location.href = `https://wa.me/${SysConfig.whatsapp}?text=${encodeURIComponent(msg)}`;
            
            setTimeout(() => {
                this.closeTrustModal();
                document.getElementById('final-btn-text').innerText = "Confirm & Proceed";
                btn.querySelector('i').classList.replace('fa-circle-notch', 'fa-whatsapp');
                btn.querySelector('i').classList.remove('fa-spin');
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            }, 2000);
        }, 1000);
    }
};

document.addEventListener('DOMContentLoaded', () => YtApp.init());