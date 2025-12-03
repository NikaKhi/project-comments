import { renderComments } from './modules/render.js';
import { initEventHandlers } from './modules/eventHandlers.js';
import { fetchComments } from './modules/comments.js';

async function init() {
    console.log('Запуск приложения...');

    try {
        const commentsList = document.querySelector('.comments');
        commentsList.innerHTML = '<div style="color: white; text-align: center; padding: 20px;">Загрузка комментариев...</div>';

        await fetchComments();

        if (window.comments && window.comments.length === 0) {
            commentsList.innerHTML = '<div style="color: white; text-align: center; padding: 20px;">Нет комментариев</div>';
        } else {
            renderComments();
        }

        initEventHandlers();

        console.log('Приложение запущено успешно!');
    } catch (error) {
        const commentsList = document.querySelector('.comments');
        commentsList.innerHTML = '<div style="color: #bcec30; text-align: center; padding: 20px;">Ошибка загрузки. Проверьте подключение.</div>';
        console.error('Ошибка запуска:', error);
    }
}

document.addEventListener('DOMContentLoaded', init);