// JavaScript для страницы контактов с картой
document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация Яндекс.Карты с правильными координатами
    function initYandexMap() {
        // Проверяем, загружена ли API Яндекс.Карт
        if (typeof ymaps === 'undefined') {
            console.warn('Yandex Maps API не загружена. Загрузите API или используйте статическую карту.');
            createFallbackMap();
            return;
        }
        
        // Инициализируем карту
        ymaps.ready(function() {
            try {
                // ПРАВИЛЬНЫЕ координаты отеля "Ильича" во Владимире
                var hotelCoords = [56.131551, 40.400589];
                
                // Создаем карту с минималистичным дизайном
                var map = new ymaps.Map('yandex-map', {
                    center: hotelCoords,
                    zoom: 16,
                    controls: ['zoomControl', 'fullscreenControl']
                }, {
                    searchControlProvider: 'yandex#search',
                    suppressMapOpenBlock: true
                });
                
                // Настраиваем стиль карты (более светлый)
                map.options.set({
                    suppressMapOpenBlock: true
                });
                
                // Создаем красно-желтую иконку для метки
                var hotelIcon = ymaps.templateLayoutFactory.createClass(
                    '<div style="background: linear-gradient(135deg, #d32f2f, #ff9800); ' +
                    'width: 40px; height: 40px; border-radius: 50%; ' +
                    'border: 3px solid white; box-shadow: 0 4px 12px rgba(211, 47, 47, 0.5); ' +
                    'display: flex; align-items: center; justify-content: center; ' +
                    'cursor: pointer; transform: translate(-50%, -100%);">' +
                    '<i class="fas fa-hotel" style="color: white; font-size: 18px;"></i>' +
                    '</div>'
                );
                
                // Добавляем метку отеля
                var hotelPlacemark = new ymaps.Placemark(hotelCoords, {
                    balloonContent: `
                        <div style="font-family: 'Inter', sans-serif; padding: 15px;">
                            <h4 style="color: #d32f2f; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Отель «Ильича»</h4>
                            <p style="margin: 5px 0; color: #333; font-size: 14px;"><strong>📍 Адрес:</strong> ул. Ильича, 9, Владимир</p>
                            <p style="margin: 5px 0; color: #333; font-size: 14px;"><strong>📞 Телефон:</strong> +7 (900) 777-55-88</p>
                            <p style="margin: 5px 0; color: #333; font-size: 14px;"><strong>⏰ Режим работы:</strong> круглосуточно</p>
                            <button id="getDirections" style="
                                background: linear-gradient(135deg, #d32f2f, #ff9800);
                                color: white;
                                border: none;
                                padding: 8px 16px;
                                border-radius: 6px;
                                cursor: pointer;
                                margin-top: 10px;
                                font-family: inherit;
                                font-weight: 500;
                                font-size: 14px;
                                transition: transform 0.2s;
                                width: 100%;
                            ">
                                <i class="fas fa-route" style="margin-right: 8px;"></i>
                                Построить маршрут
                            </button>
                        </div>
                    `,
                    hintContent: 'Отель «Ильича» — ул. Ильича, 9'
                }, {
                    iconLayout: hotelIcon,
                    iconShape: {
                        type: 'Circle',
                        coordinates: [0, 0],
                        radius: 20
                    }
                });
                
                // Добавляем метку на карту
                map.geoObjects.add(hotelPlacemark);
                
                // Добавляем Золотые Ворота как ориентир
                var goldenGateCoords = [56.127526, 40.396966];
                var goldenGate = new ymaps.Placemark(goldenGateCoords, {
                    balloonContent: 'Золотые Ворота — памятник древнерусской архитектуры',
                    hintContent: 'Золотые Ворота'
                }, {
                    preset: 'islands#blueCircleDotIcon',
                    iconColor: '#ff9800'
                });
                
                // Добавляем ж/д вокзал
                var railwayStationCoords = [56.137439, 40.419278];
                var railwayStation = new ymaps.Placemark(railwayStationCoords, {
                    balloonContent: 'Железнодорожный вокзал Владимира',
                    hintContent: 'Ж/д вокзал'
                }, {
                    preset: 'islands#greenDotIcon',
                    iconColor: '#d32f2f'
                });
                
                map.geoObjects.add(goldenGate);
                map.geoObjects.add(railwayStation);
                
                // Добавляем линию от вокзала до отеля
                var polyline = new ymaps.Polyline([
                    railwayStationCoords,
                    hotelCoords
                ], {
                    balloonContent: "Маршрут от ж/д вокзала до отеля"
                }, {
                    strokeColor: "#ff9800",
                    strokeWidth: 2,
                    strokeOpacity: 0.7,
                    strokeStyle: '2 5'
                });
                
                map.geoObjects.add(polyline);
                
                // Устанавливаем границы чтобы показать все метки
                map.setBounds(map.geoObjects.getBounds(), {
                    checkZoomRange: true,
                    zoomMargin: 100
                });
                
                // Добавляем обработчик для кнопки "Построить маршрут"
                hotelPlacemark.events.add('balloonopen', function() {
                    setTimeout(function() {
                        var btn = document.getElementById('getDirections');
                        if (btn) {
                            btn.addEventListener('click', function() {
                                var url = `https://yandex.ru/maps/?rtext=~${hotelCoords[0]},${hotelCoords[1]}&rtt=pd`;
                                window.open(url, '_blank');
                            });
                        }
                    }, 100);
                });
                
                // Сохраняем ссылку на карту для использования в других функциях
                window.contactMap = map;
                
            } catch (error) {
                console.error('Ошибка при создании карты:', error);
                createFallbackMap();
            }
        });
    }
    
    // Создаем заглушку для карты, если API не загрузилась
    function createFallbackMap() {
        var mapContainer = document.getElementById('yandex-map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div class="fallback-map" style="
                    background: #f8f9fa;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                ">
                    <div class="fallback-content" style="
                        background: white;
                        padding: 30px;
                        border-radius: 12px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                        max-width: 400px;
                        text-align: center;
                        border: 1px solid #eaeaea;
                    ">
                        <div style="
                            width: 60px;
                            height: 60px;
                            background: linear-gradient(135deg, #d32f2f, #ff9800);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto 20px;
                            box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
                        ">
                            <i class="fas fa-hotel" style="color: white; font-size: 24px;"></i>
                        </div>
                        <h4 style="color: #1a1a1a; margin-bottom: 15px; font-size: 20px;">Отель «Ильича»</h4>
                        <p style="color: #666; margin-bottom: 10px;">📍 ул. Ильича, 9, Владимир</p>
                        <div class="fallback-features" style="
                            margin: 20px 0;
                            text-align: left;
                            display: inline-block;
                        ">
                            <p style="color: #666; margin: 8px 0; font-size: 14px;">
                                <span style="display: inline-block; width: 24px;">🏛️</span>
                                Рядом с Золотыми Воротами
                            </p>
                            <p style="color: #666; margin: 8px 0; font-size: 14px;">
                                <span style="display: inline-block; width: 24px;">🚶‍♂️</span>
                                5 минут пешком от центра
                            </p>
                            <p style="color: #666; margin: 8px 0; font-size: 14px;">
                                <span style="display: inline-block; width: 24px;">🚗</span>
                                Охраняемая парковка
                            </p>
                        </div>
                        <a href="https://yandex.ru/maps/16/vladimir/?ll=40.400589%2C56.131551&mode=whatshere&whatshere%5Bpoint%5D=40.400589%2C56.131551&whatshere%5Bzoom%5D=16&z=16" 
                           class="external-map-btn" target="_blank" style="
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                            background: linear-gradient(135deg, #d32f2f, #ff9800);
                            color: white;
                            padding: 12px 24px;
                            border-radius: 6px;
                            text-decoration: none;
                            font-weight: 500;
                            margin-top: 15px;
                            transition: transform 0.2s;
                            font-size: 14px;
                        ">
                            <i class="fas fa-external-link-alt"></i>
                            <span>Открыть в Яндекс.Картах</span>
                        </a>
                    </div>
                </div>
            `;
        }
    }
    
    // Анимация появления элементов
    function animateElements() {
        const elements = document.querySelectorAll('.info-card, .transport-option, .social-link');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isAnimating) return;
                
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.isAnimating = true;
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
    
    // Копирование контактной информации
    function initCopyToClipboard() {
        // Добавляем атрибуты для копирования
        const phoneElements = document.querySelectorAll('.card-text');
        phoneElements.forEach(el => {
            if (el.textContent.includes('+7')) {
                el.setAttribute('data-copy', el.textContent.trim());
                el.style.cursor = 'pointer';
                el.style.position = 'relative';
                el.title = 'Кликните для копирования номера';
                
                // Добавляем иконку копирования
                const copyIcon = document.createElement('span');
                copyIcon.innerHTML = '📋';
                copyIcon.style.marginLeft = '8px';
                copyIcon.style.fontSize = '14px';
                copyIcon.style.opacity = '0.5';
                copyIcon.style.transition = 'opacity 0.2s, transform 0.2s';
                
                el.appendChild(copyIcon);
                
                el.addEventListener('mouseenter', function() {
                    copyIcon.style.opacity = '1';
                    copyIcon.style.transform = 'scale(1.1)';
                });
                
                el.addEventListener('mouseleave', function() {
                    copyIcon.style.opacity = '0.5';
                    copyIcon.style.transform = 'scale(1)';
                });
                
                el.addEventListener('click', function() {
                    const textToCopy = this.getAttribute('data-copy');
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        showNotification('Номер телефона скопирован в буфер обмена', 'success');
                    }).catch(err => {
                        // Fallback для старых браузеров
                        const textArea = document.createElement('textarea');
                        textArea.value = textToCopy;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        
                        showNotification('Номер телефона скопирован', 'success');
                    });
                });
            }
        });
    }
    
    // Показ уведомлений в красно-желтой гамме
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content" style="display: flex; align-items: center; gap: 12px;">
                <div style="
                    width: 24px;
                    height: 24px;
                    background: linear-gradient(135deg, #d32f2f, #ff9800);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <i class="fas fa-${type === 'success' ? 'check' : 'info-circle'}" 
                       style="color: white; font-size: 12px;"></i>
                </div>
                <span style="flex: 1;">${message}</span>
            </div>
        `;
        
        // Стили для уведомления
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            color: #333;
            padding: 16px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
            border: 1px solid #eaeaea;
            border-left: 4px solid #d32f2f;
            font-size: 14px;
        `;
        
        document.body.appendChild(notification);
        
        // Добавляем стили для анимации
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%) translateY(-20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0) translateY(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
                    from {
                        transform: translateX(0) translateY(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%) translateY(-20px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Автоматическое скрытие через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Инициализация всех функций
    function initContactPage() {
        // Инициализируем карту
        initYandexMap();
        
        // Запускаем анимации
        setTimeout(animateElements, 100);
        
        // Инициализируем копирование в буфер обмена
        initCopyToClipboard();
        
        // Консольное сообщение
        console.log('%c🏨 Отель "Ильича" | Контакты %c\n📍 ул. Ильича, 9, Владимир\n📞 +7 (900) 777-55-88', 
            'background: linear-gradient(to right, #d32f2f, #ff9800); color: white; padding: 10px; border-radius: 5px; font-size: 14px; font-weight: bold;', 
            'color: #666; font-size: 12px;'
        );
    }
    
    // Запускаем инициализацию при загрузке страницы
    initContactPage();
    
    // Обновляем карту при изменении размера окна
    window.addEventListener('resize', function() {
        if (window.contactMap) {
            setTimeout(() => {
                window.contactMap.container.fitToViewport();
            }, 300);
        }
    });
});