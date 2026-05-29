(function() {
    // --- Prevent multiple instances ---
    if (document.getElementById('ultimate-mochi-pet')) return;

    // --- Cached Window Dimensions (Optimization) ---
    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;
    window.addEventListener('resize', () => {
        winWidth = window.innerWidth;
        winHeight = window.innerHeight;
    });

    // --- Configuration Constants ---
    const PET_WIDTH = 34;
    const PET_HEIGHT = 28;
    const Z_INDEX_PET = 2147483647;
    const Z_INDEX_PARTICLE = 2147483646;

    // Physics & AI Parameters
    const SPRING_STIFFNESS_DEFAULT = 0.0015;
    const SPRING_STIFFNESS_EXHAUSTED = 0.0008;
    const FRICTION_DEFAULT = 0.92;
    const FRICTION_CRYING = 0.8;
    const FRICTION_PETTED = 0.85;
    const RECOVERY_RATE = 2; 
    const IDLE_THRESHOLD = 300; 
    const EXHAUSTED_THRESHOLD = 400; 
    const CRYING_THRESHOLD = 150; 
    const RESCUE_DISTANCE = 40; 
    const PETTED_DURATION = 1500; 
    
    // --- PERFECTED KAWAII PROPORTIONS ---
    const EYE_OFFSET_TOP = 13;      // Lowered for a cuter ratio
    const EYE_LEFT_OFFSET = 8;      // Balanced spacing
    const EYE_RIGHT_OFFSET = 8;
    const BLUSH_OFFSET_TOP = 14.5;
    const BLUSH_LEFT_OFFSET = 2.5;
    const BLUSH_RIGHT_OFFSET = 2.5;
    const MOUTH_OFFSET_TOP = 14.5;  // Centered exactly between eyes
    const MOUTH_OFFSET_LEFT_CENTER = '50%';
    const MOUTH_OFFSET_TRANSFORM_X = '-50%';
    
    // Emotion States Offsets
    const EYE_TRANSFORM_TOP_PETTED = 11;
    const MOUTH_TRANSFORM_TOP_PETTED = 13.5;
    const EYE_TRANSFORM_TOP_CRYING = 12;
    const MOUTH_TRANSFORM_TOP_CRYING = 15.5;
    const EYE_TRANSFORM_TOP_SLEEPING = 14;
    const MOUTH_TRANSFORM_TOP_SLEEPING = 14.5;
    const EYE_TRANSFORM_TOP_EXHAUSTED = 12;
    const MOUTH_TRANSFORM_TOP_EXHAUSTED = 14;
    
    // Body Parts Offsets
    const EAR_LEFT_OFFSET = 3;
    const EAR_RIGHT_OFFSET = 3;
    const EAR_TOP_OFFSET = -10;
    const EAR_ROTATION_DEFAULT_LEFT = -15;
    const EAR_ROTATION_DEFAULT_RIGHT = 15;
    const PAW_LEFT_OFFSET = 5;
    const PAW_RIGHT_OFFSET = 5;
    const PAW_BOTTOM_OFFSET = -2.5;
    const EAR_INNER_TOP_OFFSET = 2;
    const EAR_INNER_LEFT_OFFSET = '50%';
    const EAR_INNER_TRANSFORM_X = '-50%';
    
    // Particle Timers & Sizes
    const PARTICLE_SPAWN_INTERVAL_MAGIC = 150;
    const PARTICLE_SPAWN_INTERVAL_SLEEP = 60;
    const PARTICLE_SPAWN_INTERVAL_SWEAT = 1.5; 
    const PARTICLE_SPAWN_INTERVAL_TEAR = 30;
    const TEAR_OFFSET_Y = 14;
    const TEAR_LEFT_OFFSET = 8.5;
    const TEAR_RIGHT_OFFSET = 8.5;

    // --- MASTERPIECE STYLES ---
    const style = document.createElement('style');
    const css = `
        :root {
            --mochi-color: #ffffff;
            --mochi-dark: #4a3b3b;
            --mochi-blush: #ffb6c1;
        }

        #ultimate-mochi-pet {
            position: fixed;
            width: ${PET_WIDTH}px;
            height: ${PET_HEIGHT}px;
            z-index: ${Z_INDEX_PET};
            pointer-events: none;
            top: 0; left: 0;
            will-change: transform;
            filter: drop-shadow(0 4px 6px rgba(255, 182, 193, 0.4));
        }

        .mochi-body {
            position: absolute;
            width: 100%; height: 100%;
            background: linear-gradient(135deg, var(--mochi-color) 0%, #fff0f5 100%);
            border-radius: 50% 50% 45% 45%;
            box-shadow: inset -2px -2px 6px rgba(255, 182, 193, 0.3), inset 2px 2px 6px rgba(255,255,255,0.9);
            border: 1.5px solid #ffdae0;
            pointer-events: auto;
            cursor: grab;
            transition: background 0.3s ease;
            transform-origin: bottom center;
            animation: mochi-breathe-organic 2.5s infinite ease-in-out;
            will-change: transform;
        }

        .mochi-body:active { cursor: grabbing; }

        /* --- EARS --- */
        .mochi-ear {
            position: absolute;
            width: 10px; height: 16px;
            background: linear-gradient(135deg, #fff 0%, #fff0f5 100%);
            border: 1.5px solid #ffdae0;
            border-radius: 50% 50% 20% 20%;
            top: ${EAR_TOP_OFFSET}px;
            z-index: -1;
            transform-origin: bottom center;
            will-change: transform;
        }
        .mochi-ear.left { left: ${EAR_LEFT_OFFSET}px; }
        .mochi-ear.right { right: ${EAR_RIGHT_OFFSET}px; }

        .mochi-ear::after {
            content: ''; position: absolute;
            width: 4.5px; height: 8px;
            background: #ffcbd1;
            border-radius: 50%;
            top: ${EAR_INNER_TOP_OFFSET}px; left: ${EAR_INNER_LEFT_OFFSET};
            transform: translateX(${EAR_INNER_TRANSFORM_X});
        }

        /* --- PAWS --- */
        .mochi-paw {
            position: absolute;
            width: 8px; height: 5.5px;
            background: #fff;
            border: 1.5px solid #ffdae0;
            border-radius: 50%;
            bottom: ${PAW_BOTTOM_OFFSET}px;
            z-index: 2;
            will-change: transform;
        }
        .mochi-paw.left { left: ${PAW_LEFT_OFFSET}px; }
        .mochi-paw.right { right: ${PAW_RIGHT_OFFSET}px; }

        /* --- FACE --- */
        .mochi-face {
            position: relative;
            width: 100%; height: 100%;
            pointer-events: none;
            will-change: transform;
        }

        /* Eyes */
        .mochi-eye {
            position: absolute;
            width: 4px; height: 4px;
            background: var(--mochi-dark);
            border-radius: 50%;
            top: ${EYE_OFFSET_TOP}px;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mochi-eye.left { left: ${EYE_LEFT_OFFSET}px; }
        .mochi-eye.right { right: ${EYE_RIGHT_OFFSET}px; }

        .state-idle .mochi-eye, .state-following .mochi-eye, .state-exhausted .mochi-eye {
            animation: mochi-blink 3.5s infinite;
        }

        /* Blushes */
        .mochi-blush {
            position: absolute;
            width: 7px; height: 3px;
            background: var(--mochi-blush);
            border-radius: 50%;
            top: ${BLUSH_OFFSET_TOP}px;
            filter: blur(0.8px);
            opacity: 0.8;
            transition: all 0.3s ease;
        }
        .mochi-blush.left { left: ${BLUSH_LEFT_OFFSET}px; }
        .mochi-blush.right { right: ${BLUSH_RIGHT_OFFSET}px; }

        /* Mouth */
        .mochi-mouth {
            position: absolute;
            width: 5px; height: 3px;
            border: 1.5px solid var(--mochi-dark);
            border-top: none;
            border-radius: 0 0 10px 10px;
            top: ${MOUTH_OFFSET_TOP}px; left: ${MOUTH_OFFSET_LEFT_CENTER};
            transform: translateX(${MOUTH_OFFSET_TRANSFORM_X});
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* --- EMOTION STATES --- */
        .state-petted .mochi-eye {
            background: transparent; height: 4px; width: 6px;
            border: 1.5px solid var(--mochi-dark); border-bottom: none;
            border-radius: 10px 10px 0 0; top: ${EYE_TRANSFORM_TOP_PETTED}px;
        }
        .state-petted .mochi-mouth {
            width: 5px; height: 4px; background: #ff7ea0; border: none;
            border-radius: 2px 2px 10px 10px; top: ${MOUTH_TRANSFORM_TOP_PETTED}px;
        }
        .state-petted .mochi-blush { transform: scale(1.3); opacity: 1; background: #ff9fb3; }

        .state-crying .mochi-eye {
            background: transparent; height: 4px; width: 5px;
            border: 1.5px solid var(--mochi-dark); border-top: none;
            border-radius: 0 0 10px 10px; top: ${EYE_TRANSFORM_TOP_CRYING}px;
        }
        .state-crying .mochi-mouth {
            width: 4px; height: 2px; border-bottom: none; border-top: 1.5px solid var(--mochi-dark);
            border-radius: 10px 10px 0 0; top: ${MOUTH_TRANSFORM_TOP_CRYING}px;
        }
        .state-crying .mochi-blush { transform: translateY(1px) scale(0.8); opacity: 0.5; }

        .state-sleeping .mochi-eye {
            background: transparent; height: 1px; width: 6px;
            border-top: 1.5px solid var(--mochi-dark); border-radius: 0; top: ${EYE_TRANSFORM_TOP_SLEEPING}px;
        }
        .state-sleeping .mochi-mouth {
            width: 3px; height: 3px; border: 1.5px solid var(--mochi-dark);
            border-radius: 50%; top: ${MOUTH_TRANSFORM_TOP_SLEEPING}px;
        }

        .state-exhausted .mochi-eye {
            background: transparent; height: 4px; width: 4px;
            border: 1.5px solid var(--mochi-dark); border-radius: 50%; top: ${EYE_TRANSFORM_TOP_EXHAUSTED}px;
        }
        .state-exhausted .mochi-mouth {
            width: 5px; height: 4px; border: none; background: #ffcbd1;
            border-radius: 40% 40% 50% 50%; top: ${MOUTH_TRANSFORM_TOP_EXHAUSTED}px;
        }

        /* --- ANIMATIONS --- */
        @keyframes mochi-breathe-organic {
            0%, 100% { transform: scale(1, 1) skewX(0deg); }
            50% { transform: scale(1.02, 0.97) skewX(0.5deg); }
        }
        @keyframes mochi-blink {
            0%, 94%, 98%, 100% { transform: scaleY(1); }
            96% { transform: scaleY(0.1); }
        }
        @keyframes particle-fade {
            0% { transform: translate3d(0,0,0) scale(1) rotate(0deg); opacity: 1; }
            100% { transform: translate3d(var(--dx), var(--dy), 0) scale(0.5) rotate(var(--rot)); opacity: 0; }
        }
        @keyframes tear-drop {
            0% { transform: translateY(0) scale(1) rotate(45deg); opacity: 1; }
            100% { transform: translateY(15px) scale(0) rotate(45deg); opacity: 0; }
        }

        .mochi-particle {
            position: fixed; pointer-events: none; z-index: ${Z_INDEX_PARTICLE};
            will-change: transform, opacity;
            animation: particle-fade var(--duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .mochi-tear {
            position: absolute; width: 3px; height: 5px;
            background: #80c5de; border-radius: 0 50% 50% 50%;
            top: ${TEAR_OFFSET_Y}px; z-index: 3;
            animation: tear-drop 0.8s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
        }
        .mochi-tear.left { left: ${TEAR_LEFT_OFFSET}px; }
        .mochi-tear.right { right: ${TEAR_RIGHT_OFFSET}px; }
    `;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // --- DOM CONSTRUCTION ---
    const container = document.createElement('div');
    container.id = 'ultimate-mochi-pet';

    const body = document.createElement('div');
    body.className = 'mochi-body state-idle';

    const face = document.createElement('div');
    face.className = 'mochi-face';

    const parts =[
        { cls: 'mochi-ear left', parent: body }, { cls: 'mochi-ear right', parent: body },
        { cls: 'mochi-paw left', parent: body }, { cls: 'mochi-paw right', parent: body },
        { cls: 'mochi-eye left', parent: face }, { cls: 'mochi-eye right', parent: face },
        { cls: 'mochi-blush left', parent: face }, { cls: 'mochi-blush right', parent: face },
        { cls: 'mochi-mouth', parent: face }
    ];

    const elements = {};
    parts.forEach(p => {
        const el = document.createElement('div');
        el.className = p.cls;
        p.parent.appendChild(el);
        const baseName = p.cls.split(' ')[0].replace('mochi-', '');
        const side = p.cls.includes('left') ? 'L' : p.cls.includes('right') ? 'R' : '';
        elements[`mochi${baseName.charAt(0).toUpperCase() + baseName.slice(1)}${side}`] = el;
    });

    body.appendChild(face);
    container.appendChild(body);
    document.body.appendChild(container);

    // --- PARTICLE ENGINE ---
    const particleTypes = {
        magic: { content:['✨','✧','🌸'], color: '#ffd1dc', dist: 25, dur: 1200, size: 10 },
        heart: { content:['💖','💕','💓'], color: '#ff7ea0', dist: 40, dur: 1500, size: 12 },
        sleep: { content: '💤', color: '#80c5de', dist: 30, dur: 1800, size: 11 },
        sweat: { content: '💦', color: '#80c5de', dist: 20, dur: 1000, size: 10 }
    };

    function spawnParticle(x, y, type) {
        const p = document.createElement('div');
        p.className = 'mochi-particle';
        const config = particleTypes[type];
        if (!config) return;

        p.textContent = Array.isArray(config.content) ? config.content[Math.floor(Math.random() * config.content.length)] : config.content;
        p.style.fontSize = config.size + 'px';
        p.style.color = config.color;
        p.style.left = x + 'px';
        p.style.top = y + 'px';

        const angle = type === 'sleep' ? (Math.random() * -Math.PI - 0.5 * Math.PI) : Math.random() * Math.PI * 2;
        p.style.setProperty('--dx', (Math.cos(angle) * config.dist) + 'px');
        p.style.setProperty('--dy', (Math.sin(angle) * config.dist - (type === 'sleep' ? 30 : 15)) + 'px');
        p.style.setProperty('--rot', (Math.random() * 180 - 90) + 'deg');
        p.style.setProperty('--duration', config.dur + 'ms');

        document.body.appendChild(p);
        setTimeout(() => p.remove(), config.dur);
    }

    // --- OPTIMIZED PHYSICS & AI ENGINE ---
    let mouseX = winWidth / 2, mouseY = winHeight / 2;
    let prevMouseX = mouseX, prevMouseY = mouseY;
    let petX = mouseX, petY = mouseY;
    let velX = 0, velY = 0;
    
    // Smooth face tracking variables
    let currentLookX = 0, currentLookY = 0;

    let state = 'idle';
    let fatigue = 0, idleTimer = 0, particleTimer = 0;
    let pettedTimer = null;
    let lastTime = performance.now();
    let isDragging = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        idleTimer = 0;
        if (state === 'sleeping' && !isDragging) changeState('following');
    });

    function changeState(newState) {
        if (state === newState) return;
        state = newState;
        body.className = `mochi-body state-${state}`;
    }

    function update(time) {
        const dt = Math.min((time - lastTime) / 16.66, 2); // Time delta cap
        lastTime = time;

        const targetX = mouseX - PET_WIDTH / 2;
        const targetY = mouseY - PET_HEIGHT / 2;
        const dx = targetX - petX;
        const dy = targetY - petY;
        const distance = Math.sqrt(dx * dx + dy * dy); // Optimized Math

        let mouseVelX = mouseX - prevMouseX;
        let mouseVelY = mouseY - prevMouseY;
        prevMouseX = mouseX; prevMouseY = mouseY;

        // Logic processing
        if (isDragging) {
            petX = targetX; petY = targetY;
            velX = mouseVelX * 0.8; velY = mouseVelY * 0.8;
            changeState('petted');
        } else {
            if (state !== 'petted') {
                if (state === 'crying') {
                    velX *= Math.pow(FRICTION_CRYING, dt);
                    velY *= Math.pow(FRICTION_CRYING, dt);
                    particleTimer += dt;
                    if (particleTimer > PARTICLE_SPAWN_INTERVAL_TEAR) {
                        const side = Math.random() > 0.5 ? 'left' : 'right';
                        const tear = document.createElement('div');
                        tear.className = `mochi-tear ${side}`;
                        face.appendChild(tear);
                        setTimeout(() => { if (tear.parentNode) tear.remove(); }, 800);
                        particleTimer = 0;
                    }
                    body.style.filter = (distance < RESCUE_DISTANCE) ? "brightness(1.08)" : "none";
                } else {
                    idleTimer += dt;
                    if (idleTimer > IDLE_THRESHOLD) {
                        changeState('sleeping');
                        velX *= FRICTION_DEFAULT; velY *= FRICTION_DEFAULT;
                        particleTimer += dt;
                        if (particleTimer > PARTICLE_SPAWN_INTERVAL_SLEEP) {
                            spawnParticle(petX + PET_WIDTH/2, petY - PET_HEIGHT/2, 'sleep');
                            particleTimer = 0;
                        }
                    } else {
                        if (distance > EXHAUSTED_THRESHOLD) {
                            fatigue += dt;
                            changeState('exhausted');
                            if (Math.random() < (PARTICLE_SPAWN_INTERVAL_SWEAT / 100)) spawnParticle(petX + PET_WIDTH/2, petY, 'sweat');
                            if (fatigue > CRYING_THRESHOLD) { changeState('crying'); fatigue = 0; }
                        } else {
                            fatigue = Math.max(0, fatigue - dt * RECOVERY_RATE);
                            changeState('following');
                            if (distance > PET_WIDTH) {
                                particleTimer += Math.sqrt(velX * velX + velY * velY) * dt;
                                if (particleTimer > PARTICLE_SPAWN_INTERVAL_MAGIC) {
                                    spawnParticle(petX + PET_WIDTH/2, petY + PET_HEIGHT, 'magic');
                                    particleTimer = 0;
                                }
                            }
                        }
                    }
                    if (state !== 'sleeping') {
                        const spring = state === 'exhausted' ? SPRING_STIFFNESS_EXHAUSTED : SPRING_STIFFNESS_DEFAULT;
                        velX = (velX + dx * spring * dt) * FRICTION_DEFAULT;
                        velY = (velY + dy * spring * dt) * FRICTION_DEFAULT;
                    }
                }
            } else {
                velX *= FRICTION_PETTED; velY *= FRICTION_PETTED;
            }
        }

        // Constraints & Boundaries
        if (!isDragging) {
            petX += velX * dt; petY += velY * dt;
            if (petX <= 0) { petX = 0; velX = Math.abs(velX) * 0.6; } 
            else if (petX >= winWidth - PET_WIDTH) { petX = winWidth - PET_WIDTH; velX = -Math.abs(velX) * 0.6; }
            if (petY <= 0) { petY = 0; velY = Math.abs(velY) * 0.6; } 
            else if (petY >= winHeight - PET_HEIGHT) { petY = winHeight - PET_HEIGHT; velY = -Math.abs(velY) * 0.6; }
        } else {
            petX = Math.max(0, Math.min(winWidth - PET_WIDTH, petX));
            petY = Math.max(0, Math.min(winHeight - PET_HEIGHT, petY));
        }

        // Kinematics calculations
        const speed = Math.sqrt(velX * velX + velY * velY);
        const stretch = Math.min(speed * 0.015, 0.25);
        const scaleX = 1 - stretch; const scaleY = 1 + stretch;
        const rotation = velX * 1.2;

        // 1. Organic Face Tracking (Lerped for smooth fluidity)
        let targetLookX = 0, targetLookY = 0;
        if (state !== 'sleeping' && state !== 'crying' && !isDragging) {
            targetLookX = Math.max(-2.5, Math.min(2.5, dx * 0.04));
            targetLookY = Math.max(-2.5, Math.min(2.5, dy * 0.04));
        } else if (state === 'crying') { targetLookY = 1.5; } 
        else if (state === 'petted') { targetLookY = -1; }
        
        currentLookX += (targetLookX - currentLookX) * 0.15;
        currentLookY += (targetLookY - currentLookY) * 0.15;
        face.style.transform = `translate3d(${currentLookX}px, ${currentLookY}px, 0)`;

        // 2. Breath & Bounce
        const breatheBob = Math.sin(time * 0.003) * 1.5;
        const walkBounce = Math.abs(Math.sin(time * 0.012)) * Math.min(speed * 0.3, 4);
        const yOffset = (state === 'sleeping' || state === 'petted') ? breatheBob : breatheBob - walkBounce;
        container.style.transform = `translate3d(${petX}px, ${petY + yOffset}px, 0) rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`;

        // 3. Autonomous Ears
        const earWiggle = Math.sin(time * 0.002) * 3 + Math.cos(time * 0.006) * 2;
        const earSwingL = -velX * 1.5 - earWiggle;
        const earSwingR = -velX * 1.5 + earWiggle;
        elements.mochiEarL.style.transform = `rotate(${EAR_ROTATION_DEFAULT_LEFT + earSwingL}deg)`;
        elements.mochiEarR.style.transform = `rotate(${EAR_ROTATION_DEFAULT_RIGHT + earSwingR}deg)`;

        // 4. Paddling Paws
        const pawY = Math.max(0, velY * 0.5);
        const pawSwing = velX * 2;
        const pawPaddleL = speed > 1 ? Math.sin(time * 0.02) * 2.5 : 0;
        const pawPaddleR = speed > 1 ? Math.cos(time * 0.02) * 2.5 : 0;
        elements.mochiPawL.style.transform = `translateY(${pawY + pawPaddleL}px) rotate(${pawSwing}deg)`;
        elements.mochiPawR.style.transform = `translateY(${pawY + pawPaddleR}px) rotate(${pawSwing}deg)`;

        requestAnimationFrame(update);
    }

    // --- INTERACTION HOOKS ---
    body.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true; fatigue = 0; idleTimer = 0;
        body.style.filter = "none";
        changeState('petted');
        
        for (let i = 0; i < 4; i++) {
            const heartX = petX + PET_WIDTH/2 + (Math.random() - 0.5) * PET_WIDTH * 0.8;
            const heartY = petY + PET_HEIGHT/2 + (Math.random() - 0.5) * PET_HEIGHT * 0.8;
            setTimeout(() => spawnParticle(heartX, heartY, 'heart'), i * 80);
        }
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            const throwSpeed = Math.sqrt(velX * velX + velY * velY);
            if (throwSpeed > 10) changeState('following');
            else {
                velY -= 2; 
                clearTimeout(pettedTimer);
                pettedTimer = setTimeout(() => { if (state === 'petted') changeState('following'); }, PETTED_DURATION);
            }
        }
    });

    // Start 60fps Loop
    requestAnimationFrame(update);
    console.log("%c✨ Micro Mochi Pet - Fully Optimized & Alive! ✨", "color: #ffb6c1; font-size: 14px; font-weight: bold;");

})();
