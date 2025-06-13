// order-pass.js

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    const order = {
        service: 'Prime Video',
        plan: null,
        priceUGX: null,
        priceUSD: null,
        clientName: null,
        paymentMethod: null
    };

    // --- DOM ELEMENT SELECTORS ---
    const steps = {
        step1: document.getElementById('step-1'),
        step2: document.getElementById('step-2'),
        step3: document.getElementById('step-3'),
        step4: document.getElementById('step-4'),
    };
    const pass = {
        element: document.getElementById('access-pass'),
        nameValue: document.getElementById('pass-name-value'),
        planValue: document.getElementById('pass-plan-value'),
        priceValue: document.getElementById('pass-price-value'),
        paymentStamp: document.getElementById('pass-payment-stamp'),
        nameField: document.getElementById('pass-name-field'),
        planField: document.getElementById('pass-plan-field'),
        priceField: document.getElementById('pass-price-field')
    };
    const controls = {
        planOptions: document.querySelectorAll('.plan-option'),
        clientNameInput: document.getElementById('clientName'),
        paymentOptions: document.querySelectorAll('.payment-option'),
        submitButton: document.getElementById('submit-button')
    };
    
    // --- UI UPDATE FUNCTIONS ---

    function updatePassUI() {
        // Update Plan
        if (order.plan) {
            pass.planValue.textContent = order.plan;
            pass.priceValue.textContent = `${Number(order.priceUGX).toLocaleString()} UGX`;
            pass.planField.classList.add('visible');
            pass.priceField.classList.add('visible');
        }
        
        // Update Name
        pass.nameValue.textContent = order.clientName || 'Your Name';
        if (order.clientName) {
            pass.nameField.classList.add('visible');
        }

        // Update Payment Stamp
        pass.paymentStamp.classList.remove('stamped');
        if (order.paymentMethod) {
            pass.paymentStamp.style.backgroundImage = `url('../${order.paymentMethod.toLowerCase()}.png')`;
            // Timeout for stamp animation effect
            setTimeout(() => pass.paymentStamp.classList.add('stamped'), 10);
        }
    }
    
    function checkCompletion() {
        const isComplete = order.plan && order.clientName && order.paymentMethod;
        if (isComplete) {
            controls.submitButton.disabled = false;
            controls.submitButton.textContent = 'Activate My Access';
            controls.submitButton.classList.add('ready');
            pass.element.classList.add('complete');
        } else {
            controls.submitButton.disabled = true;
            controls.submitButton.textContent = 'Complete Your Pass';
            controls.submitButton.classList.remove('ready');
            pass.element.classList.remove('complete');
        }
    }
    
    // --- EVENT LISTENERS ---

    // 1. Plan Selection
    controls.planOptions.forEach(option => {
        option.addEventListener('click', () => {
            controls.planOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            order.plan = option.dataset.plan;
            order.priceUGX = option.dataset.priceUgx;
            order.priceUSD = option.dataset.priceUsd;
            
            steps.step2.classList.add('active');
            controls.clientNameInput.focus();
            updatePassUI();
            checkCompletion();
        });
    });

    // 2. The Name Input
    controls.clientNameInput.addEventListener('input', (e) => {
        order.clientName = e.target.value.trim();
        if (order.clientName) {
            steps.step3.classList.add('active');
        }
        updatePassUI();
        checkCompletion();
    });

    // 3. Payment Method Selection
    controls.paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            controls.paymentOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            order.paymentMethod = option.dataset.method;
            steps.step4.classList.add('active');
            updatePassUI();
            checkCompletion();
        });
    });

    // 4. Form Submission
    controls.submitButton.addEventListener('click', () => {
        if (!controls.submitButton.disabled) {
            const message = `Hi Cartelug, I'd like to order the following package:\n\n*Service:* ${order.service}\n*Plan:* ${order.plan}\n*Price:* ${Number(order.priceUGX).toLocaleString()} UGX / $${order.priceUSD} USD\n\n*My Name:* ${order.clientName}\n*Payment Method:* ${order.paymentMethod}`;
            
            const whatsappUrl = `https://wa.me/YOUR_PHONE_NUMBER?text=${encodeURIComponent(message)}`;
            
            // **IMPORTANT**: Replace YOUR_PHONE_NUMBER with your actual WhatsApp number including country code (e.g., 2567...)
            window.open(whatsappUrl.replace('YOUR_PHONE_NUMBER', '256742367554'), '_blank');
        }
    });

});
