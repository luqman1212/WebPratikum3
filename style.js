document.addEventListener('DOMContentLoaded', () => {
    const characterItems = document.querySelectorAll('.character-item');
    const mainBg = document.getElementById('main-bg');
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = 100;
    let mouse = { x: null, y: null, radius: 100 };

    // Create particles
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Interact with mouse
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                let force = (mouse.radius - distance) / mouse.radius;
                let angle = Math.atan2(dy, dx);
                this.speedX -= Math.cos(angle) * force * 2;
                this.speedY -= Math.sin(angle) * force * 2;
            }
        }

        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let particle of particles) {
            particle.update();
            particle.draw();
        }
        requestAnimationFrame(animate);
    }

    animate();

    // Mouse movement
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    // Window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Character selection
    characterItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            characterItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');

            // Update main background
            const bg = item.getAttribute('data-bg');
            mainBg.style.opacity = '0';
            setTimeout(() => {
                mainBg.src = bg;
                mainBg.style.opacity = '1';
            }, 500);
        });
    });

    // Set first character as default active
    characterItems[0].classList.add('active');

    document.querySelector('.close-btn').addEventListener('click', () => {
        if (confirm('Apakah kamu yakin ingin menutup?')) {
            window.close();
        }
    });
});