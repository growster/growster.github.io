(function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.id = 'star-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    
    document.body.appendChild(canvas);
    
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;
    let moveTimeout = null;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    class StarParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.01;
            this.color = this.getRandomColor();
            this.twinkle = Math.random() * Math.PI * 2;
            this.twinkleSpeed = Math.random() * 0.1 + 0.05;
        }
        
        getRandomColor() {
            const colors = [
                '#00f5ff', // 青色
                '#ff69b4', // 粉色
                '#ffd700', // 金色
                '#bd00ff', // 紫色
                '#00ff88', // 绿色
                '#ffffff'  // 白色
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
            this.twinkle += this.twinkleSpeed;
            
            // 缓慢减速
            this.speedX *= 0.98;
            this.speedY *= 0.98;
        }
        
        draw() {
            const alpha = this.life * (0.5 + Math.sin(this.twinkle) * 0.5);
            const glowSize = this.size * (1 + Math.sin(this.twinkle) * 0.5);
            
            ctx.save();
            ctx.globalAlpha = alpha;
            
            // 发光效果
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, glowSize * 3
            );
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(0.3, this.color);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, glowSize * 3, 0, Math.PI * 2);
            ctx.fill();
            
            // 核心亮点
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, glowSize * 0.5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // 移动时生成粒子
        if (isMoving) {
            // 随机生成1-3个粒子
            const count = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < count; i++) {
                const offsetX = (Math.random() - 0.5) * 20;
                const offsetY = (Math.random() - 0.5) * 20;
                particles.push(new StarParticle(mouseX + offsetX, mouseY + offsetY));
            }
        }
        
        clearTimeout(moveTimeout);
        isMoving = true;
        
        moveTimeout = setTimeout(function() {
            isMoving = false;
        }, 100);
    });
    
    // 点击时爆发粒子
    document.addEventListener('click', function(e) {
        const clickX = e.clientX;
        const clickY = e.clientY;
        
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const speed = Math.random() * 5 + 3;
            const particle = new StarParticle(clickX, clickY);
            particle.speedX = Math.cos(angle) * speed;
            particle.speedY = Math.sin(angle) * speed;
            particle.size = Math.random() * 4 + 2;
            particles.push(particle);
        }
    });
    
    // 触摸设备检测
    if ('ontouchstart' in window) {
        canvas.style.display = 'none';
    }
    
    function animate() {
        // 清空画布，保留微弱拖尾
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 更新和绘制粒子
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
})();
