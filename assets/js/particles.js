class Particle {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.reset();
        
        // Espalhamento inicial pelo canvas
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
    }

    reset() {
        this.size = Math.random() * 2.5 + 1.5;
        
        const colors = [
            'rgba(163, 196, 243, 0.7)',
            'rgba(209, 196, 233, 0.7)',
            'rgba(161, 193, 166, 0.7)',
            'rgba(248, 187, 208, 0.7)',
            'rgba(255, 204, 128, 0.7)',
            'rgba(255, 249, 196, 0.7)'
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        
        this.friction = Math.random() * 0.04 + 0.92;
        this.mouseInfluence = Math.random() * 0.003 + 0.001;
        this.wander = Math.random() * 0.5 + 0.2;
        this.angle = Math.random() * Math.PI * 2;
    }

    update(mouseX, mouseY) {
        if (mouseX && mouseY) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            this.vx += dx * this.mouseInfluence;
            this.vy += dy * this.mouseInfluence;
        }

        this.angle += 0.05;
        this.vx += Math.cos(this.angle) * this.wander * 0.1;
        this.vy += Math.sin(this.angle) * this.wander * 0.1;

        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;

        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const maxSpeed = 1.8;
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        const grad = this.ctx.createRadialGradient(
            this.x - this.size/4, 
            this.y - this.size/4, 
            0, 
            this.x, 
            this.y, 
            this.size
        );
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(1, this.color);

        this.ctx.fillStyle = grad;
        this.ctx.fill();
        this.ctx.closePath();
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.particles = [];
        this.mouseX = null;
        this.mouseY = null;
        
        this.initCanvas();
        this.initParticles();
        this.addEventListeners();
        
        this.animate();
    }

    initCanvas() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-999';
        document.body.appendChild(this.canvas);
        
        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initParticles() {
        const particleCount = window.innerWidth > 768 ? 70 : 30;
        this.particles = [];
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.canvas, this.ctx));
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.initParticles();
        });

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        document.addEventListener('mouseleave', () => {
            this.mouseX = null;
            this.mouseY = null;
        });
    }

    applySeparation() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                const minDist = 35;
                
                if (dist < minDist && dist > 0) {
                    const force = (minDist - dist) / minDist;
                    p1.vx += (dx / dist) * force * 0.5;
                    p1.vy += (dy / dist) * force * 0.5;
                    p2.vx -= (dx / dist) * force * 0.5;
                    p2.vy -= (dy / dist) * force * 0.5;
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.applySeparation();

        this.particles.forEach(p => {
            p.update(this.mouseX, this.mouseY);
            if (!this.mouseX) {
               if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
               if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
            }
            p.draw();
        });

        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});
