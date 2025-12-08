import { getComments, postComment } from './api.js';

export let comments = [];

export async function fetchComments() {
    try {
        const apiResponse = await getComments();
        console.log('API Response structure:', apiResponse);

        // Проверяем разные варианты структуры ответа
        if (apiResponse.comments && Array.isArray(apiResponse.comments)) {
            comments = apiResponse.comments.map(comment => {
                console.log('Comment structure:', comment);
                return {
                    id: comment.id,
                    name: comment.author?.name || comment.name || 'Аноним',
                    date: comment.date || new Date().toISOString(),
                    text: comment.text || '',
                    likes: comment.likes || 0,
                    isLiked: false
                };
            });
        } else if (Array.isArray(apiResponse)) {
            // Если API возвращает массив напрямую
            comments = apiResponse.map(comment => ({
                id: comment.id,
                name: comment.author?.name || comment.name || 'Аноним',
                date: comment.date || new Date().toISOString(),
                text: comment.text || '',
                likes: comment.likes || 0,
                isLiked: false
            }));
        } else {
            console.error('Неизвестный формат ответа API:', apiResponse);
            comments = [];
        }

        console.log('Преобразованные комментарии:', comments);
        return comments;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        comments = [];
        throw error;
    }
}

export async function addComment({ name, text }) {
    try {
        console.log('Добавляем комментарий:', { name, text });

        const apiResponse = await postComment({ name, text });
        console.log('POST Response:', apiResponse);

        // Проверяем разные варианты структуры ответа
        let newComment;

        if (apiResponse.comment) {
            // Вариант 1: { comment: { ... } }
            newComment = {
                id: apiResponse.comment.id,
                name: apiResponse.comment.author?.name || name,
                date: apiResponse.comment.date || new Date().toISOString(),
                text: apiResponse.comment.text || text,
                likes: apiResponse.comment.likes || 0,
                isLiked: false
            };
        } else if (apiResponse.id) {
            // Вариант 2: { id, name, text, date, likes, ... }
            newComment = {
                id: apiResponse.id,
                name: apiResponse.author?.name || apiResponse.name || name,
                date: apiResponse.date || new Date().toISOString(),
                text: apiResponse.text || text,
                likes: apiResponse.likes || 0,
                isLiked: false
            };
        } else {
            // Вариант 3: создаем вручную
            console.warn('Непонятный формат ответа, создаем комментарий вручную');
            newComment = {
                id: Date.now(),
                name: name,
                date: new Date().toISOString(),
                text: text,
                likes: 0,
                isLiked: false
            };
        }

        console.log('Созданный комментарий:', newComment);
        comments.push(newComment);
        return newComment;
    } catch (error) {
        console.error('Ошибка добавления:', error);
        throw error;
    }
}

export function toggleLike(commentId) {
    const comment = comments.find(c => c.id.toString() === commentId.toString());
    if (comment) {
        comment.isLiked = !comment.isLiked;
        comment.likes += comment.isLiked ? 1 : -1;
        return true;
    }
    console.log('Комментарий для лайка не найден:', commentId, comments);
    return false;
}

export function getCommentById(commentId) {
    return comments.find(comment => comment.id.toString() === commentId.toString());
}