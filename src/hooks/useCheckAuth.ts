import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { useEffect, useLayoutEffect } from "react";
import { changeAuthState } from "../app/mainStateSlice";
import { changeCorreoUsuario } from "../app/mainStateSlice";
import { changeNombreUsuario } from "../app/mainStateSlice";
import { selectCorreo } from "../app/mainStateSlice";

export default function useCheckAuth() {
  const dispatch = useAppDispatch();

  const authed: boolean | null = useAppSelector(
    (state) => state.main.autenticado
  );
  const correo: string | null = useAppSelector(selectCorreo);

  //revisa si esta logueado
  useLayoutEffect(() => {
    if (auth.currentUser) {
      dispatch(changeAuthState(true));
      dispatch(changeNombreUsuario(auth.currentUser.displayName));
      dispatch(changeCorreoUsuario(auth.currentUser.email));
    }
    //console.log("corrio la funcion de CheckAuth en el use effect");
  }, [dispatch]);

  // se subscribe a cambios en el estado de autenticacion
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      // The user object has basic properties such as display name, email, etc.
      const displayName = user.displayName;
      const email = user.email;
      // console.log(displayName, email);
      dispatch(changeAuthState(true));
      dispatch(changeNombreUsuario(displayName));
      dispatch(changeCorreoUsuario(email));

      // console.log("corrio la funcion de CheckAuth");

      // const photoURL = user.photoURL;
      // const emailVerified = user.emailVerified;

      // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
      const uid = user.uid;
      // ...
      //!there are maybe problems if user sign with a provider, data is extracted like this
      user.providerData.forEach((profile) => {
        //console.log("Sign-in provider: " + profile.providerId);
        //console.log("  Provider-specific UID: " + profile.uid);
        // console.log("  Name: " + profile.displayName);
      });
      //user.providerData.profile.uid
    } else {
      dispatch(changeAuthState(false));
      dispatch(changeNombreUsuario(null));
      dispatch(changeCorreoUsuario(null));
      // User is signed out
      // ...
    }
  });
}
