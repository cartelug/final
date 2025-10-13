document.addEventListener('DOMContentLoaded', function () {
    const whatsappNumber = "256762193386";

    const order = {
        service: 'Instagram Growth',
        package: null,
        price: null,
        clientName: null,
        instaUsername: null,
        paymentMethod: null
    };

    const packages = {
        followers: [
            { name: '5K Followers', price: '120,000 UGX' },
            { name: '10K Followers', price: '180,000 UGX' },
            { name: '15K Followers', price: '240,000 UGX' },
            { name: '20K Followers', price: '290,000 UGX' }
        ],
        views: [
            { name: '50K Views', price: '100,000 UGX' },
            { name: '100K Views', price: '150,000 UGX' },
            { name: '200K Views', price: '230,000 UGX' },
            { name: '300K Views', price: '300,000 UGX' }
        ],
        likes: [
            { name: '5K Likes', price: '80,000 UGX' },
            { name: '10K Likes', price: '120,000 UGX' },
            { name: '20K Likes', price: '170,000 UGX' },
            { name: '30K Likes', price: '220,000 UGX' }
        ],
        allInOne: [
             { name: 'All-in-One Growth', price: '500,000 UGX', description: '20k Followers, 300k Views, 30k Likes' },
        ]
    };

    const steps = {
        objective: document.getElementById('step-1-objective'),
        packages: document.getElementById('step-2-packages'),
        allInOne: document.getElementById('step-3-all-in-one'),
        finalize: document.getElementById('step-4-finalize')
    };

    function unlockStep(step) {
        step.classList.remove('locked');
        setTimeout(() => {
            step.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    function generatePackageCards(objective) {
        const grid = document.getElementById('packages-grid');
        grid.innerHTML = '';
        packages[objective].forEach(pkg => {
            const card = document.createElement('div');
            card.className = 'package-card';
            card.innerHTML = `<h3>${pkg.name}</h3><div class="price"><span class="new-price">${pkg.price}</span></div>`;
            card.addEventListener('click', () => {
                order.package = pkg.name;
                order.price = pkg.price;
                document.querySelectorAll('.package-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                unlockStep(steps.allInOne);
                unlockStep(steps.finalize);
                updateFormState();
            });
            grid.appendChild(card);
        });
    }
    
    function generateAllInOneCard() {
        const grid = document.getElementById('all-in-one-grid');
        grid.innerHTML = '';
        packages['allInOne'].forEach(pkg => {
            const card = document.createElement('div');
            card.className = 'package-card';
            card.innerHTML = `<h3>${pkg.name}</h3><p class="description">${pkg.description}</p><div class="price"><span class="new-price">${pkg.price}</span></div>`;
            card.addEventListener('click', () => {
                order.package = pkg.name;
                order.price = pkg.price;
                document.querySelectorAll('.package-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                unlockStep(steps.finalize);
                updateFormState();
            });
            grid.appendChild(card);
        });
    }

    document.querySelectorAll('.objective-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const objective = btn.dataset.objective;
            document.querySelectorAll('.objective-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            document.getElementById('package-title').innerText = `Choose ${objective.charAt(0).toUpperCase() + objective.slice(1)} Package`;
            generatePackageCards(objective);
            generateAllInOneCard();
            unlockStep(steps.packages);
        });
    });

    const form = document.getElementById('order-form');
    const clientNameInput = document.getElementById('clientName');
    const usernameInput = document.getElementById('instaUsername');
    const paymentOptions = document.querySelectorAll('.payment-option');
    const whatsappLink = document.getElementById('whatsapp-link');

    function updateFormState() {
        order.clientName = clientNameInput.value;
        order.instaUsername = usernameInput.value;

        const isFormValid = order.package && order.clientName && order.instaUsername && order.paymentMethod;

        if (isFormValid) {
            whatsappLink.classList.remove('disabled');
            let message = `Order for Cartelug:\n\n`;
            message += `*Service:* ${order.service}\n`;
            message += `*Package:* ${order.package}\n`;
            if (order.price) {
                message += `*Price:* ${order.price}\n`;
            }
             message += `*Instagram Username:* ${order.instaUsername}\n`;
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