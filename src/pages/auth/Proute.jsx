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
