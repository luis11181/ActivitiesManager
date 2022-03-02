import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { Box, Button } from "@mui/material";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { selectNombre } from "../app/mainStateSlice";

export default function MainPage() {
  const authed: boolean | null = useAppSelector(
    (state) => state.main.autenticado
  );
  let navigate = useNavigate();

  const nombre: string | null = useAppSelector(selectNombre);

  if (!authed) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        You are not logged in.
        <Button
          onClick={() => {
            navigate("/signIn");
          }}
        >
          Sign In
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {`Bienvenido ${nombre}`}
      <Button
        onClick={() => {
          signOut(auth);
          navigate("/");
        }}
      >
        Sign out
      </Button>
    </Box>
  );
}
