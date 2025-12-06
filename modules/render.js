import { sanitizeHTML } from './sanitize.js';
import { comments } from './comments.js';

export function renderComments() {
  console.log(' Рендер комментариев...');

  const commentsList = document.querySelector('.comments');

  if (!commentsList) {
    console.error(' Элемент .comments не найден!');
    return;
  }

  commentsList.innerHTML = '';

  if (comments.length === 0) {
    commentsList.innerHTML = '<div style="color: white; text-align: center; padding: 20px;">Нет комментариев</div>';
    console.log(' Нет комментариев для отображения');
    return;
  }

  console.log(` Отображаем ${comments.length} комментариев`);

  // Массив русских названий месяцев
  const monthNames = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];

  comments.forEach(comment => {
    const likeClass = comment.isLiked ? ' -active-like' : '';

    // Форматируем дату в формате "17 декабря 2023 г. 15:48"
    let displayDate = 'Только что';

    if (comment.date) {
      try {
        const date = new Date(comment.date);
        if (!isNaN(date.getTime())) {
          const now = new Date();
          const diffMs = now - date;
          const diffMins = Math.floor(diffMs / 60000);

          // Если комментарий создан менее 1 минуты назад
          if (diffMins < 1) {
            displayDate = 'Только что';
          } else {
            const day = date.getDate();
            const month = monthNames[date.getMonth()];
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');

            displayDate = `${day} ${month} ${year} г. ${hours}:${minutes}`;
          }
        }
      } catch (e) {
        console.error('Ошибка форматирования даты:', e);
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

  console.log(' Рендер завершен');
}