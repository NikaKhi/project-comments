import { comments, toggleLike, addComment, getCommentById } from './comments.js';
import { renderComments } from './render.js';
import { sanitizeHTML } from './sanitize.js';

let formData = {
    name: '',
    text: ''
};

let eventListenersInitialized = false;

export function initEventHandlers() {
    if (eventListenersInitialized) return;

    const nameInput = document.querySelector('.add-form-name');
    const textInput = document.querySelector('.add-form-text');

    if (nameInput && textInput) {
        nameInput.addEventListener('input', (e) => {
            formData.name = e.target.value;
        });

        textInput.addEventListener('input', (e) => {
            formData.text = e.target.value;
        });

        if (formData.name) nameInput.value = formData.name;
        if (formData.text) textInput.value = formData.text;
    }

    // кнопка "Написать"
    const addButton = document.querySelector('.add-form-button');
    if (addButton) {
        addButton.addEventListener('click', handleAddComment);
    }

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

        const commentElement = event.target.closest('.comment');
        if (commentElement && !event.target.classList.contains('like-button')) {
            const commentId = commentElement.dataset.id;
            const comment = getCommentById(commentId);
            const commentInput = document.querySelector('.add-form-text');

            if (comment && commentInput) {
                commentInput.value = `> ${sanitizeHTML(comment.name)}: ${sanitizeHTML(comment.text)}\n\n`;
                commentInput.focus();
            
                formData.text = commentInput.value;
            }
        }
    });

    eventListenersInitialized = true;
}

function validateForm(name, text) {
    if (name.length < 3 || text.length < 3) {
        alert('Имя и комментарий должны быть не короче 3 символов');
        return false;
    }
    return true;
}

async function handleAddComment() {
    const nameInput = document.querySelector('.add-form-name');
    const commentInput = document.querySelector('.add-form-text');
    const addButton = document.querySelector('.add-form-button');
    const addForm = document.querySelector('.add-form');
    const loadingIndicator = document.querySelector('.loading-add');

    if (!nameInput || !commentInput || !addButton || !addForm) return;

    const name = nameInput.value.trim();
    const commentText = commentInput.value.trim();

    if (!validateForm(name, commentText)) {
        formData.name = name;
        formData.text = commentText;
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
        await addComment({
            name,
            text: commentText,
            forceError: false 
        });

        // Очищаем форму и данные
        nameInput.value = '';
        commentInput.value = '';
        formData.name = '';
        formData.text = '';

        renderComments();

    } catch (error) {
        nameInput.value = formData.name;
        commentInput.value = formData.text;

        // Показываем alert с текстом ошибки
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