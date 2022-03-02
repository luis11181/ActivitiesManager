import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/UI/LoadingSpinner";

//* importa estilos generales que yo defini
import "./App.css";

import { Counter } from "./pages/CounterPage";
import RequireAuth from "./components/middleware/RequireAuth";
import AuthPage from "./pages/AuthPage";
import MainPage from "./pages/MainPage";
import NotFound from "./pages/NotFound";
import useCheckAuth from "./hooks/useCheckAuth";
import { useLayoutEffect } from "react";

function App() {
  //Hook para checar el estado de autenticacion y subscribirse a sus cambios
  // useLayoutEffect(() => {
  //   useCheckAuth();
  //   //console.log("corrio la funcion de CheckAuth en el use effect");
  // }, []);

  useCheckAuth();
  return (
    <Layout>
      {
        //* suspense with  React.lazy(() => import("./pages/NewQuote")) let us only load the component that is being deployed at first, so it will only load the initial page or the one we visit or want, and later the other ones
      }
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signIn" element={<AuthPage />} />
        {/* <Route
          path="/crear-comprobante"
          element={
            <RequireAuth>
              <NewInvoice />
            </RequireAuth>
          }
        /> */}

        <Route
          path="/counter"
          element={
            <RequireAuth>
              <Counter />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
