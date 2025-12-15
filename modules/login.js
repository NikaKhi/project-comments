import { login } from './auth.js';
import { renderApp } from '../main.js';

export function renderLoginPage() {
    const container = document.querySelector('.container');

    container.innerHTML = `
        <div class="login-container">
            <h2 style="color: white; text-align: center; margin-bottom: 30px;">Вход в систему</h2>
            
            <form class="login-form">
                <div class="form-group">
                    <input 
                        type="text" 
                        class="login-input" 
                        placeholder="Логин" 
                        required 
                    />
                </div>
                
                <div class="form-group">
                    <input 
                        type="password" 
                        class="password-input" 
                        placeholder="Пароль" 
                        required 
                    />
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="login-button">Войти</button>
                </div>
                
                <div class="login-error" style="color: #ff6b6b; text-align: center; margin-top: 15px; display: none;"></div>
            </form>
            
            <div class="back-link" style="text-align: center; margin-top: 20px;">
                <a href="#" class="back-to-comments" style="color: #bcec30; text-decoration: none;">← Вернуться к комментариям</a>
            </div>
        </div>
    `;

    // Обработчики
    const loginForm = document.querySelector('.login-form');
    const loginError = document.querySelector('.login-error');
    const backLink = document.querySelector('.back-to-comments');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const loginInput = document.querySelector('.login-input');
        const passwordInput = document.querySelector('.password-input');
        const loginButton = document.querySelector('.login-button');

        const loginValue = loginInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        if (!loginValue || !passwordValue) {
            showError('Заполните все поля');
            return;
        }

        loginButton.disabled = true;
        loginButton.textContent = 'Вход...';

        login(loginValue, passwordValue)
            .then(() => {
                renderApp();
            })
            .catch((error) => {
                showError(error.message || 'Ошибка авторизации');
            })
            .finally(() => {
                loginButton.disabled = false;
                loginButton.textContent = 'Войти';
            });
    });

    backLink.addEventListener('click', function (e) {
        e.preventDefault();
        renderApp();
    });

    function showError(message) {
        loginError.textContent = message;
        loginError.style.display = 'block';
    }
}