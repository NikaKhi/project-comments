import { comments, updateCommentLikes, addComment, getCommentById } from './comments.js';
import { renderComments } from './render.js';
import { sanitizeHTML } from './sanitize.js';

// Добавляем обработчики лайков
export function addLikeEventListeners() {
    const likeButtons = document.querySelectorAll('.like-button');
    likeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            handleLikeClick(event);
        });
    });
}

// Добавляем обработчики кликов по комментариям
export function addCommentClickEventListeners() {
    const commentElements = document.querySelectorAll('.comment');
    commentElements.forEach(commentElement => {
        commentElement.addEventListener('click', (event) => {
            if (!event.target.classList.contains('like-button')) {
                handleCommentClick(event);
            }
        });
    });
}

// Обработчик лайков (работает локально)
function handleLikeClick(event) {
    const commentElement = event.target.closest('.comment');
    if (!commentElement) return;

    const commentId = commentElement.dataset.id;

    if (updateCommentLikes(commentId)) {
        renderComments();
    }
}

// Обработчик клика по комментарию (для ответа)
function handleCommentClick(event) {
    const commentElement = event.target.closest('.comment');
    if (!commentElement) return;

    const commentId = commentElement.dataset.id;
    const comment = getCommentById(commentId);
    const commentInput = document.querySelector('.add-form-text');

    if (comment && commentInput) {
        commentInput.value = `> ${sanitizeHTML(comment.name)}: ${sanitizeHTML(comment.text)}\n\n`;
        commentInput.focus();
    }
}

// Обработчик добавления комментария
export async function handleAddComment() {
    const nameInput = document.querySelector('.add-form-name');
    const commentInput = document.querySelector('.add-form-text');
    const addButton = document.querySelector('.add-form-button');

    const name = nameInput.value.trim();
    const commentText = commentInput.value.trim();

    // Валидация
    if (!name || !commentText) {
        alert('Заполните все поля');
        return;
    }

    // Блокируем кнопку во время отправки
    addButton.disabled = true;
    addButton.textContent = 'Добавляем...';

    try {
        await addComment({ name, text: commentText });

        // Очищаем форму
        nameInput.value = '';
        commentInput.value = '';

        // Перерисовываем комментарии
        renderComments();

    } catch (error) {
        alert('Ошибка при добавлении комментария: ' + error.message);
        console.error('Ошибка:', error);
    } finally {
        // Разблокируем кнопку
        addButton.disabled = false;
        addButton.textContent = 'Написать';
    }
}

// Инициализация обработчиков
export function initEventHandlers() {
    const addButton = document.querySelector('.add-form-button');
    if (addButton) {
        addButton.addEventListener('click', handleAddComment);
    }
}