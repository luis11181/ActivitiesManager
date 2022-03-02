import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { auth } from "../../firebase";
import { Button, FormControl, InputLabel, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

interface IFormInput {
  //firstName: string;
  email: string;
  password: string;
}

interface IValues {
  showPassword: boolean;
  error: null | string;
}

interface IFromProps {
  from: string;
}

//to auth woth ggog;e
const provider = new GoogleAuthProvider();

const AuthForm: React.FC<IFromProps> = (props): JSX.Element => {
  // let location: any = useLocation();
  // //si hubo una ruta anterio la pone en la variable, en caso contrario lleva a la pronmcipal
  // let from = location.state?.from?.pathname || "/";
  let navigate = useNavigate();

  const [values, setValues] = useState<IValues>({
    showPassword: false,
    error: null,
  });

  const {
    register,
    handleSubmit,
    //watch, // console.log(watch("example")); // watch input value by passing the name of it, and then it can trigger actions if changes
    formState: { errors },
  } = useForm();

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    //alert(JSON.stringify(data));

    // console.log(data);
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);

        //si todo salio bien navega a la pagina de donde venia sin estar autorizado, o a la pagina princeipal
        navigate(props.from, { replace: true });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setValues({
          ...values,
          error: errorMessage,
        });
        // console.log(errorCode, errorMessage);
      });
  };

  const googleRegister = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);

        const token = credential!.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        //si todo salio bien navega a la pagina de donde venia sin estar autorizado, o a la pagina princeipal
        navigate(props.from, { replace: true });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        setValues({
          ...values,
          error: errorMessage,
        });

        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage, email, credential);
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      //center all the text fileds indie the div
    >
      <Typography
        variant="h1"
        component="h1"
        align="center"
        fontSize={30}
        fontWeight="bold"
        gutterBottom
      >
        Sign In
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          //center the form in the middle
        }}
        //noValidate
        //autoComplete="off"
      >
        <TextField
          id="email"
          //required // le pone un asterisco para saber  que es obligatoria
          label="email"
          type="email"
          variant="standard"
          error={errors.email ? true : false}
          helperText={errors.email && errors.email.message}
          //variant="outlined"
          //defaultValue="Hello World"
          {...register("email", {
            pattern: {
              value:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "correo no valido",
            },
            required: { value: true, message: "requerido" },
            // maxLength: { value: 15, message: "nombre muy largo" },
          })}
        />
        <FormControl sx={{ m: 1, width: "25ch" }} variant="filled">
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            //required
            id="password"
            error={errors.password ? true : false}
            type={values.showPassword ? "text" : "password"}
            aria-describedby="password-helper-text"
            // onChange={handleChange("password")}

            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  //  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            {...register("password", {
              required: { value: true, message: "requerido" },
              maxLength: { value: 15, message: "contraseña muy larga" },
            })}
          />
          {errors.password && (
            <FormHelperText
              id="password-helper-text"
              error={errors.password ? true : false}
            >
              {errors.password.message}
            </FormHelperText>
          )}
        </FormControl>
        <Button variant="contained" color="secondary" type="submit">
          Sign In
        </Button>
      </Box>
      <Box sx={{ m: 1 }} />

      <Button onClick={googleRegister}> SignIn with Google</Button>
      <Box sx={{ m: 1 }} />

      <Typography variant="body1" sx={{ color: "red" }}>
        {values.error}
      </Typography>

      <Box sx={{ m: 2 }} />
    </Box>
  );
};

export default AuthForm;
