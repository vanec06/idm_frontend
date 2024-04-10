import React, { useEffect, useState } from "react";
import { Link, } from "react-router-dom";
import Cookies from "js-cookie";
import {
  RiLogoutCircleRLine, RiNotification3Line, RiArrowDownSLine, RiSettings3Line,
} from "react-icons/ri";
import { FaBell, FaUser, FaLeaf, FaCog, FaTools, FaMap } from "react-icons/fa";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import { Outlet } from "react-router-dom";
import Api, { ruta } from "./Api";
import Swal from 'sweetalert2';


const Sidebar = ({ usuario }) => {
  const [showMenu] = useState(true);
  const [contador, setContador] = useState(0);
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    listarNotificaciones();
    setContador(notificaciones.length);
  }, [notificaciones.length])


  // const Sidebar = () => {
  //   const [showMenu] = useState(true); 
  //   const [contador,setContador] = useState();

  //   setContador('2')

  // const [contador, setContador] = useState(0);

  // // Función para incrementar el contador
  // const incrementarContador = () => {
  //   setContador(contador + 1);
  // };

  const listarNotificaciones = async () => {
    try {
      const response = await Api.post(`http://${ruta}:4000/notificacion/listar`, { filtro: true });
      const data = response.data;

      if (data.length > 0) {
        setNotificaciones(data);
      } else {
        console.error('Error al listar las Notificaciones:', data.message);
      }
    } catch (error) {
      console.error('Error al listar las Notificaciones:', error);
    }
  };

  const cambiarEstado = async (value, id, descripcion) => {
    try {
      Swal.fire({
        title: (value == 1 ? 'Aceptar' : 'Omitir'),
        text: "Descripción: " + descripcion,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: value == 1 ? "Aceptar" : 'Omitir'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const resp = await Api.put('/notificacion/estado/' + id, { estado: value })
          if (resp.data.status == true) {
            // console.log('ESTADO: ', resp);
            listarNotificaciones()
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al cambiar de estado.',
            });

          }
        }
      });
    } catch (error) {
      console.log('ERROR NOTIFICACION: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Error interno del servidor!',
      });
    }
  }

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <div id="mainContent" >
      <link rel="stylesheet" href="../../public/css/sidebar.css" />
      <div style={showMenu ? styles.sidebarOpen : styles.sidebarClosed} className="sidebar">
        <div style={styles.logoContainer}>
          <Link to="/sidebar">
            <img
              src="../public/img/logo.jpg"
              alt="Descripción de la imagen"
              style={styles.logo}
            />
          </Link>
          <span style={styles.logoText}>IDM</span>
        </div>
        <ul style={styles.menu}>
          <li>
            {usuario.rol == 'administrador' ?
              <Link to="/sidebar/crudUsuario" style={styles.menuItem}>
                <FaUser style={styles.menuIcon} /> Usuario
              </Link>
              : ''}
          </li>
          <li>
            {usuario.rol == 'administrador' ?
              <Link to="/sidebar/maquina" style={styles.menuItem}>
                <FaCog style={styles.menuIcon} /> Maquina
              </Link>
              : ''}
          </li>
          <li>
            {usuario.rol == 'administrador' ?
              <Link to="/sidebar/ambiente" style={styles.menuItem}>
                <FaLeaf style={styles.menuIcon} /> Ambiente
              </Link>
              : ''}
          </li>
          <li>
            {usuario.rol == 'administrador' ?
              <Link to="/sidebar/area" style={styles.menuItem}>
                <FaMap style={styles.menuIcon} /> Area
              </Link>
              : ''}
          </li>
          <li>
            {usuario.rol == 'administrador' || usuario.rol == 'tecnico' ?
              <Link to="/sidebar/Nmantenimiento" style={styles.menuItem}>
                <FaBell style={styles.menuIcon} />Notificacion Mantenimiento
              </Link>
              : ''}
          </li>
          <li>
            {usuario.rol == 'administrador' || usuario.rol == 'tecnico' ?
              <Link to="/sidebar/mantenimiento" style={styles.menuItem}>
                <FaTools style={styles.menuIcon} /> Mantenimiento
              </Link>
              : ''}
          </li>
          <li>
            {usuario.rol == 'administrador' || usuario.rol == 'usuario' ?
              <Link to="/inventario" style={styles.menuItem}>
                <FaUser style={styles.menuIcon} /> Vista Usuario
              </Link>
              : ''}
          </li>

        </ul>
        <div style={styles.logoutContainer}>
          <Link
            to="/"
            onClick={handleLogout}

            style={styles.logoutLink}
          >
            <RiLogoutCircleRLine style={styles.menuIcon} /> Cerrar sesión
          </Link>
        </div>
      </div>


      {/* HEADER  */}
      <div >
        <header
          style={{

            backgroundColor: "#2A5D84",
            height: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end", // Alineado al extremo derecho
          }}
        >
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {/* Menú de notificaciones */}
            <Menu
              menuButton={
                <MenuButton
                  style={{
                    position: "relative",
                    padding: "10px",
                    borderRadius: "10px",
                    color: "#fff",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                  }}
                >
                  <RiNotification3Line style={{ fontSize: "20px" }} />
                  <span
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      backgroundColor: "#f00",
                      padding: "3px 6px",
                      borderRadius: "50%",
                      fontSize: "10px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                  >
                    {contador}
                  </span>
                </MenuButton>
              }
              align="end" arrowClassName="bg-secondary-100" menuClassName="bg-secondary-100 p-4 w-[500px]"
            >
              {/* Contenido del menú de notificaciones */}
              <h1
                style={{
                  color: "#ccc",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Notificaciones {notificaciones.length}
              </h1>
              <hr style={{ margin: "6px 0", borderColor: "#ccc" }} />

              <div className="flex flex-col w-full gap-2">
                {notificaciones.map((notificacion) =>
                  <div key={notificacion.id_notificacion} className="bg-gray-700 flex">

                    <span className="block p-2 text-white w-full" key={notificacion.id_notificacion}>{notificacion.comentarios}</span>
                    <div className="flex justify-end w-max gap-2 items-center">
                      {notificacion.estado == 'aceptar' ? (<p className="flex bg-green-100 rounded-full text-green-600 items-center h-[24px]"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      </p>) :

                        (
                          <>
                            <button className="bg-blue-200 text-center p-2 h-[40px] rounded" onClick={() => cambiarEstado(1, notificacion.id_notificacion, notificacion.comentarios)}>Aceptar</button>
                            <button className="bg-red-300 text-center p-2 h-[40px] rounded" onClick={() => cambiarEstado(2, notificacion.id_notificacion, notificacion.comentarios)}>Omitir</button>
                          </>
                        )
                      }
                    </div>
                  </div>
                )}
                <p style={{ color: "#999", fontSize: "10px" }}>

                </p>
              </div>

              {/* Resto de notificaciones */}
            </Menu>
            {/* Menú de perfil */}
            {usuario.rol != 'tecnico' ?   
            <Menu
              menuButton={
                <MenuButton
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "10px",
                    borderRadius: "10px",
                    color: "#fff",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                  }}
                >
                  <img
                    src="../public/img/user.jpg"
                    alt="Profile"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <span>Usuario </span>
                  <RiArrowDownSLine />
                </MenuButton>
              }
              align="end"
              arrow
              arrowClassName="bg-secondary-100"
              transition
              menuClassName="bg-secondary-100 p-4"
            >
              {/* Contenido del menú de perfil */}
              <MenuItem
                style={{ padding: "0", backgroundColor: "transparent" }}
              >
                <Link
                  to="/sidebar/perfil"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#ccc",
                    gap: "10px",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    textDecoration: "none",
                  }}
                >
                  <img
                    src="../public/img/user.jpg"
                    alt="Profile"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                    <div style={{ flex: "1" }}>
                    <span style={{ fontSize: "15px" }}>Usuario</span>
                    <span style={{ color: "#999", fontSize: "13px" }}> <br />
                      Ver perfil
                    </span>
                  </div>
            
                </Link>
              </MenuItem>
              <hr style={{ margin: "4px 0", borderColor: "#ccc" }} />
              {/* Enlaces del menú de perfil */}
              <MenuItem
                style={{ padding: "0", backgroundColor: "transparent" }}
              >
              </MenuItem>
              <MenuItem
                style={{ padding: "0", backgroundColor: "transparent" }}
              >
              </MenuItem>
            </Menu>
             : ''}
          </nav>
        </header>
      </div>
      <div style={{ overflow: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
};

const styles = {
  sidebarOpen: {
    transition: "width 0.3s ease-in-out",
    backgroundColor: "#2A5D84", // Cambiar color de fondo del sidebar
  },
  logoContainer: {
    padding: "20px",
    borderBottom: "1px solid #546E7A",
  },
  logo: {
    width: "50px",
    height: "50px",
    marginRight: "10px",
    borderRadius: "50%",
  },
  logoText: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#ffffff", // Cambiar color del texto del logo
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
  },
  menu: {
    listStyle: "none",
    padding: "0",
    margin: "0",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 20px",
    borderRadius: "5px",
    color: "#ffffff", // Cambiar color del texto del menú
    textDecoration: "none",
  },
  menuIcon: {
    fontSize: "20px",
    color: "#ffffff", // Cambiar color de los íconos del menú
  },
  logoutContainer: {
    padding: "20px",
  },
  logoutLink: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 20px",
    borderRadius: "5px",
    color: "#ffffff", // Cambiar color del texto del enlace de cierre de sesión
    textDecoration: "none",
  },
};

export default Sidebar;
