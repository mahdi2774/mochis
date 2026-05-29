(function() {
    // Prevent duplicate injections
    if (document.getElementById('ai-debugger-drone')) return;

    // --- 1. STYLES (Cybernetic & Holographic) ---
    const style = document.createElement('style');
    const css = `
        .drone-container {
            position: fixed;
            width: 40px;
            height: 40px;
            z-index: 1000000;
            pointer-events: none;
            top: 0; left: 0;
            will-change: transform;
        }

        /* The main spherical body */
        .drone-body {
            position: absolute;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 30% 30%, #2a2d34 0%, #111 100%);
            border-radius: 50%;
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.4), inset 0 0 12px rgba(0, 255, 255, 0.2);
            border: 2px solid #0ff;
            pointer-events: auto;
            cursor: crosshair;
            transition: all 0.3s ease;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        }

        /* The glowing eye */
        .drone-eye {
            width: 16px; 
            height: 16px;
            background: #0ff;
            border-radius: 50%;
            box-shadow: 0 0 10px #fff, 0 0 20px #0ff;
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
        }

        /* Eye pupil/core */
        .drone-eye::after {
            content: '';
            position: absolute;
            width: 6px; height: 6px;
            background: #fff;
            border-radius: 50%;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
        }

        /* Antenna array */
        .drone-antenna {
            width: 4px; height: 12px;
            background: #0ff;
            position: absolute;
            top: -8px; left: 50%;
            transform: translateX(-50%);
            border-radius: 2px 2px 0 0;
            box-shadow: 0 -4px 10px #0ff;
            z-index: -1;
            transition: all 0.3s ease;
        }

        /* Holographic scan line */
        .scan-line {
            position: absolute;
            width: 100%;
            height: 2px;
            background: rgba(255, 0, 0, 0.8);
            box-shadow: 0 0 8px #f00;
            top: 0;
            opacity: 0;
        }

        @keyframes scan {
            0% { top: 0%; }
            50% { top: 100%; }
            100% { top: 0%; }
        }

        /* --- DEBUG MODE (Clicked State) --- */
        .drone-body.is-scanning {
            border-color: #f00;
            box-shadow: 0 0 25px rgba(255, 0, 0, 0.6), inset 0 0 15px rgba(255, 0, 0, 0.4);
            animation: shake 0.2s infinite;
        }
        
        .drone-body.is-scanning .drone-eye {
            background: #f00;
            box-shadow: 0 0 10px #fff, 0 0 25px #f00;
            width: 26px; height: 6px; /* Squinting/Scanning */
            border-radius: 3px;
        }

        .drone-body.is-scanning ~ .drone-antenna {
            background: #f00;
            box-shadow: 0 -4px 10px #f00;
        }

        .drone-body.is-scanning .scan-line {
            opacity: 1;
            animation: scan 0.6s linear infinite;
        }

        @keyframes shake {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(1px, -1px); }
            50% { transform: translate(-1px, 1px); }
            75% { transform: translate(1px, 1px); }
        }

        /* Particle CSS */
        @keyframes digital-decay {
            0% { transform: translate3d(0,0,0) scale(1); opacity: 1; }
            100% { transform: translate3d(var(--dx), var(--dy), 0) scale(0.2); opacity: 0; filter: blur(2px); }
        }
        .drone-particle {
            position: fixed; pointer-events: none; z-index: 999999;
            will-change: transform, opacity;
            animation: digital-decay 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            font-family: monospace;
            font-weight: bold;
        }
    `;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // --- 2. DOM CONSTRUCTION ---
    const container = document.createElement('div');
    container.id = 'ai-debugger-drone';
    container.className = 'drone-container';

    const antenna = document.createElement('div');
    antenna.className = 'drone-antenna';

    const body = document.createElement('div');
    body.className = 'drone-body';

    const eye = document.createElement('div');
    eye.className = 'drone-eye';

    const scanLine = document.createElement('div');
    scanLine.className = 'scan-line';

    body.appendChild(eye);
    body.appendChild(scanLine);
    container.appendChild(antenna);
    container.appendChild(body);
    document.body.appendChild(container);

    // --- 3. PARTICLE ENGINE (Syntax & Bugs) ---
    const stdParticles = ['0', '1', '{', '}', ';', '/>'];
    const bugParticles = ['🐛', '🐞', '⚡', '⚠', '🔥'];

    function spawnParticle(x, y, isBug = false) {
        const p = document.createElement('div');
        p.className = 'drone-particle';
        p.textContent = isBug 
            ? bugParticles[Math.floor(Math.random() * bugParticles.length)] 
            : stdParticles[Math.floor(Math.random() * stdParticles.length)];
        
        p.style.color = isBug ? '#ff4444' : ['#00ffff', '#00cccc', '#ffffff'][Math.floor(Math.random() * 3)];
        p.style.fontSize = (isBug ? 16 : 12) + 'px';
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        
        // Glitchy scatter pattern
        const angle = Math.random() * Math.PI * 2;
        const dist = isBug ? 60 : 25;
        p.style.setProperty('--dx', (Math.cos(angle) * dist) + 'px');
        p.style.setProperty('--dy', (Math.sin(angle) * dist - (isBug ? 30 : 10)) + 'px');
        
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1000);
    }

    // --- 4. ADVANCED PHYSICS & AI LOGIC ---
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let droneX = mouseX, droneY = mouseY;
    let velX = 0, velY = 0;
    
    // Idle state tracking
    let lastMouseMove = performance.now();
    let idleTargetX = mouseX, idleTargetY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        lastMouseMove = performance.now();
    });

    let spawnCounter = 0;

    function update(time) {
        // Determine if user is inactive (3 seconds)
        const isIdle = (time - lastMouseMove) > 3000;
        
        // If idle, pick random waypoints to patrol
        if (isIdle) {
            if (Math.random() < 0.015) { // Change target occasionally
                idleTargetX = Math.max(40, Math.min(window.innerWidth - 40, droneX + (Math.random() - 0.5) * 400));
                idleTargetY = Math.max(40, Math.min(window.innerHeight - 40, droneY + (Math.random() - 0.5) * 400));
            }
        }

        // Set physics target (cursor center vs idle patrol waypoint)
        let targetX = isIdle ? idleTargetX : mouseX - 20;
        let targetY = isIdle ? idleTargetY : mouseY - 20;

        // Snappy, robotic acceleration
        let ax = (targetX - droneX) * (isIdle ? 0.0005 : 0.003); 
        let ay = (targetY - droneY) * (isIdle ? 0.0005 : 0.003);
        
        velX = (velX + ax * 16) * 0.90; // High friction for robotic stops
        velY = (velY + ay * 16) * 0.90;

        droneX += velX;
        droneY += velY;

        // Add anti-gravity hover (sine wave) independent of base velocity
        let hoverY = Math.sin(time / 250) * 6;

        // Render transform (incorporating hover and velocity tilt)
        container.style.transform = `translate3d(${droneX}px, ${droneY + hoverY}px, 0) rotate(${velX * 1.2}deg)`;

        // Particle Trail (Spawns based on speed)
        spawnCounter += Math.hypot(velX, velY);
        if (spawnCounter > 25 && !isIdle) {
            spawnParticle(droneX + 20, droneY + 20);
            spawnCounter = 0;
        }

        requestAnimationFrame(update);
    }

    // --- 5. INTERACTION (Debug Scan Mode) ---
    let scanTimeout;
    body.onmousedown = (e) => {
        e.preventDefault();
        
        // Wake up from idle instantly
        lastMouseMove = performance.now(); 
        
        body.classList.add('is-scanning');
        
        // Force a rapid dash/recoil
        velX += (Math.random() - 0.5) * 30;
        velY -= 20;

        // Spit out bug particles
        for(let i=0; i<8; i++) {
            setTimeout(() => spawnParticle(droneX + 20, droneY + 20, true), i * 50);
        }
        
        clearTimeout(scanTimeout);
        scanTimeout = setTimeout(() => body.classList.remove('is-scanning'), 1500);
    };

    // Boot up
    requestAnimationFrame(update);
})();
