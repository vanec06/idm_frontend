import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import MUIDataTable from "mui-datatables";

const Area = () => {
  const [id_area, setid_area] = useState('');
  const [nombre, setnombre] = useState('');
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    listarAreas();
  }, []);

  const buscarAreas = async (id_area) => {
    try {
      if (!id_area) {
        listarAreas();
        return;
      }

      const response = await fetch(`http://localhost:4000/area/buscar/${id_area}`);
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
      const response = await fetch('http://localhost:4000/area/listar');
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
  };

  const closeModal = () => {
    setSelectedArea(null);
    setIsOpen(false);
  };

  const handleRegistrarArea = async (e) => {
    e.preventDefault();

    const nuevaArea = {
      id_area,
      nombre,
    };

    const response = await fetch('http://localhost:4000/area/registrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaArea),
    });

    const responseData = await response.json();

    if (responseData.errors) {
      setErrors(responseData.errors);
    } else {
      closeModal();

    }
    
    console.log("DATA REGISTER: ", responseData.errors);

    listarAreas();
    setid_area('');
    setnombre('');
    // closeModal();
  };

  const handleActualizarArea = async () => {
    const areaActualizada = {
      id_area: selectedArea.id_area,
      nombre,
    };

    const response =await fetch(`http://localhost:4000/area/actualizar/${areaActualizada.id_area}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(areaActualizada),
    });

    const responseData = await response.json();

    if (responseData.errors) {
      setErrors(responseData.errors);
    } else {
      closeModal();

    }
    
    console.log("DATA REGISTER: ", responseData.errors);

     listarAreas();
    // closeModal();
  };

  const handleEliminarArea = async (id_area) => {
    await fetch(`http://localhost:4000/area/eliminar/${id_area}`, {
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
    },
  ];

  const options = {
    filterType: 'checkbox',
    selectableRows: false,
    responsive: 'standard',
    download: false,
    print: false,
    viewColumns: false,
    pagination: false,
    elevation: 0,
    onRowClick: (rowData) => {
      const area = areas[rowData[0]];
      openModal(area);
    },
  };

  return (
    <div>
      <h2 className="text-black text-3xl font-bold mb-5 px-6 w-full">Lista de Áreas</h2>
      <div className='w-full h-20 bg-customBlue flex items-center justify-between px-4'>
        <div>
          <button className='text-white w-40 h-10 bg-green-600 rounded-md' onClick={() => openModal(null)}>
            Registrar
          </button>
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
        onRequestClose={closeModal}
        contentLabel="Modal Área"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        appElement={document.getElementById("root")}
      >
        {selectedArea ? (
          <div className="bg-white w-96 p-6 rounded shadow-lg grid grid-cols-2 gap-4">
            <h2 className="text-xl font-bold mb-4">Actualizar Área</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="id_area" className="block text-sm font-bold text-gray-700">
                  ID Área:
                </label>
                <input
                  type="text"
                  id="id_area"
                  value={selectedArea.id_area || ''}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
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
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  placeholder="Nuevo Nombre"
                />
              </div>
              <div className="text-red-500">{errors.length > 0 ? errors[0].msg: ''}</div>
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-2"
                onClick={handleActualizarArea}
              >
                Actualizar Área
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white w-2/4 p-6 rounded shadow-lg grid grid-cols-2 gap-4">
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
                <div className="text-red-500">{errors.length > 0 ? errors[0].msg: ''}</div>
              </div>
              <button
                className='text-white w-40 h-10 bg-green-600 rounded-md'
                onClick={handleRegistrarArea}
              >
                Registrar
              </button>
            </form>
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

export default Area;
