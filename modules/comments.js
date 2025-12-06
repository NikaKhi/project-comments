import { getComments, postComment } from './api.js';

export let comments = [];

export async function fetchComments() {
    try {
        comments = await getComments();

        // Добавляем поле isLiked для локального хранения лайков
        comments.forEach(comment => {
            comment.isLiked = false;
        });

        return comments;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        comments = [];
        throw error;
    }
}

export async function addComment({ name, text }) {
    try {
        const response = await postComment({ name, text });

        // Добавляем локальное поле isLiked
        const newComment = {
            ...response,
            isLiked: false
        };

        comments.push(newComment);
        return newComment;
    } catch (error) {
        console.error('Ошибка добавления:', error);
        throw error;
    }
}

export function updateCommentLikes(commentId) {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
        comment.isLiked = !comment.isLiked;
        comment.likes += comment.isLiked ? 1 : -1;
        return true;
    }
    return false;
}

export function getCommentById(commentId) {
    return comments.find(comment => comment.id === commentId);
}