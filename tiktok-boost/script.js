document.addEventListener('DOMContentLoaded', function () {
    const whatsappNumber = "256762193386";

    const order = {
        service: 'TikTok Growth',
        package: null,
        price: null,
        clientName: null,
        tiktokUsername: null,
        paymentMethod: null
    };

    const bundles = [
        { name: 'Boost Lite', price: '95,000 UGX', desc: '2K Followers + 15K Views + 2K Likes' },
        { name: 'Starter Pack', price: '120,000 UGX', desc: '3K Followers + 20K Views + 3K Likes' },
        { name: 'Creator Mini', price: '145,000 UGX', desc: '4K Followers + 30K Views + 4K Likes' },
        { name: 'Growth Pack', price: '170,000 UGX', desc: '5K Followers + 40K Views + 5K Likes' },
        { name: 'Viral Rise', price: '190,000 UGX', desc: '6K Followers + 50K Views + 6K Likes' },
        { name: 'Influencer Pack', price: '220,000 UGX', desc: '8K Followers + 70K Views + 8K Likes' },
        { name: 'Elite Pro', price: '260,000 UGX', desc: '10K Followers + 100K Views + 10K Likes' }
    ];

    const finalizeStep = document.getElementById('step-2-finalize');

    function unlockStep(step) {
        step.classList.remove('locked');
        setTimeout(() => {
            step.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    const bundlesGrid = document.getElementById('bundles-grid');
    bundles.forEach(bundle => {
        const card = document.createElement('div');
        card.className = 'package-card';
        card.innerHTML = `<h3>${bundle.name}</h3><p class="description">${bundle.desc}</p><div class="price"><span class="new-price">${bundle.price}</span></div>`;
        card.addEventListener('click', () => {
            order.package = bundle.name;
            order.price = bundle.price;
            document.querySelectorAll('.package-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            unlockStep(finalizeStep);
            updateFormState();
        });
        bundlesGrid.appendChild(card);
    });

    const form = document.getElementById('order-form');
    const clientNameInput = document.getElementById('clientName');
    const usernameInput = document.getElementById('tiktokUsername');
    const paymentOptions = document.querySelectorAll('.payment-option');
    const whatsappLink = document.getElementById('whatsapp-link');

    function updateFormState() {
        order.clientName = clientNameInput.value;
        order.tiktokUsername = usernameInput.value;

        const isFormValid = order.package && order.clientName && order.tiktokUsername && order.paymentMethod;

        if (isFormValid) {
            whatsappLink.classList.remove('disabled');
            let message = `Order for Cartelug:\n\n`;
            message += `*Service:* ${order.service}\n`;
            message += `*Package:* ${order.package}\n`;
            if (order.price) {
                message += `*Price:* ${order.price}\n`;
            }
            message += `*TikTok Username:* ${order.tiktokUsername}\n`;
            message += `*Payment Method:* ${order.paymentMethod}\n`;
            message += `*Name:* ${order.clientName}`;
            
            const encodedMessage = encodeURIComponent(message);
            whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        } else {
            whatsappLink.classList.add('disabled');
        }
    }

    form.addEventListener('input', updateFormState);

    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            order.paymentMethod = option.dataset.method;
            updateFormState();
        });
    });
});