import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { MdUpdate } from 'react-icons/md';
import MUIDataTable from 'mui-datatables';

const mantenimiento = () => {
  const [id_mantenimiento, setIdMantenimiento] = useState('');
  const [fecha_mantenimiento, setFechaMantenimiento] = useState('');
  const [hora_mantenimiento, setHoraMantenimiento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo_mantenimiento, setTipoMantenimiento] = useState('');
  const [id_maquina, setIdMaquina] = useState('');
  const [id_usuario, setIdUsuario] = useState('');
  const [mantenimientos, setMantenimientos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedMantenimiento, setSelectedMantenimiento] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    listarMantenimientos();
  }, []);

  const listarMantenimientos = async () => {
    try {
      const response = await fetch('http://localhost:4000/mantenimiento/listar');
      const data = await response.json();

      if (response.ok) {
        setMantenimientos(data);
      } else {
        console.error('Error al listar mantenimientos:', data.message);
      }
    } catch (error) {
      console.error('Error al listar mantenimientos:', error);
    }
  };

  const openModal = (mantenimiento) => {
    setSelectedMantenimiento(mantenimiento);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedMantenimiento(null);
    setModalIsOpen(false);
  };

  const handleRegistrarMantenimiento = async () => {
    const nuevoMantenimiento = {
      id_mantenimiento,
      fecha_mantenimiento,
      hora_mantenimiento,
      descripcion,
      tipo_mantenimiento,
      id_maquina,
      id_usuario,
    };

    try {
      const response = await fetch('http://localhost:4000/mantenimiento/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoMantenimiento),
      });

      const responseData = await response.json();

      if (response.ok) {
        closeModal();
        listarMantenimientos();
      } else {
        setErrors(responseData.errors || ['Error al registrar mantenimiento']);
      }

      console.log("DATA REGISTER: ", responseData.errors);
    } catch (error) {
      console.error('Error al registrar mantenimiento:', error);
      setErrors(['Error al registrar mantenimiento']);
    }
  };

  const handleActualizarMantenimiento = async () => {
    const mantenimientoActualizado = {
      id_mantenimiento: selectedMantenimiento.id_mantenimiento,
      fecha_mantenimiento,
      hora_mantenimiento,
      descripcion,
      tipo_mantenimiento,
      id_maquina,
      id_usuario,
    };

    try {
      const response = await fetch(`http://localhost:4000/mantenimiento/actualizar/${mantenimientoActualizado.id_mantenimiento}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mantenimientoActualizado),
      });

      const responseData = await response.json();

      if (response.ok) {
        closeModal();
        listarMantenimientos();
      } else {
        setErrors(responseData.errors || ['Error al actualizar mantenimiento']);
      }

      console.log("DATA UPDATE: ", responseData.errors);
    } catch (error) {
      console.error('Error al actualizar mantenimiento:', error);
      setErrors(['Error al actualizar mantenimiento']);
    }
  };

  const handleEliminarMantenimiento = async (id_mantenimiento) => {
    try {
      await fetch(`http://localhost:4000/mantenimiento/eliminar/${id_mantenimiento}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      listarMantenimientos();
    } catch (error) {
      console.error('Error al eliminar mantenimiento:', error);
    }
  };

  const columns = [
    {
      name: 'id_mantenimiento',
      label: 'ID',
    },
    {
      name: 'fecha_mantenimiento',
      label: 'Fecha',
    },
    {
      name: 'hora_mantenimiento',
      label: 'Hora',
    },
    {
      name: 'descripcion_mantenimiento',
      label: 'Descripción',
    },
    {
      name: 'tipo_mantenimiento',
      label: 'Tipo',
    },
    {
      name: 'nombre_maquina',
      label: 'ID Máquina',
    },
    {
      name: 'nombre_usuario',
      label: 'ID Usuario',
    },
    {
      name: 'acciones',
      label: 'Acciones',
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const mantenimiento = mantenimientos[tableMeta.rowIndex];
          return (
            <div>
              <button onClick={() => openModal(mantenimiento)}>
                <FaEdit className="text-orange-400 text-xl" />
              </button>
              <button onClick={() => handleEliminarMantenimiento(mantenimiento.id_mantenimiento)}>
                <FaTrashAlt className="text-red-500 text-xl" />
              </button>
              <button onClick={() => handleDesactivarMantenimiento(mantenimiento.id_mantenimiento)}>
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
    selectableRows: 'none', // If you don't want checkboxes for row selection
  };

  return (
    <div>
      <h2 className="text-black text-3xl font-bold mb-5 px-6 w-full">Lista de Mantenimientos</h2>
      <div className="w-full h-20 bg-customBlue flex items-center justify-between px-4">
        <div>
          <button className="text-white w-40 h-10 bg-green-600 rounded-md" onClick={() => openModal(null)}>
            Registrar
          </button>
        </div>
      </div>
      <div className="mt-8 mx-6">
        <MUIDataTable
          title={'Mantenimientos'}
          data={mantenimientos}
          columns={columns}
          options={options}
        />
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal Mantenimiento"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        appElement={document.getElementById('root')}
      >
       {selectedMantenimiento ? (
          <div className="bg-white w-96 p-6 rounded shadow-lg grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-bold mb-4 text-stone-950">Actualizar Mantenimiento</h2>
              <form>
                {/* Columna 1 */}
                <div className="mb-4">
                  <label htmlFor="id_mantenimiento" className="block text-sm font-bold text-gray-700">ID Mantenimiento:</label>
                  <input
                    type="text"
                    id="id_mantenimiento"
                    value={selectedMantenimiento?.id_mantenimiento || ''}
                    disabled
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950 "
                  />
                  <div className="text-red-500">{errors.map((error)=> error.path == 'id_mantenimiento' ? error.msg : '')}</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="fecha_mantenimiento" className="block text-sm font-bold text-gray-700">Fecha Mantenimiento:</label>
                  <input
                    type="date"
                    id="fecha_mantenimiento"
                    value={fecha_mantenimiento}
                    onChange={(e) => setFechaMantenimiento(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950 "
                    placeholder="Nueva Fecha Mantenimiento"
                  />
                  <div className="text-red-500">{errors.map((error)=> error.path == 'fecha_mantenimiento' ? error.msg : '')}</div>
                  <div className="text-red-500"></div>
                </div>
                <div className="mb-4">
                  <label htmlFor="hora_mantenimiento" className="block text-sm font-bold text-gray-700">Hora Mantenimiento:</label>
                  <input
                    type="time"
                    id="hora_mantenimiento"
                    value={hora_mantenimiento}
                    onChange={(e) => setHoraMantenimiento(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950 "
                    placeholder="Nueva Hora Mantenimiento"
                  />
                  <div className="text-red-500">{errors.map((error)=> error.path == 'hora_mantenimiento' ? error.msg : '')}</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="descripcion_mantenimiento" className="block text-sm font-bold text-gray-700">Descripción:</label>
                  <input
                    type="text"
                    id="descripcion_mantenimiento"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950 "
                    placeholder="Nueva Descripción"
                  />
                  <div className="text-red-500">{errors.map((error)=> error.path == 'descripcion' ? error.msg : '')}</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="tipo_mantenimiento" className="block text-sm font-bold text-gray-700">Tipo Mantenimiento:</label>
                  <select
                    id="tipo_mantenimiento"
                    value={tipo_mantenimiento}
                    onChange={(e) => setTipoMantenimiento(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950 "
                  >
                    <option value="">Selecciona un tipo de mantenimiento</option>
                    <option value="preventivo">Preventivo</option>
                    <option value="correctivo">Correctivo</option>
                  </select>
                  <div className="text-red-500">{errors.map((error)=> error.path == 'tipo_mantenimiento' ? error.msg : '')}</div>
                </div>

              </form>
            </div>
            <div>
              {/* Columna 2 */}
              <div className="mb-4">
                <label htmlFor="nombre_maquina" className="block text-sm font-bold text-gray-700">ID Máquina:</label>
                <input
                  type="text"
                  id="id_maquina"
                  value={id_maquina}
                  onChange={(e) => setIdMaquina(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950 "
                  placeholder="Nuevo ID Máquina"
                />
                <div className="text-red-500">{errors.map((error)=> error.path == 'id_maquina' ? error.msg : '')}</div>              
              </div>
              <div className="mb-4">
                <label htmlFor="nombre_usuario" className="block text-sm font-bold text-gray-700">ID Usuario:</label>
                <input
                  type="text"
                  id="nombre_usuario"
                  value={id_usuario}
                  onChange={(e) => setIdUsuario(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950 "
                  placeholder="Nuevo ID Usuario"
                />
                <div className="text-red-500">{errors.map((error)=> error.path == 'id_usuario' ? error.msg : '')}</div>
              </div>
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-2"
                onClick={handleActualizarMantenimiento}
              >
                Actualizar Mantenimiento
              </button>
              <button
                className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={closeModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white w-2/4 p-6 rounded shadow-lg grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-bold mb-4 text-stone-950 ">Registrar Mantenimiento</h2>
              <form>
                <div className="mb-4">
                  <label htmlFor="fecha_mantenimiento" className="block text-sm font-bold text-gray-700">
                    Fecha Mantenimiento:
                  </label>
                  <input
                    type="date"
                    id="fecha_mantenimiento"
                    value={fecha_mantenimiento}
                    onChange={(e) => setFechaMantenimiento(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950 "
                    placeholder="Nueva Fecha Mantenimiento"
                  />
                   <div className="text-red-500">{errors.map((error)=> error.path == 'fecha_mantenimiento' ? error.msg : '')}</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="hora_mantenimiento" className="block text-sm font-bold text-gray-700">Hora Mantenimiento:</label>
                  <input
                    type="time"
                    id="hora_mantenimiento"
                    value={hora_mantenimiento}
                    onChange={(e) => setHoraMantenimiento(e
                    .target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950 "
                    placeholder="Nueva Hora Mantenimiento"
                  />
                  <div className="text-red-500">{errors.map((error)=> error.path == 'hora_mantenimiento' ? error.msg : '')}</div>

                </div>
                <div className="mb-4">
                  <label htmlFor="descripcion_mantenimiento" className="block text-sm font-bold text-gray-700">Descripción:</label>
                  <input
                    type="text"
                    id="descripcion_mantenimeinto"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950 "
                    placeholder="Nueva Descripción"
                  />
                   <div className="text-red-500">{errors.map((error)=> error.path == 'descripcion' ? error.msg : '')}</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="tipo_mantenimiento" className="block text-sm font-bold text-gray-700">Tipo Mantenimiento:</label>
                  <select
                    id="tipo_mantenimiento"
                    value={tipo_mantenimiento}
                    onChange={(e) => setTipoMantenimiento(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950 "
                  >
                    <option value="">Selecciona un tipo de mantenimiento</option>
                    <option value="preventivo">Preventivo</option>
                    <option value="correctivo">Correctivo</option>
                  </select>
                  <div className="text-red-500">{errors.map((error)=> error.path == 'tipo_mantenimiento' ? error.msg : '')}</div>
                </div>

              </form>
            </div>
            <div>
              <div className="mb-4">
                <label htmlFor="nombre_maquina" className="block text-sm font-bold text-gray-700">ID Máquina:</label>
                <input
                  type="text"
                  id="nombre_maquina"
                  value={id_maquina}
                  onChange={(e) => setIdMaquina(e.target.value)} 
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950 "
                  placeholder="Nuevo ID Máquina"
                />
                <div className="text-red-500">{errors.map((error)=> error.path == 'id_maquina' ? error.msg : '')}</div>
              </div>
              <div className="mb-4">
                <label htmlFor="nombre_usuario" className="block text-sm font-bold text-gray-700">ID Usuario:</label>
                <input
                  type="text"
                  id="nombre_usuario"
                  value={id_usuario}
                  onChange={(e) => setIdUsuario(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950 "
                  placeholder="Nuevo ID Usuario"
                />
                <div className="text-red-500">{errors.map((error)=> error.path == 'id_usuario' ? error.msg : '')}</div>
              </div>
              <button
                type="button"
                className="bg-green-500 w-60 hover:bg-green-700 text-white font-bold py-2 px-4 rounded col-span-2"
                onClick={handleRegistrarMantenimiento}
              >
                Registrar Mantenimiento
              </button>
              <button
                className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={closeModal}
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

export default mantenimiento;