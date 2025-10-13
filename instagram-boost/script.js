document.addEventListener('DOMContentLoaded', () => {

    document.body.classList.add('instagram-theme');

    const order = {
        service: 'Instagram',
        category: null,
        package: null,
        price: null,
        clientName: null,
        username: null,
        paymentMethod: null,
    };

    const steps = {
        serviceType: document.getElementById('step-1-servicetype'),
        packages: document.getElementById('step-2-packages'),
        combined: document.getElementById('step-3-combined'),
        details: document.getElementById('step-4-details'),
        payment: document.getElementById('step-5-payment'),
        final: document.getElementById('step-final'),
    };

    const packagesData = {
        followers: [
            { name: '5K Followers', price: '120,000 UGX' },
            { name: '10K Followers', price: '180,000 UGX' },
        ],
        likes: [
            { name: '5K Likes', price: '80,000 UGX' },
            { name: '10K Likes', price: '120,000 UGX' },
        ],
        views: [
            { name: '50K Views', price: '100,000 UGX' },
            { name: '100K Views', price: '150,000 UGX' },
        ],
    };

    function unlockStep(step) {
        if (step && step.classList.contains('locked')) {
            step.classList.remove('locked');
            step.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function generatePackageButtons(category) {
        const container = steps.packages.querySelector('#packages-content');
        container.innerHTML = '';
        packagesData[category].forEach(pkg => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.innerHTML = `<span class="plan-duration">${pkg.name}</span> <span class="plan-price">${pkg.price}</span>`;
            button.onclick = () => {
                order.category = category;
                order.package = pkg.name;
                order.price = pkg.price;
                container.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
                unlockStep(steps.combined);
            };
            container.appendChild(button);
        });
    }

    // Event Listeners
    steps.serviceType.querySelectorAll('.service-button').forEach(button => {
        button.addEventListener('click', () => {
            const service = button.dataset.service;
            steps.serviceType.querySelectorAll('.service-button').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            generatePackageButtons(service);
            unlockStep(steps.packages);
        });
    });

    document.getElementById('details-form').addEventListener('submit', e => {
        e.preventDefault();
        order.clientName = document.getElementById('clientName').value;
        order.username = document.getElementById('instaUsername').value;
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
            *Instagram Order*
            - *Name:* ${order.clientName}
            - *Username:* ${order.username}
            - *Service:* ${order.package}
            - *Payment:* ${order.paymentMethod}
        `;
        const encodedMessage = encodeURIComponent(message.trim().replace(/\s+/g, ' '));
        document.getElementById('cta-button-link').href = `https://wa.me/256762193386?text=${encodedMessage}`;
    }
});