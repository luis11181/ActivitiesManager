import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
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

interface IFormInput {
  name: string;
  email: string;
  password: string;
}

interface IValues {
  showPassword: boolean;
  error: null | string;
}

//to auth woth ggog;e
const provider = new GoogleAuthProvider();
const googleRegister = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential!.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log(user);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorCode, errorMessage, email, credential);
    });
};

const AuthForm = () => {
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
    // alert(JSON.stringify(data));

   // console.log(data);

    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        updateProfile(user, {
          displayName: data.name,
          //photoURL: `https://gravatar.com/avatar${md5(user.email)}?d=identicon`,
        }).then(function () {
          console.log(`Profile updated.`);

          console.log(user);
        });
        //    sendEmailVerification(auth.currentUser).then(() => {
        // Email verification sent!
        // ...
        //});
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setValues({
          ...values,
          error: errorMessage,
        });
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
        Sign Up
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
          //required // le pone un asterisco para saber  que es obligatoria
          id="name"
          label="name"
          variant="standard"
          error={errors.name ? true : false}
          helperText={errors.name && errors.name.message}
          //variant="outlined"
          //defaultValue="Hello World"
          {...register("name", {
            required: { value: true, message: "requerido" },
            maxLength: { value: 15, message: "nombre muy largo" },
          })}
        />

        <TextField
          // required // le pone un asterisco para saber  que es obligatoria
          id="email"
          label="email"
          type="email"
          variant="standard"
          error={errors.email ? true : false}
          helperText={errors.email && errors.email.message}
          //variant="outlined"
          //defaultValue="Hello World"
          {...register("email", {
            required: { value: true, message: "requerido" },
            pattern: {
              value:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "correo no valido",
            },
            // maxLength: { value: 15, message: "nombre muy largo" },
          })}
        />
        <FormControl sx={{ m: 1, width: "25ch" }} variant="filled">
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            //required
            id="password"
            type={values.showPassword ? "text" : "password"}
            aria-describedby="password-helper-text"
            error={errors.password ? true : false}
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
          Sign Up
        </Button>
      </Box>

      <Box sx={{ m: 1 }} />

      <Button onClick={googleRegister}> SignUp with Google</Button>
      <Box sx={{ m: 1 }} />

      <Typography variant="body1" sx={{ color: "red" }}>
        {values.error}
      </Typography>

      <Box sx={{ m: 2 }} />
    </Box>
  );
};

export default AuthForm;
