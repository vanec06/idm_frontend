import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaEdit } from 'react-icons/fa';
import MUIDataTable from "mui-datatables";
import Swal from 'sweetalert2';
import { ruta } from "../../components/Api";
import { exportToExcel } from "../../components/Reportes";
import Select from 'react-select';

const Ambiente = () => {
  const [id_ambiente, setid_ambiente] = useState('');
  const [nombre, setnombre] = useState('');
  const [ambientes, setAmbientes] = useState([]);
  const [selectedAmbiente, setSelectedAmbiente] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState([]);


  const [usuarios, setUsuarios] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);

  const [usuarioId, setUsuarioId] = useState(null);
  const [areaId, setAreaId] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listarAmbientes();
    listarUsuarios();
    listarAreas();

  }, []);

  const listarUsuarios = async () => {

    try {
      const response = await fetch(`http://${ruta}:4000/usuario/listar/` + true,);
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

  const listarAreas = async () => {
    try {
      const response = await fetch(`http://${ruta}:4000/area/listar`);
      const data = await response.json();

      if (response.ok) {
        setAreas(data);
      } else {
        console.error('Error al listar áreas:', data.message);
      }
    } catch (error) {
      console.error('Error al listar áreas:', error);
    }
  };

  const buscarAmbientes = async (id_ambiente) => {
    try {
      if (!id_ambiente) {
        listarAmbientes();
        return;
      }

      const response = await fetch(`http://${ruta}:4000/ambiente/buscar/${id_ambiente}`);
      const data = await response.json();

      if (response.ok) {
        if (data) {
          setAmbientes([data]);
        } else {
          setAmbientes([]);
        }
      } else {
        console.error('Error al buscar ambiente:', data.message);
      }
    } catch (error) {
      console.error('Error en la búsqueda de ambiente:', error);
    }
  };

  const listarAmbientes = async () => {
    try {
      const response = await fetch(`http://${ruta}:4000/ambiente/listar`,
        {
          method: 'POST'
        });
      const data = await response.json();

      if (response.ok) {
        setAmbientes(data);
      } else {
        console.error('Error al listar ambientes:', data.message);
      }
    } catch (error) {
      console.error('Error al listar ambientes:', error);
    }
  };

  const openModal = (ambiente) => {
    setSelectedAmbiente(ambiente);
    setIsOpen(true);

    if (ambiente) {
      setid_ambiente(ambiente.id_ambiente);
      setnombre(ambiente.nombre);
      setUsuarioId(ambiente.id_usuario)
      setAreaId(ambiente.area_id_area)
      // console.log('XD:; ', ambiente.id_usuario);
      // setnombre(ambiente.nombre);
    }
  };

  const closeModal = () => {
    setSelectedAmbiente(null);
    setIsOpen(false);
    setErrors([]); // Limpiar los errores
    setid_ambiente(''); // Restablecer el ID del área
    setnombre(''); // Restablecer el nombre del área
  };

  const handleRegistrarAmbiente = async (e) => {
    e.preventDefault();

    setLoading(true)
    const nuevoAmbiente = {
      nombre: nombre,
      id_usuario: selectedUsuario ? selectedUsuario.value : null,
      area_id_area: selectedArea ? selectedArea.value : null
    };

    console.log('DATA: ', nuevoAmbiente);
    const response = await fetch(`http://${ruta}:4000/ambiente/registrar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoAmbiente),
    });

    const responseData = await response.json();
    setLoading(false)
    if (responseData.errors) {
      setErrors(responseData.errors);
    } else {
      setLoading(false)
      listarAmbientes(); // Actualizar la lista inmediatamente
      closeModal();
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Ambiente registrado exitosamente.',
      });
    }
  };

  const handleActualizarAmbiente = async () => {
    setLoading(true)
    const ambienteActualizado = {
      id_ambiente: selectedAmbiente.id_ambiente,
      area_id_area: selectedArea ? selectedArea.value : areaId,
      id_usuario: selectedUsuario ? selectedUsuario.value : usuarioId,
      nombre: nombre
    };

    const response = await fetch(`http://${ruta}:4000/ambiente/actualizar/${ambienteActualizado.id_ambiente}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ambienteActualizado),
    });

    const responseData = await response.json();

    setLoading(false)
    if (responseData.errors) {
      setErrors(responseData.errors);
    } else {
      setLoading(false)
      listarAmbientes(); // Actualizar la lista inmediatamente
      closeModal();
      Swal.fire({
        icon: 'success',
        title: '¡Actualización exitosa!',
        text: 'El ambiente se ha actualizado correctamente.',
      });
    }
  };

  const columns = [
    {
      name: "id_ambiente",
      label: "ID",
    },
    {
      name: "nombre",
      label: "Nombre",
    },
    {
      name: "nombre_area",
      label: "Area",
    },
    {
      name: "encargado",
      label: "Encargado",
    },
    {
      name: "acciones",
      label: "Acciones",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const ambiente = ambientes[tableMeta.rowIndex];
          return (
            <div>
              <button onClick={() => openModal(ambiente)}>
                <FaEdit className="text-orange-400 text-xl" />
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
  };


  return (
    <div>
      <h2 className="text-black text-3xl font-bold mb-5 px-6 w-full">Lista de Ambientes</h2>
      <div className=' justify-between px-4'>
        <div>
          <button className='text-white w-40 h-10 bg-green-600 rounded-md' onClick={() => openModal(null)}>
            Registrar
          </button>
          <button className='bg-blue-400 p-2 ml-4 rounded text-white' onClick={() => exportToExcel(ambientes, columnsExcel)}>Exportar a Excel</button>

        </div>
      </div>
      <div className="mt-8 mx-6">
        <MUIDataTable
          title={"Ambientes"}
          data={ambientes.map(ambiente => [ambiente.id_ambiente, ambiente.nombre, ambiente.nombre_area, ambiente.encargado, null])}
          columns={columns}
          options={options}
        />

      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={Modal}
        contentLabel="Modal Ambiente"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        appElement={document.getElementById("root")}
      >
        {selectedAmbiente ? (
          <div className="bg-white w-96 p-6 rounded shadow-lg grid gap-4">
            <h2 className="text-xl font-bold mb-4 text-black">Actualizar Ambiente</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="id_ambiente" className="block text-sm font-bold text-gray-700">
                  ID Ambiente:
                </label>
                <input
                  type="text"
                  id="id_ambiente"
                  value={selectedAmbiente.id_ambiente || ''}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="nombre" className="block text-sm font-bold text-gray-700">
                  Nombre:
                </label>
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setnombre(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                  placeholder="Nuevo Nombre"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'nombre' ? error.msg : '')}</div>

              </div>

              <div className="mb-4">
                <label htmlFor="id_usuario" className="block text-sm font-bold text-gray-700">Usuario:</label>
                {/* {console.log('AREAS: ',  areas)}
                {console.log('ID AREA: ',  areaId)}
                {console.log('AREASIBJET: ',  areas.find(area => area.id_area === areaId)?.nombre || '' )}
                {console.log('OBJE: ',  usuarios)}
                {console.log('IDUS: ',  usuarioId)}
                {console.log('mmm: ',  usuarios.find(usuario => usuario.id_usuario === usuarioId))} */}
                <Select
                  id="id_usuario"
                  onChange={(option) => setSelectedUsuario(option)}
                  defaultValue={{ value: usuarioId, label: usuarios.find(usuario => usuario.id_usuario === usuarioId)?.nombres || '' }}
                  options={usuarios.map(usuario => ({ value: usuario.id_usuario, label: usuario.nombres + ',' + usuario.identificacion }))}

                  className="w-full mt-1 text-black"
                  placeholder="Selecciona un usuario"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'id_usuario' ? error.msg : '')}</div>
              </div>
              <div className="mb-4">
                <label htmlFor="id_area" className="block text-sm font-bold text-gray-700">Area:</label>
                <Select
                  id="id_area"
                  onChange={(option) => setSelectedArea(option)}
                  defaultValue={{ value: areaId, label: areas.find(area => area.id_area === areaId)?.nombre || '' }}
                  options={areas.map(area => ({ value: area.id_area, label: area.nombre }))}
                  className="w-full mt-1 text-black"
                  placeholder="Selecciona el area"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'area_id_area' ? error.msg : '')}</div>
              </div>

              <div className="flex justify-between">
                <button
                  disabled={loading}
                  type="button"
                  className='text-white font-bold hover:bg-blue-800 w-40 h-10 bg-blue-600 rounded'
                  onClick={handleActualizarAmbiente}
                >
                  {loading == true ?
                    <div
                      class="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status">
                      <span
                        class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                      >Loading...</span
                      >
                    </div> : 'Actualizar'
                  }
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
        ) : (
          <div className="bg-white w-96 p-6 rounded shadow-lg grid gap-4">
            <h2 className="text-xl font-bold mb-4 text-stone-950">Registrar Ambiente</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="nombre" className="block text-sm font-bold text-gray-700">
                  Nombre:
                </label>
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setnombre(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950"
                  placeholder="Nuevo Ambiente"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'nombre' ? error.msg : '')}</div>

              </div>
              <div className="mb-4">
                <label htmlFor="id_usuario" className="block text-sm font-bold text-gray-700">Usuario:</label>
                <Select
                  id="id_usuario"
                  // value={selectedUsuario}
                  onChange={(option) => setSelectedUsuario(option)}
                  options={usuarios.map(usuario => ({ value: usuario.id_usuario, label: usuario.nombres + ',' + usuario.identificacion }))}
                  className="w-full mt-1 text-black"
                  placeholder="Selecciona un usuario"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'id_usuario' ? error.msg : '')}</div>
              </div>
              <div className="mb-4">
                <label htmlFor="id_area" className="block text-sm font-bold text-gray-700">Area:</label>
                <Select
                  id="id_area"
                  // value={selectedArea}
                  onChange={(option) => setSelectedArea(option)}
                  options={areas.map(area => ({ value: area.id_area, label: area.nombre }))}
                  className="w-full mt-1 text-black"
                  placeholder="Selecciona el area"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'area_id_area' ? error.msg : '')}</div>
              </div>
              <div className="flex justify-between">
                <button
                  disabled={loading}
                  type="button"
                  className='text-white font-bold hover:bg-green-800 w-40 h-10 bg-green-600 rounded'
                  onClick={handleRegistrarAmbiente}
                >
                  {loading == true ?
                    <div
                      class="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status">
                      <span
                        class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                      >Loading...</span
                      >
                    </div> : 'Registrar'
                  }
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
        )}
      </Modal>
    </div>
  );
};

export default Ambiente;
