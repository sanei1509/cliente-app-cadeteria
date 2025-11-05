import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    allEnvios: [],      // Todos los envíos (para KPIs)
    envios: [],         // Envíos filtrados (para tabla)
    areEnviosLoading: false
}

export const enviosSlice = createSlice({
    name: "envios",
    initialState: initialState,
    reducers: {
        setEnvios: (state, action) => {
            // Al cargar envíos, actualizar ambos
            state.allEnvios = action.payload;
            state.envios = action.payload;
        },
        setFilteredEnvios: (state, action) => {
            // Solo actualizar los envíos filtrados
            state.envios = action.payload;
        },
        addEnvio: (state, action) => {
            const newEnvio = action.payload;
            // Agregar a ambos estados
            state.allEnvios.push(newEnvio);
            state.envios.push(newEnvio);
        },
        deleteEnvio: (state, action) => {
            const id = action.payload;
            // Eliminar de ambos estados
            state.allEnvios = state.allEnvios.filter(envio => envio.id !== id);
            state.envios = state.envios.filter(envio => envio.id !== id);
        },
        updateEnvio: (state, action) => {
            const id = action.payload.id;
            const updatedEnvio = action.payload.updatedEnvio;
            // Actualizar en ambos estados
            state.allEnvios = state.allEnvios.map(envio => envio.id === id ? {...envio, ...updatedEnvio} : envio);
            state.envios = state.envios.map(envio => envio.id === id ? {...envio, ...updatedEnvio} : envio);
        },
        setEnviosLoading: (state, action) => {
            state.areEnviosLoading = action.payload;
        }
    }
})

export const {  setEnvios, setFilteredEnvios, addEnvio, deleteEnvio, updateEnvio, setEnviosLoading } = enviosSlice.actions;

export default enviosSlice.reducer;