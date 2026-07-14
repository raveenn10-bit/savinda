/**
 * ENIX Travels - Premium Interactive Experience Engine (Apple/Vercel-level)
 * Built with vanilla JS, CSS variables, and Intersection Observer.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Only run preloader on the home page (which contains the main .hero class)
    const isHomePage = document.querySelector('.hero') !== null || window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
    if (isHomePage) {
        initLoader();
    } else {
        // Immediately reveal headers on subpages without loader delay
        document.querySelectorAll('.hero-title, .hero-sub, .hero-content .glow-btn').forEach(el => {
            el.classList.add('revealed');
        });
    }
    initScrollProgress();
    initCursorGlow();
    initScrollReveals();
    initMagneticHover();
    init3DTilt();
    initRippleClick();
    initSecondaryAurora();
    initStatsCounter();
    initMobileAutoScroll();
});

/**
 * 1. Elegant Glassmorphism Page Loader
 */
function initLoader() {
    // Check if loader already exists, if not, inject it
    if (document.getElementById('enix-loader')) return;

    const loader = document.createElement('div');
    loader.id = 'enix-loader';
    loader.className = 'enix-loader-container';
    loader.innerHTML = `
        <div class="enix-loader-content">
            <div class="enix-loader-logo-wrap">
                <img src="logo.jpeg" alt="ENIX Travels" class="enix-loader-logo">
                <div class="enix-loader-ring"></div>
            </div>
            <h2 class="enix-loader-title">ENIX Travels</h2>
            <div class="enix-loader-progress-track">
                <div class="enix-loader-progress-bar" id="loader-bar"></div>
            </div>
            <div class="enix-loader-percent" id="loader-percent">0%</div>
        </div>
    `;
    document.body.appendChild(loader);

    // Disable scroll while loading
    document.documentElement.style.overflow = 'hidden';

    // Simulate progressive loading
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Fade out loader and restore scrolling
            setTimeout(() => {
                loader.classList.add('fade-out');
                document.documentElement.style.overflow = '';
                
                // Trigger animation items inside hero
                document.querySelectorAll('.hero-title, .hero-sub, .hero-content .glow-btn').forEach(el => {
                    el.classList.add('revealed');
                });
            }, 600);
        }
        document.getElementById('loader-bar').style.width = progress + '%';
        document.getElementById('loader-percent').textContent = progress + '%';
    }, 80);
}

/**
 * 2. Top Scroll Progress Indicator
 */
function initScrollProgress() {
    if (document.getElementById('enix-scroll-progress')) return;

    const bar = document.createElement('div');
    bar.id = 'enix-scroll-progress';
    bar.className = 'enix-scroll-bar';
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        bar.style.width = scrolled + '%';
    });
}

/**
 * 3. Custom Cursor Glow Effect (Follows mouse)
 */
function initCursorGlow() {
    // Only enable on desktop/pointing devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (document.getElementById('enix-cursor-glow')) return;

    const glow = document.createElement('div');
    glow.id = 'enix-cursor-glow';
    glow.className = 'enix-cursor-glow';
    document.body.appendChild(glow);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        glow.style.opacity = '1';
    });

    window.addEventListener('mouseout', () => {
        glow.style.opacity = '0';
    });

    // Smooth lerp follow loop
    function updateGlowPosition() {
        const dx = mouseX - glowX;
        const dy = mouseY - glowY;
        
        glowX += dx * 0.15;
        glowY += dy * 0.15;
        
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        
        requestAnimationFrame(updateGlowPosition);
    }
    updateGlowPosition();
}

/**
 * 4. Scroll-Triggered Fade & Stagger Reveals
 */
function initScrollReveals() {
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply reveal class prep to cards and section blocks
    const targetClasses = [
        '.animate-item', '.why-box', '.destination-card', 
        '.package-card', '.tip-card', '.service-card', 
        '.team-card', '.vm-box', '.info-card', '.faq-item'
    ];

    document.querySelectorAll(targetClasses.join(', ')).forEach(el => {
        el.classList.add('reveal-prep');
        revealObserver.observe(el);
    });

    // Apply auto-stagger delays on grids
    const gridClasses = [
        '.why-grid', '.category-grid', '.packages-grid', 
        '.services-grid', '.team-grid', '.values-grid', 
        '.tips-grid', '.info-cards'
    ];

    document.querySelectorAll(gridClasses.join(', ')).forEach(grid => {
        Array.from(grid.children).forEach((child, idx) => {
            // Apply delay up to 1s maximum
            const delay = Math.min(idx * 0.08, 1);
            child.style.transitionDelay = delay + 's';
        });
    });
}

/**
 * 5. Magnetic Hover Effect (Apple / Vercel-style)
 */
