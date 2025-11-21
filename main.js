import { renderComments } from './modules/render.js';
import { initEventHandlers } from './modules/eventHandlers.js';

function init() {
    console.log('Инициализация приложения...');

    renderComments();
    initEventHandlers();

    console.log('Приложение запущено!');
}

document.addEventListener('DOMContentLoaded', init);