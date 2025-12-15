import { renderComments, renderAuthSection, renderAddForm } from './modules/render.js';
import { initEventHandlers } from './modules/eventHandlers.js';
import { getComments } from './modules/comments.js';
import { getCurrentUser } from './modules/auth.js';
import { renderLoginPage } from './modules/login.js';

export function renderApp() {
    const container = document.querySelector('.container');

    container.innerHTML = `
        <!-- Лоадер при загрузке комментариев -->
        <div class="loading" style="display: none;">
            <div style="margin-bottom: 15px;">Загрузка комментариев...</div>
            <div class="loader"></div>
        </div>

        <!-- Секция авторизации -->
        <div class="auth-section"></div>

        <!-- Список комментариев -->
        <ul class="comments"></ul>

        <!-- Форма добавления комментария -->
        <div class="add-form-container"></div>
    `;


    loadAndRenderApp();
}

async function loadAndRenderApp() {
    const loadingElement = document.querySelector('.loading');
    const commentsList = document.querySelector('.comments');

    if (loadingElement) {
        loadingElement.style.display = 'block';
    }

    if (commentsList) {
        commentsList.innerHTML = '';
    }

    try {
        
        await getComments();

        await getCurrentUser();

        renderComments();
        renderAuthSection();
        renderAddForm();

        initEventHandlers();

    } catch (error) {
        console.error('Ошибка загрузки:', error);
        if (commentsList) {
            commentsList.innerHTML = `
                <div style="color: #ff6b6b; text-align: center; padding: 20px;">
                    <p>Не удалось загрузить комментарии</p>
                    <button onclick="location.reload()" style="background: #bcec30; color: #000; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                        Попробовать снова
                    </button>
                </div>
            `;
        }
    } finally {
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
}

function initApp() {
    renderApp();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}