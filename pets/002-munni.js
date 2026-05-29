(function() {
    if (document.getElementById('tiny-mochi')) return;

    // --- 1. STYLES (Precision Alignment & Smooth Transitions) ---
    const style = document.createElement('style');
    const css = `
        .mochi-container {
            position: fixed;
            width: 35px;
            height: 28px;
            z-index: 1000000;
            pointer-events: none;
            top: 0; left: 0;
            will-change: transform;
        }
        
        @keyframes mochi-breathe {
            0%, 100% { transform: scale(1, 1); }
            50% { transform: scale(1.04, 0.96); }
        }

        .mochi-body {
            position: absolute;
            width: 100%;
            height: 100%;
            /* Dark mode gradient */
            background: radial-gradient(circle at 30% 30%, #555 0%, #111 100%);
            border-radius: 50% 50% 45% 45%;
            /* Dark shadow */
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
            border: 1.5px solid #000;
            pointer-events: auto;
            cursor: grab;
            animation: mochi-breathe 3s infinite ease-in-out;
            transition: background 0.3s ease;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* --- FACE WRAPPER (Centers everything perfectly) --- */
        .mochi-face {
            position: relative;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }
        
        @keyframes blink {
            0%, 92%, 100% { transform: scaleY(1); }
            96% { transform: scaleY(0.1); }
        }

        /* EYES: White for contrast */
        .mochi-eye {
            width: 3.5px; height: 3.5px;
            background: #fff; border-radius: 50%;
            position: absolute; 
            top: 11px;
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            animation: blink 4s infinite ease-in-out;
        }
        .mochi-eye.left { left: 8px; }
        .mochi-eye.right { right: 8px; }

        /* MOUTH: White borders */
        .mochi-mouth {
            width: 6px; height: 3px;
            border: 1.2px solid #fff;
            border-top: none;
            border-radius: 0 0 10px 10px;
            position: absolute;
            top: 16px;
            left: 50%;
            transform: translateX(-50%);
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        /* BLUSH: Adjusted opacity/color for dark mode */
        .mochi-blush {
            width: 6px; height: 3px;
            background: rgba(255, 105, 180, 0.6); border-radius: 50%;
            position: absolute; top: 18px; filter: blur(1px);
            opacity: 0.8;
        }
        .mochi-blush.left { left: 5px; }
        .mochi-blush.right { right: 5px; }

        /* --- PETTED STATE (Happy Expression) --- */
        .mochi-body.is-petted .mochi-eye {
            width: 6px; height: 3px;
            background: transparent;
            border: 1.2px solid #fff;
            border-bottom: none;
            border-radius: 10px 10px 0 0;
            top: 10px;
            animation: none;
        }
        .mochi-body.is-petted .mochi-mouth {
            width: 7px; height: 5px;
            background: #ff7ea0;
            border: none;
            border-radius: 2px 2px 10px 10px;
            top: 15px;
        }
        .mochi-body.is-petted .mochi-blush {
            transform: scale(1.3);
            background: rgba(255, 105, 180, 0.9);
        }

        /* EARS: Dark matching ears */
        .mochi-ear {
            width: 8px; height: 8px;
            background: #111; border: 1.5px solid #000;
            position: absolute; top: -4px; border-radius: 50% 50% 0 0; z-index: -1;
        }

        @keyframes sparkle-trail {
            0% { transform: translate3d(0,0,0) scale(1) rotate(0deg); opacity: 1; }
            100% { transform: translate3d(var(--dx), var(--dy), 0) scale(0) rotate(90deg); opacity: 0; }
        }
        .mochi-particle {
            position: fixed; pointer-events: none; z-index: 999999;
            will-change: transform, opacity;
            animation: sparkle-trail 0.8s ease-out forwards;
        }
    `;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // --- 2. CREATE PET (Simplified DOM structure) ---
    const container = document.createElement('div');
    container.id = 'tiny-mochi';
    container.className = 'mochi-container';

    const body = document.createElement('div');
    body.className = 'mochi-body';

    const face = document.createElement('div');
    face.className = 'mochi-face';

    const elements = [
        { cls: 'mochi-ear', style: 'left:4px; transform:rotate(-20deg);' },
        { cls: 'mochi-ear', style: 'right:4px; transform:rotate(20deg);' },
        { cls: 'mochi-eye left' },
        { cls: 'mochi-eye right' },
        { cls: 'mochi-blush left' },
        { cls: 'mochi-blush right' },
        { cls: 'mochi-mouth' }
    ];

    elements.forEach(el => {
        const div = document.createElement('div');
        div.className = el.cls;
        if (el.style) div.style.cssText = el.style;
        el.cls.includes('ear') ? body.appendChild(div) : face.appendChild(div);
    });

    body.appendChild(face);
    container.appendChild(body);
    document.body.appendChild(container);

    // --- 3. OPTIMIZED PARTICLE ENGINE ---
    const particles = ['✨', '✧', '🌸', '💖'];
    function spawnParticle(x, y, isSpecial = false) {
        const p = document.createElement('div');
        p.className = 'mochi-particle';
        p.textContent = isSpecial ? particles[Math.floor(Math.random() * 2) + 2] : particles[Math.floor(Math.random() * 2)];
        
        // Changed normal particles to lighter/starry colors for contrast against black
        p.style.color = isSpecial ? '#ffb6c1' : ['#FFFFFF', '#FFD700', '#B2E2F2'][Math.floor(Math.random() * 3)];
        
        p.style.fontSize = (isSpecial ? 14 : 10) + 'px';
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        
        const angle = Math.random() * Math.PI * 2;
        const dist = isSpecial ? 40 : 20;
        p.style.setProperty('--dx', (Math.cos(angle) * dist) + 'px');
        p.style.setProperty('--dy', (Math.sin(angle) * dist - (isSpecial ? 20 : 0)) + 'px');
        
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 800);
    }

    // --- 4. PERFECTED PHYSICS ---
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let petX = mouseX, petY = mouseY;
    let velX = 0, velY = 0;
    let lastTime = performance.now();
    let spawnCounter = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function update(time) {
        const dt = (time - lastTime) / 16; // Normalized delta time
        lastTime = time;

        // Ultra-smooth follow math
        let ax = (mouseX - 17.5 - petX) * 0.0015; 
        let ay = (mouseY - 14 - petY) * 0.0015;
        
        velX = (velX + ax * dt) * 0.95; 
        velY = (velY + ay * dt) * 0.95;

        petX += velX * dt;
        petY += velY * dt;

        container.style.transform = `translate3d(${petX}px, ${petY}px, 0) rotate(${velX * 1.8}deg)`;

        // Throttled trail spawn
        spawnCounter += Math.hypot(velX, velY);
        if (spawnCounter > 15) {
            spawnParticle(petX + 17, petY + 14);
            spawnCounter = 0;
        }

        requestAnimationFrame(update);
    }

    // --- 5. INTERACTION ---
    let pettedTimeout;
    body.onmousedown = (e) => {
        e.preventDefault();
        body.classList.add('is-petted');
        for(let i=0; i<6; i++) spawnParticle(petX + 17, petY + 14, true);
        
        clearTimeout(pettedTimeout);
        pettedTimeout = setTimeout(() => body.classList.remove('is-petted'), 1000);
    };

    requestAnimationFrame(update);
})();
