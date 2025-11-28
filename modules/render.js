import { sanitizeHTML } from './sanitize.js';
import { comments } from './comments.js';
import { addLikeEventListeners, addCommentClickEventListeners } from './eventHandlers.js';

export function renderComments() {
  const commentsList = document.querySelector('.comments');

  if (!commentsList) {
    console.error('Элемент .comments не найден!');
    return;
  }

  commentsList.innerHTML = '';

  comments.forEach(comment => {
    const likeClass = comment.isLiked ? ' -active-like' : '';

    const commentHTML = `
      <li class="comment" data-id="${comment.id}">
        <div class="comment-header">
          <div>${sanitizeHTML(comment.name)}</div>
          <div>${formatDate(comment.date)}</div>
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

  addLikeEventListeners();
  addCommentClickEventListeners();

  console.log('Комментарии отрендерены: ' + comments.length);
}

function formatDate(apiDate) {
  if (!apiDate) return '';

  if (apiDate.includes('T')) {
    const date = new Date(apiDate);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear().toString().slice(-2)} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  return apiDate;
}