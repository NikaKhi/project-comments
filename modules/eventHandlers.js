import { comments, updateComment, addComment } from './comments.js';
import { renderComments } from './render.js';
import { sanitizeHTML } from './sanitize.js';

export function addLikeEventListeners() {
    const likeButtons = document.querySelectorAll('.like-button');
    likeButtons.forEach(button => {
        button.addEventListener('click', handleLikeClick);
    });
}

export function addCommentClickEventListeners() {
    const commentElements = document.querySelectorAll('.comment');
    commentElements.forEach(commentElement => {
        commentElement.addEventListener('click', handleCommentClick);
    });
}

function handleLikeClick(event) {
    event.stopPropagation();
    const commentElement = event.target.closest('.comment');
    const commentId = commentElement.dataset.id;
    const commentIndex = comments.findIndex(comment => comment.id === commentId);

    if (commentIndex !== -1) {
        if (comments[commentIndex].isLiked) {
            updateComment(commentId, {
                isLiked: false,
                likes: comments[commentIndex].likes - 1
            });
        } else {
            updateComment(commentId, {
                isLiked: true,
                likes: comments[commentIndex].likes + 1
            });
        }
        renderComments();
    }
}

function handleCommentClick(event) {
    const commentElement = event.target.closest('.comment');
    const commentId = commentElement.dataset.id;
    const comment = comments.find(c => c.id === commentId);
    const nameInput = document.querySelector('.add-form-name');
    const commentInput = document.querySelector('.add-form-text');

    if (comment) {
        nameInput.value = '';
        commentInput.value = `> ${sanitizeHTML(comment.name)}: ${sanitizeHTML(comment.text)}\n\n`;
        commentInput.focus();
    }
}

export async function handleAddComment() {
    const nameInput = document.querySelector('.add-form-name');
    const commentInput = document.querySelector('.add-form-text');
    const addButton = document.querySelector('.add-form-button');

    const name = nameInput.value.trim();
    const commentText = commentInput.value.trim();

    if (!name || !commentText) {
        alert('Пожалуйста, заполните все поля');
        return;
    }

    addButton.disabled = true;
    addButton.textContent = 'Добавляем...';

    try {
        await addComment({ name, text: commentText });
        renderComments();

        nameInput.value = '';
        commentInput.value = '';

    } catch (error) {
        alert('Ошибка при добавлении комментария. Попробуйте еще раз.');
        console.error('Ошибка:', error);
    } finally {
        addButton.disabled = false;
        addButton.textContent = 'Написать';
    }
}

export function initEventHandlers() {
    const addButton = document.querySelector('.add-form-button');
    if (addButton) {
        addButton.addEventListener('click', handleAddComment);
        console.log('Обработчик кнопки "Написать" добавлен');
    }
}