import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    envios: [],
    areEnviosLoading: false
}

export const enviosSlice = createSlice({
    name: "envios",
    initialState: initialState,
    reducers: {
        setEnvios: (state, action) => {
            state.envios = action.payload;
        },
        addEnvio: (state, action) => {
            const newEnvio = action.payload;
            //immer
            state.envios.push(newEnvio);
        },
        deleteEnvio: (state, action) => {
            const id = action.payload;
            state.envios = state.envios.filter(envio => envio.id !== id)
        },
        updateEnvio: (state, action) => {
            const id = action.payload.id;
            const updatedEnvio = action.payload.updatedEnvio;

           // const {id, updatedTodo} = action.payload
            state.envios = state.envios.map(envio => envio.id === id ? {...envio, ...updatedEnvio} : envio)
        },
        setEnviosLoading: (state, action) => {
            //action.payload
            state.areEnviosLoading = action.payload;
        }
    }
})

export const {  setEnvios, addEnvio, deleteEnvio, updateEnvio, setEnviosLoading } = enviosSlice.actions;

export default enviosSlice.reducer;