/**
 * Futuristic Particle & Matrix Canvas Engine
 * Handles interactive cyber constellation and matrix digital rain modes.
 */

class CyberCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 140 };
    this.mode = 'constellation'; // 'constellation' or 'matrix'
    this.matrixColumns = [];
    this.matrixChars = '0123456789ABCDEF0123456789GKD<>{}[]/\\*+-=~^$#@!%&';
    this.fontSize = 14;
    this.animId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    this.initConstellation();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    if (this.mode === 'matrix') {
      this.initMatrix();
    } else {
      this.initConstellation();
    }
  }

  initConstellation() {
    this.particles = [];
    const count = Math.min(Math.floor((this.width * this.height) / 12000), 90);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.6 ? '#00f0ff' : (Math.random() > 0.5 ? '#a855f7' : '#38bdf8')
      });
    }
  }

  initMatrix() {
    const cols = Math.floor(this.width / this.fontSize);
    this.matrixColumns = [];
    for (let i = 0; i < cols; i++) {
      this.matrixColumns[i] = Math.floor(Math.random() * -50);
    }
  }

  toggleMatrixMode() {
    if (this.mode === 'constellation') {
      this.mode = 'matrix';
      this.initMatrix();
      return true;
    } else {
      this.mode = 'constellation';
      this.initConstellation();
      return false;
    }
  }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());

    if (this.mode === 'matrix') {
      this.renderMatrix();
    } else {
      this.renderConstellation();
    }
  }

  renderConstellation() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;

      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (1 - dist / this.mouse.radius) * 1.5;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();

      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.25;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.shadowBlur = 0;
          this.ctx.stroke();
        }
      }
    }
  }

  renderMatrix() {
    this.ctx.fillStyle = 'rgba(7, 9, 14, 0.08)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = '#00f0ff';
    this.ctx.font = `${this.fontSize}px 'Courier New', monospace`;
    this.ctx.shadowBlur = 5;
    this.ctx.shadowColor = '#00f0ff';

    for (let i = 0; i < this.matrixColumns.length; i++) {
      const char = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
      const x = i * this.fontSize;
      const y = this.matrixColumns[i] * this.fontSize;

      if (y > 0) {
        this.ctx.fillText(char, x, y);
      }

      if (y > this.height && Math.random() > 0.985) {
        this.matrixColumns[i] = 0;
      } else {
        this.matrixColumns[i]++;
      }
    }
  }
}

window.CyberCanvas = CyberCanvas;