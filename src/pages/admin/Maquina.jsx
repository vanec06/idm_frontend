import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { MdUpdate } from 'react-icons/md';
import MUIDataTable from "mui-datatables";

const Maquina = () => {
  const [id_maquina, setid_maquina] = useState('');
  const [nombre, setNombre] = useState('');
  const [marca, setMarca] = useState('');
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [manual, setManual] = useState('');
  const [serial, setSerial] = useState('');
  const [imagen, setImagen] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('');
  const [id_usuario, setid_usuario] = useState('');
  const [id_area, setid_area] = useState('');
  const [id_ambiente, setid_ambiente] = useState('');
  const [estado_maquina, setestado_maquina] = useState('');

  const [maquinas, setMaquinas] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedMaquina, setSelectedMaquina] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/maquina/listar');
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

    fetchData();
  }, []);

  const columns = ["ID", "Nombre", "Marca", "Placa", "Modelo", "Cantidad", "Manual", "Serial", "Imagen", "Descripcion", "Estado Máquina", "ID Usuario", "ID Área", "ID Ambiente"];
  const options = {
    filterType: 'checkbox',
  };

  const openModal = (maquina) => {
    setSelectedMaquina(maquina);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedMaquina(null);
    setModalIsOpen(false);
  };

  return (
    <div>
      <h2 className="text-black text-3xl font-bold mb-5 px-6 w-full">Lista de Máquinas</h2>
      <div className="w-full h-20 bg-customBlue flex items-center justify-between px-4">
        <div>
          <input
            type="text"
            placeholder="Buscar por ID de máquina"
            className="w-48 h-10 border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <button className="text-white w-40 h-10 bg-green-600 rounded-md" onClick={() => openModal(null)}>
            Registrar
          </button>
        </div>
      </div>
      <div className="mt-8 mx-6">
        <MUIDataTable
          title={"Lista de Máquinas"}
          data={maquinas.map(maquina => [maquina.id_maquina, maquina.nombre, maquina.marca, maquina.placa, maquina.modelo, maquina.cantidad, maquina.manual, maquina.serial, maquina.imagen, maquina.descripcion, maquina.estado_maquina, maquina.id_usuario, maquina.id_area, maquina.id_ambiente])}
          columns={columns}
          options={options}
        />
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal Máquina"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        appElement={document.getElementById('root')}
      >
        {/* Modal content */}
      </Modal>
    </div>
  );
};

export default Maquina;
