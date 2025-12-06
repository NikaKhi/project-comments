import { renderComments } from './modules/render.js';
import { initEventHandlers } from './modules/eventHandlers.js';
import { fetchComments } from './modules/comments.js';

async function initApp() {
    console.log('🚀 ===== ЗАПУСК ПРИЛОЖЕНИЯ =====');

    const commentsList = document.querySelector('.comments');
    commentsList.innerHTML = '<div style="color: white; text-align: center; padding: 20px;">Загрузка комментариев...</div>';

    try {
        console.log('1. 📥 Загружаем комментарии из API...');
        await fetchComments();

        console.log('2. 🎨 Рендерим комментарии...');
        renderComments();

        console.log('3. ⚙️ Инициализируем обработчики событий...');
        initEventHandlers();

        console.log('✅ ===== ПРИЛОЖЕНИЕ ЗАПУЩЕНО УСПЕШНО =====');

    } catch (error) {
        console.error('❌ ===== ОШИБКА ЗАПУСКА =====', error);
        commentsList.innerHTML = `
      <div style="color: #bcec30; text-align: center; padding: 20px;">
        <p>Ошибка: ${error.message}</p>
        <button onclick="location.reload()" style="background: #bcec30; color: #000; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
          Обновить страницу
        </button>
      </div>
    `;
    }
}

// Запускаем когда DOM готов
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}