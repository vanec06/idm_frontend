import React, { useState, useEffect } from "react";
import CardTicket from "../../components/CardUsu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import CountUsu from '../../components/ContarUsu';
import { ruta } from "../../components/Api";

const Home = () => {
  const [usuarios, setUsuarios] = useState(0);
  const [maquinas, setMaquinas] = useState(0);
  const [mantenimientos, setMantenimientos] = useState(0);
  const [areas, setAreas] = useState(0);
  const [lastUsers, setLastUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usuariosResponse = await fetch(`http://${ruta}:4000/contar/usuarios`);
        const maquinasResponse = await fetch(`http://${ruta}:4000/contar/maquinas`);
        const mantenimientosResponse = await fetch(`http://${ruta}:4000/contar/mantenimientos`);
        const areasResponse = await fetch(`http://${ruta}:4000/contar/areas`);
        const lastUsersResponse = await fetch(`http://${ruta}:4000/contar/nuevousuario`);

        const usuariosData = await usuariosResponse.json();
        const maquinasData = await maquinasResponse.json();
        const mantenimientosData = await mantenimientosResponse.json();
        const areasData = await areasResponse.json();
        const lastUsersData = await lastUsersResponse.json();

        setUsuarios(usuariosData.total || 0);
        setMaquinas(maquinasData.total || 0);
        setMantenimientos(mantenimientosData.total || 0);
        setAreas(areasData.total || 0);
        setLastUsers(lastUsersData || []);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <CardTicket ticket="total" totalTickets={usuarios} text="Usuarios" lastUsers={lastUsers} />
      <CardTicket ticket="pending" totalTickets={maquinas} text="Máquinas" lastUsers={lastUsers} />
      <CardTicket ticket="inProcess" totalTickets={mantenimientos} text="Mantenimientos" lastUsers={lastUsers} />
      <CardTicket ticket="close" totalTickets={areas} text="Áreas" lastUsers={lastUsers} />
      
      <CountUsu lastUsers={lastUsers} />
    </div>
  );
};

export default Home;
