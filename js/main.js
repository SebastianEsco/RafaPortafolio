document.addEventListener('DOMContentLoaded', () => {
    // Premium Intro Logic
    const loader = document.getElementById('intro-loader');
    const isFirstVisit = !sessionStorage.getItem('visited');

    if (loader && isFirstVisit) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.classList.add('site-reveal');
                sessionStorage.setItem('visited', 'true');
            }, 2500); // Cinematic pause
        });
    } else if (loader) {
        loader.style.display = 'none';
        document.body.classList.add('site-reveal');
    }

    // Typing Effect for Hero
    const typingText = document.getElementById('typing-text');
    const words = {
        es: [
            "Consultor SEO Senior",
            "Estratega de Crecimiento",
            "Especialista en Datos",
            "Google Search Expert"
        ],
        en: [
            "Senior SEO Consultant",
            "Growth Strategist",
            "Data Specialist",
            "Google Search Expert"
        ]
    };

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        if (!typingText) return;

        const lang = localStorage.getItem('preferredLanguage') || 'es';
        const currentWords = words[lang] || words.es;
        const currentWord = currentWords[wordIndex % currentWords.length];

        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40; // Faster deletion
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80; // Natural typing speed
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2500; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.8)';
            navbar.style.padding = '0';
        }
    });

    // Scroll Progress Bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';

        // Navbar styling on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle?.classList.remove('active');
            navLinks?.classList.remove('active');
        });
    });

    // Project Carousel
    const track = document.querySelector('.carousel-track');
    const items = Array.from(document.querySelectorAll('.portfolio-item.card'));
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const indicators = Array.from(document.querySelectorAll('.indicator'));

    let currentIndex = 0;
    let itemWidth = 0;
    let gap = 0;
    let visibleItems = 1;

    function updateCarousel() {
        if (!track) return;

        const containerWidth = track.parentElement.offsetWidth;
        const windowWidth = window.innerWidth;

        if (windowWidth > 1100) {
            visibleItems = 3;
        } else if (windowWidth > 768) {
            visibleItems = 2;
        } else {
            visibleItems = 1;
        }

        gap = parseFloat(getComputedStyle(track).gap) || 0;
        const totalGap = gap * (visibleItems - 1);
        itemWidth = (containerWidth - totalGap) / visibleItems;

        items.forEach(item => {
            item.style.width = `${itemWidth}px`;
            item.style.minWidth = `${itemWidth}px`;
        });

        // Clamp index after resize or visibility change
        const maxIndex = items.length - visibleItems;
        if (currentIndex > maxIndex) currentIndex = maxIndex;

        const offset = currentIndex * (itemWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;

        // Update indicators visibility and active state
        indicators.forEach((ind, i) => {
            if (i <= maxIndex) {
                ind.style.display = 'block';
                ind.classList.toggle('active', i === currentIndex);
            } else {
                ind.style.display = 'none';
            }
        });
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            const maxIndex = items.length - visibleItems;
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0; // Infinite loop back to start
            }
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                const maxIndex = items.length - visibleItems;
                currentIndex = maxIndex; // Infinite loop back to end
            }
            updateCarousel();
        });

        indicators.forEach(ind => {
            ind.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const maxIndex = items.length - visibleItems;
                currentIndex = Math.min(index, maxIndex);
                updateCarousel();
            });
        });

        window.addEventListener('resize', updateCarousel);
        // Initial setup after fonts/styles load
        setTimeout(updateCarousel, 100);
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once visible
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Track reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Experience Expansion Logic
    const expButtons = document.querySelectorAll('.btn-exp-more');
    expButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.experience-item');
            const isExpanded = item.classList.toggle('expanded');

            // Sync with i18n system
            const labelSpan = btn.querySelector('[data-i18n]');
            if (labelSpan && window.i18n) {
                const key = isExpanded ? 'exp_see_less' : 'exp_see_more';
                labelSpan.setAttribute('data-i18n', key);
                labelSpan.textContent = window.i18n.t(key);
            }

            btn.setAttribute('aria-expanded', isExpanded);
        });
    });

    const initLightbox = () => {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
            <button class="lightbox-close" aria-label="Close">&times;</button>
            <img class="lightbox-image" src="" alt="Expanded Metric">
        `;
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');

        const openLightbox = (src) => {
            lightboxImg.src = src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevents scrolling
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => { lightboxImg.src = ''; }, 300); // Clear src after fade
        };

        // Event Delegation for clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('zoomable')) {
                let imgSrc = e.target.src;

                // If it's a div with background image instead of an img tag
                if (!imgSrc && e.target.style.backgroundImage) {
                    imgSrc = e.target.style.backgroundImage.slice(4, -1).replace(/"/g, "");
                }

                if (imgSrc) openLightbox(imgSrc);
            } else if (e.target.classList.contains('lightbox-overlay') || e.target.classList.contains('lightbox-close')) {
                closeLightbox();
            }
        });

        // Close on Esc key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    };

    initLightbox();
});
