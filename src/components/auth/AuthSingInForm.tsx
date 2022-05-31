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

import { useAppSelector, useAppDispatch } from "../../app/hooks";

import {
  changeAuthState,
  changeJWTFechaExpiracion,
  changeJwtToken,
  changeRol,
  changeUserId,
} from "../../app/mainStateSlice";

import { changeNombreUsuario } from "../../app/mainStateSlice";

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

const AuthForm: React.FC<IFromProps> = (props): JSX.Element => {
  // let location: any = useLocation();
  // //si hubo una ruta anterio la pone en la variable, en caso contrario lleva a la pronmcipal
  // let from = location.state?.from?.pathname || "/";
  let navigate = useNavigate();

  const dispatch = useAppDispatch();

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
    //alert(JSON.stringify(data));

    interface IResponse {
      token: string;
      userId: string;
      role: string;
      firstName: string;
      message: string;
    }

    try {
      let resultFetch = await fetch(
        `${process.env.REACT_APP_BACKENDURL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );

      let resultFetchJson = (await resultFetch.json()) as IResponse;

      if (resultFetch.status === 401) {
        throw new Error(resultFetchJson.message);
      }

      if (!resultFetch.ok) {
        throw new Error(resultFetchJson.message);
        // throw new Error("fallo el inicio de sesion!");
      }

      const remainingMilliseconds = Number(
        `${process.env.REACT_APP_JWTDURATIONTIME}`
      );

      //TODO CAMBIAR EL GUARDADO DEL TOKEN EN COOKIES Y NO LOCAL STORAE, CON HTTP ONLY Y CON SECURE

      //TODO para proteger de CSRF attacks se debe usar una clave secreta al generar el token(random string), guardarla en un CSRF-TOKEN EN EL CLIENTe y en secreto como parte del jwt token. este XSRF debe ser readable, en localstorage, y se envia junto con el token en el request.(ya que solo desde el mismo dominio se puede leer dicho token)

      //* otra forma de proteccion seria solo agregar el random string de clave XSRF-TOKEN  en el cookie y enviarlo en la creacion del token, y en cada request se debe agregar el XSRF-TOKEN en el header. validando este el servidor contra el del jwt token.(ya que solo desde el mismo dominio se puede leer dicho token)

      //* set jwt token in cookies of name access_token
      // setCookie("access_token", resultFetchJson.token, {
      //   maxAge: remainingMilliseconds,
      //   path: "/",
      //   httpOnly: true, //not accesible throw javascript
      //   secure: true, //solo se envia por https
      // });

      console.log(remainingMilliseconds);

      const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);

      dispatch(changeAuthState(true));
      dispatch(changeJwtToken(resultFetchJson.token));
      dispatch(changeJWTFechaExpiracion(expiryDate.toISOString()));
      dispatch(changeUserId(resultFetchJson.userId));
      dispatch(changeNombreUsuario(resultFetchJson.firstName));
      dispatch(changeRol(resultFetchJson.role));

      localStorage.setItem("JWTToken", resultFetchJson.token);
      localStorage.setItem("userId", resultFetchJson.userId);
      localStorage.setItem("rol", resultFetchJson.role);
      localStorage.setItem("nombreUsuario", resultFetchJson.firstName);

      localStorage.setItem("JWTFechaExpiracion", expiryDate.toISOString());

      navigate(props.from, { replace: true });
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

      <Typography variant="body1" sx={{ color: "red" }}>
        {values.error}
      </Typography>

      <Box sx={{ m: 2 }} />
    </Box>
  );
};

export default AuthForm;
