document.addEventListener('DOMContentLoaded', () => {
    const popupOverlay = document.getElementById('country-popup-overlay');
    const countryButtons = document.querySelectorAll('.country-btn');
    const packagesGrid = document.getElementById('packages-grid');
    const container = document.querySelector('.container');

    const USD_TO_UGX_RATE = 3600;
    const WHATSAPP_NUMBER = '256762193386';

    // --- Data for TikTok Packages ---
    const tiktokPackages = [
        { name: 'Boost Lite', priceUGX: 95000, desc: '2K Followers + 15K Views + 2K Likes' },
        { name: 'Starter Pack', priceUGX: 120000, desc: '3K Followers + 20K Views + 3K Likes' },
        { name: 'Creator Mini', priceUGX: 145000, desc: '4K Followers + 30K Views + 4K Likes' },
        { name: 'Growth Pack', priceUGX: 170000, desc: '5K Followers + 40K Views + 5K Likes' },
        { name: 'Viral Rise', priceUGX: 190000, desc: '6K Followers + 50K Views + 6K Likes' },
        { name: 'Influencer Pack', priceUGX: 220000, desc: '8K Followers + 70K Views + 8K Likes' },
        { name: 'Elite Pro', priceUGX: 260000, desc: '10K Followers + 100K Views + 10K Likes' },
    ];

    // --- Function to Create a Package Card ---
    function createPackageCard(pkg, country) {
        const card = document.createElement('div');
        card.className = 'package-card';

        let priceHTML = '';
        if (country === 'uganda') {
            const newPrice = pkg.priceUGX.toLocaleString();
            const oldPrice = (pkg.priceUGX * 2).toLocaleString();
            priceHTML = `
                <div class="price">
                    <span class="old-price">~~${oldPrice} UGX~~</span>
                    <span class="new-price">${newPrice} UGX</span>
                </div>`;
        } else if (country === 'south-sudan') {
            const priceSSP = pkg.priceUGX * 1.5; // Note: Adjust conversion rate if needed
            const priceUSD = pkg.priceUGX / USD_TO_UGX_RATE;
            const newPrice = `${priceSSP.toLocaleString()} SSP / $${priceUSD.toFixed(2)}`;
            const oldPrice = `~~${(priceSSP * 2).toLocaleString()} SSP / $${(priceUSD * 2).toFixed(2)}~~`;
            priceHTML = `
                <div class="price">
                    <span class="old-price">${oldPrice}</span>
                    <span class="new-price">${newPrice}</span>
                </div>`;
        }

        card.innerHTML = `
            <h3>${pkg.name}</h3>
            <p class="description">${pkg.desc}</p>
            ${priceHTML}
            <button class="whatsapp-btn" data-order="${pkg.name}">Order on WhatsApp</button>
        `;

        // Add event listener for the WhatsApp button
        card.querySelector('.whatsapp-btn').addEventListener('click', (e) => {
            const order = e.target.dataset.order;
            const message = `Hello! I’d like to order the ${order} bundle from the TikTok Boost page.`;
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });

        packagesGrid.appendChild(card);
    }

    // --- Main Logic ---
    // Show popup
    popupOverlay.classList.add('active');

    // Country button event listeners
    countryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedCountry = button.dataset.country;
            
            // Generate all package cards for the selected country
            packagesGrid.innerHTML = ''; // Clear existing cards
            tiktokPackages.forEach(pkg => createPackageCard(pkg, selectedCountry));
            
            // Hide popup and show main content
            popupOverlay.classList.remove('active');
            container.style.opacity = '1';
        });
    });
});