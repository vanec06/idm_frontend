import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Pages auth
import Login from "./pages/auth/Login";
import ForgetPassword from "./pages/auth/ForgetPassword";
// Pages admin
import Home from "./pages/admin/Home";
import Profile from "./pages/admin/Profile";
import Usuario from "./pages/admin/Usuario";
import Ambiente from "./pages/admin/Ambiente";
import Area from "./pages/admin/Area";
import Mantenimiento from "./pages/admin/mantenimiento";
import Nmantenimiento from "./pages/admin/Nmantenimeinto";
import Maquina from "./pages/admin/Maquina";
import Sidebar from "./components/Sidebar";
import Api from "./components/Api";
import { useEffect, useState } from "react";
import { Proteger } from "./pages/auth/Proute";
import Vista from "./usuario";

function App() {
  const [usuario, setUsuario] = useState(null);
  const ruta = useLocation();


  const validarRuta = async () => {
    try {
      const resp = await Api.get('/api/validarRuta')
      console.log(resp.data.autorizado);

      if (resp.data.autorizado == true) {
        setUsuario(resp.data.user);
        if (ruta.pathname == '/') {
          if (ruta.pathname.includes('/sidebar')) {
            window.history.go(-1);
          } else {
            location.href = '/sidebar';
          }
        }
      } else {
        if (ruta.pathname.includes('sidebar')) {
          location.href = '/';
        }
      }

    } catch (error) {
      console.log('ERROR: ', error);
    }
  }

  useEffect(() => {
    validarRuta();
  }, [ruta.pathname])

  if (ruta.pathname.includes('/sidebar')) {
    if (!usuario) {
      return
    }
  }


  return (
    // <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/olvide-password" element={<ForgetPassword />} />
      <Route path="/inventario" element={<Vista />} />

      <Route path="/sidebar" element={<Sidebar usuario={usuario} />}>
        <Route index element={<Home />} />
        <Route path="perfil" element={usuario ? <Proteger usuario={usuario} Rol={['administrador', 'usuario']} Ruta={<Profile usuario={usuario} />} /> : null} />
        <Route path="crudUsuario" element={usuario ? <Proteger usuario={usuario} Rol={['administrador']} Ruta={<Usuario />} /> : null} />
        <Route path="ambiente" element={usuario ? <Proteger usuario={usuario} Rol={['administrador']} Ruta={<Ambiente />} /> : null} />
        <Route path="area" element={usuario ? <Proteger usuario={usuario} Rol={['administrador']} Ruta={<Area />} /> : null} />
        <Route path="mantenimiento" element={usuario ? <Proteger usuario={usuario} Rol={['administrador', 'tecnico']} Ruta={<Mantenimiento />} /> : null} />
        <Route path="Nmantenimiento" element={usuario ? <Proteger usuario={usuario} Rol={['administrador', 'tecnico']} Ruta={<Nmantenimiento />} /> : null} />
        <Route path="maquina" element={usuario ? <Proteger usuario={usuario} Rol={['administrador']} Ruta={<Maquina />} /> : null} />
      </Route>
    </Routes>
    // </BrowserRouter>
  );
}

export default App;
