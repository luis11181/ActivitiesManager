import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
} from "@mui/material";
import { selectJWTToken, selectNombre } from "../app/mainStateSlice";
import Autocomplete from "@mui/material/Autocomplete";
import { FormControl, InputLabel, Typography, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useLayoutEffect, useState } from "react";
//useSWR library to manage the state
import useSWR, { useSWRConfig } from "swr";
import { nextTick } from "process";
import CachedIcon from "@mui/icons-material/Cached";
import { flexbox } from "@mui/material/node_modules/@mui/system";
import SendIcon from "@mui/icons-material/Send";

interface AutocompleteOption {
  label: string;
  id: number;
}

interface IFormNewAreaInput {
  areaNueva: string;
  codigoAreaNueva: number;
  padreAreaNueva: string;
  jefeAreaNueva: string;
  areasDisponibles: AutocompleteOption[];
}

interface IFormEmployeeAreaInput {
  correoUser: string;
  areaUser: string;
  etiquetas: string;
}

interface IResponse {
  areas: { idAreas: number; area: string }[];
  message: string;
}

async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, {
    headers: { Authorization: "Bearer " + init },
  });

  let resJson = await res.json();

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    throw error;
  }

  return resJson;
}

interface IFeedback {
  error: boolean;
  message: null | string;
}

