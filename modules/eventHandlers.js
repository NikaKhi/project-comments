import { toggleLike, getCommentById, addComment } from './comments.js';
import { renderComments, renderAuthSection, renderAddForm } from './render.js';
import { sanitizeHTML } from './sanitize.js';
import { login, logout, isAuthenticated, getCurrentUser } from './auth.js';
import { renderLoginPage } from './login.js';
import { renderApp } from '../main.js';

export function initEventHandlers() {
    // Делегирование событий
    document.addEventListener('click', function (event) {
        
        if (event.target.classList.contains('like-button')) {
            event.preventDefault();
            event.stopPropagation();

            const commentElement = event.target.closest('.comment');
            if (!commentElement) return;

            const commentId = commentElement.dataset.id;

            if (toggleLike(commentId)) {
                const button = event.target;
                const isLiked = button.classList.contains('-active-like');

                if (isLiked) {
                    button.classList.remove('-active-like');
                } else {
                    button.classList.add('-active-like');
                }

                const counter = commentElement.querySelector('.likes-counter');
                const comment = getCommentById(commentId);
                if (counter && comment) {
                    counter.textContent = comment.likes;
                }
            }
            return;
        }

        // ССЫЛКА НА ЛОГИН
        if (event.target.classList.contains('login-link')) {
            event.preventDefault();
            renderLoginPage();
            return;
        }

        // КНОПКА ВЫХОДА
        if (event.target.classList.contains('logout-button')) {
            event.preventDefault();
            logout();
            renderApp();
            return;
        }

        // КНОПКА "НАПИСАТЬ"
        if (event.target.classList.contains('add-form-button')) {
            event.preventDefault();
            handleAddComment();
            return;
        }
    });
}

async function handleAddComment() {
    const commentInput = document.querySelector('.add-form-text');
    const addButton = document.querySelector('.add-form-button');
    const addForm = document.querySelector('.add-form');
    const loadingIndicator = document.querySelector('.loading-add');

    if (!commentInput || !addButton || !addForm) return;

    const commentText = commentInput.value.trim();

    if (commentText.length < 3) {
        alert('Комментарий должен быть не короче 3 символов');
        return;
    }

    addForm.style.display = 'none';
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }

    addButton.disabled = true;
    const originalText = addButton.textContent;
    addButton.textContent = 'Добавляем...';

    try {
        await addComment(commentText);

        commentInput.value = '';

        renderComments();

    } catch (error) {
        alert(error.message);
    } finally {
        addForm.style.display = 'flex';
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }

        addButton.disabled = false;
        addButton.textContent = originalText;
    }
}