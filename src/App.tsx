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
import CrearFlujos from "./pages/CrearFlujos";
import EstructuraEmpresarial from "./pages/EstructuraEmpresarial";

function App() {
  //Hook para checar el estado de autenticacion y subscribirse a sus cambios
  useCheckAuth();

  // fetch('http://localhost:8080/feed/posts?page=' + page, {
  //     headers: {
  //       Authorization: 'Bearer ' + this.props.token
  //     }
  //   })

  return (
    <Layout>
      {
        //* suspense with  React.lazy(() => import("./pages/NewQuote")) let us only load the component that is being deployed at first, so it will only load the initial page or the one we visit or want, and later the other ones
      }
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signIn" element={<AuthPage />} />

        <Route
          path="/admin/crear-flujos"
          element={
            <RequireAuth>
              <CrearFlujos />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/estructuraEmpresarial"
          element={
            <RequireAuth>
              <EstructuraEmpresarial />
            </RequireAuth>
          }
        />

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
