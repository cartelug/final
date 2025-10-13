document.addEventListener('DOMContentLoaded', () => {
    const popupOverlay = document.getElementById('country-popup-overlay');
    const countryButtons = document.querySelectorAll('.country-btn');
    const packagesGrid = document.getElementById('packages-grid');
    const container = document.querySelector('.container');

    const USD_TO_UGX_RATE = 3600;
    const WHATSAPP_NUMBER = '256762193386';

    // --- Data for Instagram Packages ---
    const instagramPackages = [
        { name: '5K Followers', priceUGX: 120000 },
        { name: '10K Followers', priceUGX: 180000 },
        { name: '15K Followers', priceUGX: 240000 },
        { name: '20K Followers', priceUGX: 290000 },
        { name: '50K Views', priceUGX: 100000 },
        { name: '100K Views', priceUGX: 150000 },
        { name: '200K Views', priceUGX: 230000 },
        { name: '300K Views', priceUGX: 300000 },
        { name: '5K Likes', priceUGX: 80000 },
        { name: '10K Likes', priceUGX: 120000 },
        { name: '20K Likes', priceUGX: 170000 },
        { name: '30K Likes', priceUGX: 220000 },
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
            ${priceHTML}
            <button class="whatsapp-btn" data-order="${pkg.name}">Order on WhatsApp</button>
        `;

        // Add event listener for the WhatsApp button
        card.querySelector('.whatsapp-btn').addEventListener('click', (e) => {
            const order = e.target.dataset.order;
            const message = `Hello! I’d like to order the ${order} from the Instagram Boost page.`;
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
            instagramPackages.forEach(pkg => createPackageCard(pkg, selectedCountry));
            
            // Hide popup and show main content
            popupOverlay.classList.remove('active');
            container.style.opacity = '1';
        });
    });
});