const BASE_URL = "https://wedev-api.sky.pro/api/v1/nika-khaimina/comments";

export async function getComments() {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error("Ошибка загрузки");
        const data = await response.json();
        return data.comments;
    } catch (error) {
        console.error("Ошибка:", error);
        throw error;
    }
}

export async function postComment({ name, text }) {
    try {
        // Создаем FormData вместо JSON
        const formData = new FormData();
        formData.append('name', name);
        formData.append('text', text);

        const response = await fetch(BASE_URL, {
            method: "POST",
            // НЕ добавляем Content-Type заголовок!
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка ${response.status}: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Ошибка отправки:", error);
        throw error;
    }
}