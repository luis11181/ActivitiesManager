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

function makeKey<NS extends string, N extends string>(namespace: NS, name: N) {
  return (namespace + name) as `${NS}${N}`;
}

const readInvoice = async (
  year: string,
  tipoComprobante: "egreso" | "ingresos" | "gastos",
  numero: string
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
    return docSnap.data();
  } else {
    throw new Error(
      "NO existe comprobante con ese numero, no es posible ver detalle!"
    );
  }

  // doc.data() will be undefined in this case
};

export default readInvoice;

export const lastNumero = async (
  year: string,
  tipoComprobante: "egreso" | "ingresos" | "gastos"
) => {
  const numeroRef = doc(comprobantes, year);

  const docSnap2 = await getDoc(numeroRef);

  if (docSnap2.exists() && docSnap2.data().ultimosNumeros) {
    let numero = docSnap2.data().ultimosNumeros[tipoComprobante];
    let tipo: "egresoDato" | "ingresosDato" | "gastosDato" = makeKey(
      tipoComprobante,
      "Dato"
    );
    let numeroDato = docSnap2.data().ultimosNumeros[tipo];

    return { numero, numeroDato };
  } else {
    throw new Error(
      "NO se encontro el numero de ultimo comprbante para esta categoria!"
    );
  }
};

//str.replace(/\D+$/g, "")
// var date = new Date(unix_timestamp * 1000);
