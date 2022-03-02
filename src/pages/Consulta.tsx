import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { useEffect, useState } from "react";
import { selectCorreo } from "../app/mainStateSlice";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";

import { Icomprobante } from "../firebase";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import NewPrint from "../components/print/NewPrint";
import getInvoices from "../features/invoice/query";
import { Timestamp } from "firebase/firestore";
import { log } from "console";

interface IValues {
  error: null | string;
}

type FormValues = {
  tipoComprobante: "egreso" | "ingresos" | "gastos";
  numero: string;
  fechaDesde: string;
  fechaHasta: string;

  tipoBusqueda: "numero" | "fechas";
};

const Consulta: React.FC = (): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [values, setValues] = useState<IValues>({
    error: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [datos, setDatos] = useState<Icomprobante[]>([]);

  const [selected, setSelected] = useState(new Set<number>());
  const [datosPrint, setDatosPrint] = useState<Icomprobante[]>([]);

  const navigate = useNavigate();

  const correoUsuarioActual = useAppSelector(selectCorreo);

  let currentYear = new Date().getFullYear().toString();

  const {
    register,
    handleSubmit,
    getValues,

    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    setDatosPrint([]);
    let tempResult: Icomprobante[] = [];
    selected.forEach((item) => {
      tempResult.push(datos[item]);
    });
    setDatosPrint(tempResult);
  }, [datos, selected]);

  const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
    setSelected(new Set());
    //console.log(data.fechaDesde);
    let year = currentYear;
    //toca poner la zona horaria a la del primer mundo
    let yearInput = new Date(`${data.fechaDesde}T00:00:00`)
      .getFullYear()
      .toString();

    let fechaDesde = Timestamp.fromDate(new Date(data.fechaDesde));
    let fechaHasta = Timestamp.fromDate(new Date(data.fechaHasta));
    let numeroDesde = Number(data.numero.replace(/\D+$/g, ""));
    //console.log(fechaDesde);

    try {
      // verifica que haya un tipo de busqueda
      if (data.tipoBusqueda == null) {
        setValues((anterior) => ({
          ...anterior,
          error: "Selecccione tipo de busqueda",
        }));
        return;
      } else {
        setValues((anterior) => ({
          ...anterior,
          error: null,
        }));
      }

      if (yearInput !== "" && yearInput !== "NaN") {
        year = yearInput;
      }

      setLoading(true);

      const result = await getInvoices(
        year,
        data.tipoComprobante,
        numeroDesde,
        data.tipoBusqueda,
        fechaDesde,
        fechaHasta
      );
      console.log(result);

      setDatos(result);
      setError(false);
      setLoading(false);
      console.log(datos);
    } catch (error: any) {
      setError(true);
      setLoading(false);
      if (error.message && typeof error.message === "string") {
        setValues((anterior) => ({ ...anterior, error: error.message }));
      } else {
        setValues((anterior) => ({ ...anterior, error: "Error inesperado" }));
      }
    }
  };

  if (loading || error) {
    return (
      <div>
        {loading ? <LoadingSpinner></LoadingSpinner> : null}
        <Typography variant="body1" sx={{ color: "red" }}>
          {values.error}
        </Typography>
      </div>
    );
  }

  return (
    <Box
      //center all the text fileds indie the div
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h1"
        component="h1"
        align="center"
        fontSize={30}
        fontWeight="bold"
        gutterBottom
      >
        {`Consulta de Comprobantes`}
      </Typography>

      <Grid
        container //grid contenedor que define prorpiedades de la grilla
        //spacing={1}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 2 }}
      >
        <Grid item xs={10} md={10} textAlign={"center"}>
          <Grid
            container //grid contenedor que define prorpiedades de la grilla
            //spacing={1}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 2 }}
          >
            <Grid item xs={6} md={6} textAlign={"center"}>
              <FormControl fullWidth>
                <InputLabel id="tipoComprobante-label">
                  Tipo Comprobante
                </InputLabel>
                <Select
                  autoWidth={true}
                  //sx={{ width: "max-content" }}
                  labelId="tipoComprobante-label"
                  id="tipoComprobante"
                  error={errors.tipoComprobante && true}
                  defaultValue="egreso"
                  //value={age}
                  label="tipoComprobante"
                  {...register("tipoComprobante", {
                    required: { value: true, message: "requerido" },
                    // maxLength: { value: 15, message: "nombre muy largo" },
                  })}
                  //onChange={handleChange}
                >
                  <MenuItem value={"egreso"}>Comprobante de egreso</MenuItem>
                  <MenuItem value={"gastos"}>Comprobante de gastos</MenuItem>
                  <MenuItem value={"ingresos"}>
                    Comprobante de ingresos
                  </MenuItem>
                </Select>
                <FormHelperText error={errors.tipoComprobante && true}>
                  {errors.tipoComprobante && errors.tipoComprobante.message}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={6}>
              <TextField
                id="numero"
                //required // le pone un asterisco para saber  que es obligatoria
                label="numero desde"
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
                  // maxLength: { value: 15, message: "nombre muy largo" },
                })}
              />
            </Grid>

            <Grid
              item
              xs={6}
              md={4}
              sx={{ display: "flex", alignContent: "start" }}
            >
              <TextField
                id="fechaDesde"
                //required // le pone un asterisco para saber  que es obligatoria
                label="fechaDesde"
                type="date"
                variant="outlined"
                //defaultValue={new Date().toISOString().split("T")[0]}
                InputLabelProps={{
                  shrink: true,
                }}
                error={errors.fechaDesde ? true : false}
                helperText={errors.fechaDesde && errors.fechaDesde.message}
                //variant="outlined"
                //defaultValue="Hello World"

                {
                  ...register("fechaDesde", {
                    validate: {
                      required: (v) => {
                        if (getValues("tipoBusqueda") === "fechas") {
                          return v.length > 1 || "requerido";
                        } else {
                          return true;
                        }
                      },
                    },
                  })
                  // maxLength: { value: 15, message: "nombre muy largo" },
                }
              />
            </Grid>

            <Grid
              item
              xs={6}
              md={4}
              sx={{ display: "flex", alignContent: "start" }}
            >
              <TextField
                id="fechaHasta"
                //required // le pone un asterisco para saber  que es obligatoria
                label="fechaHasta"
                type="date"
                variant="outlined"
                //defaultValue={new Date().toISOString().split("T")[0]}
                InputLabelProps={{
                  shrink: true,
                }}
                error={errors.fechaHasta ? true : false}
                helperText={errors.fechaHasta && errors.fechaHasta.message}
                //variant="outlined"
                //defaultValue="Hello World"
                {
                  ...register("fechaHasta", {
                    validate: {
                      required: (v) => {
                        if (getValues("tipoBusqueda") === "fechas") {
                          return v.length > 1 || "requerido";
                        } else {
                          return true;
                        }
                      },
                    },
                  })
                  // maxLength: { value: 15, message: "nombre muy largo" },
                }
              />
            </Grid>

            <Grid item xs={2} md={4}></Grid>
          </Grid>
        </Grid>

        <Grid item xs={2} md={2}>
          <FormControl>
            <FormLabel id="radio">Buscar por:</FormLabel>
            <RadioGroup aria-labelledby="demo-radio-buttons-group-label">
              <FormControlLabel
                value="fechas"
                control={<Radio />}
                label="fechas"
                {...register(
                  "tipoBusqueda",
                  {}
                  // maxLength: { value: 15, message: "nombre muy largo" },
                )}
              />

              <FormControlLabel
                value="numero"
                control={<Radio />}
                label="numero"
                {...register(
                  "tipoBusqueda",
                  {}
                  // maxLength: { value: 15, message: "nombre muy largo" },
                )}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ m: 3 }} />

      <LoadingButton
        color="primary"
        loading={loading}
        loadingPosition="start"
        startIcon={<SearchIcon />}
        variant="contained"
        type="submit"
      >
        consultar
      </LoadingButton>
      <Box sx={{ m: 1 }} />

      <Grid container spacing={3}>
        {datos.map((item, index) => {
          return (
            <Grid
              item
              xs={12}
              md={12}
              key={item.numero}
              onClick={() => {
                //console.log(item.numero);
                if (selected.has(index)) {
                  setSelected((prev) => {
                    const next = new Set(prev);

                    next.delete(index);

                    return next;
                  });
                } else {
                  setSelected((prev) => new Set(prev).add(index));
                }
              }}
              sx={{
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
                textAlign: "center",
                size: "max-content",
              }}
            >
              <Paper
                elevation={3}
                key={item.numero}
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <Grid key={item.numero} container spacing={3}>
                  <Grid
                    className={`${selected.has(index) ? "selected" : ""}`}
                    sx={{
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                    item
                    xs={12}
                    md={12}
                  >
                    {" "}
                    <Box
                      sx={{
                        display: "flex",
                        alignContent: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        alignItems: "center",
                        color: `${selected.has(index) ? "#3f0091" : "black"}`,
                        backgroundColor: `${
                          selected.has(index) ? "#d1e3ff" : "#f7f7f7"
                        }`,
                      }}
                    >
                      <Typography
                        boxSizing={"content-box"}
                        fontSize="1rem"
                      >{`numero: ${item.numero}  - comprobante:${
                        item.tipoComprobante
                      } - fechaAplica: ${
                        item.fechaAplica.toDate().toISOString().split("T")[0]
                      }`}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
              <Box sx={{ m: 1 }} />
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ m: 1 }} />

      {selected.size === 1 && (
        <Button
          variant="contained"
          type="button"
          onClick={() => {
            navigate(
              `/detalle/${
                datos[selected.values().next().value].tipoComprobante
              }/${datos[selected.values().next().value].fechaAplica
                .toDate()
                .getFullYear()}/${datos[selected.values().next().value].numero}`
            );
          }}
        >
          Ver detalle de comprobante
        </Button>
      )}

      <NewPrint print={datosPrint}></NewPrint>

      <Box sx={{ m: 1 }} />

      <Typography variant="body1" sx={{ color: "red" }}>
        {values.error}
      </Typography>
    </Box>
    //// //  <div> </div>
  );
};

export default Consulta;
