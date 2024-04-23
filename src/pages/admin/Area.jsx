import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaEdit } from 'react-icons/fa';
import MUIDataTable from "mui-datatables";
import Swal from 'sweetalert2';
import { ruta } from "../../components/Api";
import { exportToExcel } from "../../components/Reportes";

const Area = () => {
  const [id_area, setid_area] = useState('');
  const [nombre, setnombre] = useState('');
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listarAreas();
  }, []);

  const columnsExcel = [
    { key: "id_area", label: "ID" },
    { key: "nombre", label: "Nombre" }
  ]

  const buscarAreas = async (id_area) => {
    try {
      if (!id_area) {
        listarAreas();
        return;
      }

      const response = await fetch(`http://${ruta}:4000/area/buscar/${id_area}`);
      const data = await response.json();

      if (response.ok) {
        if (data) {
          setAreas([data]);
        } else {
          setAreas([]);
        }
      } else {
        console.error('Error al buscar área:', data.message);
      }
    } catch (error) {
      console.error('Error en la búsqueda de área:', error);
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

  const openModal = (area) => {
    setSelectedArea(area);
    setIsOpen(true);

    // Si hay un área seleccionada, establecer el ID y el nombre en los estados correspondientes
    if (area) {
      setid_area(area.id_area);
      setnombre(area.nombre);
    }
  };

  const closeModal = () => {
    setSelectedArea(null);
    setIsOpen(false);
    setErrors([]); // Limpiar los errores
    setid_area(''); // Restablecer el ID del área
    setnombre(''); // Restablecer el nombre del área
  };

  const handleRegistrarArea = async (e) => {
    e.preventDefault();
    setLoading(true)
    const nuevaArea = {
      id_area,
      nombre,
    };

    const response = await fetch(`http://${ruta}:4000/area/registrar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaArea),
    });

    const responseData = await response.json();
    setLoading(false)
    if (responseData.errors) {
      setErrors(responseData.errors);
    } else {
      setLoading(false)
      closeModal();
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Área registrada exitosamente.',
      });
    }

    console.log("DATA REGISTER: ", responseData.errors);

    listarAreas();
    setid_area('');
    setnombre('');
    // closeModal();
  };

  const handleActualizarArea = async () => {
    setLoading(true)
    if (!nombre.trim()) {
      setErrors([{ msg: "El nombre es obligatorio" }]);
      return;
    }
    const areaActualizada = {
      id_area: selectedArea.id_area,
      nombre,
    };

    const response = await fetch(`http://${ruta}:4000/area/actualizar/${areaActualizada.id_area}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(areaActualizada),
    });

    const responseData = await response.json();
    setLoading(false)
    if (responseData.errors) {
      setErrors(responseData.errors);
    } else {
      setLoading(false)
      closeModal();
      Swal.fire({
        icon: 'success',
        title: '¡Actualización exitosa!',
        text: 'El área se ha actualizado correctamente.',
      });

    }

    console.log("DATA REGISTER: ", responseData.errors);

    listarAreas();
    // closeModal();
  };

  const handleEliminarArea = async (id_area) => {
    await fetch(`http://${ruta}:4000/area/eliminar/${id_area}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    listarAreas();
  };

  const columns = [
    {
      name: "id_area",
      label: "ID",
    },
    {
      name: "nombre",
      label: "Nombre",
    },
    {
      name: "acciones",
      label: "Acciones",

      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const area = areas[tableMeta.rowIndex];
          return (
            <div>
              <button onClick={() => openModal(area)}>
                <FaEdit className="text-orange-400 text-xl" />
              </button>
            </div>
          );
        },
      },
    }
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
      <h2 className="text-black text-3xl font-bold mb-5 px-6 w-full">Lista de Áreas</h2>
      <div className='justify-between px-4'>
        <div>
          <button className='text-white w-40 h-10 bg-green-600 rounded-md' onClick={() => openModal(null)}>
            Registrar
          </button>
          <button className='bg-blue-400 p-2 ml-4 rounded text-white' onClick={() => exportToExcel(areas, columnsExcel)}>Exportar a Excel</button>
        </div>
      </div>
      <div className="mt-8 mx-6">
        <MUIDataTable
          title={"Áreas"}
          data={areas.map(area => [area.id_area, area.nombre, null])}
          columns={columns}
          options={options}
        />
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={Modal}
        contentLabel="Modal Área"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        appElement={document.getElementById("root")}
      >
        {selectedArea ? (
          <div className="bg-white w-96 p-6 rounded shadow-lg grid gap-4">
            <h2 className="text-xl font-bold mb-4 text-stone-950">Actualizar Área</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="id_area" className="block text-sm font-bold text-gray-700 ">
                  ID Área:
                </label>
                <input
                  type="text"
                  id="id_area"
                  value={selectedArea.id_area || ''}
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
              </div>
              <div className="text-red-500">{errors.length > 0 ? errors[0].msg : ''}</div>
              <div className="flex justify-between">
                <button
                  disabled={loading}
                  type="button"
                  className='text-white font-bold hover:bg-blue-800 w-40 h-10 bg-blue-600 rounded'
                  onClick={handleActualizarArea}
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
            <h2 className="text-xl font-bold mb-4 text-stone-950">Registrar Área</h2>
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
                  placeholder="Nuevo Area"
                />

                <div className="text-red-500">{errors.length > 0 ? errors[0].msg : ''}</div>
              </div>
              <div className="flex justify-between">
                <button
                  disabled={loading}
                  type="button"
                  className='text-white font-bold hover:bg-green-800 w-40 h-10 bg-green-600 rounded'
                  onClick={handleRegistrarArea}
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

export default Area;
