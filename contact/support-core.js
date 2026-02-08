/* === ACCESSUG SMART SUPPORT CORE === */

// 1. CHAT LOGIC
const chatFeed = document.getElementById('chat-feed');
const delay = ms => new Promise(res => setTimeout(res, ms));

// Sound Effect (Optional - smooth click)
const playSound = () => {
    // You can add a subtle 'pop' sound here if you want
};

// Function to add a message
async function addMessage(text, isBot = true, actionBtn = null) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('msg', isBot ? 'bot-msg' : 'user-msg');
    
    chatFeed.appendChild(msgDiv);
    
    if (isBot) {
        // Typing effect
        msgDiv.textContent = "...";
        await delay(600);
        msgDiv.innerHTML = text; // Use innerHTML to allow <br> or <b>
        if (actionBtn) {
            msgDiv.appendChild(actionBtn);
        }
    } else {
        msgDiv.textContent = text;
    }

    // Scroll to bottom
    chatFeed.scrollTop = chatFeed.scrollHeight;
}

// Initial Greeting
window.onload = async () => {
    initParticles(); // Start the background
    await delay(500);
    addMessage("Hello! Welcome to AccessUG Support.");
    await delay(800);
    addMessage("I'm here to fix your streaming issues instantly. <br>Please select an option from the menu on the right.");
};

// SCRIPT: The Logic for each button
async function runScript(issueType) {
    
    // 1. User "says" the issue
    let userText = "";
    if (issueType === 'household') userText = "I have a Netflix Household issue.";
    if (issueType === 'download') userText = "I can't download movies.";
    if (issueType === 'logout') userText = "I was logged out early.";
    if (issueType === 'spotify') userText = "My Spotify Premium stopped working.";
    if (issueType === 'other') userText = "I need to speak to an agent.";

    addMessage(userText, false); // Add user message
    await delay(1000);

    // 2. Bot Responds based on issue
    if (issueType === 'household') {
        addMessage("Understood. The 'Household' error happens when Netflix detects a location change.");
        await delay(1500);
        addMessage("We can fix this remotely by sending a new travel code to your TV.");
        await delay(1000);
        
        const btn = document.createElement('a');
        btn.href = "https://wa.me/256700000000?text=Hello+AccessUG+I+have+Netflix+Household+Issue"; // REPLACE WITH YOUR NUMBER
        btn.className = "chat-btn";
        btn.innerHTML = "<i class='fab fa-whatsapp'></i> Fix on WhatsApp";
        
        addMessage("Click below to request a code instantly:", true, btn);
    }

    else if (issueType === 'download') {
        addMessage("Netflix downloads are sometimes restricted on shared accounts to save storage for everyone.");
        await delay(1500);
        addMessage("<b>Solution:</b> Please try streaming the movie while online. If you strictly need offline viewing, we can switch your profile.");
        
        const btn = document.createElement('a');
        btn.href = "https://wa.me/256700000000?text=Hello+AccessUG+I+cannot+download+movies";
        btn.className = "chat-btn";
        btn.innerHTML = "Request Offline Profile";
        
        addMessage("Need an offline profile? Contact us:", true, btn);
    }

    else if (issueType === 'logout') {
        addMessage("I'm checking your account status...");
        await delay(2000);
        addMessage("It looks like a password rotation might have disconnected you.");
        
        const btn = document.createElement('a');
        btn.href = "https://wa.me/256700000000?text=Hello+AccessUG+I+was+logged+out+early";
        btn.className = "chat-btn";
        btn.innerHTML = "Get New Password";
        
        addMessage("Don't worry, your time is still valid. Click below to get the new login details:", true, btn);
    }

    else {
        // General / Spotify
        addMessage("I see. Let's get a human agent to look at this for you immediately.");
        
        const btn = document.createElement('a');
        btn.href = "https://wa.me/256700000000?text=Hello+AccessUG+I+need+help";
        btn.className = "chat-btn";
        btn.innerHTML = "<i class='fab fa-whatsapp'></i> Chat with Agent";
        
        addMessage("Our team is online on WhatsApp:", true, btn);
    }
}


// 2. BACKGROUND ANIMATION (The "Constellation" Effect)
const canvas = document.getElementById('neuro-bg');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

// Resize
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resize);

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5; // Slow movement
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(100, 100, 255, 0.5)"; // Blue-ish dots
        ctx.fill();
    }
}

// Mouse Interaction
let mouse = { x: null, y: null };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

function initParticles() {
    resize();
    for (let i = 0; i < 60; i++) { // Number of dots
        particles.push(new Particle());
    }
    animate();
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Update and Draw Particles
    particles.forEach(p => {
        p.update();
        p.draw();
        
        // Draw lines between particles
        particles.forEach(p2 => {
            let dx = p.x - p2.x;
            let dy = p.y - p2.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            
            if (distance < 150) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(100, 100, 255, ${0.1 - distance/1500})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });

        // Draw line to mouse
        if (mouse.x) {
            let dx = p.x - mouse.x;
            let dy = p.y - mouse.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if (distance < 200) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(125, 42, 232, ${0.2 - distance/1000})`; // Purple connection to mouse
                ctx.lineWidth = 1;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(animate);
}