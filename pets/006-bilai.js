(function() {
    if (document.getElementById('tiny-cat-pet')) return;

    // --- 1. STYLES (Ultra-Detailed Adorable+++ Design) ---
    const style = document.createElement('style');
    const css = `
        .cat-container {
            position: fixed;
            width: 42px;
            height: 36px;
            z-index: 1000000;
            pointer-events: none;
            top: 0; left: 0;
            will-change: transform;
        }
        
        /* Smooth, lifelike breathing */
        @keyframes cat-breathe {
            0%, 100% { transform: scale(1, 1) translateY(0); }
            50% { transform: scale(1.03, 0.97) translateY(1.5px); }
        }
        
        /* Joyful tail swish */
        @keyframes tail-swish {
            0%, 100% { transform: rotate(12deg); }
            50% { transform: rotate(-25deg); }
        }

        /* Natural double-blink */
        @keyframes cat-blink {
            0%, 88%, 100% { transform: scaleY(1); }
            91% { transform: scaleY(0.1); }
            94% { transform: scaleY(1); }
            97% { transform: scaleY(0.1); }
        }

        /* Subtle ear twitching */
        @keyframes ear-twitch {
            0%, 90%, 100% { transform: rotate(var(--base-rot)); }
            95% { transform: rotate(calc(var(--base-rot) + 15deg)); }
        }

        .cat-tail {
            position: absolute;
            width: 9px; height: 26px;
            background: #fffaf0;
            border: 1.5px solid #ffdae0;
            border-radius: 10px;
            bottom: 6px; right: -6px;
            transform-origin: bottom center;
            animation: tail-swish 3s infinite ease-in-out;
            z-index: -2;
        }

        .cat-body {
            position: absolute;
            width: 100%; height: 100%;
            background: radial-gradient(circle at 30% 30%, #ffffff 0%, #fffaf0 70%, #ffedf0 100%);
            border-radius: 45% 45% 42% 42%;
            box-shadow: 0 5px 12px rgba(255, 182, 193, 0.4);
            border: 1.5px solid #ffdae0;
            pointer-events: auto;
            cursor: grab;
            animation: cat-breathe 2.5s infinite ease-in-out;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: transform 0.1s;
        }
        
        .cat-body:active {
            cursor: grabbing;
            transform: scale(1.05, 0.95) translateY(3px) !important;
        }

        /* 3D-ish Ears with pink insides */
        .cat-ear {
            position: absolute;
            width: 14px; height: 14px;
            background: #fffaf0;
            border: 1.5px solid #ffdae0;
            top: -7px;
            border-radius: 3px 12px 0 0;
            z-index: -1;
            overflow: hidden;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .cat-ear::after {
            content: ''; position: absolute;
            bottom: 0; left: 3px;
            width: 7px; height: 8px;
            background: #ffcbd1; /* Pink inner ear */
            border-radius: 3px 8px 0 0;
        }
        .cat-ear.left { 
            left: 1px; --base-rot: -20deg; 
            transform: rotate(var(--base-rot)); 
            animation: ear-twitch 7s infinite ease-in-out; 
        }
        .cat-ear.right { 
            right: 1px; --base-rot: 20deg; 
            transform: scaleX(-1) rotate(calc(var(--base-rot) * -1)); 
        }

        .cat-face { position: relative; width: 100%; height: 100%; pointer-events: none; }

        /* Highly detailed anime eyes */
        .cat-eye {
            width: 8px; height: 10px;
            background: #4a3636;
            border-radius: 50%;
            position: absolute; top: 13px;
            animation: cat-blink 5s infinite;
            box-shadow: inset 0 -2px 0 rgba(160, 120, 120, 0.3);
            transition: all 0.2s;
        }
        .cat-eye.left { left: 7px; }
        .cat-eye.right { right: 7px; }

        /* Eye Gleams (Catchlights) */
        .cat-eye::before {
            content: ''; position: absolute; top: 1.5px; left: 1.5px;
            width: 3.5px; height: 3.5px; background: #fff; border-radius: 50%;
        }
        .cat-eye::after {
            content: ''; position: absolute; bottom: 2px; right: 1.5px;
            width: 1.5px; height: 1.5px; background: #fff; border-radius: 50%;
        }

        .cat-blush {
            width: 8px; height: 4px;
            background: #ffcbd1; border-radius: 50%;
            position: absolute; top: 22px; filter: blur(1px); opacity: 0.85;
            transition: all 0.3s;
        }
        .cat-blush.left { left: 2px; }
        .cat-blush.right { right: 2px; }

        /* Tiny Pink Nose */
        .cat-nose {
            position: absolute; width: 3.5px; height: 2.5px;
            background: #ff9fb1; border-radius: 50%;
            top: 19px; left: 50%; transform: translateX(-50%);
        }

        /* Perfect ':3' Mouth using borders */
        .cat-mouth {
            position: absolute; top: 20.5px; left: 50%;
            transform: translateX(-50%); width: 10px; height: 4px;
            transition: all 0.2s;
        }
        .cat-mouth::before, .cat-mouth::after {
            content: ''; position: absolute; width: 5px; height: 4px;
            border: 1.5px solid transparent; border-bottom-color: #4a3636;
            border-radius: 50%;
        }
        .cat-mouth::before { left: -1.5px; }
        .cat-mouth::after { right: -1.5px; }

        /* Cute Whiskers */
        .cat-whisker {
            position: absolute; width: 7px; height: 1.2px;
            background: #d6b8be; border-radius: 2px; opacity: 0.7;
        }
        .cat-whisker.l1 { top: 18px; left: -3px; transform: rotate(12deg); }
        .cat-whisker.l2 { top: 21px; left: -3px; transform: rotate(-5deg); }
        .cat-whisker.r1 { top: 18px; right: -3px; transform: rotate(-12deg); }
        .cat-whisker.r2 { top: 21px; right: -3px; transform: rotate(5deg); }

        /* Little dangling paws */
        .cat-paw {
            width: 9px; height: 7px;
            background: #fffaf0;
            border: 1.5px solid #ffdae0;
            border-radius: 5px 5px 4px 4px;
            position: absolute; bottom: -3px;
            box-shadow: 0 2px 3px rgba(255, 182, 193, 0.4);
            z-index: 2;
        }
        .cat-paw.left { left: 6px; }
        .cat-paw.right { right: 6px; }

        /* --- EXTREMELY HAPPY PETTED STATE --- */
        .cat-body.is-petted .cat-eye {
            background: transparent; height: 5px; top: 16px;
            border: 1.5px solid #4a3636; border-top: none; border-radius: 0 0 10px 10px;
            animation: none; box-shadow: none;
        }
        .cat-body.is-petted .cat-eye::before, .cat-body.is-petted .cat-eye::after { display: none; }
        
        .cat-body.is-petted .cat-mouth {
            top: 20px; width: 6px; height: 6px;
            background: #ff7ea0; border-radius: 2px 2px 10px 10px;
            border: 1.5px solid #4a3636;
        }
        .cat-body.is-petted .cat-mouth::before, .cat-body.is-petted .cat-mouth::after { display: none; }
        
        .cat-body.is-petted .cat-blush { transform: scale(1.5); background: #ffb6c1; opacity: 1; top: 21px; }
        
        /* Airplane ears when happy! */
        .cat-body.is-petted .cat-ear.left { transform: rotate(-55deg) translateY(2px); }
        .cat-body.is-petted .cat-ear.right { transform: scaleX(-1) rotate(-55deg) translateY(2px); }

        /* Magic Particles */
        @keyframes sparkle-trail {
            0% { transform: translate3d(0,0,0) scale(1) rotate(0deg); opacity: 1; }
            100% { transform: translate3d(var(--dx), var(--dy), 0) scale(0) rotate(120deg); opacity: 0; }
        }
        .cat-particle {
            position: fixed; pointer-events: none; z-index: 999999;
            will-change: transform, opacity;
            animation: sparkle-trail 0.9s ease-out forwards;
        }
    `;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // --- 2. CREATE PET DOM ---
    const container = document.createElement('div');
    container.id = 'tiny-cat-pet';
    container.className = 'cat-container';

    const tail = document.createElement('div');
    tail.className = 'cat-tail';
    container.appendChild(tail);

    const body = document.createElement('div');
    body.className = 'cat-body';

    const face = document.createElement('div');
    face.className = 'cat-face';

    const elements =[
        { cls: 'cat-ear left', parent: body },
        { cls: 'cat-ear right', parent: body },
        { cls: 'cat-paw left', parent: body },
        { cls: 'cat-paw right', parent: body },
        { cls: 'cat-eye left', parent: face },
        { cls: 'cat-eye right', parent: face },
        { cls: 'cat-blush left', parent: face },
        { cls: 'cat-blush right', parent: face },
        { cls: 'cat-whisker l1', parent: face },
        { cls: 'cat-whisker l2', parent: face },
        { cls: 'cat-whisker r1', parent: face },
        { cls: 'cat-whisker r2', parent: face },
        { cls: 'cat-nose', parent: face },
        { cls: 'cat-mouth', parent: face }
    ];

    elements.forEach(el => {
        const div = document.createElement('div');
        div.className = el.cls;
        el.parent.appendChild(div);
    });

    body.appendChild(face);
    container.appendChild(body);
    document.body.appendChild(container);

    // --- 3. PARTICLE ENGINE (Hearts, Paws, Stars) ---
    const particles =['✨', '🌸', '💖', '🐾', '⭐'];
    function spawnParticle(x, y, isSpecial = false) {
        const p = document.createElement('div');
        p.className = 'cat-particle';
        
        // Use hearts/paws for special (clicking), stars/flowers for moving
        const charPool = isSpecial ? ['💖', '🐾'] :['✨', '🌸', '⭐'];
        p.textContent = charPool[Math.floor(Math.random() * charPool.length)];
        
        p.style.color = isSpecial ? '#ff7ea0' :['#FFD1DC', '#B2E2F2', '#FEF9E7'][Math.floor(Math.random() * 3)];
        p.style.fontSize = (isSpecial ? 16 : 11) + 'px';
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        
        const angle = Math.random() * Math.PI * 2;
        const dist = isSpecial ? 50 : 25;
        p.style.setProperty('--dx', (Math.cos(angle) * dist) + 'px');
        p.style.setProperty('--dy', (Math.sin(angle) * dist - (isSpecial ? 30 : 10)) + 'px');
        
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 900);
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

        // Ultra-smooth follow math (offsets adjusted for new dimensions)
        let ax = (mouseX - 21 - petX) * 0.0015; 
        let ay = (mouseY - 18 - petY) * 0.0015;
        
        velX = (velX + ax * dt) * 0.95; 
        velY = (velY + ay * dt) * 0.95;

        petX += velX * dt;
        petY += velY * dt;

        // Dynamic body tilt based on velocity
        container.style.transform = `translate3d(${petX}px, ${petY}px, 0) rotate(${velX * 2}deg)`;

        // Throttled magic trail
        spawnCounter += Math.hypot(velX, velY);
        if (spawnCounter > 18) {
            spawnParticle(petX + 21, petY + 18);
            spawnCounter = 0;
        }

        requestAnimationFrame(update);
    }

    // --- 5. ADORABLE INTERACTION ---
    let pettedTimeout;
    body.onmousedown = (e) => {
        e.preventDefault();
        body.classList.add('is-petted');
        
        // Explode with hearts & paw prints!
        for(let i=0; i<8; i++) spawnParticle(petX + 21, petY + 18, true);
        
        clearTimeout(pettedTimeout);
        pettedTimeout = setTimeout(() => body.classList.remove('is-petted'), 1200);
    };

    requestAnimationFrame(update);
})();
