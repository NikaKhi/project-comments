import { loginApi, getUserApi, setAuthToken, getAuthToken, isAuthenticated as checkAuth, logout as apiLogout } from './api.js';

let currentUser = null;

// Авторизация пользователя
export function login(login, password) {
    return loginApi(login, password)
        .then((response) => {
            setAuthToken(response.user.token);
            currentUser = {
                name: response.user.name,
                login: response.user.login
            };
            return currentUser;
        });
}

export function getCurrentUser() {
    if (!checkAuth()) {
        currentUser = null;
        return Promise.resolve(null);
    }

    return getUserApi()
        .then((response) => {
            currentUser = {
                name: response.user.name,
                login: response.user.login
            };
            return currentUser;
        })
        .catch(() => {
            currentUser = null;
            return null;
        });
}

// Выход из системы
export function logout() {
    apiLogout();
    currentUser = null;
}

export function isAuthenticated() {
    return checkAuth();
}

export function getUser() {
    return currentUser;
}