let currentPlan = null;
let unlockedGifts = 0;

function selectPlan(cardElement, planName, price, usd) {
    // 1. Visual selection
    document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');

    // 2. Store data
    currentPlan = { name: planName, price: price, usd: usd };

    // 3. Update Summary
    document.getElementById('sum-total').textContent = price + " UGX";

    // 4. Enable button
    const btn = document.getElementById('btn-step-1');
    btn.classList.remove('disabled');
    btn.innerHTML = `Continue with ${planName} <i class="fas fa-arrow-right"></i>`;

    // 5. SMART AUTO-SCROLL
    setTimeout(() => {
        btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
}

function unlockBonus(id) {
    const el = document.getElementById('bonus-' + id);
    if(el.classList.contains('unlocked')) return;

    el.classList.remove('locked');
    el.classList.add('unlocked');
    
    const statusSpan = el.querySelector('.status');
    statusSpan.textContent = "UNLOCKED!";
    
    unlockedGifts++;

    if(unlockedGifts >= 2) {
        const btn = document.getElementById('btn-step-2');
        btn.classList.remove('disabled');
    }
}

function goToStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active-step'));
    
    // Show target step
    document.getElementById('step-' + stepNumber).classList.add('active-step');
    
    // Update top progress bar
    document.querySelectorAll('.step').forEach(s => {
        if(parseInt(s.dataset.step) <= stepNumber) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });

    // Scroll to top of card for better UX
    document.querySelector('.wizard-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function validateAndSend() {
    const name = document.getElementById('clientName').value.trim();
    const payment = document.getElementById('paymentMethod').value;

    if (!name) {
        alert("Please enter your name to finalize the order.");
        document.getElementById('clientName').focus();
        return false;
    }

    // GENERATE EXACT WHATSAPP MESSAGE FORMAT
    const phone = "256762193386";
    
    let message = `Order for Cartelug:\n\n`;
    message += `*Service:* Netflix Premium\n`;
    message += `*Package:* ${currentPlan.name}\n`;
    message += `*Price:* ${currentPlan.price} UGX\n`;
    message += `*Name:* ${name}\n`;
    message += `*Payment Method:* ${payment}`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.location.href = url;
    return false; // Prevent default link behavior
}