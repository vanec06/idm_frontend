import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import MUIDataTable from "mui-datatables";

const Ambiente = () => {
  const [id_ambiente, setid_ambiente] = useState('');
  const [nombre, setnombre] = useState('');
  const [ambientes, setAmbientes] = useState([]);
  const [selectedAmbiente, setSelectedAmbiente] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    listarAmbientes();
  }, []);

  const buscarAmbientes = async (id_ambiente) => {
    try {
      if (!id_ambiente) {
        listarAmbientes();
        return;
      }

      const response = await fetch(`http://localhost:4000/ambiente/buscar/${id_ambiente}`);
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
      const response = await fetch('http://localhost:4000/ambiente/listar');
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
  };

  const closeModal = () => {
    setSelectedAmbiente(null);
    setIsOpen(false);
  };

  const handleRegistrarAmbiente = async (e) => {
    e.preventDefault();

    const nuevoAmbiente = {
      id_ambiente,
      nombre,
    };

    const response = await fetch('http://localhost:4000/ambiente/registrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoAmbiente),
    });

    const responseData = await response.json();

    if (responseData.errors) {
      setErrors(responseData.errors);
    } else {
      closeModal();
    }

    listarAmbientes();
    setid_ambiente('');
    setnombre('');
  };

  const handleActualizarAmbiente = async () => {
    const ambienteActualizado = {
      id_ambiente: selectedAmbiente.id_ambiente,
      nombre,
    };

    await fetch(`http://localhost:4000/ambiente/actualizar/${ambienteActualizado.id_ambiente}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ambienteActualizado),
    });

    listarAmbientes();
    closeModal();
  };

  const handleEliminarAmbiente = async (id_ambiente) => {
    await fetch(`http://localhost:4000/ambiente/eliminar/${id_ambiente}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    listarAmbientes();
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
    selectableRows: false,
    responsive: 'standard',
    download: false,
    print: false,
    viewColumns: false,
    pagination: false,
    elevation: 0,
    onRowClick: (rowData) => {
      const ambiente = ambientes[rowData[0]];
      openModal(ambiente);
    },
  };

  return (
    <div>
      <h2 className="text-black text-3xl font-bold mb-5 px-6 w-full">Lista de Ambientes</h2>
      <div className='w-full h-20 bg-customBlue flex items-center justify-between px-4'>
        <div>
          <button className='text-white w-40 h-10 bg-green-600 rounded-md' onClick={() => openModal(null)}>
            Registrar
          </button>
        </div>
      </div>
      <div className="mt-8 mx-6">
        <MUIDataTable
          title={"Ambientes"}
          data={ambientes.map(ambiente => [ambiente.id_ambiente, ambiente.nombre, null])}
          columns={columns}
          options={options}
        />
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Modal Ambiente"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        appElement={document.getElementById("root")}
      >
        {selectedAmbiente ? (
          <div className="bg-white w-96 p-6 rounded shadow-lg grid grid-cols-2 gap-4">
            <h2 className="text-xl font-bold mb-4">Actualizar Ambiente</h2>
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
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-2"
                onClick={handleActualizarAmbiente}
              >
                Actualizar Ambiente
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white w-2/4 p-6 rounded shadow-lg grid grid-cols-2 gap-4">
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
                 <div className="text-red-500">{errors.length > 0 ? errors[0].msg: ''}</div>
              </div>
              <button
                className='text-white w-40 h-10 bg-green-600 rounded-md'
                onClick={handleRegistrarAmbiente}
              >
                Registrar
              </button>
            </form>
            <button
              className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
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

export default Ambiente;
