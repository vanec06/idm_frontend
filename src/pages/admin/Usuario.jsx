import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdUpdate } from 'react-icons/md';
import MUIDataTable from 'mui-datatables';

const Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/usuario/listar')
      .then(response => response.json())
      .then(data => setUsuarios(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleDesactivarUsuario = async (identificacion) => {
    await fetch(`http://localhost:4000/usuario/cambiarEstado/${identificacion}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const updatedUsers = await fetch('http://localhost:4000/usuario/listar')
      .then(response => response.json())
      .catch(error => console.error('Error fetching users:', error));

    setUsuarios(updatedUsers);
  };

  const columns = [
    { name: 'id_usuario', label: 'ID' },
    { name: 'identificacion', label: 'Identificación' },
    { name: 'nombres', label: 'Nombres' },
    { name: 'apellidos', label: 'Apellidos' },
    { name: 'telefono', label: 'Teléfono' },
    { name: 'correo', label: 'Correo Electrónico' },
    { name: 'estado', label: 'Estado' },
    { name: 'contraseña', label: 'Contraseña', options: { display: 'false' } },
    { name: 'rol', label: 'Rol', options: { display: 'false' } },
    {
      name: 'acciones',
      label: 'Acciones',
      options: {
        display: 'false',
        customBodyRender: (value, tableMeta, updateValue) => {
          const usuario = usuarios[tableMeta.rowIndex];
          return (
            <div>
              <button onClick={() => openModal(usuario)}>
                <FaEdit className="text-orange-400 text-xl" />
              </button>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    responsive: 'standard', // or 'vertical' or 'simple'
    onRowClick: (rowData) => {
      const usuario = usuarios[rowData[0]];
      openModal(usuario);
    },
  };

  return (
    <div>
      <h2 className="text-black text-3xl font-bold mb-5 px-6 w-full">Lista de Usuarios</h2>
      <div className='w-full h-20 bg-customBlue flex items-center justify-between px-4'>
        <div>
          <button className='text-white w-40 h-10 bg-green-600 rounded-md' onClick={() => openModal(null)}>
            Registrar
          </button>
        </div>
      </div>
      <div className="mt-8 mx-6">
        <MUIDataTable
          title={"Usuarios"}
          data={usuarios.map(usuario => [usuario.id_usuario, usuario.identificacion, usuario.nombres, usuario.apellidos, usuario.telefono, usuario.correo, usuario.estado, usuario.contraseña, usuario.rol, null])}
          columns={columns}
          options={options}
        />
      </div>
    </div>
  );
};

export default Usuario;
