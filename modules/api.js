const BASE_URL = "https://wedev-api.sky.pro/api/v1/nika-khaimina/comments";

export async function getComments() {
    try {
        console.log('GET запрос к:', BASE_URL);
        const response = await fetch(BASE_URL);
        console.log('GET статус:', response.status);

        if (!response.ok) throw new Error("Ошибка загрузки");

        const data = await response.json();
        console.log('GET ответ:', data);
        return data;
    } catch (error) {
        console.error("GET ошибка:", error);
        throw error;
    }
}

export async function postComment({ name, text }) {
    try {
        console.log('POST запрос с:', { name, text });

        const response = await fetch(BASE_URL, {
            method: "POST",
            body: JSON.stringify({
                name: name,
                text: text
            })
        });

        console.log('POST статус:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('POST ошибка текст:', errorText);
            throw new Error(`Ошибка ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('POST ответ:', data);
        return data;
    } catch (error) {
        console.error("POST ошибка:", error);
        throw error;
    }
}