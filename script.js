document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById('navbar');
    
    // Dynamic navigation bar background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.7)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Optional: Add smooth scrolling for anchor links in the future
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#') && targetId.length > 1) {
                // Future functionality when sections are built
                // e.preventDefault();
                // document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Animated Counters logic
    const easeOutExpo = (t) => {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const animateSingleCounter = (stat) => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        let start = null;

        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const timeRatio = Math.min(progress / duration, 1);
            
            const current = Math.floor(easeOutExpo(timeRatio) * target);
            stat.innerText = current;

            if (progress < duration) {
                window.requestAnimationFrame(step);
            } else {
                stat.innerText = target;
            }
        };
        window.requestAnimationFrame(step);
    };

    // Intersection Observer for Scroll Entrance Animations
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // If this is a stat-box, animate its counter
                if (entry.target.classList.contains('stat-box')) {
                    const statNumber = entry.target.querySelector('.stat-number');
                    if (statNumber) {
                        animateSingleCounter(statNumber);
                    }
                }
                
                // Stop observing after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.15 
    });

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });


    // Testimonials Carousel
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const dotsNav = document.querySelector('.carousel-nav');
        const dots = Array.from(dotsNav.children);

        let currentIndex = 0;
        let autoPlayInterval;

        const updateSlidePosition = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        const updateDots = () => {
            dots.forEach(dot => dot.classList.remove('current-indicator'));
            dots[currentIndex].classList.add('current-indicator');
        };

        const moveToSlide = (index) => {
            currentIndex = index;
            
            if (currentIndex < 0) {
                currentIndex = slides.length - 1;
            } else if (currentIndex >= slides.length) {
                currentIndex = 0;
            }

            updateSlidePosition();
            updateDots();
        };

        const nextSlide = () => {
            moveToSlide(currentIndex + 1);
        };

        const prevSlide = () => {
            moveToSlide(currentIndex - 1);
        };

        const startAutoPlay = () => {
            stopAutoPlay();
            autoPlayInterval = setInterval(nextSlide, 4000);
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };

        nextButton.addEventListener('click', () => {
            nextSlide();
            startAutoPlay(); // Reset timer on manual interaction
        });

        prevButton.addEventListener('click', () => {
            prevSlide();
            startAutoPlay();
        });

        dotsNav.addEventListener('click', (e) => {
            const targetDot = e.target.closest('button');
            if (!targetDot) return;

            const targetIndex = dots.findIndex(dot => dot === targetDot);
            moveToSlide(targetIndex);
            startAutoPlay();
        });

        // Pause on hover
        const carouselContainer = document.querySelector('.carousel-container');
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);

        // Start initial autoplay
        startAutoPlay();
    }

    // Lógica interactiva del toggle de facturación (Mensual / Anual)
    const pricingCheckbox = document.getElementById('pricing-toggle-checkbox');
    const priceElements = document.querySelectorAll('.plan-price');
    const toggleMonthlyLabel = document.getElementById('toggle-monthly');
    const toggleYearlyLabel = document.getElementById('toggle-yearly');

    if (pricingCheckbox) {
        pricingCheckbox.addEventListener('change', () => {
            const isYearly = pricingCheckbox.checked;
            
            // Alternar clases activas en los labels
            if (isYearly) {
                toggleMonthlyLabel.classList.remove('active');
                toggleYearlyLabel.classList.add('active');
            } else {
                toggleMonthlyLabel.classList.add('active');
                toggleYearlyLabel.classList.remove('active');
            }

            priceElements.forEach(priceEl => {
                const basePrice = parseInt(priceEl.getAttribute('data-base-price'));
                const priceNumEl = priceEl.querySelector('.price-number');
                const priceSuffixEl = priceEl.querySelector('.price-suffix');
                
                if (priceNumEl) {
                    // Transición suave: fade-out
                    priceNumEl.style.opacity = '0';
                    priceNumEl.style.transform = 'translateY(-4px)';
                    
                    setTimeout(() => {
                        let newPrice;
                        if (isYearly) {
                            newPrice = Math.round(basePrice * 0.8);
                            if (priceSuffixEl) priceSuffixEl.textContent = '/mo (yearly)';
                        } else {
                            newPrice = basePrice;
                            if (priceSuffixEl) priceSuffixEl.textContent = '/mo';
                        }
                        priceNumEl.textContent = `$${newPrice}`;
                        
                        // Transición suave: fade-in
                        priceNumEl.style.opacity = '1';
                        priceNumEl.style.transform = 'translateY(0)';
                    }, 180);
                }
            });
        });
    }

    // Lógica del Formulario de Contacto (Simulación)
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-success');

    if (contactForm && contactSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Verificación adicional de campos
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const service = document.getElementById('form-service').value;
            const message = document.getElementById('form-message').value.trim();
            
            if (!name || !email || !service || !message) {
                return;
            }

            // Transición de salida del formulario
            contactForm.style.opacity = '0';
            contactForm.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                contactForm.style.display = 'none';
                contactSuccess.style.display = 'flex';
                
                // Limpiar campos de forma transparente
                contactForm.reset();
            }, 300);
        });
    }

    // Lógica del Menú Hamburguesa para Móvil
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinksContainer.classList.toggle('active');
            menuToggle.textContent = navLinksContainer.classList.contains('active') ? '✕' : '☰';
        });

        // Cerrar menú al hacer clic en un enlace
        const links = navLinksContainer.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!navLinksContainer.contains(e.target) && e.target !== menuToggle) {
                navLinksContainer.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });
    }

    // Back to Top button logic
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Active nav link highlight on scroll
    const sections = document.querySelectorAll('header[id], section[id]');
    const navItems = document.querySelectorAll('.nav-links a:not(.btn)');

    if (sections.length > 0 && navItems.length > 0) {
        const activeSectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navItems.forEach(link => {
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.25,
            rootMargin: "-20% 0px -50% 0px" // Adjusted to trigger closer to screen mid-top
        });

        sections.forEach(section => {
            activeSectionObserver.observe(section);
        });
    }
});

