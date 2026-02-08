/* === PROJECT NEXUS ENGINE === */

// 1. THREE.JS SETUP
const canvas = document.getElementById('nexus-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.02);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// LIGHTING
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// 2. CREATE THE UNIVERSE
const objects = []; // Store clickable objects

// A. STARFIELD
const starGeo = new THREE.BufferGeometry();
const starCount = 3000;
const starPos = new Float32Array(starCount * 3);
for(let i=0; i<starCount*3; i++) starPos[i] = (Math.random() - 0.5) * 100;
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({color: 0xffffff, size: 0.05, transparent: true, opacity: 0.8});
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// B. HELPER: Create Glowing Planet Orb
function createOrb(color, x, y, z, label, id) {
    const geometry = new THREE.SphereGeometry(1.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ 
        color: color, 
        emissive: color, 
        emissiveIntensity: 0.5,
        roughness: 0.1,
        metalness: 0.8
    });
    const orb = new THREE.Mesh(geometry, material);
    orb.position.set(x, y, z);
    orb.userData = { id: id, label: label, color: color };
    
    // Add "Ring"
    const ringGeo = new THREE.TorusGeometry(2.2, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    orb.add(ring);

    scene.add(orb);
    objects.push(orb);
    return orb;
}

// C. PLACE THE MODULES (Planets)
// Positions arranged in a semi-circle
const netflixOrb = createOrb(0xE50914, -6, 0, 0, "NETFLIX HOUSEHOLD", "netflix_house");
const downloadOrb = createOrb(0xB81D24, -3, 2, -2, "DOWNLOAD ERROR", "netflix_dl");
const spotifyOrb = createOrb(0x1DB954, 0, 0, 0, "SPOTIFY SYNC", "spotify"); // Center
const disconnectOrb = createOrb(0xFFD700, 3, 2, -2, "DISCONNECTED", "disconnect");
const primeOrb = createOrb(0x00A8E1, 6, 0, 0, "PRIME VIDEO", "prime");

// 3. INTERACTION LOGIC
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let currentFocus = null;

// Handle Mouse Move (Parallax)
document.addEventListener('mousemove', (e) => {
    if(currentFocus) return; // Disable parallax when zoomed
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    
    // Gentle camera sway
    gsap.to(camera.position, {
        x: x * 0.5,
        y: y * 0.5,
        duration: 2
    });
    
    // Check hover
    mouse.x = x;
    mouse.y = y;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects);
    
    if(intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        const target = intersects[0].object;
        document.getElementById('target-readout').textContent = target.userData.label;
        document.getElementById('target-readout').style.color = '#' + target.userData.color.getHexString();
    } else {
        document.body.style.cursor = 'default';
        document.getElementById('target-readout').textContent = "IDLE";
        document.getElementById('target-readout').style.color = "#888";
    }
});

// Handle Click (Zoom In)
document.addEventListener('click', (e) => {
    if(currentFocus) return; // Already focused
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects);
    
    if(intersects.length > 0) {
        const target = intersects[0].object;
        nexus.engage(target);
    }
});

camera.position.z = 10;

// ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate Planets
    objects.forEach(obj => {
        obj.rotation.y += 0.005;
        obj.rotation.x += 0.002;
    });

    // Rotate Stars
    stars.rotation.y -= 0.0005;

    renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// 4. NEXUS LOGIC CONTROLLER (The Brain)
