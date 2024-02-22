import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { MdUpdate } from 'react-icons/md';
import MUIDataTable from 'mui-datatables';

const Mantenimiento = () => {
  const [id_mantenimiento, setIdMantenimiento] = useState('');
  const [fecha_mantenimiento, setFechaMantenimiento] = useState('');
  const [hora_mantenimiento, setHoraMantenimiento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo_mantenimiento, setTipoMantenimiento] = useState('');
  const [id_maquina, setIdMaquina] = useState('');
  const [id_usuario, setIdUsuario] = useState('');
  const [errors, setErrors] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedMantenimiento, setSelectedMantenimiento] = useState(null);

  const buscarMantenimientos = async (id_mantenimiento) => {
    // Código para buscar mantenimientos...
  };

  const listarMantenimientos = async () => {
    // Código para listar mantenimientos...
  };

  useEffect(() => {
    listarMantenimientos();
  }, []);

  const openModal = (mantenimiento) => {
    setSelectedMantenimiento(mantenimiento);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedMantenimiento(null);
    setModalIsOpen(false);
  };

  const handleRegistrarMantenimiento = async () => {
    // Código para registrar un mantenimiento...
  };

  const handleActualizarMantenimiento = async () => {
    // Código para actualizar un mantenimiento...
  };

  const handleEliminarMantenimiento = async (id_mantenimiento) => {
    // Código para eliminar un mantenimiento...
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
      name: 'descripcion',
      label: 'Descripción',
    },
    {
      name: 'tipo_mantenimiento',
      label: 'Tipo',
    },
    {
      name: 'id_maquina',
      label: 'ID Máquina',
    },
    {
      name: 'id_usuario',
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
    download: false,
    print: false,
    viewColumns: false,
    pagination: false,
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
        {/* Contenido del modal */}
      </Modal>
    </div>
  );
};

export default Mantenimiento;

