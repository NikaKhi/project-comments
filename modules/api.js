const BASE_URL = "https://wedev-api.sky.pro/api/v1/nika-khaimina/comments";

export async function getComments() {
    try {
        const response = await fetch(BASE_URL);

        if (response.status === 500) {
            throw new Error("Сервер сломался, попробуй позже");
        }

        if (!response.ok) {
            throw new Error("Ошибка загрузки комментариев");
        }

        return await response.json();
    } catch (error) {
        // Обработка ошибки сети
        if (error.name === "TypeError" && error.message === "Failed to fetch") {
            throw new Error("Кажется, у вас сломался интернет, попробуйте позже");
        }
        throw error;
    }
}

export async function postComment({ name, text, forceError = false }) {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            body: JSON.stringify({
                name: name,
                text: text,
                forceError: forceError
            })
        });

        // Обработка 400 ошибки 
        if (response.status === 400) {
            throw new Error("Имя и комментарий должны быть не короче 3 символов");
        }

        // Обработка 500 ошибки
        if (response.status === 500) {
            throw new Error("Сервер сломался, попробуй позже");
        }

        if (!response.ok) {
            throw new Error("Ошибка при добавлении комментария");
        }

        return await response.json();
    } catch (error) {
        // Обработка ошибки сети
        if (error.name === "TypeError" && error.message === "Failed to fetch") {
            throw new Error("Кажется, у вас сломался интернет, попробуйте позже");
        }
        throw error;
    }
}