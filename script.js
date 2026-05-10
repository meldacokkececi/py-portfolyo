document.addEventListener('DOMContentLoaded', () => {

    // ===== PARTICLE BACKGROUND =====
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.05 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ===== CURSOR GLOW =====
    const glow = document.querySelector('.cursor-glow');
    document.addEventListener('mousemove', e => {
        requestAnimationFrame(() => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    });

    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ===== ACTIVE NAV LINK =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === current);
        });
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
        });
    });

    // ===== TYPEWRITER =====
    const words = ['3D Sanatçı', 'Blender Uzmanı', 'AI Geliştiricisi', 'Yaratıcı Kodcu'];
    const el = document.getElementById('typewriter');
    let wordIdx = 0, charIdx = 0, deleting = false;

    function type() {
        const word = words[wordIdx];
        if (deleting) {
            el.textContent = word.substring(0, charIdx--);
            if (charIdx < 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; setTimeout(type, 500); return; }
        } else {
            el.textContent = word.substring(0, ++charIdx);
            if (charIdx === word.length) { deleting = true; setTimeout(type, 2000); return; }
        }
        setTimeout(type, deleting ? 50 : 100);
    }
    type();

    // ===== SCROLL ANIMATIONS =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => entry.target.classList.add('visible'), delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // ===== SKILL BARS =====
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target.querySelector('.skill-fill');
                if (fill) fill.style.width = fill.dataset.width + '%';
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

    // ===== COUNTER ANIMATION =====
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                let current = 0;
                const step = () => {
                    if (current < target) { current++; el.textContent = current; requestAnimationFrame(step); }
                };
                step();
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

    // ===== CONTACT FORM =====
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const span = btn.querySelector('span');
            const icon = btn.querySelector('i');
            span.textContent = 'Gönderiliyor...';
            icon.className = 'fa-solid fa-spinner fa-spin';
            btn.style.opacity = '0.7';
            btn.disabled = true;
            setTimeout(() => {
                span.textContent = 'Başarıyla Gönderildi!';
                icon.className = 'fa-solid fa-check';
                btn.style.opacity = '1';
                btn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
                form.reset();
                setTimeout(() => {
                    span.textContent = 'Mesaj Gönder';
                    icon.className = 'fa-solid fa-paper-plane';
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // ===== MOBILE MENU =====
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinksEl = document.getElementById('nav-links');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            const open = navLinksEl.style.display === 'flex';
            navLinksEl.style.display = open ? 'none' : 'flex';
            navLinksEl.style.flexDirection = 'column';
            navLinksEl.style.position = 'absolute';
            navLinksEl.style.top = '100%';
            navLinksEl.style.left = '0';
            navLinksEl.style.right = '0';
            navLinksEl.style.background = 'rgba(11,13,17,0.95)';
            navLinksEl.style.padding = '1rem';
            navLinksEl.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
        });
    }
});
