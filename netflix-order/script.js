let currentPlan = null;
let unlockedGifts = 0;

function selectPlan(cardElement, planName, price, usd) {
    // 1. Visual selection
    document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');

    // 2. Store data
    currentPlan = { name: planName, price: price, usd: usd };

    // 3. Update Summary
    document.getElementById('sum-plan').textContent = planName;
    document.getElementById('sum-price').textContent = price + " UGX";
    document.getElementById('sum-total').textContent = price + " UGX";

    // 4. Enable button
    const btn = document.getElementById('btn-step-1');
    btn.classList.remove('disabled');
    btn.innerHTML = `Continue with ${planName} <i class="fas fa-arrow-right"></i>`;
}

function unlockBonus(id) {
    const el = document.getElementById('bonus-' + id);
    if(el.classList.contains('unlocked')) return;

    el.classList.remove('locked');
    el.classList.add('unlocked');
    
    // Change status text
    const statusSpan = el.querySelector('.status');
    statusSpan.textContent = "UNLOCKED!";
    
    unlockedGifts++;

    // Check if all unlocked
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

    // If final step, generate WhatsApp Link
    if(stepNumber === 4 && currentPlan) {
        generateWhatsAppLink();
    }
}

function generateWhatsAppLink() {
    const phone = "256762193386";
    const text = `Hello AccessUG! I want to order the *Netflix ${currentPlan.name}* plan for ${currentPlan.price} UGX. I understand it comes with Free Prime Video and Spotify. Please send payment details.`;
    
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    document.getElementById('whatsapp-btn').href = url;
}