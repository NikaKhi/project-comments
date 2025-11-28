const BASE_URL = "https://wedev-api.sky.pro/api/v1/nika-khaimina/comments";

export async function getComments() {
    try {
        const response = await fetch(BASE_URL, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error("Ошибка при загрузке комментариев");
        }

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
                name: name,
                text: text
            })
        });

        if (!response.ok) {
            throw new Error("Ошибка при отправке комментария");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Ошибка:", error);
        throw error;
    }
}