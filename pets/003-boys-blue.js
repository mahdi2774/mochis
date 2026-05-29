(function() {
    // Unique ID so they don't overlap if you switch back and forth
    if (document.getElementById('cool-blue-mochi')) return;

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
            /* Cool icy cyan gradient */
            background: radial-gradient(circle at 30% 30%, #e0f7fa 0%, #80deea 100%);
            border-radius: 45% 45% 50% 50%; /* Slightly flatter bottom */
            box-shadow: 0 4px 10px rgba(0, 188, 212, 0.3);
            border: 1.5px solid #26c6da;
            pointer-events: auto;
            cursor: grab;
            animation: mochi-breathe 3s infinite ease-in-out;
            transition: background 0.3s ease, transform 0.2s;
            display: flex;
            justify-content: center;
            align-items: center;
        }

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

        .mochi-eye {
            width: 3.5px; height: 3.5px;
            background: #223; /* Darker, sharper contrast */
            border-radius: 50%;
            position: absolute; 
            top: 11px;
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            animation: blink 4s infinite ease-in-out;
        }
        .mochi-eye.left { left: 8px; }
        .mochi-eye.right { right: 8px; }

        .mochi-mouth {
            width: 6px; height: 3px;
            border: 1.5px solid #223;
            border-top: none;
            border-radius: 0 0 10px 10px;
            position: absolute;
            top: 16px;
            left: 50%;
            transform: translateX(-50%);
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        /* Subtle icy blush */
        .mochi-blush {
            width: 6px; height: 3px;
            background: #4dd0e1; border-radius: 50%;
            position: absolute; top: 18px; filter: blur(1px);
            opacity: 0.6;
        }
        .mochi-blush.left { left: 5px; }
        .mochi-blush.right { right: 5px; }

        /* --- PETTED STATE (Hyped Expression) --- */
        .mochi-body.is-petted {
            transform: scale(1.1);
        }
        .mochi-body.is-petted .mochi-eye {
            width: 6px; height: 3px;
            background: transparent;
            border: 1.5px solid #223;
            border-bottom: none;
            border-radius: 10px 10px 0 0;
            top: 10px;
            animation: none;
        }
        .mochi-body.is-petted .mochi-mouth {
            width: 7px; height: 5px;
            background: #00bcd4; /* Deep aqua */
            border: none;
            border-radius: 2px 2px 10px 10px;
            top: 15px;
        }
        .mochi-body.is-petted .mochi-blush {
            transform: scale(1.4);
            background: #00bcd4;
            opacity: 0.9;
        }

        /* Sharper, spikier horns/ears */
        .mochi-ear {
            width: 8px; height: 8px;
            background: #b2ebf2; border: 1.5px solid #26c6da;
            position: absolute; top: -3px; 
            border-radius: 2px 8px 0 0; /* Sharper edges */
            z-index: -1;
        }

        @keyframes sparkle-trail {
            0% { transform: translate3d(0,0,0) scale(1) rotate(0deg); opacity: 1; }
            100% { transform: translate3d(var(--dx), var(--dy), 0) scale(0) rotate(90deg); opacity: 0; }
        }
        .mochi-particle {
            position: fixed; pointer-events: none; z-index: 999999;
            will-change: transform, opacity;
            animation: sparkle-trail 0.7s ease-out forwards; /* Slightly faster decay */
        }
    `;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // --- 2. CREATE PET ---
    const container = document.createElement('div');
    container.id = 'cool-blue-mochi';
    container.className = 'mochi-container';

    const body = document.createElement('div');
    body.className = 'mochi-body';

    const face = document.createElement('div');
    face.className = 'mochi-face';

    const elements = [
        { cls: 'mochi-ear', style: 'left:5px; transform:rotate(-30deg);' },
        { cls: 'mochi-ear', style: 'right:5px; transform:rotate(30deg) scaleX(-1);' },
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

    // --- 3. OPTIMIZED PARTICLE ENGINE (Cool Edition) ---
    const particles = ['✦', '⚡', '💨', '🌀'];
    function spawnParticle(x, y, isSpecial = false) {
        const p = document.createElement('div');
        p.className = 'mochi-particle';
        // Sparks/Lightning for normal trail, Wind/Swirls for special clicks
        p.textContent = isSpecial ? particles[Math.floor(Math.random() * 2) + 2] : particles[Math.floor(Math.random() * 2)];
        
        // Electric blue, cyan, and energetic yellow
        p.style.color = isSpecial ? '#00acc1' : ['#4dd0e1', '#81d4fa', '#ffca28'][Math.floor(Math.random() * 3)];
        p.style.fontSize = (isSpecial ? 15 : 11) + 'px';
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        
        const angle = Math.random() * Math.PI * 2;
        const dist = isSpecial ? 45 : 25;
        p.style.setProperty('--dx', (Math.cos(angle) * dist) + 'px');
        p.style.setProperty('--dy', (Math.sin(angle) * dist - (isSpecial ? 20 : 0)) + 'px');
        
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 700);
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
        const dt = (time - lastTime) / 16; 
        lastTime = time;

        let ax = (mouseX - 17.5 - petX) * 0.0015; 
        let ay = (mouseY - 14 - petY) * 0.0015;
        
        velX = (velX + ax * dt) * 0.95; 
        velY = (velY + ay * dt) * 0.95;

        petX += velX * dt;
        petY += velY * dt;

        container.style.transform = `translate3d(${petX}px, ${petY}px, 0) rotate(${velX * 1.8}deg)`;

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
        // Spawn energetic burst
        for(let i=0; i<8; i++) spawnParticle(petX + 17, petY + 14, true);
        
        clearTimeout(pettedTimeout);
        pettedTimeout = setTimeout(() => body.classList.remove('is-petted'), 1000);
    };

    requestAnimationFrame(update);
})();
