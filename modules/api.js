const BASE_URL_V2 = "https://wedev-api.sky.pro/api/v2/nika-khaimina/comments";
const LOGIN_URL = "https://wedev-api.sky.pro/api/user/login";
const USER_URL = "https://wedev-api.sky.pro/api/user";

let authToken = localStorage.getItem('authToken') || null;

export function setAuthToken(token) {
    authToken = token;
    if (token) {
        localStorage.setItem('authToken', token);
    } else {
        localStorage.removeItem('authToken');
    }
}

export function getAuthToken() {
    return authToken;
}

export function isAuthenticated() {
    return !!authToken;
}

export function logout() {
    setAuthToken(null);
}

function getHeaders(withAuth = true) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (withAuth && authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    return headers;
}

// GET запрос для получения комментариев
export function getComments() {
    return fetch(BASE_URL_V2, {
        headers: getHeaders(false)
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status}`);
        }
        return response.json();
    });
}

// POST запрос для добавления комментария
export function addCommentApi(text) {
    return fetch(BASE_URL_V2, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify({ text })
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`Ошибка добавления: ${response.status}`);
        }
        return response.json();
    });
}

// POST запрос для авторизации
export function loginApi(login, password) {
    return fetch(LOGIN_URL, {
        method: "POST",
        headers: getHeaders(false),
        body: JSON.stringify({ login, password })
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`Ошибка авторизации: ${response.status}`);
        }
        return response.json();
    });
}

// GET запрос для получения данных пользователя
export function getUserApi() {
    return fetch(USER_URL, {
        headers: getHeaders(true)
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`Ошибка получения пользователя: ${response.status}`);
        }
        return response.json();
    });
}