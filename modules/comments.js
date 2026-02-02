import { getComments as getCommentsApi, addCommentApi as addCommentToApi } from './api.js';

let comments = [];

export function getComments() {
    return getCommentsApi()
        .then((response) => {
            if (response && response.comments && Array.isArray(response.comments)) {
                comments = response.comments.map(comment => ({
                    id: comment.id,
                    name: comment.author.name,
                    date: comment.date,
                    text: comment.text,
                    likes: comment.likes,
                    isLiked: false,
                    isAuthor: comment.isAuthor || false
                }));
            } else {
                comments = [];
            }
            return comments;
        })
        .catch((error) => {
            console.error('Ошибка загрузки комментариев:', error);
            comments = [];
            throw error;
        });
}

// Добавление комментария
export function addComment(text) {
    if (!text || text.trim().length < 3) {
        return Promise.reject(new Error('Комментарий должен быть не короче 3 символов'));
    }

    return addCommentToApi(text.trim())
        .then((response) => {
            if (response && response.comment) {
                const newComment = {
                    id: response.comment.id,
                    name: response.comment.author.name,
                    date: response.comment.date,
                    text: response.comment.text,
                    likes: response.comment.likes,
                    isLiked: false,
                    isAuthor: true
                };

                comments.push(newComment);
                return newComment;
            } else {
                throw new Error('Некорректный ответ сервера');
            }
        });
}

// Лайк 
export function toggleLike(commentId) {
    const comment = comments.find(c => c.id.toString() === commentId.toString());
    if (comment) {
        comment.isLiked = !comment.isLiked;
        comment.likes += comment.isLiked ? 1 : -1;
        return true;
    }
    return false;
}

export function getCommentById(commentId) {
    return comments.find(comment => comment.id.toString() === commentId.toString());
}

export function getAllComments() {
    return comments;
}