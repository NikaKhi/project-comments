import { comments, toggleLike, addComment, getCommentById } from './comments.js';
import { renderComments } from './render.js';
import { sanitizeHTML } from './sanitize.js';

let eventListenersInitialized = false;

export function initEventHandlers() {
    if (eventListenersInitialized) return;

    console.log(' Инициализация обработчиков событий...');

    // 1. Обработчик для кнопки "Написать"
    const addButton = document.querySelector('.add-form-button');
    if (addButton) {
        console.log(' Найдена кнопка "Написать"');
        addButton.addEventListener('click', handleAddComment);
    }

    // 2. Делегирование событий для динамических элементов
    setupEventDelegation();

    eventListenersInitialized = true;
}

function setupEventDelegation() {
    console.log(' Настраиваем делегирование событий...');

    // Используем document для надежности
    document.addEventListener('click', function (event) {
        // ЛАЙКИ - это самое важное!
        if (event.target.classList.contains('like-button')) {
            console.log(' Клик по лайку!');
            event.preventDefault();
            event.stopPropagation();

            const commentElement = event.target.closest('.comment');
            if (!commentElement) {
                console.log(' Не найден родительский комментарий');
                return;
            }

            const commentId = commentElement.dataset.id;
            console.log('ID комментария для лайка:', commentId);

            // Переключаем лайк
            if (toggleLike(commentId)) {
                console.log(' Лайк переключен');

                // Меняем стиль кнопки
                const button = event.target;
                const isLiked = button.classList.contains('-active-like');

                if (isLiked) {
                    button.classList.remove('-active-like');
                } else {
                    button.classList.add('-active-like');
                }

                // Обновляем счетчик
                const counter = commentElement.querySelector('.likes-counter');
                const comment = getCommentById(commentId);
                if (counter && comment) {
                    counter.textContent = comment.likes;
                    console.log(' Счетчик обновлен:', comment.likes);
                }
            } else {
                console.log(' Не удалось переключить лайк');
            }
            return;
        }

        // КЛИК ПО КОММЕНТАРИЮ ДЛЯ ОТВЕТА
        const commentElement = event.target.closest('.comment');
        if (commentElement && !event.target.classList.contains('like-button')) {
            const commentId = commentElement.dataset.id;
            const comment = getCommentById(commentId);
            const commentInput = document.querySelector('.add-form-text');

            if (comment && commentInput) {
                commentInput.value = `> ${sanitizeHTML(comment.name)}: ${sanitizeHTML(comment.text)}\n\n`;
                commentInput.focus();
                console.log(' Текст комментария подставлен для ответа');
            }
        }
    });

    console.log(' Делегирование событий настроено');
}

// Обработчик добавления комментария
async function handleAddComment() {
    console.log(' Обработка добавления комментария...');

    const nameInput = document.querySelector('.add-form-name');
    const commentInput = document.querySelector('.add-form-text');
    const addButton = document.querySelector('.add-form-button');

    if (!nameInput || !commentInput || !addButton) {
        console.error(' Не найдены элементы формы');
        return;
    }

    const name = nameInput.value.trim();
    const commentText = commentInput.value.trim();

    console.log('Введенные данные:', { name, commentText });

    // Валидация
    if (!name || !commentText) {
        alert('Пожалуйста, заполните все поля');
        return;
    }

    if (name.length < 1) {
        alert('Введите имя');
        return;
    }

    if (commentText.length < 1) {
        alert('Введите комментарий');
        return;
    }

    // Блокируем кнопку
    const originalText = addButton.textContent;
    addButton.disabled = true;
    addButton.textContent = 'Добавляем...';

    try {
        console.log(' Отправка комментария в API...');
        await addComment({ name, text: commentText });

        console.log(' Комментарий добавлен');

        // Очищаем форму
        nameInput.value = '';
        commentInput.value = '';

        // Перерисовываем
        console.log(' Перерисовка комментариев...');
        renderComments();

        // Переинициализируем обработчики
        eventListenersInitialized = false;
        initEventHandlers();

    } catch (error) {
        console.error(' Ошибка добавления:', error);
        alert('Ошибка при добавлении комментария: ' + error.message);
    } finally {
        // Разблокируем кнопку
        addButton.disabled = false;
        addButton.textContent = originalText;
    }
}