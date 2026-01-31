// JavaScript для страницы ресторана
document.addEventListener('DOMContentLoaded', function() {
    
    // Анимация появления элементов при скролле
    function animateOnScroll() {
        const elements = document.querySelectorAll('.menu-group, .feature-item, .breakfast-feature');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    // Инициализация анимаций
    setTimeout(animateOnScroll, 100);
    
    // Обработка кликов по PDF ссылкам
    const pdfLinks = document.querySelectorAll('a[href$=".pdf"]');
    pdfLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log(`Открыт PDF: ${this.getAttribute('href')}`);
        });
    });
    
    // Добавляем hover-эффекты для кнопок меню
    const menuButtons = document.querySelectorAll('.menu-btn');
    menuButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('hover')) {
                this.style.transform = '';
            }
        });
    });
    
    // Консольное сообщение
    console.log('%c🍽️ Ресторан "Прогресс" %c\nСовременная кухня в стиле советского модернизма', 
        'background: linear-gradient(to right, #d32f2f, #ffd700); color: white; padding: 10px; border-radius: 5px; font-size: 14px; font-weight: bold;', 
        'color: #1976d2; font-size: 12px;'
    );
});