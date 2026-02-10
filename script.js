document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MENU RESPONSIVE ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // --- 2. NAVBAR RETRACTABLE (Scroll Handling) ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Hide/Show Logic
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        
        // Glass effect darkening
        if (currentScroll > 50) {
            navbar.style.background = 'rgba(5, 5, 5, 0.95)';
        } else {
            navbar.style.background = 'rgba(5, 5, 5, 0.8)';
        }
        
        lastScroll = currentScroll;
    });

    // --- 3. COMPARISON SLIDER (Avant/Après) ---
    const slider = document.querySelector('.comparison-slider');
    const beforeImg = document.querySelector('.c-before');
    const handle = document.querySelector('.c-handle');
    let isDown = false;

    function moveSlider(e) {
        if (!isDown) return;
        const rect = slider.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        let percent = (x / rect.width) * 100;
        
        percent = Math.max(0, Math.min(100, percent));
        
        beforeImg.style.width = percent + '%';
        handle.style.left = percent + '%';
    }

    slider.addEventListener('mousedown', () => isDown = true);
    slider.addEventListener('touchstart', () => isDown = true);
    
    window.addEventListener('mouseup', () => isDown = false);
    window.addEventListener('touchend', () => isDown = false);
    
    window.addEventListener('mousemove', moveSlider);
    window.addEventListener('touchmove', moveSlider);

    // --- 4. BACK TO TOP ---
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- 5. STATS ANIMATION ---
    const stats = document.querySelectorAll('.num');
    let animated = false;

    const animateStats = () => {
        const section = document.querySelector('.stats-row');
        if (!section) return;
        
        const sectionTop = section.getBoundingClientRect().top;
        const trigger = window.innerHeight - 50;

        if (sectionTop < trigger && !animated) {
            animated = true;
            stats.forEach(stat => {
                const target = +stat.getAttribute('data-target');
                const duration = 2000;
                const increment = target / (duration / 16);
                
                let current = 0;
                const timer = setInterval(() => {
                    current += increment;
                    stat.textContent = Math.floor(current);
                    if (current >= target) {
                        stat.textContent = target;
                        clearInterval(timer);
                    }
                }, 16);
            });
        }
    };

    window.addEventListener('scroll', animateStats);

});