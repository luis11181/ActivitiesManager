import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  DocumentData,
  updateDoc,
  CollectionReference,
  DocumentReference,
  Timestamp,
} from "firebase/firestore";

import { db, comprobantes, Icomprobante } from "../../firebase";

//! crea la referencia a la subcoleccion con typeScript
const createSubCollection = <T = DocumentData>(
  collectionName: string,
  documentName: string,
  subCollectionName: string
) => {
  return collection(
    db,
    collectionName,
    documentName,
    subCollectionName
  ) as CollectionReference<T>;
};

const newInvoice = async (
  year: string,
  tipoComprobante: "egreso" | "ingresos" | "gastos",
  numero: string,
  numeroValor: number,
  observaciones: string,
  formaPago: string,
  banco: string,
  chequeNumero: string,
  usuarioCreacion: string,
  usuarioModificacion: string | null,
  fechaAplica: Timestamp,
  fechaCreacion: Timestamp,
  fechaModificacion: Timestamp | null,
  lista: {
    codigoPuc: string;
    concepto: string;
    valor: number;
  }[]
) => {
  // se puede udsar nuestro tipo de dato especifico en lugar de db, pues este lo incluye con el tipo de dato

  const listaComprobantes = createSubCollection<Icomprobante>(
    "comprobantes",
    year,
    `listaComprobantes${tipoComprobante}`
  );

  const comprobanteRef = doc(listaComprobantes, numero);

  //console.log("comprobanteRef", comprobanteRef);

  const docSnap = await getDoc(comprobanteRef);

  if (docSnap.exists()) {
    throw new Error(
      "Ya existe comprobante con ese numero, no es posible reescribirlo!"
    );
  }
  await setDoc(comprobanteRef, {
    banco,
    tipoComprobante,
    numero,
    numeroValor,
    observaciones,
    usuarioCreacion,
    usuarioModificacion,
    chequeNumero,
    formaPago,
    fechaAplica,
    fechaModificacion,
    fechaCreacion,
    lista,
  });

  const numeroRef = doc(comprobantes, year);

  const docSnap2 = await getDoc(numeroRef);
  console.log("docSnap2", docSnap2);
  console.log("docSnap2.data()", docSnap2.data());

  if (docSnap2.exists() && docSnap2.data().ultimosNumeros) {
    let nuevoEsMayor =
      docSnap2.data().ultimosNumeros[tipoComprobante] <
      Number(numero.replace(/\D+$/g, "")); // convert number to string and remove all non-numeric characters
    if (nuevoEsMayor) {
      //hace update dee solo los numero que sean mayores, y no cambia los otros datos del objeto
      await updateDoc(numeroRef, {
        [`ultimosNumeros.${tipoComprobante}`]: Number(
          numero.replace(/\D+$/g, "")
        ),
        [`ultimosNumeros.${tipoComprobante}Dato`]: numero,
      });
    }
  } else {
    await setDoc(numeroRef, {
      ultimosNumeros: {
        egreso: 0,
        egresoDato: "0",
        gastos: 0,
        gastosDato: "0",
        ingresos: 0,
        ingresosDato: "0",
      },
    });
    await updateDoc(numeroRef, {
      [`ultimosNumeros.${tipoComprobante}`]: Number(
        numero.replace(/\D+$/g, "")
      ),
      [`ultimosNumeros.${tipoComprobante}Dato`]: numero,
    });
  }

  // doc.data() will be undefined in this case
};

export default newInvoice;

//str.replace(/\D+$/g, "")
// var date = new Date(unix_timestamp * 1000);
