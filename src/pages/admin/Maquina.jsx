import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaEdit } from 'react-icons/fa';
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

  const handleDesactivarMaquina = async (id_maquina) => {
    try {
      const response = await fetch(`http://localhost:4000/maquina/debaja/${id_maquina}`, {
        method: 'PUT',
      });

      if (response.ok) {
        const updatedMachines = await fetch('http://localhost:4000/maquina/listar')
          .then((response) => response.json())
          .catch((error) => console.error('Error fetching machines:', error));

        setMaquinas(updatedMachines);
      } else {
        console.error('Error al desactivar máquina:', response.statusText);
      }
    } catch (error) {
      console.error('Error al desactivar máquina:', error);
    }
  };

  const buscarMaquinas = async (id_maquina) => {
    try {
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

      if (!id_maquina) {
        fetchData();
        return;
      }

      const response = await fetch(`http://localhost:4000/maquina/buscar/${id_maquina}`);
      const data = await response.json();

      if (response.ok) {
        if (data) {
          setMaquinas([data]);
        } else {
          setMaquinas([]);
        }
      } else {
        console.error('Error al buscar máquina:', data.message);
      }
    } catch (error) {
      console.error('Error en la búsqueda de máquina:', error);
    }
  };



  useEffect(() => {
    const handleImagenChange = (e) => {
      const file = e.target.files[0];
      setNuevaImagenFile(file);
    };

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

  const openModal = (maquina) => {
    if (maquina) {

      setSelectedMaquina(maquina);
      setid_maquina(maquina.id_maquina || '');
      setNombre(maquina.nombre || '');
      setMarca(maquina.marca || '');
      setPlaca(maquina.placa || '');
      setModelo(maquina.modelo || '');
      setCantidad(maquina.cantidad || '');
      setManual(maquina.manual || '');
      setSerial(maquina.serial || '');
      setImagen(maquina.imagen || '');
      setDescripcion(maquina.descripcion || '');
      setEstado(maquina.estado || '');
      setid_usuario(maquina.id_usuario || '');
      setid_area(maquina.id_area || '');
      setid_ambiente(maquina.id_ambiente || '');
      setestado_maquina(maquina.estado_maquina || '');
      setModalIsOpen(true);
    } else {
      setSelectedMaquina(null);
      setid_maquina('');
      setNombre('');
      setMarca('');
      setPlaca('');
      setModelo('');
      setCantidad('');
      setManual('');
      setSerial('');
      setImagen('');
      setDescripcion('');
      setEstado('');
      setid_usuario('');
      setid_area('');
      setid_ambiente('');
      setestado_maquina('');
      setModalIsOpen(true);
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedMaquina(null);
    setModalIsOpen(false);
  };

  const [nuevaImagenFile, setNuevaImagenFile] = useState(null);
  const [nuevoManual, setNuevoManual] = useState(null);

  const handleImagenChange = (e) => {

    const file = e.target.files[0];
    setNuevaImagenFile(file);
  };
  const handleManualChange = (e) => {

    const file = e.target.files[0];
    setNuevoManual(file);
  };
  const handleRegistrarMaquina = async () => {
    try {
      const formData = new FormData();
      formData.append('img', nuevaImagenFile);
      formData.append('id_maquina', id_maquina);
      formData.append('nombre', nombre);
      formData.append('marca', marca);
      formData.append('placa', placa);
      formData.append('modelo', modelo);
      formData.append('cantidad', cantidad);
      formData.append('manual', nuevoManual);
      formData.append('serial', serial);
      formData.append('imagen', imagen);
      formData.append('descripcion', descripcion);
      formData.append('estado', estado);
      formData.append('id_usuario', id_usuario);
      formData.append('id_area', id_area);
      formData.append('id_ambiente', id_ambiente);
      formData.append('estado_maquina', estado_maquina);
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await fetch('http://localhost:4000/maquina/registrar', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const updatedMachines = await fetch('http://localhost:4000/maquina/listar')
          .then((response) => response.json())
          .catch((error) => console.error('Error fetching machines:', error));

        setMaquinas(updatedMachines);
        closeModal();
      } else {
        console.error('Error al registrar máquina:', response.statusText);

        const responseBody = await response.json();
        console.error('Detalles del error:', responseBody);
      }
    } catch (error) {
      console.error('Error al registrar máquina:', error);
    }
  };

  const handleActualizarMaquina = async () => {
    const formData = new FormData();
    formData.append('nuevaImagen', nuevaImagenFile);
    formData.append('id_maquina', selectedMaquina.id_maquina);
    formData.append('nombre', nombre);
    formData.append('marca', marca);
    formData.append('placa', placa);
    formData.append('modelo', modelo);
    formData.append('cantidad', cantidad);
    formData.append('manual', nuevoManual);
    formData.append('serial', serial);
    formData.append('imagen', imagen);
    formData.append('descripcion', descripcion);
    formData.append('estado', estado);
    formData.append('id_usuario', id_usuario);
    formData.append('id_area', id_area);
    formData.append('id_ambiente', id_ambiente);
    formData.append('estado_maquina', estado_maquina);

    await fetch(`http://localhost:4000/maquina/actualizar/${selectedMaquina.id_maquina}`, {
      method: 'PUT',
      body: formData,
    });

    const updatedMachines = await fetch('http://localhost:4000/maquina/listar')
      .then((response) => response.json())
      .catch((error) => console.error('Error fetching machines:', error));

    setMaquinas(updatedMachines);
    closeModal();
  };

  const columns = [
    { name: 'ID', label: 'ID' },
    { name: 'Nombre', label: 'Nombre' },
    { name: 'Marca', label: 'Marca' },
    { name: 'Placa', label: 'Placa' },
    { name: 'Modelo', label: 'Modelo' },
    { name: 'Cantidad', label: 'Cantidad' },
    { name: 'Manual', label: 'Manual' },
    { name: 'Serial', label: 'Serial' },
    { name: 'Imagen', label: 'Imagen' },
    { name: 'Descripción', label: 'Descripción' },
    { name: 'Estado', label: 'Estado' },
    { name: 'Nombre Usuario', label: 'Nombre Usuario' },
    { name: 'Nombre Área', label: 'Nombre Área' },
    { name: 'Nombre Ambiente', label: 'Nombre Ambiente' },
    { name: 'Estado Máquina', label: 'Estado Máquina' },
    {
      name: 'Acciones',
      label: 'Acciones',
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const maquina = maquinas[tableMeta.rowIndex];
          return (
            <div>
              <button onClick={() => openModal(maquina)}>
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
    responsive: 'stacked',
    selectableRows: 'none',
    onRowClick: (rowData) => {
      const maquina = maquinas[rowData[0]];
      openModal(maquina);
    },
  };
  
  return (
    <div>
      <h2 className="text-black text-3xl font-bold mb-5 px-6 w-full">Lista de Maquinas</h2>
      <div className='w-full h-20 bg-customBlue flex items-center justify-between px-4'>
        <div>
          <button className='text-white w-40 h-10 bg-green-600 rounded-md' onClick={() => openModal(null)}>
            Registrar
          </button>
        </div>
      </div>
      <div className="mt-8 mx-6">
        <MUIDataTable
          title={"Maquinas"}
          data={maquinas.map(maquina => [maquina.id_maquina, maquina.nombre, maquina.marca, maquina.placa, maquina.modelo, maquina.cantidad, maquina.manual, maquina.serial, maquina.imagen, maquina.descripcion, maquina.estado, maquina.nombre_usuario, maquina.nombre_area, maquina.nombre_ambiente, maquina.estado_maquina])} 
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
        {selectedMaquina ? (
          <div className="bg-white w-96 p-6 rounded shadow-lg flex flex-wrap justify-between">
            <div>
              <h2 className="text-xl font-bold mb-4">Actualizar Máquina</h2>
              <form>
                <div className="mb-4">
                  <label htmlFor="id_maquina" className="block text-sm font-bold text-gray-700">
                    ID Máquina:
                  </label>
                  <input
                    type="text"
                    id="id_maquina"
                    value={selectedMaquina?.id_maquina || ''}
                    disabled
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="nombre_maquina" className="block text-sm font-bold text-gray-700">
                    Nombre:
                  </label>
                  <input
                    type="text"
                    id="nombre_maquina"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="Nuevo Nombre"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="marca" className="block text-sm font-bold text-gray-700">
                    Marca:
                  </label>
                  <input
                    type="text"
                    id="marca"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="Nueva Marca"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="placa" className="block text-sm font-bold text-gray-700">
                    Placa:
                  </label>
                  <input
                    type="text"
                    id="placa"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="Nueva Placa"
                  />
                </div>
              </form>
            </div>
            <div>
              <div className="mb-4">
                <label htmlFor="modelo" className="block text-sm font-bold text-gray-700">
                  Modelo:
                </label>
                <input
                  type="text"
                  id="modelo"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  placeholder="Nuevo Modelo"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="cantidad" className="block text-sm font-bold text-gray-700">
                  Cantidad:
                </label>
                <input
                  type="text"
                  id="cantidad"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  placeholder="Nueva Cantidad"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="manual" className="block text-sm font-bold text-gray-700">
                  Manual:
                </label>
                <input
                  type="text"
                  id="manual"
                  value={manual}
                  onChange={(e) => handleManualChange(e)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  placeholder="Nuevo Manual"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="serial" className="block text-sm font-bold text-gray-700">
                  Serial:
                </label>
                <input
                  type="text"
                  id="serial"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  placeholder="Nuevo Serial"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="imagen" className="block text-sm font-bold text-gray-700">
                  Imagen:
                </label>
                <input
                  type="file"
                  id="imagen"
                  name='img'
                  onChange={(e) => handleImagenChange(e)}
                  className="w-full mt-1"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="descripcion" className="block text-sm font-bold text-gray-700">
                  Descripción:
                </label>
                <input
                  type="text"
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  placeholder="Nueva Descripción"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="estado_maquina" className="block text-sm font-bold text-gray-700">
                  Estado:
                </label>
                <input
                  type="text"
                  id="estado_maquina"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  placeholder="Nuevo Estado"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="nombre_usuario" className="block text-sm font-bold text-gray-700">
                  ID Usuario Máquina:
                </label>
                <input
                  type="text"
                  id="nombre_usuario"
                  value={id_usuario}
                  onChange={(e) => setid_usuario(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  placeholder="Nuevo ID Usuario Máquina"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="nombre_area" className="block text-sm font-bold text-gray-700">
                  ID Área:
                </label>
                <input
                  type="text"
                  id="nombre_area"
                  value={id_area}
                  onChange={(e) => setid_area(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  placeholder="Nuevo ID Área"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="nombre_ambiente" className="block text-sm font-bold text-gray-700">
                  ID Ambiente:
                </label>
                <input
                  type="text"
                  id="nombre_ambiente"
                  value={id_ambiente}
                  onChange={(e) => setid_ambiente(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  placeholder="Nuevo ID Ambiente"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="estado_maquina" className="block text-sm font-bold text-gray-700">
                  Estado Máquina:
                </label>
                <input
                  type="text"
                  id="estado_maquina"
                  value={estado}
                  onChange={(e) => setestado_maquina(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  placeholder="Nuevo Estado Máquina"
                />
              </div>
            </div>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-2"
              onClick={handleActualizarMaquina}
            >
              Actualizar Máquina
            </button>
          </div>
        ) : (
          <div className="bg-blue-200 text-white font-bold  rounded col-span-4">
            <h2 className="text-xl font-bold mb-4">Registrar Máquina</h2>
            <form>
              <div className="float-left bg-white w-4/4 p-6 rounded shadow-lg grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="nombre" className="block text-sm font-bold text-gray-700">
                    Nombre:
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="Nombre"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="marca" className="block text-sm font-bold text-gray-700">
                    Marca:
                  </label>
                  <input
                    type="text"
                    id="marca"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="Marca"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="placa" className="block text-sm font-bold text-gray-700">
                    Placa:
                  </label>
                  <input
                    type="text"
                    id="placa"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="Placa"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="modelo" className="block text-sm font-bold text-gray-700">
                    Modelo:
                  </label>
                  <input
                    type="text"
                    id="modelo"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="Modelo"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="cantidad" className="block text-sm font-bold text-gray-700">
                    Cantidad:
                  </label>
                  <input
                    type="text"
                    id="cantidad"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="Cantidad"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="manual" className="block text-sm font-bold text-gray-700">  Manual:    </label>
                  <input
                    type="file"
                    id="manual"
                    name='manual'
                    value={manual}
                    onChange={(e) => handleManualChange(e)}

                    placeholder="Manual"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="serial" className="block text-sm font-bold text-gray-700">
                    Serial:
                  </label>
                  <input
                    type="text"
                    id="serial"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="Serial"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="imagen" className="block text-sm font-bold text-gray-700">
                    Imagen:
                  </label>
                  <input
                    type="file"
                    id="imagen"
                    name='img'
                    onChange={(e) => handleImagenChange(e)}
                    className="w-full mt-1"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="descripcion" className="block text-sm font-bold text-gray-700">
                    Descripcion:
                  </label>
                  <input
                    type="text"
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="Descripcion"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="estado_maquina" className="block text-sm font-bold text-gray-700">
                    Estado:
                  </label>
                  <input
                    type="text"
                    id="estado_maquina"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="Estado"
                  />
                </div>


                <div className="mb-4">
                  <label htmlFor="nombre_usuario" className="block text-sm font-bold text-gray-700">
                    IDusuario:
                  </label>
                  <input
                    type="text"
                    id="nombre_usuario"
                    value={id_usuario}
                    onChange={(e) => setid_usuario(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="id_usuario"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="nombre_area" className="block text-sm font-bold text-gray-700">
                    IDarea:
                  </label>
                  <input
                    type="text"
                    id="nombre_area"
                    value={id_area}
                    onChange={(e) => setid_area(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="nombre_area"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="nombre_ambiente" className="block text-sm font-bold text-gray-700">
                    IDambiente:
                  </label>
                  <input
                    type="text"
                    id="nombre_ambiente"
                    value={id_ambiente}
                    onChange={(e) => setid_ambiente(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="nombre_ambiente"
                  />
                </div>
              </div>
            </form>
            <button
              type="button"
              className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-2"
              onClick={handleRegistrarMaquina}
            >
              Registrar Máquina
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded mt-4"
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

export default Maquina;