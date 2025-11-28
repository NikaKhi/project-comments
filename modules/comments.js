import { getComments, postComment } from './api.js';

export let comments = [];

export async function fetchComments() {
    try {
        console.log('Загрузка комментариев из API...');
        const commentsFromAPI = await getComments();

        comments = commentsFromAPI.map(comment => ({
            ...comment,
            isLiked: false,
            likes: comment.likes || 0
        }));

        console.log('Комментарии загружены:', comments.length);
        return comments;
    } catch (error) {
        console.error('Ошибка загрузки комментариев:', error);
        comments = [];
        throw error;
    }
}

export async function addComment({ name, text }) {
    try {
        console.log('Отправка комментария в API...');
        const response = await postComment({ name, text });

        const newComment = {
            ...response,
            isLiked: false
        };

        comments.push(newComment);
        console.log('Комментарий добавлен:', newComment);
        return newComment;
    } catch (error) {
        console.error('Ошибка добавления комментария:', error);
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