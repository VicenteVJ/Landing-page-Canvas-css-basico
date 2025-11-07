// Canvas de fundo - Vellarum
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const maxParticles = 90;
const connectionDistance = 135;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.7,
    vy: (Math.random() - 0.5) * 0.7,
    radius: Math.random() * 2 + 1,
    alpha: Math.random() * 0.6 + 0.4
  };
}

for (let i = 0; i < maxParticles; i++) {
  particles.push(createParticle());
}

function draw() {
  // leve rastro no fundo preto
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, index) => {
    p.x += p.vx;
    p.y += p.vy;

    // teletransporte nas bordas
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    // partícula com glow azul/ciano
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
    gradient.addColorStop(0, `rgba(0, 194, 223, ${p.alpha})`); // ciano
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
    ctx.fill();

    // ligações entre partículas com azul
    for (let j = index + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < connectionDistance) {
        // mistura de #0090da e #74d1ea
        ctx.strokeStyle = `rgba(0, 144, 218, ${(1 - dist / connectionDistance) * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(draw);
}

draw();

// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  });
});
