import { getComments as getCommentsApi, addCommentApi as addCommentToApi } from './api.js';

let comments = [];

export function getComments() {
    return getCommentsApi()
        .then((response) => {
            if (response.comments && Array.isArray(response.comments)) {
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
        });
}

// Добавление комментария
export function addComment(text) {
    return addCommentToApi(text)
        .then((response) => {
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