export default function EstructuraEmpresarial() {
  let navigate = useNavigate();

  const [feedback, setFeedback] = useState<IFeedback>({
    error: false,
    message: null,
  });

  const { mutate } = useSWRConfig();

  const token: string | null = useAppSelector(selectJWTToken);

  const { data: dataAreas, error: errorAreas } = useSWR<IResponse>(
    [`${process.env.REACT_APP_BACKENDURL}/info/areas`, token],
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (errorAreas) {
    console.error(errorAreas);
  }

  //area existentes

  //let Areas = new Set<string>();

  let areas: AutocompleteOption[] = [];

  if (dataAreas) {
    dataAreas.areas.forEach((element) => {
      areas.push({ label: element.area, id: element.idAreas });
    });
  }

  let areas2 = [...areas, { label: "Area maestra, sin padre", id: 0 }];

  const {
    register,
    handleSubmit,
    watch, // console.log(watch("example")); // watch input value by passing the name of it, and then it can trigger actions if changes
    setValue,
    getValues,
    //watch, // console.log(watch("example")); // watch input value by passing the name of it, and then it can trigger actions if changes
    formState: { errors },
  } = useForm();

  const {
    register: registerEmployee,
    handleSubmit: handleSubmitEmployee,
    formState: { errors: errorsEmployee },
  } = useForm();

  const watchArea = watch(["area"]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       //setValues((anterior) => ({ ...anterior, error: null }));
  //     } catch (error: any) {
  //       console.error(error);
  //     }
  //   })();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [watchArea]);

  const onSubmitNewArea: SubmitHandler<IFormNewAreaInput> = async (data) => {
    //alert(JSON.stringify(data));

    interface IResponse {
      message: string;
    }

    try {
      let areaPadre: string | null = data.padreAreaNueva;

      if (data.padreAreaNueva === "Area maestra, sin padre") {
        areaPadre = null;
      }

      console.log(data);

      let resultFetch = await fetch(
        `${process.env.REACT_APP_BACKENDURL}/admin/newArea`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            area: data.areaNueva,
            areaPadre: areaPadre,
            codigoArea: data.codigoAreaNueva,
            jefeArea: data.jefeAreaNueva,
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

      setFeedback((anterior) => ({
        ...anterior,
        message: null,
        error: false,
      }));
    } catch (err: any) {
      let errorMessage = "error";
      console.log(err);
      if (err?.message && typeof err?.message === "string") {
        errorMessage = err.message;
      }
      setFeedback((anterior) => ({
        ...anterior,
        message: errorMessage,
        error: true,
      }));
    }
  };

  const onSubmitEmployeeArea: SubmitHandler<IFormEmployeeAreaInput> = async (
    data
  ) => {
    //alert(JSON.stringify(data));

    interface IResponse {
      message: string;
    }

    try {
      console.log(data);

      let codigoArea = areas.find(
        (element) => element.label === data.areaUser
      )?.id;

      console.log(codigoArea);

      let resultFetch = await fetch(
        `${process.env.REACT_APP_BACKENDURL}/admin/employeeArea`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            correoUser: data.correoUser,
            areaId: codigoArea,
            etiquetas: data.etiquetas,
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

      setFeedback((anterior) => ({
        ...anterior,
        message: null,
        error: false,
      }));
    } catch (err: any) {
      let errorMessage = "error";
      console.log(err);
      if (err?.message && typeof err?.message === "string") {
        errorMessage = err.message;
      }
      setFeedback((anterior) => ({
        ...anterior,
        message: errorMessage,
        error: true,
      }));
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
    >
      <Box
        sx={{
          height: "100%",
          width: "100%",
        }}

        //noValidate
        //autoComplete="off"
      >
        <Typography variant="h6" gutterBottom>
          Estructura Empresarial Agregar Areas:
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmitNewArea)}
          sx={{
            display: "flex",
            height: "100%",
            width: "100%",
          }}

          //noValidate
          //autoComplete="off"
        >
          <Grid
            container //grid contenedor que define propiedades de la grilla
            //spacing={1}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 2 }}
          >
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={areas}
                  isOptionEqualToValue={(option, value) =>
                    option.label === value.label
                  }
                  sx={{ width: "90%" }}
                  renderInput={(params) => (
                    <TextField {...params} label="Areas Existentes" />
                  )}
                  {...register("areasDisponibles", {
                    // maxLength: { value: 15, message: "nombre muy largo" },
                  })}
                />
                <IconButton
                  aria-label="refresh"
                  type="button"
                  color="secondary"
                  size="large"
                  onClick={() => {
                    mutate([
                      `${process.env.REACT_APP_BACKENDURL}/info/areas`,
                      token,
                    ]);
                  }}
                >
                  <CachedIcon fontSize="inherit" />
                </IconButton>
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              md={8}
              sx={{
                borderLeft: "1px solid blue",
                display: "flex",
                justifyContent: "space-evenly",
                width: "100%",
                flexFlow: "wrap",
              }}
            >
              <Grid
                container //grid contenedor que define propiedades de la grilla
                //spacing={1}
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 2 }}
              >
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    width: "100%",
                    flexFlow: "wrap",
                  }}
                >
                  <TextField
                    id="areaNueva"
                    //required // le pone un asterisco para saber  que es obligatoria
                    label="Nombre Nueva Area"
                    type="text"
                    variant="outlined"
                    sx={{ minWidth: "15rem", maxWidth: "25rem" }}
                    error={errors.areaNueva ? true : false}
                    helperText={errors.areaNueva && errors.areaNueva.message}
                    //variant="outlined"
                    //defaultValue="Hello World"
                    {...register("areaNueva", {
                      required: { value: true, message: "requerido" },
                      // maxLength: { value: 15, message: "nombre muy largo" },
                    })}
                  />{" "}
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    width: "100%",
                    flexFlow: "wrap",
                  }}
                >
                  <TextField
                    id="codigoAreaNueva"
                    //required // le pone un asterisco para saber  que es obligatoria
                    label="Codigo Nueva Area"
                    type="text"
                    variant="outlined"
                    sx={{ minWidth: "15rem", maxWidth: "25rem" }}
                    error={errors.codigoAreaNueva ? true : false}
                    helperText={
                      errors.codigoAreaNueva && errors.codigoAreaNueva.message
                    }
                    //variant="outlined"
                    //defaultValue="Hello World"
                    {...register("codigoAreaNueva", {
                      required: { value: true, message: "requerido" },
                      // maxLength: { value: 15, message: "nombre muy largo" },
                    })}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    width: "100%",
                    flexFlow: "wrap",
                  }}
                >
                  <Autocomplete
                    disablePortal
                    id="areapadre"
                    sx={{ minWidth: "15rem", maxWidth: "25rem" }}
                    options={areas2}
                    isOptionEqualToValue={(option, value) =>
                      option.label === value.label
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Area Padre"
                        {...register("padreAreaNueva", {
                          required: { value: true, message: "requerido" },
                        })}
                      />
                    )}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    width: "100%",
                    flexFlow: "wrap",
                  }}
                >
                  <TextField
                    id="jefeAreaNueva"
                    //required // le pone un asterisco para saber  que es obligatoria
                    label="correo del jefe responsable del Area"
                    type="text"
                    variant="outlined"
                    sx={{ minWidth: "15rem", maxWidth: "25rem" }}
                    error={errors.jefeAreaNueva ? true : false}
                    helperText={
                      errors.jefeAreaNueva && errors.jefeAreaNueva.message
                    }
                    //variant="outlined"
                    //defaultValue="Hello World"
                    {...register("jefeAreaNueva", {
                      required: { value: true, message: "requerido" },
                      pattern: {
                        value:
                          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "correo no valido",
                      },
                      // maxLength: { value: 15, message: "nombre muy largo" },
                    })}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={12}
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    width: "100%",
                    flexFlow: "wrap",
                  }}
                >
                  <Button
                    startIcon={<SendIcon />}
                    type="submit"
                    color="secondary"
                    size="small"
                    variant="contained"
                    onClick={() => {}}
                  >
                    Agregar/Modificar Area
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/* 
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitNewArea)}
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
        <FormControl fullWidth>
          <InputLabel id="tipoComprobante-label">Areas existentes</InputLabel>
          <Select
            autoWidth={true}
            //sx={{ width: "max-content" }}
            labelId="areas existentes"
            id="area"
            variant="standard"
            error={errors.area && true}
            defaultValue=""
            //value={age}
            label="areas existentes"
            {...register("area", {
              required: { value: true, message: "requerido" },
              // maxLength: { value: 15, message: "nombre muy largo" },
            })}
            //onChange={handleChange}
          >
            {areas.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error={errors.role && true}>
            {errors.role && errors.role.message}
          </FormHelperText>
        </FormControl>
      </Box> */}

      <Box sx={{ height: "3rem" }} />

      <Box
        sx={{
          height: "100%",
          width: "100%",
        }}

        //noValidate
        //autoComplete="off"
      >
        <Typography variant="h6" gutterBottom>
          Estructura Empresarial definir etiquetas y area de los empleados:
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmitEmployee(onSubmitEmployeeArea)}
          sx={{
            display: "flex",
            height: "100%",
            width: "100%",
          }}

          //noValidate
          //autoComplete="off"
        >
          <Grid
            container //grid contenedor que define propiedades de la grilla
            //spacing={1}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 2 }}
          >
            <Grid
              item
              xs={12}
              md={8}
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                width: "100%",
                flexFlow: "wrap",
              }}
            >
              <TextField
                id="correoUser"
                //required // le pone un asterisco para saber  que es obligatoria
                label="email empleado"
                type="email"
                variant="outlined"
                sx={{ minWidth: "15rem", maxWidth: "25rem" }}
                error={errorsEmployee.correoUser ? true : false}
                helperText={
                  errorsEmployee.correoUser && errorsEmployee.correoUser.message
                }
                //variant="outlined"
                //defaultValue="Hello World"
                {...registerEmployee("correoUser", {
                  required: { value: true, message: "requerido" },
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "correo no valido",
                  },
                  // maxLength: { value: 15, message: "nombre muy largo" },
                })}
              />

              <Autocomplete
                disablePortal
                id="areaUser"
                sx={{ minWidth: "15rem", maxWidth: "25rem" }}
                options={areas}
                isOptionEqualToValue={(option, value) =>
                  option.label === value.label
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Area del empleado"
                    {...registerEmployee("areaUser")}
                  />
                )}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                width: "100%",
                flexFlow: "wrap",
              }}
            >
              <TextField
                id="etiquetas"
                //required // le pone un asterisco para saber  que es obligatoria
                label="etiquetas (descriptores empleado)"
                type="text"
                variant="outlined"
                defaultValue={"etiqueta1 , etiqueta2"}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ minWidth: "20rem", maxWidth: "30rem" }}
                error={errorsEmployee.etiquetas ? true : false}
                helperText={
                  errorsEmployee.etiquetas && errorsEmployee.etiquetas.message
                }
                //variant="outlined"
                //defaultValue="Hello World"
                {...registerEmployee("etiquetas", {
                  // maxLength: { value: 15, message: "nombre muy largo" },
                })}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Button
                startIcon={<SendIcon />}
                size="small"
                type="submit"
                color="secondary"
                variant="contained"
                onClick={() => {}}
              >
                Asignar/modificar Area Empleado
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {errorAreas?.message && (
        <Typography variant="body1" sx={{ color: "red" }}>
          {errorAreas.message}
        </Typography>
      )}

      {feedback.message && (
        <Typography
          variant="body1"
          className={`${feedback.error ? "error" : "sucess"}`}
        >
          {feedback.message}
        </Typography>
      )}
    </Box>
  );
}
