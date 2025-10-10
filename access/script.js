@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

body {
    font-family: 'Roboto', sans-serif;
    background-color: #141414;
    color: #fff;
    margin: 0;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.container {
    width: 100%;
    max-width: 600px;
}

.hidden {
    display: none;
}

/* Header */
.header {
    text-align: center;
    margin-bottom: 40px;
}

.logo {
    width: 150px;
    margin-bottom: 20px;
}

h1 {
    font-size: 2.5em;
    margin-bottom: 10px;
}

/* Plan Selection */
.plan-cards {
    display: flex;
    gap: 20px;
}

.card {
    background-color: #222;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    flex-grow: 1;
    border: 2px solid transparent;
    transition: all 0.3s ease;
    cursor: pointer;
}

.card:hover {
    border-color: #E50914;
}

.card.popular {
    border-color: #E50914;
}

.card h2 {
    margin-top: 0;
}

.price {
    font-size: 1.8em;
    font-weight: bold;
    color: #E50914;
}

.card ul {
    list-style: none;
    padding: 0;
    margin: 20px 0;
}

.card ul li {
    margin-bottom: 10px;
}

.btn {
    background-color: #E50914;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn:hover {
    background-color: #f6121d;
}

/* Device Selection */
.device-icons {
    display: flex;
    justify-content: space-around;
    gap: 20px;
}

.device {
    cursor: pointer;
    text-align: center;
}

.device img {
    transition: transform 0.3s ease;
}

.device:hover img {
    transform: scale(1.1);
}

/* Login Instructions */
.instructions .step {
    background-color: #222;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.credentials {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #333;
    padding: 10px;
    border-radius: 5px;
    font-family: 'Courier New', Courier, monospace;
}

.btn-copy {
    background-color: #555;
    color: #fff;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
}

.btn-whatsapp {
    display: block;
    text-align: center;
    margin-top: 20px;
    text-decoration: none;
    background-color: #25D366;
}

.btn-whatsapp:hover {
    background-color: #128C7E;
}


@media (max-width: 600px) {
    .plan-cards {
        flex-direction: column;
    }
}
