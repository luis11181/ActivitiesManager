import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { SubmitHandler, useForm } from "react-hook-form";
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
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  password: string;
}

interface IValues {
  showPassword: boolean;
  error: null | string;
}

const AuthForm = () => {
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

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    // alert(JSON.stringify(data));

    // console.log(data);

    try {
      let resultFetch = await fetch(
        `${process.env.REACT_APP_BACKENDURL}/auth/signup`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
          }),
        }
      );

      let resultFetchJson = await resultFetch.json();

      if (resultFetch.status === 422) {
        throw new Error(resultFetchJson.message || "Error al crear el usuario");
      }

      if (!resultFetch.ok) {
        throw new Error(resultFetchJson.message);
        // throw new Error("fallo el inicio de sesion!");
      }

      console.log(resultFetchJson);

      navigate("/");
    } catch (err: any) {
      const errorMessage = err.message;
      console.log(err);
      setValues({
        ...values,
        error: errorMessage,
      });
    }
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
          id="firstName"
          label="firstName"
          variant="standard"
          error={errors.firstName ? true : false}
          helperText={errors.firstName && errors.firstName.message}
          //variant="outlined"
          //defaultValue="Hello World"
          {...register("firstName", {
            required: { value: true, message: "requerido" },
            maxLength: { value: 15, message: "nombre muy largo" },
          })}
        />

        <TextField
          //required // le pone un asterisco para saber  que es obligatoria
          id="lastName"
          label="lastName"
          variant="standard"
          error={errors.lastName ? true : false}
          helperText={errors.lastName && errors.lastName.message}
          //variant="outlined"
          //defaultValue="Hello World"
          {...register("lastName", {
            required: { value: true, message: "requerido" },
            maxLength: { value: 15, message: "nombre muy largo" },
          })}
        />

        <TextField
          //required // le pone un asterisco para saber  que es obligatoria
          id="role"
          label="role"
          variant="standard"
          error={errors.role ? true : false}
          helperText={errors.role && errors.role.message}
          //variant="outlined"
          //defaultValue="Hello World"
          {...register("role", {
            required: { value: true, message: "requerido" },
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

      <Typography variant="body1" sx={{ color: "red" }}>
        {values.error}
      </Typography>

      <Box sx={{ m: 2 }} />
    </Box>
  );
};

export default AuthForm;