function initMagneticHover() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const magneticElements = document.querySelectorAll('.shimmer-btn, .glow-btn, .filter-tab, .logo-section, .nav-link');
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            // Calculate cursor offset relative to center of element
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Pull the element 12% towards the cursor
            el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px) scale(1.02)`;
            el.style.transition = 'transform 0.1s ease-out';
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
            el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });
    });
}

/**
 * 6. Interactive 3D Perspective Card Tilt
 */
function init3DTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const tiltCards = document.querySelectorAll('.why-box, .destination-card, .package-card, .service-card, .team-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Smoothly rotate relative to mouse position (max 6 degrees tilt)
            const rotateX = -(y / rect.height) * 12;
            const rotateY = (x / rect.width) * 12;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease, border-color 0.3s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease';
        });
    });
}

/**
 * 7. Premium Click Ripple Effect
 */
function initRippleClick() {
    window.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'enix-ripple';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        document.body.appendChild(ripple);

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    });
}

/**
 * 8. Secondary Background Aurora Gradient Blob
 */
function initSecondaryAurora() {
    if (document.getElementById('enix-aurora-secondary')) return;
    const aurora = document.createElement('div');
    aurora.id = 'enix-aurora-secondary';
    aurora.className = 'aurora-bg-secondary';
    document.body.appendChild(aurora);
}

/**
 * 9. Animated Stats Counter
 */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetEl = entry.target;
                if (targetEl.dataset.animated === 'true') return;
                
                targetEl.dataset.animated = 'true';
                const originalText = targetEl.textContent.trim();
                
                // Parse number and suffix (like "50+", "10K+", "99%")
                const numberMatch = originalText.match(/^([0-9]+)(.*)$/);
                if (!numberMatch) return;
                
                const targetNumber = parseInt(numberMatch[1], 10);
                const suffix = numberMatch[2] || '';
                
                let startTimestamp = null;
                const duration = 1500; // 1.5 seconds

                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    const currentValue = Math.floor(progress * targetNumber);
                    
                    targetEl.textContent = currentValue + suffix;
                    
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        targetEl.textContent = originalText; // Ensure exact end state
                    }
                };
                
                window.requestAnimationFrame(step);
                observer.unobserve(targetEl);
            }
        });
    }, { threshold: 0.2 });

    stats.forEach(stat => observer.observe(stat));
}

/**
 * 10. Mobile Auto Scroll Carousel & Universal Photo Gallery Scroller
 */
function initMobileAutoScroll() {
    const selectors = [
        '.why-grid',
        '.services-grid',
        '.tips-grid',
        '.team-grid',
        '.values-grid',
        '.category-grid',
        '.info-cards',
        '.destinations-grid',
        '.photo-grid',
        '.packages-grid',
        '.country-info-cards-wrapper',
        '.filter-tabs'
    ];

    selectors.forEach(selector => {
        // Skip mobile-only carousels on desktop, but allow photo-grid to scroll universally
        if (selector !== '.photo-grid' && window.innerWidth > 768) return;

        const container = document.querySelector(selector);
        if (!container) return;

        let isInteracting = false;
        let resumeTimeout = null;
        let speed = 0.5; // slow scroll speed (px per frame)
        let animationFrameId = null;

        const scrollLoop = () => {
            if (!isInteracting) {
                container.scrollLeft += speed;
                
                // If it reaches the end, reset to 0
                const maxScrollLeft = container.scrollWidth - container.clientWidth;
                if (container.scrollLeft >= maxScrollLeft - 1) {
                    container.scrollLeft = 0;
                }
            }
            animationFrameId = requestAnimationFrame(scrollLoop);
        };

        const startInteraction = () => {
            isInteracting = true;
            if (resumeTimeout) clearTimeout(resumeTimeout);
        };

        const endInteraction = () => {
            if (resumeTimeout) clearTimeout(resumeTimeout);
            resumeTimeout = setTimeout(() => {
                isInteracting = false;
            }, 3000); // Resume auto-scrolling after 3 seconds of inactivity
        };

        // Event listeners to pause on touch/swipe/drag
        container.addEventListener('touchstart', startInteraction, { passive: true });
        container.addEventListener('touchend', endInteraction, { passive: true });
        container.addEventListener('touchcancel', endInteraction, { passive: true });
        
        container.addEventListener('mousedown', startInteraction);
        container.addEventListener('mouseup', endInteraction);
        container.addEventListener('mouseleave', endInteraction);
        container.addEventListener('wheel', () => {
            startInteraction();
            endInteraction();
        }, { passive: true });

        // Start loop
        animationFrameId = requestAnimationFrame(scrollLoop);
    });
}
