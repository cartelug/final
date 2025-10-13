document.addEventListener('DOMContentLoaded', () => {
    const whatsappNumber = "256762193386";
    const isInstagram = document.body.classList.contains('instagram-theme');
    const serviceName = isInstagram ? "Instagram Growth" : "TikTok Growth";
    const usernamePlaceholder = isInstagram ? "@your_instagram_username" : "@your_tiktok_username";
    
    const flowContainer = document.getElementById('concierge-flow');

    const packagesData = [
        { tier: 'Starter Boost', desc: 'Perfect for testing quick traction.', ugx: 69000, features: '1K Followers + 10K Views + 1K Likes' },
        { tier: 'Creator Growth', desc: 'Ideal for consistent engagement.', ugx: 129000, features: '3K Followers + 25K Views + 3K Likes' },
        { tier: 'Viral Plus', desc: 'Balanced exposure & strong reach.', ugx: 189000, features: '5K Followers + 50K Views + 5K Likes' },
        { tier: 'Influencer Pro', desc: 'For creators chasing consistency.', ugx: 259000, features: '8K Followers + 100K Views + 8K Likes' },
        { tier: 'Elite Empire', desc: 'Dominance package for instant authority.', ugx: 360000, features: '12K Followers + 200K Views + 12K Likes' }
    ];

    const order = {
        package: null,
        price: null,
        clientName: null,
        username: null,
        paymentMethod: null
    };

    let currentCurrency = 'UGX';

    // ---- Helper Functions ----
    const createStep = (id) => {
        const step = document.createElement('section');
        step.id = id;
        step.className = 'flow-step';
        flowContainer.appendChild(step);
        return step;
    };

    const createPrompt = (html) => `<p class="prompt-message">${html}</p>`;

    const calculatePrices = (baseUGX) => {
        const multipliers = [2.0, 1.8, 1.67, 1.54, 1.43];
        const tierIndex = packagesData.findIndex(p => p.ugx === baseUGX);
        const oldUGX = baseUGX * multipliers[tierIndex];
        return {
            UGX: { new: baseUGX, old: Math.round(oldUGX / 1000) * 1000 },
            SSP: { new: baseUGX * 1.8, old: Math.round(oldUGX * 1.8 / 1000) * 1000 },
            USD: { new: Math.round(baseUGX / 3600), old: Math.round(oldUGX / 3600) }
        };
    };

    // ---- Flow Steps ----
    function showCurrencyStep() {
        const step = createStep('step-currency');
        step.innerHTML = `
            ${createPrompt('First, please select your <span class="highlight">currency.</span>')}
            <div class="currency-selector">
                <button class="currency-btn active" data-currency="UGX">🇺🇬 UGX</button>
                <button class="currency-btn" data-currency="SSP">🇸🇸 SSP</button>
                <button class="currency-btn" data-currency="USD">🇺🇸 USD</button>
            </div>
        `;
        step.querySelectorAll('.currency-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentCurrency = btn.dataset.currency;
                step.querySelectorAll('.currency-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                showPackageStep();
            });
        });
    }

    function showPackageStep() {
        let step = document.getElementById('step-packages');
        if (step) step.remove(); // Remove old step if currency is changed

        step = createStep('step-packages');
        step.innerHTML = `${createPrompt('Which <span class="highlight">package</span> aligns with your goals?')}`;
        const grid = document.createElement('div');
        grid.className = 'package-grid';

        packagesData.forEach(pkg => {
            const prices = calculatePrices(pkg.ugx);
            const card = document.createElement('div');
            card.className = 'package-card';
            card.innerHTML = `
                <h3>${pkg.tier}</h3>
                <p class="features">${pkg.features}</p>
                <div class="price">
                    <span class="old-price">~~${prices[currentCurrency].old.toLocaleString()} ${currentCurrency}~~</span>
                    <span class="new-price">${prices[currentCurrency].new.toLocaleString()} ${currentCurrency}</span>
                </div>
            `;
            card.addEventListener('click', () => {
                order.package = pkg.tier;
                order.price = `${prices[currentCurrency].new.toLocaleString()} ${currentCurrency}`;
                step.querySelectorAll('.package-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                showDetailsStep();
            });
            grid.appendChild(card);
        });
        step.appendChild(grid);
    }
    
    function showDetailsStep() {
        if (document.getElementById('step-details')) return;

        const step = createStep('step-details');
        step.innerHTML = `
            ${createPrompt('Great choice. Now for your <span class="highlight">details.</span>')}
            <form class="details-form">
                <input type="text" id="clientName" placeholder="Your Full Name" required>
                <input type="text" id="username" placeholder="${usernamePlaceholder}" required>
            </form>
        `;

        step.querySelector('#clientName').addEventListener('input', e => order.clientName = e.target.value);
        step.querySelector('#username').addEventListener('input', e => {
            order.username = e.target.value;
            if(order.clientName && order.username) showPaymentStep();
        });
    }

    function showPaymentStep() {
        if (document.getElementById('step-payment')) return;

        const step = createStep('step-payment');
        step.innerHTML = `
            ${createPrompt('Finally, how would you like to <span class="highlight">pay?</span>')}
            <div class="payment-selector">
                <div class="payment-option" data-method="MTN"><img src="../mtn.png" alt="MTN"></div>
                <div class="payment-option" data-method="Airtel"><img src="../airtel.png" alt="Airtel"></div>
            </div>
        `;
        step.querySelectorAll('.payment-option').forEach(opt => {
            opt.addEventListener('click', () => {
                order.paymentMethod = opt.dataset.method;
                step.querySelectorAll('.payment-option').forEach(p => p.classList.remove('selected'));
                opt.classList.add('selected');
                showCtaStep();
            });
        });
    }

    function showCtaStep() {
        let step = document.getElementById('step-cta');
        if (step) step.remove();

        step = createStep('step-cta');

        let message = `Order for Cartelug:\n\n`;
        message += `*Service:* ${serviceName}\n`;
        message += `*Package:* ${order.package}\n`;
        message += `*Price:* ${order.price}\n`;
        message += `*Payment Method:* ${order.paymentMethod}\n`;
        message += `*Name:* ${order.clientName}`;

        const encodedMessage = encodeURIComponent(message);
        const href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        const ctaButton = document.createElement('a');
        ctaButton.href = href;
        ctaButton.target = "_blank";
        ctaButton.className = 'cta-button';
        ctaButton.innerHTML = `<i class="fab fa-whatsapp"></i> Complete Order on WhatsApp`;
        step.appendChild(ctaButton);
    }

    // ---- Initialize Flow ----
    showCurrencyStep();
});