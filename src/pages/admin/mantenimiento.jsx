import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { MdUpdate } from 'react-icons/md';
import MUIDataTable from 'mui-datatables';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { ruta } from "../../components/Api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { exportToExcel } from '../../components/Reportes';
import { ConvertirArchivo } from '../../components/convertirArchivos';


const Mantenimiento = () => {
  const [id_mantenimiento, setIdMantenimiento] = useState('');
  const [fecha_mantenimiento, setFechaMantenimiento] = useState('');
  const [hora_mantenimiento, setHoraMantenimiento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo_mantenimiento, setTipoMantenimiento] = useState('');
  const [maquinas, setMaquinas] = useState([]);
  const [selectedMaquina, setSelectedMaquina] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalNoti, setModalNoti] = useState(false);
  const [selectedMantenimiento, setSelectedMantenimiento] = useState(null);
  const [errors, setErrors] = useState([]);

  const [selectedNotificacion, setSelectedNotificacion] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);
  const [maquinaId, setMaquinId] = useState(null);
  const [fecha, setFecha] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [evidencia, setEvidencia] = useState(null);


  useEffect(() => {
    listarMantenimientos();
    listarUsuarios();
    listarMaquinas();
  }, []);

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
  const listarMaquinas = async () => {
    try {
      const response = await fetch(`http://${ruta}:4000/maquina/listar`, {
        method: 'POST'
      });
      const data = await response.json();

      if (response.ok) {
        setMaquinas(data);
      } else {
        console.error('Error al listar máquinas:', data.message);
      }
    } catch (error) {
      console.error('Error al listar máquinas:', error);
    }
  };

  const listarMantenimientos = async () => {
    try {
      const response = await fetch(`http://${ruta}:4000/mantenimiento/listar`);
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

  const handleNotificarMantenimiento = async () => {
    const nuevaNotificacion = {
      fecha,
      comentarios,
      tipo_mantenimiento,
      id_maquina: selectedMaquina.value,
    };
    try {
      const response = await fetch(`http://${ruta}:4000/notificacion/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaNotificacion),
      });

      const responseData = await response.json();

      if (response.ok) {
        setModalNoti(false);
        Swal.fire({
          icon: 'success',
          title: 'Se notificó el proximo matenimiento.',
        });
      } else {
        setErrors(responseData.errors || ['Error al registrar la notificación']);
      }
    } catch (error) {
      console.error('Error al registrar la notificación:', error);
      setErrors(['Error al registrar la notificación']);
    }
  };

  const openModal = (mantenimiento) => {
    console.log('xd:', mantenimiento);
    setEvidencia(null)
    setSelectedMantenimiento(mantenimiento);
    setModalIsOpen(true);

    // Cargar información del mantenimiento seleccionado en los campos de entrada
    if (mantenimiento) {
      setIdMantenimiento(mantenimiento.id_mantenimiento);
      setFechaMantenimiento(mantenimiento.fecha_mantenimiento.split('T')[0]);
      setHoraMantenimiento(mantenimiento.hora_mantenimiento.split(':').slice(0, 2).join(':'));
      setDescripcion(mantenimiento.descripcion_mantenimiento);
      setTipoMantenimiento(mantenimiento.tipo_mantenimiento);
      setUsuarioId(mantenimiento.id_usuario)
      setMaquinId(mantenimiento.id_maquina)


    } else {
      // Si no se ha seleccionado ningún mantenimiento, restablecer los campos de entrada
      setIdMantenimiento('');
      setFechaMantenimiento('');
      setHoraMantenimiento('');
      setDescripcion('');
      setTipoMantenimiento('');
      setSelectedMaquina('');
      setSelectedUsuario('');
    }
  };

  const closeModal = () => {
    setSelectedMantenimiento(null);
    setModalIsOpen(false);
    // Restablecer campos de entrada y limpiar errores al cerrar el modal
    setIdMantenimiento('');
    setFechaMantenimiento('');
    setHoraMantenimiento('');
    setDescripcion('');
    setTipoMantenimiento('');
    setSelectedMaquina('');
    setSelectedUsuario('');

    setErrors([]);
  };

  const handleRegistrarMantenimiento = async () => {
    const nuevoMantenimiento = {
      id_mantenimiento,
      fecha_mantenimiento,
      hora_mantenimiento,
      descripcion,
      tipo_mantenimiento,
      id_maquina: selectedMaquina.value,
      id_usuario: selectedUsuario.value,
      evidencia: evidencia
    };

    try {
      const response = await fetch(`http://${ruta}:4000/mantenimiento/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoMantenimiento),
      });

      const responseData = await response.json();

      if (response.ok) {
        listarMantenimientos();
        closeModal();
        Swal.fire({
          icon: 'success',
          title: 'Mantenimiento registrado correctamente',
        });
        setModalNoti(true);
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
    console.log('xd: ', fecha_mantenimiento);
    const mantenimientoActualizado = {
      id_mantenimiento: selectedMantenimiento.id_mantenimiento,
      fecha_mantenimiento,
      hora_mantenimiento,
      descripcion,
      tipo_mantenimiento,
      id_maquina: selectedMaquina ? selectedMaquina.value : maquinaId,
      id_usuario: selectedUsuario ? selectedUsuario.value : usuarioId,
      evidencia: evidencia

    };

    try {
      const response = await fetch(`http://${ruta}:4000/mantenimiento/actualizar/${mantenimientoActualizado.id_mantenimiento}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mantenimientoActualizado),
      });

      const responseData = await response.json();

      if (response.ok) {
        listarMantenimientos();
        closeModal();
        Swal.fire({
          icon: 'success',
          title: 'Mantenimiento actualizado correctamente',
        });
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
    // Mostrar alerta de confirmación antes de eliminar
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el mantenimiento permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`http://${ruta}:4000/mantenimiento/eliminar/${id_mantenimiento}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          listarMantenimientos();
          Swal.fire({
            icon: 'success',
            title: 'Mantenimiento eliminado correctamente',
          });
        } catch (error) {
          console.error('Error al eliminar mantenimiento:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error al eliminar mantenimiento',
            text: 'Ocurrió un error al intentar eliminar el mantenimiento.',
          });
        }
      }
    });
  };

  const columnsExcel = [
    { key: "fecha_mantenimiento", label: "Fecha" },
    { key: "hora_mantenimiento", label: "Hora" },
    { key: "nombre_maquina", label: "Maquina" },
    { key: "nombre_usuario", label: "Tecnico" },
    { key: "tipo_mantenimiento", label: "Tipo" },
    { key: "descripcion_mantenimiento", label: "Descripción" },
  ]

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
      name: 'evidencia', label: 'Evidencia', options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const mantenimiento = mantenimientos[tableMeta.rowIndex];
          return (
            <>
              {!value ? 'No hay evidencia' :
                <a href={`http://${ruta}:4000/images/pdf/evidencia/${value}`} target="_blank" title='Ver manual PDF'><svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256">
                  <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                  <g><g><g><path fill="#000000" d="M204,145.9c-3.2-3.1-10.1-4.7-20.7-4.9c-7.2-0.1-15.8,0.6-24.9,1.8c-4.1-2.4-8.3-4.9-11.6-8c-8.9-8.3-16.3-19.8-20.9-32.4c0.3-1.2,0.6-2.2,0.8-3.3c0,0,5-28.4,3.7-37.9c-0.2-1.3-0.3-1.7-0.7-2.7l-0.4-1.1c-1.3-3.1-4-6.5-8.2-6.3l-2.5-0.1h-0.1c-4.6,0-8.5,2.4-9.4,5.9c-3,11.2,0.1,27.9,5.8,49.5l-1.4,3.5c-4,9.9-9.1,19.8-13.6,28.6l-0.6,1.1c-4.7,9.2-9,17-12.9,23.7l-4,2.1c-0.3,0.1-7.2,3.8-8.8,4.8C60,178.4,50.9,187.7,49.5,195c-0.5,2.3-0.1,5.3,2.3,6.7l3.9,2c1.7,0.8,3.4,1.3,5.3,1.3c9.7,0,21-12.1,36.6-39.2c18-5.9,38.4-10.7,56.3-13.4c13.7,7.7,30.5,13,41.1,13c1.9,0,3.5-0.2,4.8-0.5c2-0.5,3.8-1.7,4.8-3.3c2-3.1,2.5-7.4,1.9-11.7C206.2,148.5,205.2,146.9,204,145.9z M58.8,197.6c1.8-4.8,8.8-14.4,19.2-22.9c0.7-0.5,2.3-2,3.7-3.4C70.8,188.5,63.6,195.4,58.8,197.6z M120.3,56c3.1,0,4.9,7.9,5.1,15.3c0.1,7.4-1.6,12.6-3.7,16.4C119.8,82,119,73,119,67.2C119,67.2,118.8,56,120.3,56z M101.9,156.9c2.2-3.9,4.5-8,6.8-12.4c5.6-10.7,9.2-19,11.9-25.9c5.3,9.6,11.8,17.8,19.6,24.3c1,0.8,2,1.6,3.1,2.5C127.5,148.5,113.9,152.3,101.9,156.9z M201,156c-1,0.6-3.7,0.9-5.5,0.9c-5.7,0-12.7-2.6-22.6-6.8c3.8-0.3,7.3-0.4,10.4-0.4c5.7,0,7.4,0,13,1.4C201.9,152.5,202,155.4,201,156z M218.2,56L185.3,23c-7.2-7.2-21.3-13-31.5-13H43.2c-10.1,0-18.4,8.3-18.4,18.4v199.1c0,10.1,8.3,18.4,18.4,18.4h169.6c10.1,0,18.4-8.3,18.4-18.4V87.4C231.3,77.3,225.4,63.1,218.2,56z M207.8,66.4c0.7,0.7,1.4,1.6,2.1,2.6h-37.7V31.3c1,0.7,1.9,1.4,2.6,2.1L207.8,66.4z M216.5,227.5c0,2-1.7,3.7-3.7,3.7H43.2c-2,0-3.7-1.7-3.7-3.7V28.4c0-2,1.7-3.7,3.7-3.7h110.6c1.1,0,2.4,0.1,3.7,0.4v58.6h58.6c0.2,1.3,0.4,2.6,0.4,3.7V227.5z" /></g><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /></g></g>
                </svg></a>
              }
            </>
          )
        }
      }
    },
    {
      name: 'acciones',
      label: 'Acciones',
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const mantenimiento = mantenimientos[tableMeta.rowIndex];
          return (
            <div className='flex justify-between'>
              <button onClick={() => openModal(mantenimiento)}>
                <FaEdit className="text-orange-400 text-xl" />
              </button>
              <button onClick={() => handleEliminarMantenimiento(mantenimiento.id_mantenimiento)}>
                <FaTrashAlt className="text-red-500 text-xl" />
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
    download: false,
    filter: false,
    selectableRows: 'none', // If you don't want checkboxes for row selection
  }

  const handleEvidencia = async (e) => {
    try {
      const archivo = await ConvertirArchivo(e);
      setEvidencia(archivo);
    } catch (error) {
      console.log('ERRRO CARGANDO: ', error);
      alert('Error al cargar el archivo. Contactese con el administrador')
    }
  }

  return (
    <div>
      <h2 className="text-black text-3xl font-bold mb-5 px-6 w-full">Lista de Mantenimientos</h2>
      <div className="justify-between px-4">
        <div>
          <button className="text-white w-40 h-10 bg-green-600 rounded-md" onClick={() => openModal(null)}>
            Registrar
          </button>
          <button className='bg-blue-400 p-2 ml-4 rounded text-white' onClick={() => exportToExcel(mantenimientos, columnsExcel)}>Exportar a Excel</button>
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
          <div className="bg-white w-2/4 p-6 rounded shadow-lg grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-bold mb-4 text-black">Actualizar Mantenimiento</h2>
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
                  <div className="text-red-500">{errors.map((error) => error.path == 'id_mantenimiento' ? error.msg : '')}</div>
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
                  <div className="text-red-500">{errors.map((error) => error.path == 'fecha_mantenimiento' ? error.msg : '')}</div>
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
                  <div className="text-red-500">{errors.map((error) => error.path == 'hora_mantenimiento' ? error.msg : '')}</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="descripcion_mantenimiento" className="block text-sm font-bold text-gray-700">Descripción:</label>
                  <input
                    type="text"
                    id="descripcion_mantenimiento"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black "
                    placeholder="Nueva Descripción"
                  />
                  <div className="text-red-500">{errors.map((error) => error.path == 'descripcion' ? error.msg : '')}</div>
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
                    <option value="calibracion">Calibración</option>
                  </select>
                  <div className="text-red-500">{errors.map((error) => error.path == 'tipo_mantenimiento' ? error.msg : '')}</div>
                </div>
              </form>
            </div>
            <div>
              {/* Columna 2 */}
              <div className="mb-4 mt-11">
                <label htmlFor="id_maquina" className="block text-sm font-bold text-gray-700">Máquina:</label>

                <Select
                  id="id_maquina"
                  onChange={(option) => setSelectedMaquina(option)}
                  defaultValue={{ value: maquinaId, label: maquinas.find(maquina => maquina.id_maquina === maquinaId)?.nombre_maquina || '' }}
                  options={maquinas.map(maquina => ({ value: maquina.id_maquina, label: maquina.nombre_maquina }))}
                  className="w-full mt-1  text-black"
                  placeholder="Selecciona el ID de la máquina"
                />
                <div className="text-red-500">{errors.map((error) => error.path === 'id_maquina' ? error.msg : '')}</div>
              </div>


              <div className="mb-4">
                <label htmlFor="id_usuario" className="block text-sm font-bold text-gray-700">Usuario:</label>
                {/* {console.log('ASA:', usuarios)} */}
                <Select
                  id="id_usuario"
                  onChange={(option) => setSelectedUsuario(option)}
                  defaultValue={{ value: usuarioId, label: usuarios.find(usuario => usuario.id_usuario === usuarioId)?.nombres || '' }}
                  options={usuarios.map(usuario => ({ value: usuario.id_usuario, label: usuario.identificacion }))}
                  className="w-full mt-1 text-black"
                  placeholder="Selecciona un usuario"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'id_usuario' ? error.msg : '')}</div>
              </div>

              <div className="mb-4">
                <label htmlFor="id_usuario" className="block text-sm font-bold text-gray-700 text-black">Cargar nueva evidencia:</label>
                <input type="file" name="" id="" accept='application/pdf' onChange={handleEvidencia} />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className='text-white font-bold hover:bg-blue-800 w-48 h-14 bg-blue-600 rounded'
                  onClick={handleActualizarMantenimiento}
                >
                  Actualizar
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-800 text-white font-bold py-2 px-8 rounded"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white w-2/4 p-6 rounded shadow-lg grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-bold mb-4 text-stone-950 ">Registrar Mantenimiento</h2>
              <form>
                <div className="mb-4 ">
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
                  <div className="text-red-500">{errors.map((error) => error.path == 'fecha_mantenimiento' ? error.msg : '')}</div>
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
                  <div className="text-red-500">{errors.map((error) => error.path == 'hora_mantenimiento' ? error.msg : '')}</div>

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
                  <div className="text-red-500">{errors.map((error) => error.path == 'descripcion' ? error.msg : '')}</div>
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
                    <option value="calibracion">Calibración</option>
                  </select>
                  <div className="text-red-500">{errors.map((error) => error.path == 'tipo_mantenimiento' ? error.msg : '')}</div>
                </div>

              </form>
            </div>
            <div>
              <div className="mb-4 mt-11">
                <label htmlFor="id_maquina" className="block text-sm font-bold text-gray-700">Máquina:</label>
                <Select
                  id="id_maquina"
                  value={selectedMaquina}
                  onChange={(option) => setSelectedMaquina(option)}
                  options={maquinas.map(maquina => ({ value: maquina.id_maquina, label: maquina.nombre_maquina }))}
                  className="w-full mt-1 text-black"
                  placeholder="Selecciona una máquina"
                />
                <div className="text-red-500">{errors.map((error) => error.path === 'id_maquina' ? error.msg : '')}</div>
              </div>

              <div className="mb-4">
                <label htmlFor="id_usuario" className="block text-sm font-bold text-gray-700 text-black">Usuario:</label>
                <Select
                  id="id_usuario"
                  value={selectedUsuario}
                  onChange={(option) => setSelectedUsuario(option)}
                  options={usuarios.map(usuario => ({ value: usuario.id_usuario, label: usuario.identificacion }))}
                  className="w-full mt-1 text-black"
                  placeholder="Selecciona un usuario"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'id_usuario' ? error.msg : '')}</div>
              </div>
              <div className="mb-4">
                <label htmlFor="id_usuario" className="block text-sm font-bold text-gray-700 text-black">Cargar Evdencia:</label>
                <input type="file" name="" id="" accept='application/pdf' onChange={handleEvidencia} />
                {/* <div className="text-red-500">{errors.map((error) => error.path == 'id_usuario' ? error.msg : '')}</div> */}
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="text-white font-bold hover:bg-green-800 w-40 h-10 bg-green-600 rounded"
                  onClick={handleRegistrarMantenimiento}
                >
                  Registrar
                </button>
                <button
                  className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mt-4bg-gray-500 hover:bg-gray-800 text-white font-bold py-2 px-8 rounded"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalNoti}
        onRequestClose={closeModal}
        contentLabel="Modal Mantenimiento"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        appElement={document.getElementById('root')}
      >
        <div className="bg-white w-96 p-6 rounded shadow-lg grid gap-4">
          <h2 className="text-xl font-bold mb-4 text-stone-950">Notificar próximo mantenimiento</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="fecha" className="block text-sm font-bold text-gray-700">
                Fecha:
              </label>
              <input
                type="date"
                id="fecha"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                placeholder="Nuevo Fecha"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="comentarios" className="block text-sm font-bold text-gray-700">
                Comentarios:
              </label>
              <input
                type="text"
                id="comentarios"
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                placeholder="Nuevo Comentario"
              />
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
                <option value="calibracion">Calibracion</option>

              </select>
            </div>

            <div className="mb-4 mt-11">
              <label htmlFor="id_maquina" className="block text-sm font-bold text-gray-700">Máquina:</label>
              <Select
                id="id_maquina"
                value={selectedMaquina}
                onChange={(option) => setSelectedMaquina(option)}
                options={maquinas.map(maquina => ({ value: maquina.id_maquina, label: maquina.nombre_maquina }))}
                className="w-full mt-1  text-black"
                placeholder="Selecciona el ID de la máquina"
              />
              <div className="text-red-500">{errors.map((error) => error.path === 'id_maquina' ? error.msg : '')}</div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                className='text-white font-bold hover:bg-green-800 w-40 h-10 bg-green-600 rounded'
                onClick={handleNotificarMantenimiento}
              >
                Registrar
              </button>

              <button
                className="bg-gray-500 hover:bg-gray-800 text-white font-bold py-2 px-8 rounded"
                onClick={closeModal}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Mantenimiento;