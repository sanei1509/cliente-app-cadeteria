import { createSlice } from "@reduxjs/toolkit";

// Cargar usuario desde localStorage si existe
const loadUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error loading user from localStorage:", error);
    return null;
  }
};

const initialState = {
  user: loadUserFromStorage(),
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      // Sincronizar con localStorage
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },
    updateUserPlan: (state, action) => {
      if (state.user) {
        state.user.plan = action.payload;
        // Actualizar también en localStorage
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    clearUser: (state) => {
      state.user = null;
      // Limpiar localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const {
  setUser,
  updateUserPlan,
  clearUser,
} = userSlice.actions;

// Selectores
export const selectUser = (state) => state.user.user;
export const selectUserPlan = (state) => state.user.user?.plan || "plus";
export const selectUserName = (state) =>
  state.user.user?.nombre || state.user.user?.username || "Usuario";

export default userSlice.reducer;
