import { configureStore } from "@reduxjs/toolkit";
import enviosReducer from "../features/enviosSlice";
import userReducer from "../features/userSlice";

export const store = configureStore ({
    reducer: {
        envios: enviosReducer,
        user: userReducer
    }
})
 