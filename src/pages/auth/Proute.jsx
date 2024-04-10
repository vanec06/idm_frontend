import { Route } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ element, ...rest }) => {
  const isAuthenticated = !!Cookies.get("token");

  console.log("Is Authenticated:", isAuthenticated);

  return isAuthenticated ? (
    <Route {...rest} element={element} />
  ) : null;
};

export default PrivateRoute;

export const Proteger = ({ Ruta, Rol, usuario }) => {
  const rol = usuario ? usuario.rol : null;

  if (rol && Rol.includes(rol)) {

    return Ruta
  } else {
    if (window.history && window.history.length > 1) {
      window.history.go(-1);
    } else {
      window.location.href = '/sidebar';
    }
  }
}
