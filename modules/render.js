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

  comments.forEach(comment => {
    const likeClass = comment.isLiked ? ' -active-like' : '';

    // Форматируем дату
    let displayDate = 'Только что';
    if (comment.date) {
      try {
        const date = new Date(comment.date);
        if (!isNaN(date.getTime())) {
          const now = new Date();
          const diffMs = now - date;
          const diffMins = Math.floor(diffMs / 60000);

          if (diffMins < 1) {
            displayDate = 'Только что';
          } else if (diffMins < 60) {
            displayDate = `${diffMins} минут назад`;
          } else {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear().toString().slice(-2);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            displayDate = `${day}.${month}.${year} ${hours}:${minutes}`;
          }
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

  console.log(' Рендер завершен');
}