const nexus = {
    engage: (target) => {
        currentFocus = target;
        const id = target.userData.id;
        const color = '#' + target.userData.color.getHexString();

        // 1. Hide Intro Hint
        document.getElementById('intro-hint').classList.add('hidden');

        // 2. Camera Zoom (GSAP)
        // Move camera close to object, slightly offset to left so chat fits on right
        const offset = 2.5; 
        gsap.to(camera.position, {
            x: target.position.x - offset, // Move camera left of object
            y: target.position.y,
            z: target.position.z + 4, // Close up
            duration: 1.5,
            ease: "power3.inOut"
        });

        // 3. UI Updates
        document.documentElement.style.setProperty('--accent', color);
        document.getElementById('ai-icon').style.color = color;
        document.getElementById('chat-title').innerText = target.userData.label;
        
        // 4. Show Chat
        setTimeout(() => {
            document.getElementById('neural-interface').classList.add('active');
            nexus.startChat(id);
        }, 1000);
    },

    disengage: () => {
        currentFocus = null;
        
        // 1. Hide Chat
        document.getElementById('neural-interface').classList.remove('active');
        
        // 2. Reset Camera
        gsap.to(camera.position, {
            x: 0, y: 0, z: 10,
            duration: 1.5,
            ease: "power3.inOut",
            onComplete: () => {
                document.getElementById('intro-hint').classList.remove('hidden');
                document.getElementById('chat-feed').innerHTML = ''; // Clear chat
            }
        });
    },

    // CHAT BOT LOGIC
    startChat: (id) => {
        const feed = document.getElementById('chat-feed');
        feed.innerHTML = ''; // Clear previous

        nexus.msg("System connected. Analyzing request...", 'bot');

        setTimeout(() => {
            if(id === 'netflix_house') {
                nexus.msg("I see you have a Household Error. Which device is blocked?", 'bot', [
                    { txt: "Smart TV", action: "nexus.solve('tv')" },
                    { txt: "Phone / Tablet", action: "nexus.solve('phone')" }
                ]);
            } 
            else if (id === 'netflix_dl') {
                nexus.msg("Scanning account tier...<br>Result: <b>Standard Plan</b>.<br>Downloads are disabled on this tier. You need the Pro Upgrade.", 'bot', [
                    { txt: "Upgrade to Pro", action: "nexus.human('Upgrade Request')" },
                    { txt: "Cancel", action: "nexus.msg('Session ended.', 'bot')" }
                ]);
            }
            else if (id === 'disconnect') {
                nexus.msg("Error: Session Expired. Your password was rotated for security.", 'bot', [
                    { txt: "Get New Password", action: "nexus.human('Password Rotation')" },
                    { txt: "Report Issue", action: "nexus.human('Login Issue')" }
                ]);
            }
            else if (id === 'spotify') {
                nexus.msg("Spotify Premium Sync failed. You need a new Family Invite Link.", 'bot', [
                    { txt: "Request Link", action: "nexus.human('Spotify Invite')" }
                ]);
            }
            else if (id === 'prime') {
                nexus.msg("Prime Video Diagnostic. Are you seeing a 'Rent/Buy' button?", 'bot', [
                    { txt: "Yes (Rent/Buy)", action: "nexus.msg('That title is Pay-Per-View. It is not included in the subscription.', 'bot')" },
                    { txt: "No (System Error)", action: "nexus.human('Prime System Error')" }
                ]);
            }
        }, 800);
    },

    solve: (device) => {
        if(device === 'tv') {
            nexus.msg("<b>TV PROTOCOL:</b><br>1. Select 'I'm Traveling'.<br>2. Select 'Send Email'.<br>3. Confirm below.", 'bot', [
                { txt: "I Sent the Email", action: "nexus.human('TV Household - Email Sent')" }
            ]);
        } else {
            nexus.msg("<b>MOBILE PROTOCOL:</b><br>1. Tap 'Watch Temporarily'.<br>2. Tap 'Send Email'.<br>3. Confirm below.", 'bot', [
                { txt: "I Sent the Email", action: "nexus.human('Mobile Household - Email Sent')" }
            ]);
        }
    },

    msg: (text, type, buttons = []) => {
        const feed = document.getElementById('chat-feed');
        const div = document.createElement('div');
        div.className = `msg ${type}`;
        div.innerHTML = text;
        
        if(buttons.length > 0) {
            const btnGrid = document.createElement('div');
            btnGrid.className = 'btn-grid';
            buttons.forEach(b => {
                const btn = document.createElement('button');
                btn.className = 'hud-btn ' + (type==='user'?'':'primary');
                btn.innerText = b.txt;
                btn.setAttribute('onclick', b.action);
                btnGrid.appendChild(btn);
            });
            div.appendChild(btnGrid);
        }

        feed.appendChild(div);
        feed.scrollTop = feed.scrollHeight;
    },

    human: (reason) => {
        nexus.msg("Redirecting to WhatsApp Agent...", 'bot');
        setTimeout(() => {
            window.open(`https://wa.me/256762193386?text=Nexus%20Support:%20${reason}`, '_blank');
        }, 1000);
    }
};