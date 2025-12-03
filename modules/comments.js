import { getComments, postComment } from './api.js';

export let comments = [];

export async function fetchComments() {
    try {
        const commentsFromAPI = await getComments();
        comments = commentsFromAPI.map(comment => ({
            ...comment,
            isLiked: false
        }));
        console.log('Загружено комментариев:', comments.length);
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

        const newComment = {
            ...response,
            isLiked: false,
            likes: 0
        };

        comments.push(newComment);
        console.log('Добавлен комментарий:', newComment);
        return newComment;
    } catch (error) {
        console.error('Ошибка добавления:', error);
        throw error;
    }
}

export function updateComment(commentId, updates) {
    const commentIndex = comments.findIndex(comment => comment.id === commentId);
    if (commentIndex !== -1) {
        comments[commentIndex] = { ...comments[commentIndex], ...updates };
        return true;
    }
    return false;
}

export function getCommentById(commentId) {
    return comments.find(comment => comment.id === commentId);
}