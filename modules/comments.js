import { getComments, postComment } from './api.js';

export let comments = [];

export async function fetchComments() {
    try {
        const apiResponse = await getComments();

        if (apiResponse.comments && Array.isArray(apiResponse.comments)) {
            comments = apiResponse.comments.map(comment => ({
                id: comment.id,
                name: comment.author?.name || comment.name || 'Аноним',
                date: comment.date || new Date().toISOString(),
                text: comment.text || '',
                likes: comment.likes || 0,
                isLiked: false
            }));
        } else if (Array.isArray(apiResponse)) {
            comments = apiResponse.map(comment => ({
                id: comment.id,
                name: comment.author?.name || comment.name || 'Аноним',
                date: comment.date || new Date().toISOString(),
                text: comment.text || '',
                likes: comment.likes || 0,
                isLiked: false
            }));
        } else {
            comments = [];
        }

        return comments;
    } catch (error) {
        throw error;
    }
}

export async function addComment({ name, text, forceError = false }) {
    try {
        const apiResponse = await postComment({ name, text, forceError });

        let newComment;

        if (apiResponse.comment) {
            newComment = {
                id: apiResponse.comment.id,
                name: apiResponse.comment.author?.name || name,
                date: apiResponse.comment.date || new Date().toISOString(),
                text: apiResponse.comment.text || text,
                likes: apiResponse.comment.likes || 0,
                isLiked: false
            };
        } else if (apiResponse.id) {
            newComment = {
                id: apiResponse.id,
                name: apiResponse.author?.name || apiResponse.name || name,
                date: apiResponse.date || new Date().toISOString(),
                text: apiResponse.text || text,
                likes: apiResponse.likes || 0,
                isLiked: false
            };
        } else {
            newComment = {
                id: Date.now(),
                name: name,
                date: new Date().toISOString(),
                text: text,
                likes: 0,
                isLiked: false
            };
        }

        comments.push(newComment);
        return newComment;
    } catch (error) {
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
    return false;
}

export function getCommentById(commentId) {
    return comments.find(comment => comment.id.toString() === commentId.toString());
}