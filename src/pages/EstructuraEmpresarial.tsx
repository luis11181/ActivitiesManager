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

interface AutocompleteOption {
  label: string;
  id: string;
}

let Empleados: AutocompleteOption[] = [
  { label: "Empleado 1", id: "1" },
  { label: "Empleado 2", id: "2" },
  { label: "Empleado 3", id: "3" },
];

interface IFormInput {
  area: string;
  empleadoId: number;
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

export default function EstructuraEmpresarial() {
  let navigate = useNavigate();

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

  console.log(dataAreas);

  if (errorAreas) {
    console.error(errorAreas);
  }

  //area existentes

  //let Areas = new Set<string>();

  let areas: AutocompleteOption[] = [];

  if (dataAreas) {
    console.log(dataAreas);
    dataAreas.areas.forEach((element) => {
      areas.push({ label: element.area, id: element.idAreas.toString() });
    });
  }

  const {
    register,
    handleSubmit,
    watch, // console.log(watch("example")); // watch input value by passing the name of it, and then it can trigger actions if changes
    setValue,
    getValues,
    //watch, // console.log(watch("example")); // watch input value by passing the name of it, and then it can trigger actions if changes
    formState: { errors },
  } = useForm();

  const watchArea = watch(["area"]);

  useEffect(() => {
    (async () => {
      try {
        //setValues((anterior) => ({ ...anterior, error: null }));
      } catch (error: any) {
        console.error(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchArea]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    //alert(JSON.stringify(data));

    interface IResponse {
      token: string;
      userId: string;
      role: string;
      firstName: string;
      message: string;
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
        component="form"
        onSubmit={handleSubmit(onSubmit)}
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
        <Grid
          container //grid contenedor que define prorpiedades de la grilla
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
                sx={{ width: "90%" }}
                renderInput={(params) => (
                  <TextField {...params} label="Areas" />
                )}
                {...register("persona", {
                  // maxLength: { value: 15, message: "nombre muy largo" },
                })}
              />
              <IconButton
                aria-label="delete"
                type="button"
                color="secondary"
                size="large"
                onClick={() => {
                  mutate(`${process.env.REACT_APP_BACKENDURL}/info/areas`);

                  console.log("aaa");
                }}
              >
                <CachedIcon fontSize="inherit" />
              </IconButton>{" "}
            </Box>
          </Grid>

          <Grid
            item
            xs={6}
            md={8}
            sx={{
              border: "1px solid",
            }}
          >
            <TextField
              id="numero"
              //required // le pone un asterisco para saber  que es obligatoria
              label="numero"
              type="text"
              variant="outlined"
              error={errors.numero ? true : false}
              helperText={errors.numero && errors.numero.message}
              InputLabelProps={{
                shrink: true,
              }}
              //variant="outlined"
              //defaultValue="Hello World"
              {...register("numero", {
                required: { value: true, message: "requerido" },
                // maxLength: { value: 15, message: "nombre muy largo" },
              })}
            />
          </Grid>
        </Grid>
      </Box>

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
      </Box>
    </Box>
  );
}
