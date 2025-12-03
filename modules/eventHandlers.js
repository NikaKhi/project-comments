import { comments, updateComment, addComment } from './comments.js';
import { renderComments } from './render.js';
import { sanitizeHTML } from './sanitize.js';

export function addLikeEventListeners() {
    const likeButtons = document.querySelectorAll('.like-button');
    likeButtons.forEach(button => {
        button.removeEventListener('click', handleLikeClick);
        button.addEventListener('click', handleLikeClick);
    });
}

export function addCommentClickEventListeners() {
    const commentElements = document.querySelectorAll('.comment');
    commentElements.forEach(commentElement => {
        commentElement.removeEventListener('click', handleCommentClick);
        commentElement.addEventListener('click', handleCommentClick);
    });
}

function handleLikeClick(event) {
    event.stopPropagation();
    const commentElement = event.target.closest('.comment');
    const commentId = commentElement.dataset.id;
    const comment = comments.find(c => c.id === commentId);

    if (comment) {
        const newLikedState = !comment.isLiked;
        const likeChange = newLikedState ? 1 : -1;

        updateComment(commentId, {
            isLiked: newLikedState,
            likes: comment.likes + likeChange
        });

        renderComments();
    }
}

function handleCommentClick(event) {
    if (event.target.classList.contains('like-button')) return;

    const commentElement = event.target.closest('.comment');
    const commentId = commentElement.dataset.id;
    const comment = comments.find(c => c.id === commentId);
    const commentInput = document.querySelector('.add-form-text');

    if (comment && commentInput) {
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
        alert('Заполните все поля');
        return;
    }

    if (name.length < 3) {
        alert('Имя должно быть не менее 3 символов');
        return;
    }

    if (commentText.length < 3) {
        alert('Комментарий должен быть не менее 3 символов');
        return;
    }

    addButton.disabled = true;
    addButton.textContent = 'Добавляем...';

    try {
        await addComment({ name, text: commentText });

        nameInput.value = '';
        commentInput.value = '';

        renderComments();
    } catch (error) {
        alert('Ошибка при добавлении комментария: ' + error.message);
        console.error('Ошибка:', error);
    } finally {
        addButton.disabled = false;
        addButton.textContent = 'Написать';
    }
}

export function initEventHandlers() {
    const addButton = document.querySelector('.add-form-button');
    addButton.addEventListener('click', handleAddComment);
}