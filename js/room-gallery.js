// Галерея для страницы номера
document.addEventListener('DOMContentLoaded', function() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainImage');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const currentImageSpan = document.getElementById('currentImage');
    const totalImagesSpan = document.getElementById('totalImages');
    
    // Массив изображений в высоком качестве
    const highQualityImages = [
        'foto/2026-01-31 ov.jpg',
        'foto/2026-01-31 sz.jpg',
        'foto/2026-01-31 tk.jpg',
        'foto/2026-01-31 rs.jpg'
    ];
    
    let currentIndex = 0;
    const totalImages = highQualityImages.length;
    
    // Устанавливаем общее количество изображений
    totalImagesSpan.textContent = totalImages;
    
    // Инициализация галереи
    function initGallery() {
        // Обработчики для миниатюр
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                setActiveImage(index);
            });
        });
        
        // Кнопки навигации
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        
        // Обновляем начальное состояние
        updateGallery();
        
        // Добавляем обработчики для клавиатуры
        document.addEventListener('keydown', handleKeyboardNavigation);
    }
    
    // Показать предыдущее изображение
    function showPrevImage() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateGallery();
    }
    
    // Показать следующее изображение
    function showNextImage() {
        currentIndex = (currentIndex + 1) % totalImages;
        updateGallery();
    }
    
    // Установить активное изображение по индексу
    function setActiveImage(index) {
        currentIndex = index;
        updateGallery();
    }
    
    // Обновить галерею
    function updateGallery() {
        // Обновляем главное изображение
        mainImage.style.opacity = '0';
        
        setTimeout(() => {
            mainImage.src = highQualityImages[currentIndex];
            mainImage.style.opacity = '1';
        }, 150);
        
        // Обновляем миниатюры
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.classList.toggle('active', index === currentIndex);
            thumbnail.style.opacity = index === currentIndex ? '1' : '0.6';
            thumbnail.style.borderColor = index === currentIndex ? '#d32f2f' : 'transparent';
        });
        
        // Обновляем счетчик
        currentImageSpan.textContent = currentIndex + 1;
        
        // Обновляем атрибут alt
        const activeThumbnail = thumbnails[currentIndex];
        if (activeThumbnail) {
            const img = activeThumbnail.querySelector('img');
            if (img) {
                mainImage.alt = img.alt;
            }
        }
    }
    
    // Навигация с клавиатуры
    function handleKeyboardNavigation(event) {
        if (event.key === 'ArrowLeft') {
            showPrevImage();
        } else if (event.key === 'ArrowRight') {
            showNextImage();
        }
    }
    
    // Автоматическая смена изображений (опционально)
    function startAutoRotation() {
        let rotationInterval = setInterval(() => {
            showNextImage();
        }, 5000);
        
        // Останавливаем при наведении на галерею
        const gallery = document.querySelector('.room-gallery-column');
        gallery.addEventListener('mouseenter', () => {
            clearInterval(rotationInterval);
        });
        
        gallery.addEventListener('mouseleave', () => {
            rotationInterval = setInterval(() => {
                showNextImage();
            }, 5000);
        });
    }
    
    // Инициализируем галерею
    initGallery();
    
    // Запускаем авто-ротацию (раскомментировать, если нужно)
    // startAutoRotation();
    
    // Логика формы бронирования
    const bookingForm = document.getElementById('bookingForm');
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    const nightsCount = document.getElementById('nightsCount');
    const nightsValue = document.getElementById('nightsValue');
    const totalPrice = document.getElementById('totalPrice');
    const finalPrice = document.getElementById('finalPrice');
    
    // Устанавливаем минимальную дату (сегодня)
    const today = new Date().toISOString().split('T')[0];
    checkinInput.min = today;
    
    // Обновляем минимальную дату выезда при выборе даты заезда
    checkinInput.addEventListener('change', function() {
        checkoutInput.min = this.value;
        if (checkoutInput.value && checkoutInput.value < this.value) {
            checkoutInput.value = '';
        }
        calculateNights();
    });
    
    checkoutInput.addEventListener('change', calculateNights);
    
    // Расчет количества ночей
    function calculateNights() {
        if (checkinInput.value && checkoutInput.value) {
            const checkin = new Date(checkinInput.value);
            const checkout = new Date(checkoutInput.value);
            const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
            
            if (nights > 0) {
                nightsCount.textContent = nights;
                nightsValue.textContent = nights;
                
                const basePrice = 4500;
                const serviceFee = 450;
                const total = (basePrice * nights) + serviceFee;
                
                totalPrice.textContent = `${(basePrice * nights).toLocaleString('ru-RU')} ₽`;
                finalPrice.textContent = `${total.toLocaleString('ru-RU')} ₽`;
            }
        }
    }
    
    // Обработка отправки формы
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Здесь будет реальная логика отправки
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Показываем сообщение об успехе
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span class="btn-icon">✓</span><span>Забронировано!</span>';
        submitBtn.style.background = '#4caf50';
        
        // В реальном приложении здесь был бы fetch запрос
        console.log('Данные для бронирования:', data);
        
        // Возвращаем кнопку в исходное состояние через 3 секунды
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '#d32f2f';
            bookingForm.reset();
            calculateNights(); // Сбросить расчет
        }, 3000);
    });
    
    // Инициализируем расчет для сегодняшней даты
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    checkinInput.value = today;
    checkoutInput.value = tomorrow.toISOString().split('T')[0];
    checkoutInput.min = today;
    calculateNights();
});