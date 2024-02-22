import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  RiLogoutCircleRLine,
  RiCustomerService2Line,
  RiErrorWarningLine,
} from "react-icons/ri";
import { FaBell, FaUser, FaLeaf, FaCog, FaTools, FaMap } from "react-icons/fa";

const Sidebar = () => {
  const [showMenu, setShowMenu] = useState(true); // Cambiado a true
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <div style={showMenu ? styles.sidebarOpen : styles.sidebarClosed} className="sidebar">
      <div style={styles.logoContainer}>
        <img
          src="../public/img/logo.jpg"
          alt="Descripción de la imagen"
          style={styles.logo}
        />
        <span style={styles.logoText}>IDM</span>
      </div>
      <ul style={styles.menu}>
        <li>
          <Link to="/crudUsuario" style={styles.menuItem}>
            <FaUser style={styles.menuIcon} /> Usuario
          </Link>
        </li>
        <li>
          <Link to="/maquina" style={styles.menuItem}>
            <FaCog style={styles.menuIcon} /> Maquina
          </Link>
        </li>
        <li>
          <Link to="/Nmantenimiento" style={styles.menuItem}>
            <FaBell style={styles.menuIcon} /> Notificacion
          </Link>
        </li>
        <li>
          <Link to="/ambiente" style={styles.menuItem}>
            <FaLeaf style={styles.menuIcon} /> Ambiente
          </Link>
        </li>
        <li>
          <Link to="/area" style={styles.menuItem}>
            <FaMap style={styles.menuIcon} /> Area
          </Link>
        </li>
        <li>
          <Link to="/mantenimiento" style={styles.menuItem}>
            <FaTools style={styles.menuIcon} /> Mantenimiento
          </Link>
        </li>
        <li>
          {/* <Link to="/tickets" style={styles.menuItem}>
            <RiCustomerService2Line style={styles.menuIcon} /> Soporte técnico
          </Link> */}
        </li>
      </ul>
      <div style={styles.logoutContainer}>
        <Link
          to="/login"
          onClick={handleLogout}
          style={styles.logoutLink}
        >
          <RiLogoutCircleRLine style={styles.menuIcon} /> Cerrar sesión
        </Link>
      </div>
    </div>
  );
};

const styles = {
  sidebarOpen: {
    width: "250px",
    transition: "width 0.3s ease-in-out",
    backgroundColor: "#37474F", // Cambiar color de fondo del sidebar
  },
  sidebarClosed: {
    width: "50px",
    transition: "width 0.3s ease-in-out",
    backgroundColor: "#37474F", // Cambiar color de fondo del sidebar
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