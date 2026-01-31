// Данные мероприятий - УПРОЩЕННЫЕ
const eventsData = {
    1: {
        title: "Оркестр. 'Симфония Ведьмак при свечах'",
        date: "24 апреля 2026",
        time: "19:00 - 22:00",
        location: "Арт Холл, Владимир",
        distance: "10 мин (на машине) от отеля",
        image: "foto/ork.jpeg",
        description: "CAGMO представляет концертную программу по мотивам одной из самых популярных игр — «Симфония Ведьмак при свечах» в исполнении струнного оркестра с участием вокала.",
        details: [
            "Эпические мелодии",
            "Серия романов Анджея Сапковского",
            "Струнный оркестр CAGMO",
            "Этническое звучание струнного оркестра"
        ],
        price: "От 1500 руб",
        ageRestriction: "6+",
        duration: "3 часа"
    },
    2: {
        title: "Ночь музеев во Владимире",
        date: "18 мая 2026",
        time: "19:00 - 02:00",
        location: "Музейный квартал, Владимир",
        distance: "500 м от отеля",
        image: "foto/nm.jpeg",
        description: "Ежегодная акция, когда музеи открывают свои двери для посетителей в ночное время.",
        details: [
            "Эксклюзивные экскурсии",
            "Ночные квесты",
            "Выставка 'Сокровища Владимира'",
            "Концерты классической музыки"
        ],
        price: "Единый билет: 500 руб.",
        ageRestriction: "12+ (после 22:00)",
        duration: "7 часов"
    },
    3: {
        title: "Спектакль 'Анна Каренина'",
        date: "25 февраля 2026",
        time: "18:00 - 21:20",
        location: "г. Владимир, ул. Дворянская, д. 4",
        distance: "800 м от отеля",
        image: "foto/kk.jpeg",
        description: "Зрителей ждут вечные темы любви, семьи, ревности, измены и трагического искупления.",
        details: [
            "Театральная постановка",
            "Любовь и ненависть",
            "Л.Н. Толстой",
            "Современная российская жизнь"
        ],
        price: "От 1100 руб",
        ageRestriction: "16+",
        duration: "3 часа 20 минут"
    },
    4: {
        title: "Выставка «Сунгирь. Верхний палеолит в центре русской равнины»",
        date: "31 января - 25 июля 2026",
        time: "10:00 - 18:00",
        location: "Музейный центр «Палаты»",
        distance: "900 м от отеля",
        image: "foto/sy.jpeg",
        description: "Археологический памятник выявлен на окраине города Владимира в 1955 году. Раскопки там велись в общей сложности более полувека, а научные исследования продолжаются до сих пор. ",
        details: [
            "Отто Николаевич Бадер",
            "История",
            "Выставочный проект",
            "Экспонаты"
        ],
        price: "300 руб.",
        ageRestriction: "0+",
        duration: "8 часов"
    }
};

// Инициализация событий
document.addEventListener('DOMContentLoaded', function() {
    // Обработка кнопок "Подробнее"
    const detailButtons = document.querySelectorAll('.event-details-btn');
    const modal = document.getElementById('eventModal');
    const modalBody = document.querySelector('.modal-body');
    const modalClose = document.querySelector('.modal-close');
    
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const eventId = this.getAttribute('data-event');
            const eventData = eventsData[eventId];
            
            if (eventData) {
                // Заполняем модальное окно данными
                modalBody.innerHTML = `
                    <div class="modal-event-header">
                        <div class="modal-event-image">
                            <img src="${eventData.image}" alt="${eventData.title}">
                        </div>
                        <div class="modal-event-basic">
                            <h3>${eventData.title}</h3>
                            <div class="modal-event-info">
                                <div class="modal-info-item">
                                    <span class="info-label">📅 Дата:</span>
                                    <span class="info-value">${eventData.date}</span>
                                </div>
                                <div class="modal-info-item">
                                    <span class="info-label">⏰ Время:</span>
                                    <span class="info-value">${eventData.time}</span>
                                </div>
                                <div class="modal-info-item">
                                    <span class="info-label">📍 Место:</span>
                                    <span class="info-value">${eventData.location}</span>
                                </div>
                                <div class="modal-info-item">
                                    <span class="info-label">🚶‍♂️ От отеля:</span>
                                    <span class="info-value">${eventData.distance}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-event-description">
                        <h4>О мероприятии</h4>
                        <p>${eventData.description}</p>
                        <ul class="modal-event-details">
                            ${eventData.details.map(detail => `<li>${detail}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="modal-event-extra">
                        <div class="extra-grid">
                            <div class="extra-item">
                                <span class="extra-label">💰 Стоимость:</span>
                                <span class="extra-value">${eventData.price}</span>
                            </div>
                            <div class="extra-item">
                                <span class="extra-label">🎭 Возраст:</span>
                                <span class="extra-value">${eventData.ageRestriction}</span>
                            </div>
                            <div class="extra-item">
                                <span class="extra-label">⏱️ Длительность:</span>
                                <span class="extra-value">${eventData.duration}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-event-actions">
                        <button class="modal-book-btn" onclick="alert('Бронирование билетов через ресепшен отеля')">Забронировать билеты</button>
                        <button class="modal-map-btn" onclick="showEventOnMap(${eventId})">Показать на карте</button>
                    </div>
                `;
                
                // Показываем модальное окно
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Закрытие модального окна
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Закрытие модального окна при клике вне его
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Закрытие модального окна клавишей ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Функция для показа на карте (заглушка)
function showEventOnMap(eventId) {
    const eventData = eventsData[eventId];
    alert(`Маршрут до "${eventData.title}" построен. \nРасстояние: ${eventData.distance}\nРекомендуем пешую прогулку - это займет 5-10 минут.`);
}