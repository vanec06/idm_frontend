import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import LayoutAuth from "./layouts/LayoutAuth";
import LayoutAdmin from "./layouts/LayoutAdmin";
// Pages auth
import Login from "./pages/auth/Login";
import ForgetPassword from "./pages/auth/ForgetPassword";
// Pages admin
import Home from "./pages/admin/Home";
import Profile from "./pages/admin/Profile";
import Chat from "./pages/admin/Chat";
import Error404 from "./pages/Error404";
import Tickets from "./pages/admin/CardUsu";
import Usuario from "./pages/admin/Usuario";
import Nmantenimiento from "./pages/admin/Nmantenimiento";
import Ambiente from "./pages/admin/Ambiente";
import Area from "./pages/admin/Area";
import Mantenimiento from "./pages/admin/mantenimiento";
import Maquina from "./pages/admin/Maquina";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/olvide-password" element={<ForgetPassword />} />
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<Home />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="chat" element={<Chat />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="crudUsuario" element={<Usuario />} />
          <Route path="Nmantenimiento" element={<Nmantenimiento />} />
          <Route path="ambiente" element={<Ambiente />} />
          <Route path="area" element={<Area />} />
          <Route path="mantenimiento" element={<Mantenimiento />} />
          <Route path="maquina" element={<Maquina />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
