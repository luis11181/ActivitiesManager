import { createTheme, styled } from "@mui/material/styles";
import { orange } from "@mui/material/colors";
import type {} from "@mui/lab/themeAugmentation"; //to add material ui lab items
declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const theme = createTheme({
  status: {
    danger: orange[500],
  },
  palette: {
    mode: "light", //define el modo y de forma automatica el "dark para los colores a otro estilo"
    primary: {
      light: "#757ce8",
      main: "#3f50b5",
      dark: "#002884",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
    success: {
      main: "#009688", //todos los que fefina deben tener un main
      dark: "#009688",
    },
  },
});

export default theme;
