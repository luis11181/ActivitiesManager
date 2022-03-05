import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { Box, Button, FormHelperText, MenuItem, Select } from "@mui/material";
import { selectJWTToken, selectNombre } from "../app/mainStateSlice";
import Autocomplete from "@mui/material/Autocomplete";
import { FormControl, InputLabel, Typography, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useLayoutEffect, useState } from "react";
//useSWR library to manage the state
import useSWR from "swr";
import { nextTick } from "process";

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
  areas: { idAreas: number; area: string; cargo: string }[];
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

export default function DefineRolesPage() {
  let navigate = useNavigate();

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

  let Areas = new Set<string>();

  if (dataAreas) {
    console.log(dataAreas);
    dataAreas.areas.forEach((area) => {
      Areas.add(area.area);
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
          <InputLabel id="tipoComprobante-label">area</InputLabel>
          <Select
            autoWidth={true}
            //sx={{ width: "max-content" }}
            labelId="area"
            id="area"
            variant="standard"
            error={errors.area && true}
            defaultValue=""
            //value={age}
            label="area"
            {...register("area", {
              required: { value: true, message: "requerido" },
              // maxLength: { value: 15, message: "nombre muy largo" },
            })}
            //onChange={handleChange}
          >
            {Areas.size > 0 &&
              Array.from(Areas).map(
                (
                  area //map the set to an array
                ) => (
                  <MenuItem key={area} value={area}>
                    {area}
                  </MenuItem>
                )
              )}
          </Select>
          <FormHelperText error={errors.role && true}>
            {errors.role && errors.role.message}
          </FormHelperText>
        </FormControl>

        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={Empleados}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Areas" />}
          {...register("persona", {
            required: { value: true, message: "requerido" },
            // maxLength: { value: 15, message: "nombre muy largo" },
          })}
        />
      </Box>
    </Box>
  );
}
