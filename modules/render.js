import { sanitizeHTML } from './sanitize.js';
import { getAllComments } from './comments.js';
import { getUser } from './auth.js';
import { isAuthenticated } from './api.js';

export function renderComments() {
    const commentsList = document.querySelector('.comments');
    if (!commentsList) return;

    const comments = getAllComments();
    
    commentsList.innerHTML = '';

    if (comments.length === 0) {
        commentsList.innerHTML = '<div style="color: white; text-align: center; padding: 20px;">Нет комментариев</div>';
        return;
    }

    const monthNames = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];

    comments.forEach(comment => {
        const likeClass = comment.isLiked ? ' -active-like' : '';
        
        let displayDate = 'Только что';
        
        if (comment.date) {
            try {
                const date = new Date(comment.date);
                if (!isNaN(date.getTime())) {
                    const day = date.getDate();
                    const month = monthNames[date.getMonth()];
                    const year = date.getFullYear();
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    
                    displayDate = `${day} ${month} ${year} г. ${hours}:${minutes}`;
                }
            } catch (e) {
                displayDate = comment.date;
            }
        }

        const commentHTML = `
            <li class="comment" data-id="${comment.id}">
                <div class="comment-header">
                    <div>${sanitizeHTML(comment.name)}</div>
                    <div>${displayDate}</div>
                </div>
                <div class="comment-body">
                    <div class="comment-text">
                        ${sanitizeHTML(comment.text)}
                    </div>
                </div>
                <div class="comment-footer">
                    <div class="likes">
                        <span class="likes-counter">${comment.likes}</span>
                        <button class="like-button${likeClass}"></button>
                    </div>
                </div>
            </li>
        `;

        commentsList.innerHTML += commentHTML;
    });
}

export function renderAuthSection() {
    const authSection = document.querySelector('.auth-section');
    if (!authSection) return;

    if (isAuthenticated()) {
        const user = getUser();
        authSection.innerHTML = `
            <div style="color: white; margin-bottom: 20px; padding: 10px; background: rgba(76, 175, 80, 0.1); border-radius: 5px;">
                Вы вошли как: <strong>${user ? sanitizeHTML(user.name) : 'Пользователь'}</strong>
                <button class="logout-button" style="margin-left: 15px; background: #ff6b6b; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 12px;">
                    Выйти
                </button>
            </div>
        `;
    } else {
        authSection.innerHTML = `
            <div style="color: white; text-align: center; margin-bottom: 20px; padding: 15px; background: rgba(255, 107, 107, 0.1); border-radius: 5px;">
                <a href="#" class="login-link" style="color: #bcec30; text-decoration: none;">
                    Чтобы добавить комментарий, авторизуйтесь
                </a>
            </div>
        `;
    }
}

export function renderAddForm() {
    const addFormContainer = document.querySelector('.add-form-container');
    if (!addFormContainer) return;

    if (isAuthenticated()) {
        const user = getUser();
        addFormContainer.innerHTML = `
            <div class="add-form">
                <input 
                    type="text" 
                    class="add-form-name" 
                    value="${user ? sanitizeHTML(user.name) : ''}" 
                    readonly 
                />
                <textarea class="add-form-text" placeholder="Введите ваш комментарий" rows="4" required></textarea>
                <div class="add-form-row">
                    <button class="add-form-button">Написать</button>
                </div>
            </div>
            <div class="loading-add" style="display: none;">
                <div style="margin-bottom: 15px;">Комментарий добавляется...</div>
                <div class="loader"></div>
            </div>
        `;
    } else {
        addFormContainer.innerHTML = '';
    }
}