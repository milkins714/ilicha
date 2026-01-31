// JavaScript для галереи с каруселями
document.addEventListener('DOMContentLoaded', function() {
    
    // Конфигурация каруселей
    const carousels = {
        'reception': {
            element: document.getElementById('receptionCarousel'),
            dots: document.getElementById('receptionDots'),
            currentIndex: 1, // Начинаем с реального первого изображения
            totalSlides: 4, // Реальное количество уникальных слайдов
            isAnimating: false
        },
        'restaurant': {
            element: document.getElementById('restaurantCarousel'),
            dots: document.getElementById('restaurantDots'),
            currentIndex: 1,
            totalSlides: 4,
            isAnimating: false
        },
        'rooms': {
            element: document.getElementById('roomsCarousel'),
            dots: document.getElementById('roomsDots'),
            currentIndex: 1,
            totalSlides: 4,
            isAnimating: false
        },
        'additional': {
            element: document.getElementById('additionalCarousel'),
            dots: document.getElementById('additionalDots'),
            currentIndex: 1,
            totalSlides: 4,
            isAnimating: false
        }
    };
    
    // Инициализация каруселей
    function initCarousels() {
        Object.keys(carousels).forEach(carouselId => {
            const carousel = carousels[carouselId];
            
            if (!carousel.element) return;
            
            // Устанавливаем начальную позицию (первое реальное изображение)
            updateCarouselPosition(carouselId);
            
            // Добавляем обработчики для кнопок
            const prevBtn = document.querySelector(`.prev-btn[data-carousel="${carouselId}"]`);
            const nextBtn = document.querySelector(`.next-btn[data-carousel="${carouselId}"]`);
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => moveCarousel(carouselId, -1));
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => moveCarousel(carouselId, 1));
            }
            
            // Добавляем обработчики для точек
            if (carousel.dots) {
                const dots = carousel.dots.querySelectorAll('.dot');
                dots.forEach((dot, index) => {
                    dot.addEventListener('click', () => {
                        moveToSlide(carouselId, index);
                    });
                });
            }
            
            // Автоматическое перелистывание
            startAutoRotation(carouselId);
        });
        
        // Обработка свайпов (для мобильных устройств)
        initSwipeSupport();
    }
    
    // Обновление позиции карусели
    function updateCarouselPosition(carouselId) {
        const carousel = carousels[carouselId];
        if (!carousel || !carousel.element) return;
        
        const slideWidth = 100; // 100% на слайд
        const translateX = -carousel.currentIndex * slideWidth;
        carousel.element.style.transform = `translateX(${translateX}%)`;
        
        // Обновляем активную точку
        updateActiveDot(carouselId);
    }
    
    // Перемещение карусели
    function moveCarousel(carouselId, direction) {
        const carousel = carousels[carouselId];
        if (!carousel || carousel.isAnimating) return;
        
        carousel.isAnimating = true;
        
        // Вычисляем новый индекс
        let newIndex = carousel.currentIndex + direction;
        
        // Если достигли дубликата последнего слайда (перед первым реальным)
        if (newIndex === 0) {
            // Мгновенно переходим к предпоследнему слайду (реальное последнее изображение)
            setTimeout(() => {
                carousel.currentIndex = carousel.totalSlides;
                carousel.element.style.transition = 'none';
                updateCarouselPosition(carouselId);
                
                setTimeout(() => {
                    carousel.element.style.transition = 'transform 0.5s ease-in-out';
                    carousel.currentIndex = carousel.totalSlides + direction;
                    updateCarouselPosition(carouselId);
                    carousel.isAnimating = false;
                }, 50);
            }, 500);
        }
        // Если достигли дубликата первого слайда (после последнего реального)
        else if (newIndex === carousel.totalSlides + 1) {
            // Мгновенно переходим ко второму слайду (реальное первое изображение)
            setTimeout(() => {
                carousel.currentIndex = 1;
                carousel.element.style.transition = 'none';
                updateCarouselPosition(carouselId);
                
                setTimeout(() => {
                    carousel.element.style.transition = 'transform 0.5s ease-in-out';
                    carousel.currentIndex = 1 + direction;
                    updateCarouselPosition(carouselId);
                    carousel.isAnimating = false;
                }, 50);
            }, 500);
        }
        else {
            carousel.currentIndex = newIndex;
            updateCarouselPosition(carouselId);
            
            // Сбрасываем флаг анимации после завершения перехода
            setTimeout(() => {
                carousel.isAnimating = false;
            }, 500);
        }
    }
    
    // Переход к конкретному слайду
    function moveToSlide(carouselId, slideIndex) {
        const carousel = carousels[carouselId];
        if (!carousel || carousel.isAnimating) return;
        
        // slideIndex - индекс реального слайда (0-3)
        // carousel.currentIndex - индекс с учетом дубликатов (1-4)
        carousel.currentIndex = slideIndex + 1;
        updateCarouselPosition(carouselId);
    }
    
    // Обновление активной точки
    function updateActiveDot(carouselId) {
        const carousel = carousels[carouselId];
        if (!carousel || !carousel.dots) return;
        
        // Вычисляем индекс реального слайда (0-3)
        let realIndex = carousel.currentIndex - 1;
        if (realIndex < 0) realIndex = carousel.totalSlides - 1;
        if (realIndex >= carousel.totalSlides) realIndex = 0;
        
        const dots = carousel.dots.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === realIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Автоматическое перелистывание
    function startAutoRotation(carouselId) {
        setInterval(() => {
            moveCarousel(carouselId, 1);
        }, 5000); // Каждые 5 секунд
    }
    
    // Поддержка свайпов для мобильных устройств
    function initSwipeSupport() {
        Object.keys(carousels).forEach(carouselId => {
            const carousel = carousels[carouselId];
            if (!carousel.element) return;
            
            let startX = 0;
            let endX = 0;
            const threshold = 50; // Минимальное расстояние для свайпа
            
            carousel.element.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            }, { passive: true });
            
            carousel.element.addEventListener('touchmove', (e) => {
                endX = e.touches[0].clientX;
            }, { passive: true });
            
            carousel.element.addEventListener('touchend', () => {
                const diff = startX - endX;
                
                if (Math.abs(diff) > threshold) {
                    if (diff > 0) {
                        // Свайп влево - следующий слайд
                        moveCarousel(carouselId, 1);
                    } else {
                        // Свайп вправо - предыдущий слайд
                        moveCarousel(carouselId, -1);
                    }
                }
            });
        });
    }
    
    // Инициализация при загрузке страницы
    initCarousels();
    
    // Пауза авто-ротации при наведении
    const carouselContainers = document.querySelectorAll('.carousel-container');
    carouselContainers.forEach(container => {
        container.addEventListener('mouseenter', () => {
            // Можно добавить логику паузы
        });
        
        container.addEventListener('mouseleave', () => {
            // Можно добавить логику возобновления
        });
    });
    
    // Добавляем консольное сообщение
    console.log('%c📸 Галерея отеля "Ильича" %c\nПогрузитесь в атмосферу советского модернизма', 
        'background: linear-gradient(to right, #d32f2f, #ffd700); color: white; padding: 10px; border-radius: 5px; font-size: 14px; font-weight: bold;', 
        'color: #1976d2; font-size: 12px;'
    );
});