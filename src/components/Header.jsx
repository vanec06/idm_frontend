import React from "react";
import {
  RiNotification3Line,
  RiArrowDownSLine,
  RiSettings3Line,
  RiLogoutCircleRLine,
  RiThumbUpLine,
  RiChat3Line,
} from "react-icons/ri";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header
      style={{
        backgroundColor: "#37474F", 
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
                2
              </span>
            </MenuButton>
          }
          align="end" arrowClassName="bg-secondary-100" menuClassName="bg-secondary-100 p-4"
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
            Notificaciones (1)
          </h1>
          <hr style={{ margin: "6px 0", borderColor: "#ccc" }} />
          <MenuItem
            style={{ padding: "0", backgroundColor: "transparent" }}
          >
            {/* Contenido de una notificación */}
            <Link
              to="/"
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
                src="https://img.freepik.com/foto-gratis/feliz-optimista-guapo-gerente-ventas-latina-apuntando-lado-mirando-camara_1262-12679.jpg"
                alt="Profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div style={{ flex: "1" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Tostadora</span>{" "}
                  <span style={{ fontSize: "10px" }}><><br /><br /></> 21/10/2022</span>
                </div>
                <p style={{ color: "#999", fontSize: "10px" }}>
                  
                </p>
              </div>
            </Link>
          </MenuItem>
          {/* Resto de notificaciones */}
        </Menu>
        {/* Menú de perfil */}
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
                src="https://img.freepik.com/foto-gratis/feliz-optimista-guapo-gerente-ventas-latina-apuntando-lado-mirando-camara_1262-12679.jpg"
                alt="Profile"
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <span>Administrador </span>
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
              to="/perfil"
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
                src="https://img.freepik.com/foto-gratis/feliz-optimista-guapo-gerente-ventas-latina-apuntando-lado-mirando-camara_1262-12679.jpg"
                alt="Profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div style={{ flex: "1" }}>
                <span style={{ fontSize: "14px" }}>Administrador</span>
                <span style={{ color: "#999", fontSize: "10px" }}> <br />
                  admin@gmail.com
                </span>
              </div>
            </Link>
          </MenuItem>
          <hr style={{ margin: "4px 0", borderColor: "#ccc" }} />
          {/* Enlaces del menú de perfil */}
          <MenuItem
            style={{ padding: "0", backgroundColor: "transparent" }}
          >
            <Link
              to="/configuracion"
              style={{
                color: "#ccc",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
            >
              <RiSettings3Line /> Configuración
            </Link>
          </MenuItem>
          <MenuItem
            style={{ padding: "0", backgroundColor: "transparent" }}
          >
          </MenuItem>
        </Menu>
      </nav>
    </header>
  );
};

export default Header;

