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

export default function CrearFlujos() {
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
          Creacion de servicios:
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
              xs={6}
              md={4}
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                width: "100%",
                flexFlow: "wrap",
              }}
            >
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
                    label="Area del servicio"
                    {...registerEmployee("areaServicio")}
                  />
                )}
              />
            </Grid>

            <Grid
              item
              xs={6}
              md={4}
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                width: "100%",
                flexFlow: "wrap",
              }}
            >
              <Autocomplete
                disablePortal
                id="empleadosServicio"
                sx={{ minWidth: "15rem", maxWidth: "25rem" }}
                options={areas}
                isOptionEqualToValue={(option, value) =>
                  option.label === value.label
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Empleado responsables del servicio"
                    {...registerEmployee("empleadosServicio")}
                  />
                )}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={12}
              sx={{
                display: "flex",
                justifyContent: "left",
                width: "100%",
                flexFlow: "wrap",
              }}
            >
              <Box sx={{ m: 1 }} />
              <Typography variant="body1" gutterBottom>
                Caracteristicas/ campos requeridos al responder el servicio:
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              md={4}
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                width: "100%",
                flexFlow: "wrap",
              }}
            >
              <TextField
                //required // le pone un asterisco para saber  que es obligatoria
                id="lastName"
                label="titulo de la caracteristica"
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
            </Grid>

            <Grid
              item
              xs={6}
              md={4}
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                width: "100%",
                flexFlow: "wrap",
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="tipoComprobante-label">
                  Valor esperado
                </InputLabel>
                <Select
                  autoWidth={true}
                  //sx={{ width: "max-content" }}
                  labelId="tipoCaracteristica"
                  id="tipoCaracteristica"
                  variant="standard"
                  error={errors.role && true}
                  defaultValue="texto"
                  //value={age}
                  label="valor esperado"
                  {...register("role", {
                    required: { value: true, message: "requerido" },
                    // maxLength: { value: 15, message: "nombre muy largo" },
                  })}
                  //onChange={handleChange}
                >
                  <MenuItem value={"texto"}>valor / texto corto</MenuItem>
                  <MenuItem value={"archivo"}>Archivo</MenuItem>
                  <MenuItem value={"textoLargo"}>Texto largo</MenuItem>
                </Select>
                <FormHelperText error={errors.role && true}>
                  {errors.role && errors.role.message}
                </FormHelperText>
              </FormControl>
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
                size="small"
                type="submit"
                color="secondary"
                variant="contained"
                onClick={() => {}}
              >
                Agregar campo
              </Button>
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
              <Box sx={{ m: 1 }} />
              <Button
                startIcon={<SendIcon />}
                size="small"
                type="submit"
                color="secondary"
                variant="contained"
                onClick={() => {}}
              >
                Crear servicio
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
