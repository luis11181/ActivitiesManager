import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface CounterState {
  autenticado: boolean | null;
  correoUsuario: string | null;
  nombreUsuario: string | null;
  rol: string | null;
  userId: string | null;
  JWTToken: string | null;
  JWTFechaExpiracion: string | null;
  darkMode: boolean;
}

const initialState: CounterState = {
  autenticado: true,
  darkMode: false,
  rol: localStorage.getItem("rol"),
  correoUsuario: null,
  nombreUsuario: localStorage.getItem("nombreUsuario"),
  JWTToken: localStorage.getItem("JWTToken"),
  JWTFechaExpiracion: localStorage.getItem("JWTFechaExpiracion"),
  userId: localStorage.getItem("userId"),
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    changeAuthState: (state, action: PayloadAction<boolean | null>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      state.autenticado = action.payload;
    },
    changeCorreoUsuario: (state, action: PayloadAction<string | null>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      state.correoUsuario = action.payload;
    },
    changeNombreUsuario: (state, action: PayloadAction<string | null>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      state.nombreUsuario = action.payload;
    },
    changeJwtToken: (state, action: PayloadAction<string | null>) => {
      state.JWTToken = action.payload;
    },
    changeJWTFechaExpiracion: (state, action: PayloadAction<string | null>) => {
      state.JWTFechaExpiracion = action.payload;
    },
    changeUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
    },
    changeRol: (state, action: PayloadAction<string | null>) => {
      state.rol = action.payload;
    },
  },
});

export const { changeAuthState } = mainSlice.actions;
export const { changeNombreUsuario } = mainSlice.actions;
export const { changeCorreoUsuario } = mainSlice.actions;
export const { changeJwtToken } = mainSlice.actions;
export const { changeJWTFechaExpiracion } = mainSlice.actions;
export const { changeUserId } = mainSlice.actions;
export const { changeRol } = mainSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectAutenticado = (state: RootState) => state.main.autenticado;
export const selectCorreo = (state: RootState) => state.main.correoUsuario;
export const selectNombre = (state: RootState) => state.main.nombreUsuario;
export const selectJWTToken = (state: RootState) => state.main.JWTToken;
export const selectJWTFechaExpiracion = (state: RootState) =>
  state.main.JWTFechaExpiracion;
export const selectUserId = (state: RootState) => state.main.userId;
export const selectRol = (state: RootState) => state.main.rol;

export default mainSlice.reducer;
