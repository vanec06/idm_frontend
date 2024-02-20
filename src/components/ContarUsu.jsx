import React, { useState, useEffect } from 'react';

const CountUsu = () => {
  const [lastUsers, setLastUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/contar/nuevousuario')
      .then((response) => response.json())
      .then((data) => setLastUsers(data))
      .catch((error) => console.error('Error fetching last users:', error));
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold mb-5 px-6 w-96">Últimos Usuarios Agregados</h2>
      {lastUsers && lastUsers.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-blue-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Identificación</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Apellido</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Teléfono</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Correo Electrónico</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Contraseña</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Rol</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {lastUsers.map(({ id_usuario, identificacion, nombres, apellidos, telefono, correo, estado, contraseña, rol }) => (
              <tr key={id_usuario}>
                <td className="text-black px-4 py-3 whitespace-nowrap">{id_usuario}</td>
                <td className="text-black px-4 py-3 whitespace-nowrap">{identificacion}</td>
                <td className="text-black px-4 py-3 whitespace-nowrap">{nombres}</td>
                <td className="text-black px-4 py-3 whitespace-nowrap">{apellidos}</td>
                <td className="text-black px-4 py-3 whitespace-nowrap">{telefono}</td>
                <td className="text-black px-4 py-3 whitespace-nowrap">{correo}</td>
                <td className="text-black px-4 py-3 whitespace-nowrap">{estado}</td>
                <td className="text-black px-4 py-3 whitespace-nowrap">{contraseña}</td>
                <td className="text-black px-4 py-3 whitespace-nowrap">{rol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">No hay usuarios disponibles</p>
      )}
    </div>
  );
};

export default CountUsu;
