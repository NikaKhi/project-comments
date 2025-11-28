import { comments, updateComment, addComment, getCommentById } from './comments.js';
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
    const commentId = parseInt(commentElement.dataset.id);
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
    const commentId = parseInt(commentElement.dataset.id);
    const comment = getCommentById(commentId);
    const nameInput = document.querySelector('.add-form-name');
    const commentInput = document.querySelector('.add-form-text');

    if (comment) {
        nameInput.value = '';
        commentInput.value = `> ${sanitizeHTML(comment.name)}: ${sanitizeHTML(comment.text)}\n\n`;
        commentInput.focus();
    }
}

export function handleAddComment() {
    const nameInput = document.querySelector('.add-form-name');
    const commentInput = document.querySelector('.add-form-text');
    const name = nameInput.value.trim();
    const commentText = commentInput.value.trim();

    if (!name || !commentText) {
        alert('Пожалуйста, заполните все поля');
        return;
    }

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear().toString().slice(-2)} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newComment = {
        id: Date.now(),
        name: sanitizeHTML(name),
        date: formattedDate,
        text: sanitizeHTML(commentText),
        likes: 0,
        isLiked: false
    };

    addComment(newComment);
    renderComments();

    nameInput.value = '';
    commentInput.value = '';
}

export function initEventHandlers() {
    const addButton = document.querySelector('.add-form-button');
    if (addButton) {
        addButton.addEventListener('click', handleAddComment);
        console.log('Обработчик кнопки "Написать" добавлен');
    }
}