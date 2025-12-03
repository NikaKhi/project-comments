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
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                text: text.replace(/</g, "&lt;").replace(/>/g, "&gt;")
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Ошибка сервера:", errorText);
            throw new Error(`Ошибка ${response.status}: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Ошибка отправки:", error);
        throw error;
    }
}