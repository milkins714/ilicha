document.addEventListener('DOMContentLoaded', function () {
    // Инициализация Swiper
    const swiper = new Swiper('.swiper-container', {
        loop: true,
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
        speed: 800,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '"></span>';
            },
        },
        navigation: {
            nextEl: '#nextSlide',
            prevEl: '#prevSlide',
        },
    });

    // Обновление числового индикатора
    const slideIndicator = document.querySelector('.current-slide');
    const totalSlides = document.querySelector('.total-slides');
    
    function updateSlideIndicator() {
        const current = (swiper.realIndex + 1).toString().padStart(2, '0');
        slideIndicator.textContent = current;
    }
    
    swiper.on('slideChange', updateSlideIndicator);
    totalSlides.textContent = '/ ' + (swiper.slides.length - 2).toString().padStart(2, '0');
    updateSlideIndicator();

    // Фиксация шапки при скролле
    const header = document.getElementById('header');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Мобильное меню
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function () {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Блокировка скролла
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Закрытие меню при клике на ссылку
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Закрытие меню при клике вне его
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Параллакс эффект для слайдов
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const slides = document.querySelectorAll('.slide-image');
        slides.forEach((slide, index) => {
            const rate = scrolled * 0.3 * (index + 1);
            slide.style.transform = `translate3d(0, ${rate}px, 0)`;
        });
    });

    // Плавный скролл для якорей
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Закрытие мобильного меню если открыто
                if (mobileMenuBtn && mobileMenuBtn.classList.contains('active')) {
                    mobileMenuBtn.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
});