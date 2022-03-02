// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {
  Timestamp,
  getFirestore,
  CollectionReference,
  DocumentReference,
  collection,
  DocumentData,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);
// Initialize Firebase
export default app;
export const analytics = getAnalytics(app);
export const auth = getAuth();
export const db = getFirestore();

//! add  type definitions for firebase
// This is just a helper to add the type to the db responses
const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>;
};

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

// Import all your model types
export type Icomprobante = {
  banco: string;
  tipoComprobante: string;
  numero: string;
  numeroValor: number;
  observaciones: string;
  usuarioCreacion: string;
  usuarioModificacion: string | null;
  formaPago: string;
  fechaAplica: Timestamp;
  fechaModificacion: Timestamp | null;
  fechaCreacion: Timestamp;
  chequeNumero: string;
  lista: {
    codigoPuc: string;
    concepto: string;
    valor: number;
  }[];
};

type Iyear = {
  //year: {DocumentReference<>DocumentReference<Icomprobante>;}
  ultimosNumeros: {
    egreso: number;
    egresoDato: string;
    gastos: number;
    gastosDato: string;
    ingresos: number;
    ingresosDato: string;
  };
};
// export all your collections
// export const listaComprobantes = createSubCollection<Icomprobante>(
//   "comprobantes",
//   "2022", //cambio
//   "listaComprobantesegreso"
// );

export const comprobantes = createCollection<Iyear>("comprobantes");
