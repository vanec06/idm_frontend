    import React, { useState, useEffect } from 'react';
    import Modal from 'react-modal';
    import { FaEdit  } from 'react-icons/fa';
    import { MdUpdate } from 'react-icons/md';

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

      const buscarusuarios = async (identificacion) => {
        try {
          if (!identificacion) {
            listarUsuarios();
            return;
          }
    
          const response = await fetch(`http://localhost:4000/usuario/buscar/${identificacion}`);
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

      const listarUsuarios = async () => {
        try {
          const response = await fetch('http://localhost:4000/usuario/listar');
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

      useEffect(() => {
        fetch('http://localhost:4000/usuario/listar')
          .then(response => response.json())
          .then(data => setUsuarios(data))
          .catch(error => console.error('Error fetching users:', error));
      }, []);

      const openModal = (usuario) => {
        setSelectedUsuario(usuario);
        setModalIsOpen(true);
      };

      const closeModal = () => {
        setSelectedUsuario(null);
        setModalIsOpen(false);
      };

      const handleRegistrarUsuario = async () => {
        const nuevoUsuario = {
          identificacion,
          nombres,
          apellidos,
          telefono,
          correo,
          estado,
          rol,
        };      

        await fetch('http://localhost:4000/usuario/registrar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoUsuario),
        });      

        const updatedUsers = await fetch('http://localhost:4000/usuario/listar')
          .then(response => response.json())
          .catch(error => console.error('Error fetching users:', error));

        setUsuarios(updatedUsers);
        closeModal();
      };

      const handleActualizarUsuario = async () => {
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

        await fetch(`http://localhost:4000/usuario/actualizar/${usuarioActualizado.id_usuario}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(usuarioActualizado),
        });

        const updatedUsers = await fetch('http://localhost:4000/usuario/listar')
          .then(response => response.json())
          .catch(error => console.error('Error fetching users:', error));

        setUsuarios(updatedUsers);
        closeModal();
      };
      

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

      return (
        <div>
        <h2 className="text-black text-3xl font-bold mb-5 px-6 w-full">Lista de Usuarios</h2>
        <div className='w-full h-20 bg-customBlue flex items-center justify-between px-4'>
          <div>
            <input
              type="text"
              placeholder="Buscar por identificación"
              className="w-48 h-10 border border-gray-300 rounded px-3 py-2"
              onChange={(e) => buscarusuarios(e.target.value)}  
            />
          </div>
          <div>
            <button className='text-white w-40 h-10 bg-green-600 rounded-md' onClick={() => openModal(null)}>
              Registrar
            </button>
    </div>
  </div>
            <div className="mt-8 mx-6">
            <div className="overflow-x-auto">
            </div>
            <table className="w-3/5 border-none shadow-sm overflow-hidden mx-auto">
    <thead className="bg-customBlue text-white">
      <tr>
        <th className="py-2 px-3 text-sm">ID</th>
        <th className="py-2 px-3 text-sm">Identificación</th>
        <th className="py-2 px-3 text-sm">Nombres</th>
        <th className="py-2 px-3 text-sm">Apellidos</th>
        <th className="py-2 px-3 text-sm">Teléfono</th>
        <th className="py-2 px-3 text-sm">Correo Electrónico</th>
        <th className="py-2 px-3 text-sm">Estado</th>
        <th className="py-2 px-3 text-sm">Contraseña</th>
        <th className="py-2 px-3 text-sm">Rol</th>
        <th className="py-2 px-3 text-sm">Acciones</th>
      </tr>
    </thead>
    <tbody className="text-sm text-black bg-white divide-y divide-gray-200">
      {usuarios.map((usuario) => (
        <tr key={usuario.id_usuario}>
          <td className="py-1 px-3">{usuario.id_usuario}</td>
          <td className="py-1 px-3">{usuario.identificacion}</td>
          <td className="py-1 px-3">{usuario.nombres}</td>
          <td className="py-1 px-3">{usuario.apellidos}</td>
          <td className="py-1 px-3">{usuario.telefono}</td>
          <td className="py-1 px-3">{usuario.correo}</td>
          <td className="py-1 px-3">{usuario.estado}</td>
          <td className="py-1 px-3">{usuario.contraseña}</td>
          <td className="py-1 px-3">{usuario.rol}</td>
          <td className="py-1 px-3">
    <div className="flex items-center">
      <button onClick={() => openModal(usuario)} className="text-white px-2 py-1 rounded">
        <FaEdit className="text-orange-400 text-xl" />
      </button>
      <button onClick={() => handleDesactivarUsuario(usuario.identificacion)} className="text-white px-2 py-1 rounded ml-2">
        <MdUpdate className="text-green-500 text-xl" />
      </button>
    </div>
  </td>
        </tr>
      ))}
    </tbody>
  </table>
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
        <div className="bg-white w-96 p-6 rounded shadow-lg grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-bold mb-4">Actualizar Usuario</h2>
            <form>
              {/* Columna 1 */}
              <div className="mb-4">
                <label htmlFor="id_usuario" className="block text-sm font-bold text-gray-700">ID Usuario:</label>
                <input
                  type="text"
                  id="id_usuario"
                  value={selectedUsuario?.id_usuario || ''}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="identificacion" className="block text-sm font-bold text-gray-700">Identificación:</label>
                <input
                  type="text"
                  id="identificacion"
                  value={identificacion}
                  onChange={(e) => setIdentificacion(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  placeholder="Nueva Identificación"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="nombres" className="block text-sm font-bold text-gray-700">Nombres:</label>
                <input
                  type="text"
                  id="nombres"
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  placeholder="Nuevos Nombres"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="apellidos" className="block text-sm font-bold text-gray-700">Apellidos:</label>
                <input
                  type="text"
                  id="apellidos"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  placeholder="Nuevos Apellidos"
                />
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
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                placeholder="Nuevo Teléfono"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="correo" className="block text-sm font-bold text-gray-700">Correo:</label>
              <input
                type="text"
                id="correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                placeholder="Correo Electrónico"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="estado" className="block text-sm font-bold text-gray-700">Estado:</label>
              <select
                id="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              >
                 <option value="">Selecciona un tipo de estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">inactivo</option>
                       
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="contraseña" className="block text-sm font-bold text-gray-700">Contraseña:</label>
              <input
                type="password"
                id="contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                placeholder="Contraseña"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="rol" className="block text-sm font-bold text-gray-700">Rol:</label>
              <select
                id="rol"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              >
              <option className='text-black' value="">seleccione un rol</option>
              <option  value="usuario">usuario</option>
              <option  value="tecnico">tecnico</option>
              <option  value="administrador">administrador</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-2"
            onClick={handleActualizarUsuario}
          >
            Actualizar Usuario
          </button>
        </div>
      ) : (
        <div className="bg-white w-2/4 p-6 rounded shadow-lg grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-bold mb-4">Registrar Usuario</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="identificacion" className="block text-sm font-bold text-gray-700">Identificación:</label>
                <input
                  type="text"
                  id="identificacion"
                  value={identificacion}
                  onChange={(e) => setIdentificacion(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  placeholder="Nueva Identificación"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="nombres" className="block text-sm font-bold text-gray-700">Nombres:</label>
                <input
                  type="text"
                  id="nombres"
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  placeholder="Nuevos Nombres"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="apellidos" className="block text-sm font-bold text-gray-700">Apellidos:</label>
                <input
                  type="text"
                  id="apellidos"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  placeholder="Nuevos Apellidos"
                />
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
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                placeholder="Nuevo Teléfono"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="correo" className="block text-sm font-bold text-gray-700">Correo:</label>
              <input
                type="text"
                id="correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                placeholder="Correo Electrónico"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="estado" className="block text-sm font-bold text-gray-700">Estado:</label>
              <select
               
                id="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"

              >
                 <option value="">Selecciona un tipo de estado</option>
                           <option value="activo">Activo</option>
                           <option value="inactivo">inactivo</option>
                       
                       </select>
            </div>
            <div className="mb-4">
              <label htmlFor="rol" className="block text-sm font-bold text-gray-700">Rol:</label>
              <select
                id="rol"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              >
              <option className='text-black' value="">seleccione un rol</option>
              <option className='text-black' value="usuario">Usuario</option>
              <option className='text-black' value="tecnico">tecnico</option>
              <option className='text-black' value="administrador">administrador</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            className="bg-green-500 w-60 hover:bg-green-700 text-white font-bold py-2 px-4 rounded col-span-2"
            onClick={handleRegistrarUsuario}
          >
            Registrar Usuario
          </button>
          <button
        className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={closeModal}
      >
        Cancelar
      </button>
        </div>
      )}

    </Modal>
            </div>
      );
    };

    export default Usuario;