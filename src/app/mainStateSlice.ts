import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface CounterState {
  autenticado: boolean | null;
  correoUsuario: string | null;
  nombreUsuario: string | null;
  darkMode: boolean;
}

const initialState: CounterState = {
  autenticado: true,
  darkMode: false,
  correoUsuario: null,
  nombreUsuario: null,
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
  },
});

export const { changeAuthState } = mainSlice.actions;
export const { changeNombreUsuario } = mainSlice.actions;
export const { changeCorreoUsuario } = mainSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectAutenticado = (state: RootState) => state.main.autenticado;
export const selectCorreo = (state: RootState) => state.main.correoUsuario;
export const selectNombre = (state: RootState) => state.main.nombreUsuario;

export default mainSlice.reducer;
