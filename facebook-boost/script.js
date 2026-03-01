document.addEventListener('DOMContentLoaded', () => {
    // --- SYSTEM CONFIG ---
    const WHATSAPP_NUMBER = "256XXXXXXXXX"; // Replace with your actual number
    const GOOGLE_SCRIPT_URL = "YOUR_WEB_APP_URL"; // Replace for Sheets integration

    const cards = document.querySelectorAll('.tier-card');
    const displayTier = document.getElementById('display-tier');
    const displayUsd = document.getElementById('display-usd');
    const displayUgx = document.getElementById('display-ugx');
    const btnCheckout = document.getElementById('btn-checkout');
    const form = document.getElementById('checkout-form');
    const inputPage = document.getElementById('input-page');
    
    let selectedData = null;

    // 1. Handle Card Selection with Premium UI feedback
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove previous selections
            cards.forEach(c => c.classList.remove('selected'));
            // Highlight chosen package
            card.classList.add('selected');

            // Extract data from HTML attributes
            selectedData = {
                tier: card.dataset.tier,
                usd: card.dataset.usd,
                ugx: parseInt(card.dataset.ugx).toLocaleString()
            };

            // Animate text change in the Summary Box
            displayTier.style.opacity = 0;
            displayUsd.style.opacity = 0;
            
            setTimeout(() => {
                displayTier.textContent = `${selectedData.tier} Tier`;
                displayUsd.textContent = `$${selectedData.usd}`;
                displayUgx.textContent = `${selectedData.ugx} UGX`;
                
                displayTier.style.opacity = 1;
                displayUsd.style.opacity = 1;
            }, 150);

            validateForm();
        });
    });

    // 2. Validate Checkout Form
    inputPage.addEventListener('input', validateForm);

    function validateForm() {
        // Only allow checkout if a package is clicked AND a link is pasted
        if (selectedData && inputPage.value.trim().length > 5) {
            btnCheckout.removeAttribute('disabled');
        } else {
            btnCheckout.setAttribute('disabled', 'true');
        }
    }

    // 3. Process the Multi-Action Checkout
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!selectedData) return;

        // Change button to loading state
        const originalBtnText = btnCheckout.innerHTML;
        btnCheckout.innerHTML = '<i class="fas fa-circle-notch fa-spin text-2xl"></i> Securing Order...';
        btnCheckout.setAttribute('disabled', 'true');

        // Capture Inputs
        const pageLink = inputPage.value.trim();
        const postLinks = document.getElementById('input-posts').value.trim() || "None";
        const referral = document.getElementById('input-referral').value.trim() || "None";

        // ACTION A: Log to Google Sheets (Silently in background)
        if(GOOGLE_SCRIPT_URL !== "YOUR_WEB_APP_URL") {
            const formData = new FormData();
            formData.append('Timestamp', new Date().toISOString());
            formData.append('Platform', 'Facebook');
            formData.append('Tier', selectedData.tier);
            formData.append('PriceUSD', selectedData.usd);
            formData.append('PageLink', pageLink);
            formData.append('PostLinks', postLinks);
            formData.append('Referral', referral);

            try {
                // Fire and forget fetch to keep UX fast
                fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: formData });
            } catch (err) {
                console.log("Sheet log failed, but continuing to WhatsApp.");
            }
        }

        // ACTION B: Exact WhatsApp Blueprint Payload
        const whatsappMessage = `🚀 *NEW ELITE ORDER REQUEST* 🚀

*Platform:* Facebook Authority
*Package:* ${selectedData.tier} Tier
*Price:* $${selectedData.usd} (${selectedData.ugx} UGX)

🔗 *Target Page:* ${pageLink}
🔗 *Target Posts:* ${postLinks}
🎁 *Referral Code:* ${referral}

_Client is ready to complete payment. Please provide the gateway link or mobile money details._`;

        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        
        // Slight delay for UX premium feel, then redirect to WhatsApp
        setTimeout(() => {
            btnCheckout.innerHTML = originalBtnText;
            btnCheckout.removeAttribute('disabled');
            window.open(whatsappUrl, '_blank');
        }, 800);
    });
});