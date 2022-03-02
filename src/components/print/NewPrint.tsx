import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import logo from "../../assets/psi.png";
import { Button, Grid, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import NumberFormat from "react-number-format";
import { useRef } from "react";

import ReactToPrint from "react-to-print";
import { Icomprobante } from "../../firebase";

import classes from "./Print.module.css";

interface Iprops {
  print: Icomprobante[];
}
const NewPrint: React.FC<Iprops> = (props): JSX.Element => {
  // let location: any = useLocation();
  // //si hubo una ruta anterio la pone en la variable, en caso contrario lleva a la pronmcipal
  // let from = location.state?.from?.pathname || "/";

  const componentRef = useRef(null);

  interface Iprint extends Icomprobante {
    total: number;
  }

  let print: Iprint[] = [];

  props.print.forEach((element) => {
    let total = 0;

    element.lista.forEach((item) => {
      total += Number(item.valor);
    });
    print.push({ ...element, total });
  });

  return (
    <Box>
      <Box ref={componentRef}>
        <Box className={`${classes.pageContainer}`}>
          <Box className={` ${classes.item} ${classes.noBreakInside}`}>
            {print.map((comprobante, indexComprobante) => {
              return (
                <div key={comprobante.numero}>
                  <Box
                    key={comprobante.numero}

                    //noValidate
                    //autoComplete="off"
                  >
                    <Box
                      sx={{
                        display: "flex",

                        justifyContent: "space-evenly",
                      }}
                      //noValidate
                      //autoComplete="off"
                    >
                      <img src={logo} alt="logo" width={"100rem"} />{" "}
                      {"              "}
                      <Typography variant="h6" color={"red"}>
                        {`${"Comprobante De "
                          .concat(comprobante.tipoComprobante)
                          .toUpperCase()} # ${
                          comprobante.tipoComprobante === "egreso" ? "CE" : ""
                        } 
                          ${
                            comprobante.tipoComprobante === "gastos" ? "CG" : ""
                          }
                          ${
                            comprobante.tipoComprobante === "ingresos"
                              ? "CI"
                              : ""
                          }
                          -${comprobante.fechaAplica
                            .toDate()
                            .toISOString()
                            .split("T")[0]
                            .slice(2, 4)} 
                          -${comprobante.numero}`}
                      </Typography>
                    </Box>
                    <Box sx={{ m: 1 }} />

                    <Box
                      sx={{
                        display: "block",
                        justifyContent: "start",
                      }}
                    >
                      <Typography variant="body2" color={"black"}>
                        {` PROVEEDORES DE SERVICIOS INFORMATICOS PSI COLOMBIA LTDA`}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={"black"}
                        align={"left"}
                      >
                        {`
                    NIT 900047962-8`}
                      </Typography>
                      <Typography variant="body2" color={"black"}>
                        {` CARRERA 16C # 154-80`}
                      </Typography>
                      <Typography variant="body2" color={"black"}>
                        {` P.B.X: 5970235 `}
                      </Typography>
                      <Typography variant="body2" color={"black"}>
                        {` BOGOTA, COLOMBIA `}
                      </Typography>
                    </Box>

                    <Box sx={{ m: 1 }} />

                    <TableContainer component={Paper}>
                      <Table
                        sx={{ minWidth: 650 }}
                        size="small"
                        aria-label="a dense table"
                      >
                        <TableHead style={{ backgroundColor: "#e6e6e6" }}>
                          <TableRow>
                            <TableCell>Codigo P.U.C</TableCell>
                            <TableCell align="right">Concepto</TableCell>
                            <TableCell align="right">V/Total $</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {comprobante.lista.map((item, index) => {
                            return (
                              <TableRow
                                key={index}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  {item.codigoPuc}
                                </TableCell>
                                <TableCell align="right">
                                  {item.concepto}
                                </TableCell>
                                <TableCell align="right">
                                  <NumberFormat
                                    value={item.valor}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"$"}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                              //cambio
                            }}
                          >
                            <TableCell align="right">{""}</TableCell>
                            <TableCell align="right">{"valor neto:"}</TableCell>
                            <TableCell align="right">
                              <NumberFormat
                                value={comprobante.total}
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"$"}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Grid
                      key={comprobante.numero}
                      container //grid contenedor que define prorpiedades de la grilla
                      //spacing={1}
                      rowSpacing={0}
                      columnSpacing={{ xs: 1, sm: 0, md: 0 }}
                    >
                      <Grid item xs={12} md={12}>
                        <TextField
                          size="small"
                          fullWidth
                          defaultValue={comprobante.observaciones}
                          InputProps={{
                            readOnly: true,
                          }}
                          id="observaciones"
                          //required // le pone un asterisco para saber  que es obligatoria
                          label="observaciones"
                          type="text"
                          variant="standard"
                        />
                      </Grid>

                      <Grid item xs={4} md={4}>
                        <TextField
                          fullWidth
                          size="small"
                          defaultValue={`${comprobante.chequeNumero}`}
                          InputProps={{
                            readOnly: true,
                          }}
                          id="chequeNumero"
                          //required // le pone un asterisco para saber  que es obligatoria
                          label="Cheque #"
                          type="text"
                          variant="standard"
                        />
                      </Grid>

                      <Grid item xs={4} md={4}>
                        <TextField
                          size="small"
                          fullWidth
                          //defaultValue={`${comprobante.formaPago}`} //cambio
                          defaultValue="Efectivo"
                          InputProps={{
                            readOnly: true,
                          }}
                          id="formaPago"
                          //required // le pone un asterisco para saber  que es obligatoria
                          label="Forma de Pago:"
                          type="text"
                          variant="standard"
                        />
                      </Grid>
                      <Grid item xs={4} md={4}>
                        <TextField
                          size="small"
                          fullWidth
                          //defaultValue={`${comprobante.banco}`} //cambio
                          defaultValue="Davivienda"
                          InputProps={{
                            readOnly: true,
                          }}
                          id="banco"
                          //required // le pone un asterisco para saber  que es obligatoria
                          label="Banco:"
                          type="text"
                          variant="standard"
                        />
                      </Grid>

                      <Grid item xs={4} md={4}>
                        <TextField
                          fullWidth
                          size="medium"
                          defaultValue={``}
                          InputProps={{
                            readOnly: true,
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          id="elaboro"
                          //required // le pone un asterisco para saber  que es obligatoria
                          label="Elaboro:"
                          type="text"
                          variant="standard"
                        />
                      </Grid>

                      <Grid item xs={4} md={4}>
                        <TextField
                          fullWidth
                          size="medium"
                          defaultValue={``}
                          InputProps={{
                            readOnly: true,
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          id="Contabilizo"
                          //required // le pone un asterisco para saber  que es obligatoria
                          label="Contabilizo:"
                          type="text"
                          variant="standard"
                        />
                      </Grid>

                      <Grid item xs={4} md={4}>
                        <TextField
                          fullWidth
                          size="medium"
                          defaultValue={``}
                          InputProps={{
                            readOnly: true,
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          id="Firma"
                          //required // le pone un asterisco para saber  que es obligatoria
                          label="Firma y sello del beneficiario:"
                          type="text"
                          variant="standard"
                        />
                      </Grid>

                      <Grid item xs={4} md={4}>
                        <TextField
                          fullWidth
                          size="small"
                          defaultValue={
                            comprobante.fechaAplica
                              .toDate()
                              .toISOString()
                              .split("T")[0]
                          }
                          InputProps={{
                            readOnly: true,
                          }}
                          id="fechaAplica"
                          //required // le pone un asterisco para saber  que es obligatoria
                          label="Fecha de Recibido:"
                          type="date"
                          variant="standard"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ m: 1 }} />
                  </Box>
                  <Box sx={{ m: 5 }} />
                </div>
              );
            })}
          </Box>
        </Box>
        <Box sx={{ m: 1 }} />
      </Box>
      <Box sx={{ m: 3 }} />
      <Box
        sx={{
          //center content inside
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ReactToPrint
          trigger={() => (
            <Button
              color="secondary"
              variant="contained"
              type="button"
              onClick={() => {}}
            >
              Generar pdf de la seleccion!{" "}
            </Button>
          )}
          content={() => componentRef.current}
        />
      </Box>
    </Box>
  );
};

export default NewPrint;
