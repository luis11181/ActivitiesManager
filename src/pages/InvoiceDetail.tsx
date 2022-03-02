import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import FormHelperText from "@mui/material/FormHelperText";
import { useEffect, useRef, useState } from "react";
import { selectCorreo } from "../app/mainStateSlice";
import { useAppSelector } from "../app/hooks";
import ReactToPrint from "react-to-print";
import { useNavigate } from "react-router-dom";
import newInvoice from "../features/invoice/newInvoice";
import LoadingButton from "@mui/lab/LoadingButton";
import { Timestamp } from "firebase/firestore";
import { useParams } from "react-router-dom";
import readInvoice from "../features/invoice/readInvoice";
import { Icomprobante } from "../firebase";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import NewPrint from "../components/print/NewPrint";

interface IValues {
  error: null | string;
}

type Iparams = {
  year: string;
  tipoComprobante: "egreso" | "ingresos" | "gastos";
  numero: string;
};

const InvoiceDetail: React.FC = (): JSX.Element => {
  let { year, tipoComprobante, numero } = useParams<Iparams>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [values, setValues] = useState<IValues>({
    error: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [datos, setDatos] = useState<Icomprobante>({} as Icomprobante);
  const [datosPrint, setDatosPrint] = useState<Icomprobante[]>([]);

  const correoUsuarioActual = useAppSelector(selectCorreo);

  useEffect(() => {
    (async () => {
      try {
        const datos = await readInvoice(year!, tipoComprobante!, numero!);
        setDatos(datos);
        setError(false);
        setLoading(false);
        setDatosPrint([datos]);
      } catch (error: any) {
        setError(true);
        setLoading(false);
        if (error.message && typeof error.message === "string") {
          setValues((anterior) => ({ ...anterior, error: error.message }));
        } else {
          setValues((anterior) => ({ ...anterior, error: "Error inesperado" }));
        }
      }
    })();
    //el efecto no debe depender de ningun objeto, pues genera un lop infinito
  }, [numero, tipoComprobante, year]);

  //  const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
  //e es el objeto evento normal
  //     //console.log(data);
  //     setLoading(true);

  //     //alert(JSON.stringify(resultado));

  //     let dataFechaAplica = new Date(data.fechaAplica);

  //     dataFechaAplica.setHours(0, 0, 0, 0);

  //     let dataFechaCreacion = new Date();

  //     dataFechaCreacion.setHours(0, 0, 0, 0);

  //     let year = dataFechaAplica.getFullYear().toString();
  //     let tipoComprobante = data.tipoComprobante;
  //     let numero = data.numero.trim();
  //     let observaciones = data.observaciones;
  //     let formaPago = data.formaPago;
  //     let banco = data.banco;
  //     let chequeNumero = data.chequeNumero;
  //     let fechaAplica = Timestamp.fromDate(dataFechaAplica);
  //     let fechaModificacion = null;
  //     let fechaCreacion = Timestamp.fromDate(dataFechaCreacion);
  //     let usuarioCreacion = correoUsuarioActual ? correoUsuarioActual : "error";
  //     let usuarioModificacion = "";

  //     let lista = [
  //       {
  //         codigoPuc: data.codigoPuc,
  //         concepto: data.concepto,
  //         valor: data.valor,
  //       },
  //       ...data.lista,
  //     ];

  //     try {
  //       await newInvoice(
  //         year,
  //         tipoComprobante,
  //         numero,
  //         observaciones,
  //         formaPago,
  //         banco,
  //         chequeNumero,
  //         usuarioCreacion,
  //         usuarioModificacion,
  //         fechaAplica,
  //         fechaCreacion,
  //         fechaModificacion,
  //         lista
  //       );

  //       navigate(`/detalle/${numero}`);
  //     } catch (error: any) {
  //       setLoading(false);
  //       if (error.message && typeof error.message === "string") {
  //         setValues({ ...values, error: error.message });
  //       } else {
  //         setValues({ ...values, error: "Error inesperado" });
  //       }
  //     }
  //   };

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
    >
      <Typography
        variant="h1"
        component="h1"
        align="center"
        fontSize={30}
        fontWeight="bold"
        gutterBottom
      >
        {`Detalle Comprobante ${datos.tipoComprobante} - ${datos.numero}`}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        //noValidate
        //autoComplete="off"
      >
        <Grid
          container //grid contenedor que define prorpiedades de la grilla
          //spacing={1}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 2 }}
        >
          <Grid item xs={6} md={6}>
            <TextField
              defaultValue={datos.numero}
              InputProps={{
                readOnly: true,
              }}
              id="numero"
              variant="filled"
              //required // le pone un asterisco para saber  que es obligatoria
              label="numero"
              type="text"
            />
          </Grid>

          {datos.lista.map((item, index) => {
            return (
              <Grid item xs={12} key={index}>
                <Box
                  key={index}
                  //sx={{ border: 1, backgroundColor: "primary.light" }}
                >
                  <Grid
                    container //grid contenedor que define prorpiedades de la grilla
                    //spacing={1}
                    key={index}
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 2 }}
                  >
                    <Grid item xs={4} md={4} key={index}>
                      <TextField
                        defaultValue={item.codigoPuc}
                        InputProps={{
                          readOnly: true,
                        }}
                        id={`codigoPuc${index}`}
                        //required // le pone un asterisco para saber  que es obligatoria
                        label={`codigoPuc${index}`}
                        type="text"
                        variant="filled"
                      />
                    </Grid>
                    <Grid item xs={4} md={4}>
                      <TextField
                        defaultValue={item.concepto}
                        InputProps={{
                          readOnly: true,
                        }}
                        id={`concepto${index}`}
                        //required // le pone un asterisco para saber  que es obligatoria
                        label={`concepto${index}`}
                        type="text"
                        variant="filled"
                      />
                    </Grid>
                    <Grid item xs={4} md={4}>
                      <TextField
                        defaultValue={item.valor}
                        InputProps={{
                          readOnly: true,
                        }}
                        id={`valor${index}`}
                        //required // le pone un asterisco para saber  que es obligatoria
                        label={`valor${index}`}
                        type="number"
                        variant="filled"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            );
          })}

          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              defaultValue={datos.observaciones}
              InputProps={{
                readOnly: true,
              }}
              id="observaciones"
              //required // le pone un asterisco para saber  que es obligatoria
              label="observaciones"
              type="text"
              variant="filled"
            />
          </Grid>

          <Grid item xs={3} md={3}>
            <TextField
              fullWidth
              defaultValue={datos.formaPago}
              InputProps={{
                readOnly: true,
              }}
              id="formaPago"
              //required // le pone un asterisco para saber  que es obligatoria
              label="forma Pago"
              type="text"
              variant="filled"
            />
          </Grid>
          <Grid item xs={3} md={3}>
            <TextField
              fullWidth
              defaultValue={datos.banco}
              InputProps={{
                readOnly: true,
              }}
              id="banco"
              //required // le pone un asterisco para saber  que es obligatoria
              label="banco"
              type="text"
              variant="filled"
            />
          </Grid>
          <Grid item xs={3} md={3}>
            <TextField
              fullWidth
              defaultValue={
                datos.fechaAplica.toDate().toISOString().split("T")[0]
              }
              InputProps={{
                readOnly: true,
              }}
              id="fechaAplica"
              //required // le pone un asterisco para saber  que es obligatoria
              label="fechaAplica"
              type="date"
              variant="filled"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={3} md={3}>
            <TextField
              fullWidth
              defaultValue={datos.chequeNumero}
              InputProps={{
                readOnly: true,
              }}
              id="chequeNumero"
              //required // le pone un asterisco para saber  que es obligatoria
              label="cheque Numero"
              type="text"
              variant="filled"
            />
          </Grid>
        </Grid>

        <Box sx={{ m: 1 }} />

        <Box>
          <Button variant="contained" type="button" onClick={() => {}}>
            Modificar por hacer
          </Button>
          {"   "}
          <NewPrint print={datosPrint}></NewPrint>
        </Box>
      </Box>
      <Box sx={{ m: 1 }} />

      <Typography variant="body1" sx={{ color: "red" }}>
        {values.error}
      </Typography>
    </Box>
    //// //  <div> </div>
  );
};

export default InvoiceDetail;
