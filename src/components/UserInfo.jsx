 export const getUserInfo = () => {
        try {
            const userStr = localStorage.getItem("user");
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error("Error al parsear user:", error);
            return null;
        }
    };

     