// === 1. THE PARTICLE NETWORK BACKGROUND ===
const canvas = document.getElementById('neuro-bg');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < 100; i++) particles.push(new Particle());

function animateBg() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
        particles.forEach(p2 => {
            let dx = p.x - p2.x;
            let dy = p.y - p2.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 150) {
                ctx.strokeStyle = `rgba(100, 100, 255, ${1 - dist/150})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });
    });
    requestAnimationFrame(animateBg);
}
animateBg();

// === 2. THE CHAT LOGIC ENGINE ===
const chatFeed = document.getElementById('chat-feed');

function addMsg(text, type = 'bot', buttons = []) {
    const div = document.createElement('div');
    div.className = `msg ${type === 'bot' ? 'bot-msg' : 'user-msg'}`;
    
    if (type === 'bot') {
        div.innerHTML = `
            <div class="avatar"><i class="fas fa-robot"></i></div>
            <div class="text">
                ${text}
                ${buttons.length > 0 ? '<br><br>' : ''}
                ${buttons.map(b => `<button class="msg-btn" onclick="${b.action}">${b.text}</button>`).join('')}
            </div>
        `;
    } else {
        div.textContent = text;
    }
    
    chatFeed.appendChild(div);
    chatFeed.scrollTop = chatFeed.scrollHeight;
}

// THE BRAIN (Scenario Logic)
function triggerIssue(issue) {
    // Disable buttons to prevent spam
    // Add User Response
    let userText = "";
    if (issue === 'netflix-household') userText = "Fix Netflix Household Error";
    if (issue === 'netflix-download') userText = "Fix Download Error";
    if (issue === 'disconnected') userText = "I was disconnected early";
    if (issue === 'spotify') userText = "Spotify isn't working";
    if (issue === 'prime') userText = "Prime Video Error";
    
    addMsg(userText, 'user');

    // Bot Response Delay simulation
    setTimeout(() => {
        if (issue === 'netflix-household') {
            addMsg("I can bypass the Household block. Which device is giving the error?", "bot", [
                { text: "Smart TV", action: "solveTV()" },
                { text: "Phone / Tablet", action: "solvePhone()" }
            ]);
        }
        else if (issue === 'netflix-download') {
            addMsg("Analysing Account Type... <br><br><b>Result:</b> Standard accounts are for streaming only. You need the 'Pro' upgrade to download movies.", "bot", [
                { text: "Upgrade Me", action: "window.location.href='../contact/'" }, 
                { text: "Understood", action: "resetChat()" }
            ]);
        }
        else if (issue === 'disconnected') {
            addMsg("Checking session logs... It seems your password may have rotated for security.", "bot", [
                { text: "Get New Password", action: "window.location.href='../signed-out/'" },
                { text: "Contact Human", action: "contactHuman('Disconnected Early')" }
            ]);
        }
        else if (issue === 'spotify') {
            addMsg("Spotify glitches usually mean you need a new Family Plan invite link.", "bot", [
                { text: "Request New Link", action: "contactHuman('Spotify Link Needed')" }
            ]);
        }
        else if (issue === 'prime') {
            addMsg("Are you seeing a 'Rent' or 'Buy' button, or a specific error code?", "bot", [
                { text: "Rent/Buy Button", action: "addMsg('That title is not included in Prime. It is pay-per-view only.', 'bot')" },
                { text: "Other Error", action: "contactHuman('Prime Generic Error')" }
            ]);
        }
    }, 600);
}

function solveTV() {
    addMsg("TV", "user");
    setTimeout(() => {
        addMsg("<b>TV Bypass Protocol:</b><br>1. On the error screen, click 'I'm Traveling'.<br>2. Click 'Send Email'.<br>3. I have received the code. Contact me on WhatsApp to get the unlock code.", "bot", [
            { text: "Get Code on WhatsApp", action: "contactHuman('I did the Traveling step on TV')" }
        ]);
    }, 600);
}

function solvePhone() {
    addMsg("Phone", "user");
    setTimeout(() => {
        addMsg("<b>Mobile Bypass Protocol:</b><br>1. Tap 'Watch Temporarily'.<br>2. Tap 'Send Email'.<br>3. This triggers the verification code.", "bot", [
            { text: "I Sent the Email", action: "contactHuman('I did the Watch Temp step on Phone')" }
        ]);
    }, 600);
}

function contactHuman(reason) {
    window.open(`https://wa.me/256762193386?text=Bot%20Escalation:%20${reason}`, '_blank');
}

function resetChat() {
    addMsg("System reset. Ready for next query.", "bot");
}