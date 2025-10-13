document.addEventListener('DOMContentLoaded', () => {

    document.body.classList.add('tiktok-theme');

    const order = {
        service: 'TikTok',
        package: null,
        price: null,
        clientName: null,
        username: null,
        paymentMethod: null,
    };

    const steps = {
        details: document.getElementById('step-2-details'),
        payment: document.getElementById('step-3-payment'),
        final: document.getElementById('step-final'),
    };

    const bundlesData = [
        { name: 'Boost Lite', price: '95,000 UGX', desc: '2K Followers + 15K Views + 2K Likes' },
        { name: 'Starter Pack', price: '120,000 UGX', desc: '3K Followers + 20K Views + 3K Likes' },
        // ... add all other tiktok bundles here
    ];

    function unlockStep(step) {
        if (step && step.classList.contains('locked')) {
            step.classList.remove('locked');
            step.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    const packagesContainer = document.getElementById('packages-content');
    bundlesData.forEach(bundle => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.innerHTML = `<span class="plan-duration">${bundle.name}</span> <small>${bundle.desc}</small> <span class="plan-price">${bundle.price}</span>`;
        button.onclick = () => {
            order.package = bundle.name;
            order.price = bundle.price;
            packagesContainer.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            unlockStep(steps.details);
        };
        packagesContainer.appendChild(button);
    });

    document.getElementById('details-form').addEventListener('submit', e => {
        e.preventDefault();
        order.clientName = document.getElementById('clientName').value;
        order.username = document.getElementById('tiktokUsername').value;
        unlockStep(steps.payment);
    });

    steps.payment.querySelectorAll('.payment-card').forEach(card => {
        card.addEventListener('click', () => {
            order.paymentMethod = card.dataset.method;
            steps.payment.querySelectorAll('.payment-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            updateWhatsAppLink();
            unlockStep(steps.final);
        });
    });

    function updateWhatsAppLink() {
        const message = `
            *TikTok Order*
            - *Name:* ${order.clientName}
            - *Username:* ${order.username}
            - *Bundle:* ${order.package}
            - *Payment:* ${order.paymentMethod}
        `;
        const encodedMessage = encodeURIComponent(message.trim().replace(/\s+/g, ' '));
        document.getElementById('cta-button-link').href = `https://wa.me/256762193386?text=${encodedMessage}`;
    }
});