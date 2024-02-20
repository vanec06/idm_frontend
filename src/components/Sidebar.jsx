import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { RiLogoutCircleRLine, RiMenu3Line, RiCloseLine, RiCustomerService2Line } from "react-icons/ri";
import { FaBell, FaUser, FaLeaf, FaCog, FaTools, FaMap } from "react-icons/fa";

const Sidebar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };
   return (
    <>
      <div
        className={`xl:h-[100vh] overflow-y-scroll fixed xl:static w-[80%] md:w-[40%] lg:w-[30%] xl:w-auto h-full top-0 bg-customBlue p-4 flex flex-col justify-between z-50 ${
          showMenu ? "left-0" : "-left-full"
        } transition-all`}
      >
        <div>
          <h1 className="text-center text-2xl font-bold text-white mb-10">
            <img
              src="../public/img/logo.jpg"
              alt="Descripción de la imagen"
              className="w-14 h-14 mr-2 rounded-full inline-block"
            />
            <span className="text-primary text-4xl"></span>
          </h1>
          <ul>
            <li>
              <Link
                to="/crudUsuario"
                className="flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-900 transition-colors"
              >
                <FaUser className="text-primary" /> Usuario
              </Link>
            </li>
            <li>
              <Link
                to="/maquina"
                className="flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-900 transition-colors"
              >
                <FaCog className="text-primary" /> Maquina
              </Link>
            </li>
            <li>
              <Link
                to="/Nmantenimiento"
                className="flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-900 transition-colors"
              >
                <FaBell className="text-primary" /> Notificacion
              </Link>
            </li>
            <li>
              <Link
                to="/ambiente"
                className="flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-900 transition-colors"
              >
                <FaLeaf className="text-primary" /> Ambiente
              </Link>
            </li>
            <li>
              <Link
                to="/area"
                className="flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-900 transition-colors"
              >
                <FaMap className="text-primary text-xl" /> Area
              </Link>
            </li>
            <li>
              <Link
                to="/mantenimiento"
                className="flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-900 transition-colors"
              >
                <FaTools className="text-primary" /> Mantenimiento
              </Link>
            </li>
            <li>
              <Link
                to="/tickets"
                className="flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-900 transition-colors"
              >
                <RiCustomerService2Line className="text-primary" /> Soporte técnico
              </Link>
            </li>
          </ul>
        </div>
        <nav>
          <Link
            to="/login"
            onClick={handleLogout}
            className="flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-900 transition-colors"
          >
            <RiLogoutCircleRLine className="text-primary" /> Cerrar sesión
          </Link>
        </nav>
      </div>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="xl:hidden fixed bottom-4 right-4 bg-primary text-black p-3 rounded-full z-50"
      >
        {showMenu ? <RiCloseLine /> : <RiMenu3Line />}
      </button>
    </>
  );
};

export default Sidebar;