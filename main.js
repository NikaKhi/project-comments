import { renderComments } from './modules/render.js';
import { initEventHandlers } from './modules/eventHandlers.js';
import { fetchComments } from './modules/comments.js';

async function init() {
    console.log('Запуск приложения...');

    // Показываем индикатор загрузки
    const commentsList = document.querySelector('.comments');
    commentsList.innerHTML = '<div style="color: white; text-align: center; padding: 20px;">Загрузка комментариев...</div>';

    try {
        // Загружаем комментарии из API
        await fetchComments();

        // Рендерим комментарии
        renderComments();

        // Инициализируем обработчики
        initEventHandlers();

        console.log('Приложение успешно запущено!');

    } catch (error) {
        // Показываем сообщение об ошибке
        commentsList.innerHTML = '<div style="color: #bcec30; text-align: center; padding: 20px;">Ошибка загрузки комментариев</div>';
        console.error('Ошибка запуска:', error);
    }
}

// Запускаем когда DOM загружен
document.addEventListener('DOMContentLoaded', init);