import React, { useState, useEffect } from 'react';
import { ruta } from './Api';

const CountUsu = () => {
  const [lastUsers, setLastUsers] = useState([]);

  useEffect(() => {
    const dataToSend = { limiteMain: true };

    fetch(`http://${ruta}:4000/maquina/listar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('MAQUINAS: ', data);
        setLastUsers(data);
      })
      .catch((error) => console.error('Error fetching last users:', error));

  }, []);

  return (
    
    <div className="mt-8 flex flex-col justify-center items-center">
      <h2 className="text-3xl font-bold mb-5 px-6 w-96 text-black ma">Ultimos Equipos Registrados</h2>
      {lastUsers && lastUsers.length > 0 ? (
        <table className="max-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-blue-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Marca</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Modelo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Serial</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">imagen</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">descripcion</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {lastUsers.map(({ id_maquina, nombre_maquina, marca, modelo, serial, correo, estado_maquina, imagen, descripcion, placa }) => (
              <tr key={id_maquina}>
                <td className="text-black px-4 py-3 whitespace-nowrap">{id_maquina}</td>
                <td className="text-black px-4 py-3 whitespace-nowrap">{nombre_maquina}</td>
                <td className="text-black px-4 py-3 whitespace-nowrap">{marca}</td>
                <td className="text-black px-4 py-3 whitespace-nowrap">{modelo}</td>
                <td className="text-black px-4 py-3 whitespace-nowrap">{serial}</td>
                <td className="text-black px-4 py-3 whitespace-nowrap">{estado_maquina}</td>
                <td className="text-black px-4 py-3 whitespace-nowrap">  <img  className='table-img' style={{width : "100px"}} src={`http://${ruta}:4000/images/img/${placa}/${imagen}`} alt="Imagen de la máquina" /></td>
                <td className="text-black px-4 py-3 whitespace-nowrap">{descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">No hay maquinas disponibles</p>
      )}
    </div>
  );
};

export default CountUsu;
