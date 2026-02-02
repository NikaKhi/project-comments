import { loginApi, getUserApi, setAuthToken, getAuthToken, isAuthenticated as checkAuth, logout as apiLogout } from './api.js';

let currentUser = null;

// Авторизация пользователя
export function login(login, password) {
    return loginApi(login, password)
        .then((response) => {
            if (response && response.user && response.user.token) {
                setAuthToken(response.user.token);
                currentUser = {
                    name: response.user.name,
                    login: response.user.login
                };
                return currentUser;
            } else {
                throw new Error('Некорректный ответ сервера');
            }
        });
}

export function getCurrentUser() {
    if (!checkAuth()) {
        currentUser = null;
        return Promise.resolve(null);
    }

    if (currentUser) {
        return Promise.resolve(currentUser);
    }

    return getUserApi()
        .then((response) => {
            if (response && response.user) {
                currentUser = {
                    name: response.user.name,
                    login: response.user.login
                };
                return currentUser;
            }
            return null;
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

export function setUser(user) {
    currentUser = user;
}