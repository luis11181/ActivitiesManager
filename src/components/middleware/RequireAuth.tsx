import { useLocation, Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

// type Props = {
//   title: string;
//   children: JSX.Element;
// };

//const RequireAuth = ({ children }: Props) => {
function RequireAuth({ children }: { children: JSX.Element }) {
  const authed: boolean | null = useAppSelector(
    (state) => state.main.autenticado
  );
  const location = useLocation();
  //let navigate = useNavigate();

  if (!authed) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/signIn" state={{ from: location }} replace />;
  }

  return children;
}

export default RequireAuth;
