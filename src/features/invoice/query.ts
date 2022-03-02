import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  DocumentData,
  updateDoc,
  CollectionReference,
  query,
  where,
  getDocs,
  DocumentReference,
  Timestamp,
  Query,
  orderBy,
  limit,
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

const getInvoices = async (
  year: string,
  tipoComprobante: "egreso" | "ingresos" | "gastos",
  numeroDesde: number,
  tipoBusqueda: "numero" | "fechas",
  fechaDesde: Timestamp,
  fechaHasta: Timestamp
) => {
  // se puede udsar nuestro tipo de dato especifico en lugar de db, pues este lo incluye con el tipo de dato

  try {
    const listaComprobantes = createSubCollection<Icomprobante>(
      "comprobantes",
      year,
      `listaComprobantes${tipoComprobante}`
    );

    let resultado: Icomprobante[] = [];
    let q = query(listaComprobantes, where("numeroValor", ">", numeroDesde));

    if (tipoBusqueda === "numero") {
      q = query(
        listaComprobantes,
        where("numeroValor", ">", numeroDesde),
        limit(50)
      );
    }
    if (tipoBusqueda === "fechas") {
      q = query(
        listaComprobantes,
        where("fechaAplica", ">=", fechaDesde),
        where("fechaAplica", "<=", fechaHasta),
        orderBy("fechaAplica", "desc"),
        limit(50)
      );
    }

    const querySnapshot = await getDocs(q!);

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      resultado.push(doc.data());
      //console.log(doc.id, " => ", doc.data());
    });

    return resultado;
  } catch (error: any) {
    throw new Error(error.message);
  }

  // doc.data() will be undefined in this case
};

export default getInvoices;
