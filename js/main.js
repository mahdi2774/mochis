// Handle script copying
async function copyScript(filename) {
    try {
        const response = await fetch(`pets/${filename}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();
        
        await navigator.clipboard.writeText(text);
        showToast(`✨ ${filename.replace('.js', '').split('-').slice(1).join(' ')} adopted! Script copied. ✨`);
    } catch (err) {
        console.error('Failed to read or copy script: ', err);
        showToast('Failed to copy script. Please try again.');
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Smooth scrolling for the discover button
document.querySelector('.discover a').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
    });
});

// Spawn some random decorative particles in the background
const particles = ['✨', '🌸', '💖', '🎀', '🦋'];
const floatingBg = document.querySelector('.floating-bg');

for (let i = 0; i < 15; i++) {
    const p = document.createElement('div');
    p.textContent = particles[Math.floor(Math.random() * particles.length)];
    p.style.position = 'absolute';
    p.style.left = `${Math.random() * 100}vw`;
    p.style.top = `${Math.random() * 100}vh`;
    p.style.fontSize = `${Math.random() * 15 + 10}px`;
    p.style.opacity = Math.random() * 0.5 + 0.2;
    p.style.animation = `float ${Math.random() * 4 + 4}s infinite alternate`;
    floatingBg.appendChild(p);
}
