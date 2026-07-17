document.addEventListener("DOMContentLoaded", () => {
    // 1. Custom Cursor
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    cursorOutline.classList.add('cursor-outline');
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';

        cursorOutline.animate({
            left: e.clientX + 'px',
            top: e.clientY + 'px'
        }, { duration: 400, fill: "forwards" });
    });

    // Interactive Hover for links
    document.querySelectorAll('a, .bento-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)";
            cursorOutline.style.borderColor = "#38bdf8";
            cursorOutline.style.backgroundColor = "rgba(56, 189, 248, 0.1)";
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
            cursorOutline.style.borderColor = "rgba(139, 92, 246, 0.5)";
            cursorOutline.style.backgroundColor = "transparent";
        });
    });

    // 2. Scroll Reveal Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 3. Neural Network Canvas Background
    const canvas = document.getElementById('neural-canvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particles = [];
        const mouse = { x: null, y: null };

        window.addEventListener('mousemove', function(event) {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        });

        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });

        class Particle {
            constructor(x, y, dx, dy, size) {
                this.x = x; this.y = y;
                this.dx = dx; this.dy = dy;
                this.size = size;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = 'rgba(139, 92, 246, 0.8)';
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
                if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;
                this.x += this.dx;
                this.y += this.dy;
                this.draw();
            }
        }

        function init() {
            particles = [];
            let numberOfParticles = (canvas.width * canvas.height) / 12000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = Math.random() * 1.5 + 0.5;
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                let dx = (Math.random() - 0.5) * 1;
                let dy = (Math.random() - 0.5) * 1;
                particles.push(new Particle(x, y, dx, dy, size));
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            connect();
        }

        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) + 
                                   ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    
                    let mouseDistance = mouse.x ? ((particles[a].x - mouse.x) * (particles[a].x - mouse.x)) + 
                                                  ((particles[a].y - mouse.y) * (particles[a].y - mouse.y)) : 100000;

                    if (distance < 20000) {
                        opacityValue = 1 - (distance / 20000);
                        if(mouseDistance < 30000) {
                            ctx.strokeStyle = `rgba(56, 189, 248, ${opacityValue})`;
                            ctx.lineWidth = 1.2;
                        } else {
                            ctx.strokeStyle = `rgba(139, 92, 246, ${opacityValue * 0.15})`;
                            ctx.lineWidth = 0.5;
                        }
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
        init();
        animate();
    }
    
    // 4. 3D Tilt Effect for Bento Items
    const cards = document.querySelectorAll('.bento-item');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
});
