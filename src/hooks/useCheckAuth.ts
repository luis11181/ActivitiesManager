import { useAppSelector, useAppDispatch } from "../app/hooks";
import { useCallback, useEffect, useLayoutEffect } from "react";
import {
  changeAuthState,
  changeJWTFechaExpiracion,
  changeJwtToken,
  changeUserId,
} from "../app/mainStateSlice";

export default function useCheckAuth() {
  const dispatch = useAppDispatch();

  //revisa si esta logueado

  useLayoutEffect(() => {
    let JWTToken = localStorage.getItem("JWTToken");
    let JWTFechaExpiracion = localStorage.getItem("JWTFechaExpiracion");
    let userId = localStorage.getItem("userId");

    if (
      !JWTToken ||
      !JWTFechaExpiracion ||
      !userId ||
      new Date(JWTFechaExpiracion) <= new Date()
    ) {
      dispatch(changeAuthState(false));
      dispatch(changeJwtToken(null));
      dispatch(changeJWTFechaExpiracion(null));
      dispatch(changeUserId(null));

      localStorage.removeItem("JWTToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("JWTFechaExpiracion");

      console.log("corrio la funcion de  useCheckAuth");
    }
  }, [dispatch]);

  //console.log("corrio la funcion de CheckAuth en el use effect");
}
