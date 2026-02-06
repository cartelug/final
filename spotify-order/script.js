let currentPlan = null;
let accountStatus = null;

function selectPlan(cardElement, planName, price, usd) {
    // 1. Visual selection
    document.querySelectorAll('.hero-plan-card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');

    // 2. Store data
    currentPlan = { name: planName, price: price, usd: usd };

    // 3. Update Summary
    document.getElementById('sum-total').textContent = price + " UGX";

    // 4. Enable button text
    const btn = document.getElementById('btn-step-1');
    btn.classList.remove('disabled');
    btn.innerHTML = `Continue <i class="fas fa-arrow-right"></i>`;

    // 5. Smart Scroll
    setTimeout(() => {
        btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 350);
}

function selectAccountStatus(status, cardElement) {
    // 1. Visual selection
    document.querySelectorAll('.choice-card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');

    // 2. Store Data
    accountStatus = status;
    document.getElementById('sum-account').textContent = status;

    // 3. Enable Button
    const btn = document.getElementById('btn-step-2');
    btn.classList.remove('disabled');
}

function goToStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active-step'));
    
    // Show target step
    document.getElementById('step-' + stepNumber).classList.add('active-step');
    
    // Update progress
    document.querySelectorAll('.step').forEach(s => {
        if(parseInt(s.dataset.step) <= stepNumber) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });

    document.querySelector('.wizard-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function validateAndSend() {
    const name = document.getElementById('clientName').value.trim();
    const payment = document.getElementById('paymentMethod').value;

    if (!name) {
        alert("Please enter your Full Name.");
        document.getElementById('clientName').focus();
        return false;
    }

    // GENERATE EXACT WHATSAPP MESSAGE FORMAT
    const phone = "256762193386";
    
    let message = `Order for Cartelug:\n\n`;
    message += `*Service:* Spotify Premium\n`;
    message += `*Package:* ${currentPlan.name}\n`;
    message += `*Price:* ${currentPlan.price} UGX\n`;
    message += `*Has Account:* ${accountStatus}\n`;
    message += `*Name:* ${name}\n`;
    message += `*Payment Method:* ${payment}`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.location.href = url;
    return false;
}