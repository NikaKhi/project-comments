import { renderComments } from './modules/render.js';
import { initEventHandlers } from './modules/eventHandlers.js';
import { fetchComments } from './modules/comments.js';

async function initApp() {
    const commentsList = document.querySelector('.comments');
    const loadingElement = document.querySelector('.loading');

    // Показываем лоадер при загрузке
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }

    commentsList.innerHTML = '';

    try {
        await fetchComments();
        renderComments();
        initEventHandlers();

    } catch (error) {
        // Показываем alert с ошибкой загрузки
        if (error.message === "Кажется, у вас сломался интернет, попробуйте позже" ||
            error.message === "Сервер сломался, попробуй позже") {
            alert(error.message);
        }

        commentsList.innerHTML = `
      <div style="color: #bcec30; text-align: center; padding: 20px;">
        <p>Не удалось загрузить комментарии</p>
        <button onclick="location.reload()" style="background: #bcec30; color: #000; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
          Попробовать снова
        </button>
      </div>
    `;
    } finally {
        // Скрываем лоадер
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}