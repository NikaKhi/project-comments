import { renderComments } from './modules/render.js';
import { initEventHandlers } from './modules/eventHandlers.js';
import { fetchComments } from './modules/comments.js';

async function init() {
    console.log('Инициализация приложения...');

    try {
        const commentsList = document.querySelector('.comments');
        commentsList.innerHTML = '<div style="color: white; text-align: center;">Загрузка комментариев...</div>';

        await fetchComments();

        renderComments();

        initEventHandlers();

        console.log('Приложение запущено!');

    } catch (error) {
        const commentsList = document.querySelector('.comments');
        commentsList.innerHTML = '<div style="color: red; text-align: center;">Ошибка загрузки комментариев. Проверьте подключение к интернету.</div>';
        console.error('Ошибка инициализации:', error);
    }
}

document.addEventListener('DOMContentLoaded', init);