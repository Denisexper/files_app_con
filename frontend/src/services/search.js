export const searchData = async (search) => {
    try {
        const res = await fetch(`http://localhost:3000/api/users?q=${search}`);

        if (!res.ok) {
            throw new Error(`Error searching data: ${res.statusText}`);
        }

        const json = await res.json();

        // Verifica si json.data existe antes de devolverlo
        if (!json.data) {
            throw new Error("No data found in the response");
        }

        return json.data; // Devuelve solo los datos en caso de éxito

    } catch (error) {
        // Lanza el error para que sea manejado por el código que llama a esta función
        throw error instanceof Error ? error : new Error("An unknown error occurred");
    }
};