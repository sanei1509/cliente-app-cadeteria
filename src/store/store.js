import { configureStore } from "@reduxjs/toolkit";
import enviosReducer from "../features/enviosSlice";

export const store = configureStore ({
    reducer: {
        todos: enviosReducer
    }
})
 