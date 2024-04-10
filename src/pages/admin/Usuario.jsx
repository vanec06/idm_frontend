import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdUpdate } from 'react-icons/md';
import MUIDataTable from 'mui-datatables';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { ruta } from "../../components/Api";
import { exportToExcel } from '../../components/Reportes';

const Usuario = () => {
  const [identificacion, setIdentificacion] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [estado, setEstado] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [rol, setRol] = useState('');

  const [usuarios, setUsuarios] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    listarUsuarios();
  }, []);

  const columnsExcel = [
    { key: "nombres", label: "Nombre" },
    { key: "apellidos", label: "Apellido" },
    { key: "identificacion", label: "Identificación" },
    { key: "correo", label: "Correo" },
    { key: "telefono", label: "Télefono" },
    { key: "rol", label: "Rol" },
    { key: "estado", label: "Estado" },
  ]



  const listarUsuarios = async () => {
    try {
      const response = await fetch(`http://${ruta}:4000/usuario/listar`);
      const data = await response.json();

      if (response.ok) {
        setUsuarios(data);
      } else {
        console.error('Error al listar usuarios:', data.message);
      }
    } catch (error) {
      console.error('Error al listar usuarios:', error);
    }
  };


  const openModal = (usuario) => {
    setSelectedUsuario(usuario);
    setIdentificacion(usuario?.identificacion || '');
    setNombres(usuario?.nombres || '');
    setApellidos(usuario?.apellidos || '');
    setTelefono(usuario?.telefono || '');
    setCorreo(usuario?.correo || '');
    setRol(usuario?.rol || '');
    setEstado(usuario?.estado || '');
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedUsuario(null);
    setModalIsOpen(false);
  };


  const buscarusuarios = async (identificacion) => {
    try {
      if (!identificacion) {
        listarUsuarios();
        return;
      }

      const response = await fetch(`http://${ruta}:4000/usuario/buscar/${identificacion}`);
      const data = await response.json();

      if (response.ok) {
        if (data) {
          setUsuarios([data]);
        } else {
          setUsuarios([]);
        }
      } else {
        console.error('Error al buscar usuario:', data.message);
      }
    } catch (error) {
      console.error('Error en la búsqueda de usuario:', error);
    }
  };

  const handleRegistrarUsuario = async () => {
    try {
      const nuevoUsuario = {
        identificacion,
        nombres,
        apellidos,
        telefono,
        correo,
        estado,
        rol,
      };

      const response = await fetch(`http://${ruta}:4000/usuario/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoUsuario),
      });
      const responseData = await response.json();

      if (responseData.errors) {
        setErrors(responseData.errors);
      } else {
        closeModal();
        Swal.fire({
          icon: 'success',
          title: 'Usuario registrado correctamente',
        });

      }

      console.log("DATA REGISTER: ", responseData.errors);

      if (response.ok) {
        const updatedUsers = await fetch(`http://${ruta}:4000/usuario/listar`)
          .then((response) => response.json())
          .catch((error) => console.error('Error fetching machines:', error));

        setUsuarios(updatedUsers);
        // closeModal();

      } else {
        console.error('Error al registrar Usuario:', response.statusText);

        const responseBody = await response.json();
        setErrors(responseBody.errors || []);
        console.error('Error al registrar Usuario:', responseBody.errors);
      }
    } catch (error) {
      console.error('Error al registrar Usuario:', error);
    }
  };


  const handleActualizarUsuario = async () => {

    try {
      const usuarioActualizado = {
        id_usuario: selectedUsuario.id_usuario,
        identificacion,
        nombres,
        apellidos,
        telefono,
        correo,
        estado,
        contraseña,
        rol,
      };

      const response = await fetch(`http://${ruta}:4000/usuario/actualizar/${usuarioActualizado.id_usuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioActualizado),
      });

      const responseData = await response.json();

      if (responseData.errors) {
        setErrors(responseData.errors);
      } else {
        listarUsuarios();
        closeModal();
        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado correctamente',
          text: 'El Usuario se ha actualizado correctamente.',
        });

      }
      console.log("DATA REGISTER: ", responseData.errors);

      const updatedUsers = await fetch(`http://${ruta}:4000/usuario/listar`)
        .then((response) => response.json())
        .catch((error) => console.error('Error fetching machines:', error));

      setUsuarios(updatedUsers);
      // closeModal();

    } catch (error) {
      console.error('Error al actualizar Usuario:', error);
    }
  };

  const handleDesactivarUsuario = async (identificacion) => {
    await fetch(`http://${ruta}:4000/usuario/cambiarEstado/${identificacion}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const updatedUsers = await fetch(`http://${ruta}:4000/usuario/listar`)
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
    { name: 'rol', label: 'Rol'},
    { name: 'contraseña', label: 'Contraseña', options: { display: 'false' } }, //este es para que no aparezca en la tabla//

    
    {
      name: 'acciones',
      label: 'Acciones',
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const usuario = usuarios[tableMeta.rowIndex];
          return (
            <div>
              <button onClick={() => openModal(usuario)}>
                <FaEdit className="text-orange-400 text-xl" />
              </button>
              <button onClick={() => handleDesactivarUsuario(usuario.identificacion)} className="text-white px-2 py-1 rounded ml-2">
                <MdUpdate className="text-green-500 text-xl" />
              </button>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    filterType: 'checkbox',
    responsive: 'standard',
    print: false,
    viewColumns: false,
    download:false,
    filter:false,
    selectableRows: 'none', // If you don't want checkboxes for row selection
  };

  const handlelCancelar = () => {
    closeModal();
    window.location.reload();
  }
  return (
    <div>
      <h2 className="text-black text-3xl font-bold mb-5 px-6 w-full">Lista de Usuarios</h2>
      <div className='justify-between px-4'>
        <div>
          <button className='text-white w-40 h-10 bg-green-600 rounded-md' onClick={() => openModal(null)}>
            Registrar
          </button>
          <button className='bg-blue-400 p-2 ml-4 rounded text-white' onClick={() => exportToExcel(usuarios, columnsExcel)}>Exportar a Excel</button>

        </div>
      </div>
      <div className="mt-8 mx-6">
        <MUIDataTable
          title={"Usuarios"}
          data={usuarios}
          columns={columns}
          options={options}
        />
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal Usuario"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        appElement={document.getElementById("root")}
      >
        {selectedUsuario ? (
          <div className="bg-white w-2/4 p-6 rounded shadow-lg grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-bold mb-4 text-stone-950">Actualizar usuario</h2>
              <form>
                {/* Columna 1 */}
                <div className="mb-4">
                  <label htmlFor="id_usuario" className="block text-sm font-bold text-gray-700">ID Usuario:</label>
                  <input
                    type="text"
                    id="id_usuario"
                    value={selectedUsuario?.id_usuario || ''}
                    disabled
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950"
                  />
                  <div className="text-red-500">{errors.map((error) => error.path == 'id_mantenimiento' ? error.msg : '')}</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="identificacion" className="block text-sm font-bold text-gray-700">Identificación:</label>
                  <input
                    type="text"
                    id="identificacion"
                    value={identificacion}
                    onChange={(e) => setIdentificacion(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950"
                    placeholder="Nueva Identificación"
                  />
                  <div className="text-red-500">{errors.map((error) => error.path == 'identificacion' ? error.msg : '')}</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="nombres" className="block text-sm font-bold text-gray-700">Nombres:</label>
                  <input
                    type="text"
                    id="nombres"
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950"
                    placeholder="Nuevos Nombres"
                  />
                  <div className="text-red-500">{errors.map((error) => error.path == 'nombres' ? error.msg : '')}</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="apellidos" className="block text-sm font-bold text-gray-700">Apellidos:</label>
                  <input
                    type="text"
                    id="apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950"
                    placeholder="Nuevos Apellidos"
                  />
                  <div className="text-red-500">{errors.map((error) => error.path == 'apellidos' ? error.msg : '')}</div>
                </div>
              </form>
            </div>
            <div>
              {/* Columna 2 */}
              <div className="mb-4">
                <label htmlFor="telefono" className="block text-sm font-bold text-gray-700">Teléfono:</label>
                <input
                  type="text"
                  id="telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950"
                  placeholder="Nuevo Teléfono"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'telefono' ? error.msg : '')}</div>
              </div>
              <div className="mb-4">
                <label htmlFor="correo" className="block text-sm font-bold text-gray-700">Correo:</label>
                <input
                  type="text"
                  id="correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950"
                  placeholder="Correo Electrónico"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'correo' ? error.msg : '')}</div>
              </div>
              <div className="mb-4">
                <label htmlFor="estado" className="block text-sm font-bold text-gray-700">Estado:</label>
                <select
                  id="estado"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950"
                >
                  <option value="">Selecciona un tipo de estado</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">inactivo</option>

                </select>
                <div className="text-red-500">{errors.map((error) => error.path == 'estado' ? error.msg : '')}</div>
              </div>
              <div className="mb-4">
                <label htmlFor="contraseña" className="block text-sm font-bold text-gray-700">Contraseña:</label>
                <input
                  type="password"
                  id="contraseña"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950"
                  placeholder="Contraseña"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'contraseña' ? error.msg : '')}</div>
              </div>
              <div className="mb-4">
                <label htmlFor="rol" className="block text-sm font-bold text-gray-700">Rol:</label>
                <select
                  id="rol"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950"
                >
                  <option className='text-black' value="">seleccione un rol</option>
                  <option value="usuario">usuario</option>
                  <option value="tecnico">tecnico</option>
                  <option value="administrador">administrador</option>
                </select>
                <div className="text-red-500">{errors.map((error) => error.path == 'rol' ? error.msg : '')}</div>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                className="text-white font-bold hover:bg-blue-800 w-40 h-10 bg-blue-600 rounded"
                onClick={handleActualizarUsuario}
              >
                Actualizar Usuario
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-800 text-white font-bold py-2 px-8 rounded "
                onClick={handlelCancelar}
              >
                Cancelar
              </button>
            </div>

          </div>
        ) : (
          <div className="bg-white w-2/4 p-6 rounded shadow-lg grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-bold mb-4 text-black">Registrar Usuarios</h2>
              <form>
                <div className="mb-4">
                  <label htmlFor="identificacion" className="block text-sm font-bold text-gray-700">Identificación:</label>
                  <input
                    type="text"
                    id="identificacion"
                    value={identificacion}
                    onChange={(e) => setIdentificacion(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950"
                    placeholder="Nueva Identificación"
                  />
                  <div className="text-red-500">{errors.map((error) => error.path == 'identificacion' ? error.msg : '')}</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="nombres" className="block text-sm font-bold text-gray-700">Nombres:</label>
                  <input
                    type="text"
                    id="nombres"
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950"
                    placeholder="Nuevos Nombres"
                  />
                  <div className="text-red-500">{errors.map((error) => error.path == 'nombres' ? error.msg : '')}</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="apellidos" className="block text-sm font-bold text-gray-700">Apellidos:</label>
                  <input
                    type="text"
                    id="apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950"
                    placeholder="Nuevos Apellidos"
                  />
                  <div className="text-red-500">{errors.map((error) => error.path == 'apellidos' ? error.msg : '')}</div>
                </div>
              </form>
            </div>
            <div>
              {/* Columna 2 */}
              <div className="mb-4">
                <label htmlFor="telefono" className="block text-sm font-bold text-gray-700">Teléfono:</label>
                <input
                  type="text"
                  id="telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950"
                  placeholder="Nuevo Teléfono"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'telefono' ? error.msg : '')}</div>
              </div>
              <div className="mb-4">
                <label htmlFor="correo" className="block text-sm font-bold text-gray-700">Correo:</label>
                <input
                  type="text"
                  id="correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950"
                  placeholder="Correo Electrónico"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'correo' ? error.msg : '')}</div>
              </div>
              <div className="mb-4">
                <label htmlFor="estado" className="block text-sm font-bold text-gray-700">Estado:</label>
                <select

                  id="estado"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950"

                >
                  <option value="">Selecciona un tipo de estado</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">inactivo</option>

                </select>
                <div className="text-red-500">{errors.map((error) => error.path == 'estado' ? error.msg : '')}</div>
              </div>
              <div className="mb-4">
                <label htmlFor="rol" className="block text-sm font-bold text-gray-700">Rol:</label>
                <select
                  id="rol"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950"
                >
                  <option className='text-black' value="">seleccione un rol</option>
                  <option className='text-black' value="usuario">Usuario</option>
                  <option className='text-black' value="tecnico">tecnico</option>
                  <option className='text-black' value="administrador">administrador</option>
                </select>
                <div className="text-red-500">{errors.map((error) => error.path == 'rol' ? error.msg : '')}</div>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                className="text-white font-bold hover:bg-green-800 w-40 h-10 bg-green-600 rounded "
                onClick={handleRegistrarUsuario}
              >
                Registrar
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-800 text-white font-bold py-2 px-8 rounded"
                onClick={handlelCancelar}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

      </Modal>
    </div>
  );
};

export default Usuario;

