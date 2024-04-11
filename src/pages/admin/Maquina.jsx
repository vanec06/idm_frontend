import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaEdit } from 'react-icons/fa';
import { MdUpdate } from 'react-icons/md';
import { BsX } from 'react-icons/bs';
import MUIDataTable from "mui-datatables";
import Swal from 'sweetalert2';
import Select from 'react-select';
import Api, { ruta } from "../../components/Api";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

import { exportToExcel } from '../../components/Reportes';

const Maquina = () => {
  const [id_maquina, setid_maquina] = useState('');
  const [nombre, setNombre] = useState('');
  const [marca, setMarca] = useState('');
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [manual, setManual] = useState('');
  const [serial, setSerial] = useState('');
  const [imagen, setImagen] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('');
  const [ambientes, setAmbientes] = useState([]);
  const [selectedAmbiente, setSelectedAmbiente] = useState(null);
  const [estado_maquina, setestado_maquina] = useState('');

  const [maquinas, setMaquinas] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedMaquina, setSelectedMaquina] = useState(null);
  const [errors, setErrors] = useState([]);

  const [areaId, setAreaId] = useState(null);
  const [ambienteId, setambienteId] = useState(null);

  const [nuevaImagenFile, setNuevaImagenFile] = useState(null);
  const [nuevoManual, setNuevoManual] = useState(null);

  const [historialData, setHistorial] = useState([]);

  const [imagenBase64, setImagenBase64] = useState('');

  useEffect(() => {
    listarMaquinas();
    listarAmbientes();
  }, []);


  const listarAmbientes = async () => {
    try {
      const response = await fetch(`http://${ruta}:4000/ambiente/listar`, {
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
  const handleDesactivarMaquina = async (id_maquina) => {
    try {
      const response = await fetch(`http://${ruta}:4000/maquina/debaja/${id_maquina}`, {
        method: 'PUT',
      });

      if (response.ok) {
        const updatedMachines = await fetch(`http://${ruta}:4000/maquina/listar`, {
          method: 'POST'
        })
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

  const listarMaquinas = async (id_maquina) => {
    try {
      const fetchData = async () => {
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

      if (!id_maquina) {
        fetchData();
        return;
      }

      const response = await fetch(`http://${ruta}:4000/maquina/buscar/${id_maquina}`);
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

    fetchData();
  }, []);

  const openModal = (maquina) => {
    if (maquina) {
      setNuevoManual('yes')
      setNuevaImagenFile('yes')
      // console.log(maquina);
      setSelectedMaquina(maquina);
      setid_maquina(maquina.id_maquina || '');
      setNombre(maquina.nombre_maquina || '');
      setMarca(maquina.marca || '');
      setPlaca(maquina.placa || '');
      setModelo(maquina.modelo || '');
      setManual(maquina.manual || '');
      setSerial(maquina.serial || '');
      setImagen(maquina.imagen || '');
      setDescripcion(maquina.descripcion || '');
      setEstado(maquina.estado || '');
      // setSelectedUsuario(maquina.nombre_usuario || '');
      // setSelectedArea(maquina.nombre_area || '');
      // setSelectedAmbiente(maquina.nombre_ambiente || '');
      setestado_maquina(maquina.estado_maquina || '');
      // setAreaId(maquina.id_area || '');
      setambienteId(maquina.id_ambiente || '');
      setModalIsOpen(true);
    } else {

      setSelectedMaquina(null);
      setid_maquina('');
      setNombre('');
      setMarca('');
      setPlaca('');
      setModelo('');
      setManual('');
      setSerial('');
      setImagen('');
      setDescripcion('');
      setEstado('');
      // setSelectedUsuario('');
      // setSelectedArea('');
      setSelectedAmbiente('');
      setestado_maquina('');
      setModalIsOpen(true);
    }

  };

  const closeModal = () => {
    setModalIsOpen(false);
    // Restablecer campos de entrada y limpiar errores al cerrar el modal

    setid_maquina('');
    setNombre('');
    setMarca('');
    setPlaca('');
    setModelo('');
    setManual('');
    setSerial('');
    setImagen('');
    setDescripcion('');
    setEstado('');
    // setSelectedUsuario('');
    // setSelectedArea('');
    setSelectedAmbiente('');
    setestado_maquina('');
    setErrors([]);
  };

  const handleImagenConvert = (event) => {
    return new Promise((resolve, reject) => {
      const archivo = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(archivo);
    });
  };

  const handleImagenChange = async (e) => {
    try {
      const imagenBase64 = await handleImagenConvert(e);
      // setImagenBase64(imagenBase64);
      setNuevaImagenFile(imagenBase64);
      const file = e.target.files[0];
      // Continuar con el resto del código aquí
    } catch (error) {
      console.error('Error al convertir la imagen:', error);
      // Manejar el error aquí
    }
  };

  const handleManualChange = async (e) => {
    try {
      const imagenBase64 = await handleImagenConvert(e);
      // setImagenBase64(imagenBase64);
      setNuevoManual(imagenBase64);
      const file = e.target.files[0];
      // Continuar con el resto del código aquí
    } catch (error) {
      console.error('Error al convertir la imagen:', error);
      // Manejar el error aquí
    }
  };

  const handleRegistrarMaquina = async () => {
    try {
      const formData = {
        img: nuevaImagenFile,
        id_maquina: id_maquina,
        nombre: nombre,
        marca: marca,
        placa: placa,
        modelo: modelo,
        manual: nuevoManual,
        serial: serial,
        imagen: imagen,
        descripcion: descripcion,
        estado: estado,
        // id_usuario: selectedUsuario.value,
        // id_area: selectedArea.value,
        id_ambiente: selectedAmbiente.value,
        estado_maquina: estado_maquina,
      }
      console.log('DATA: ', formData);
      const responseData = await Api.post(`http://${ruta}:4000/maquina/registrar`, formData);
      // const responseData = await response.json();
      // console.log('xd: ', responseData);
      if (responseData.data.errors) {
        setErrors(responseData.data.errors);
      } else {
        closeModal();
      }

      if (responseData.data.status == true) {
        const updatedMachines = await fetch(`http://${ruta}:4000/maquina/listar`, {
          method: 'POST'
        })
          .then((response) => response.json())
          .catch((error) => console.error('Error fetching machines:', error));

        setMaquinas(updatedMachines);
        closeModal();
        Swal.fire({
          icon: 'success',
          title: 'Maquina registrada correctamente',
        });

      } else {
        console.error('Error al registrar máquina:', responseData.data.message);

        const responseBody = await responseData.data;
        setErrors(responseBody.errors || []);
        console.error('Error al registrar máquina:', responseBody.errors);
      }
    } catch (error) {
      console.error('Error al registrar máquina:', error);
    }
  };

  const handleActualizarMaquina = async () => {
    try {
      const formData = {
        img: nuevaImagenFile,
        id_maquina: id_maquina,
        nombre: nombre,
        marca: marca,
        placa: placa,
        modelo: modelo,
        manual: nuevoManual,
        serial: serial,
        imagen: imagen,
        descripcion: descripcion,
        estado: estado,
        // id_usuario: selectedUsuario ? selectedUsuario.value : 1,
        // id_area: selectedArea ? selectedArea.value : areaId,
        id_ambiente: selectedAmbiente ? selectedAmbiente.value : ambienteId,
        estado_maquina: estado_maquina,
      }
      console.log('DATA: ', formData);
      const responseData = await Api.put(`http://${ruta}:4000/maquina/actualizar/${id_maquina}`, formData);
      // const responseData = await response.json();
      // console.log('xd: ', responseData);
      if (responseData.data.errors) {
        setErrors(responseData.data.errors);
      } else {
        closeModal();
        Swal.fire({
          icon: 'success',
          title: 'Maquina actualizada correctamente',
        });
      }

      // alert(responseData.data.status)
      if (responseData.data.status == '200 OK') {
        const updatedMachines = await fetch(`http://${ruta}:4000/maquina/listar`, {
          method: 'POST'
        })
          .then((response) => response.json())
          .catch((error) => console.error('Error fetching machines:', error));

        setMaquinas(updatedMachines);
        closeModal();
        Swal.fire({
          icon: 'success',
          title: 'Maquina registrada correctamente',
        });

      } else {
        console.error('Error al registrar máquina:', responseData.data.message);

        const responseBody = await responseData.data;
        setErrors(responseBody.errors || []);
        console.error('Error al registrar máquina:', responseBody.errors);
      }
    } catch (error) {
      console.error('Error al registrar máquina:', error);
    }
  };


  const historial = async (id) => {

    try {
      const response = await Api.get(`http://${ruta}:4000/mantenimiento/historial/` + id,);
      const data = response.data;
      // console.log(data.data.length);
      if (data.data.length > 0) {
        pdfHistorial(data.data)
      } else {

        console.error('No hay historial:', data.message);
        Swal.fire({
          title: "¡No hay historial de mantenimiento!",
          icon: "error"
        });
      }
    } catch (error) {
      console.error('Error al listar historial:', error);
    }
  };

  const pdfHistorial = (info) => {

    const doc = new jsPDF();

    const data = info.map(mantenimiento => [moment(mantenimiento.fecha_mantenimiento).format('DD/MM/YYYY'), mantenimiento.hora_mantenimiento, mantenimiento.descripcion, mantenimiento.tipo_mantenimiento, mantenimiento.tecnico, mantenimiento.identificacion]);

    const addHeader = () => {
      doc.setFontSize(18);
      doc.text(`Historial de mantenimientos ${info[0].nombre} - ${info[0].placa}`, 20, 10);
    };

    doc.autoTable({
      head: [['Fecha', 'Hora', 'Descripcion', 'Tipo', 'Tecnico Encargado', 'Identificación']],
      body: data,
      addPageContent: addHeader
    });

    doc.save(`mantenimientos-${info[0].nombre}.pdf`)
  }

  const columnsExcel = [
    { key: "nombre_maquina", label: "Nombre" },
    { key: "marca", label: "Marca" },
    { key: "placa", label: "Placa Sena" },
    { key: "serial", label: "Serial" },
    { key: "descripcion", label: "Descripcion" },
    { key: "estado", label: "Estado" },
    { key: "nombre_area", label: "Area" },
    { key: "nombre_ambiente", label: "Ambiénte" },
    { key: "estado_maquina", label: "Estado maquina" },
  ]

  const columns = [
    { name: 'id_maquina', label: 'ID' },
    { name: 'nombre', label: 'Nombre maquina' },
    { name: 'marca', label: 'Marca' },
    { name: 'placa', label: 'Placa Sena' },
    { name: 'modelo', label: 'Modelo' },
    {
      name: 'manual', label: 'Manual', options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const maquina = maquinas[tableMeta.rowIndex];
          return (
            <a href={`http://${ruta}:4000/images/pdf/${maquina.placa}/${value}`} target="_blank" title='Ver manual PDF'><svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256">
              <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
              <g><g><g><path fill="#000000" d="M204,145.9c-3.2-3.1-10.1-4.7-20.7-4.9c-7.2-0.1-15.8,0.6-24.9,1.8c-4.1-2.4-8.3-4.9-11.6-8c-8.9-8.3-16.3-19.8-20.9-32.4c0.3-1.2,0.6-2.2,0.8-3.3c0,0,5-28.4,3.7-37.9c-0.2-1.3-0.3-1.7-0.7-2.7l-0.4-1.1c-1.3-3.1-4-6.5-8.2-6.3l-2.5-0.1h-0.1c-4.6,0-8.5,2.4-9.4,5.9c-3,11.2,0.1,27.9,5.8,49.5l-1.4,3.5c-4,9.9-9.1,19.8-13.6,28.6l-0.6,1.1c-4.7,9.2-9,17-12.9,23.7l-4,2.1c-0.3,0.1-7.2,3.8-8.8,4.8C60,178.4,50.9,187.7,49.5,195c-0.5,2.3-0.1,5.3,2.3,6.7l3.9,2c1.7,0.8,3.4,1.3,5.3,1.3c9.7,0,21-12.1,36.6-39.2c18-5.9,38.4-10.7,56.3-13.4c13.7,7.7,30.5,13,41.1,13c1.9,0,3.5-0.2,4.8-0.5c2-0.5,3.8-1.7,4.8-3.3c2-3.1,2.5-7.4,1.9-11.7C206.2,148.5,205.2,146.9,204,145.9z M58.8,197.6c1.8-4.8,8.8-14.4,19.2-22.9c0.7-0.5,2.3-2,3.7-3.4C70.8,188.5,63.6,195.4,58.8,197.6z M120.3,56c3.1,0,4.9,7.9,5.1,15.3c0.1,7.4-1.6,12.6-3.7,16.4C119.8,82,119,73,119,67.2C119,67.2,118.8,56,120.3,56z M101.9,156.9c2.2-3.9,4.5-8,6.8-12.4c5.6-10.7,9.2-19,11.9-25.9c5.3,9.6,11.8,17.8,19.6,24.3c1,0.8,2,1.6,3.1,2.5C127.5,148.5,113.9,152.3,101.9,156.9z M201,156c-1,0.6-3.7,0.9-5.5,0.9c-5.7,0-12.7-2.6-22.6-6.8c3.8-0.3,7.3-0.4,10.4-0.4c5.7,0,7.4,0,13,1.4C201.9,152.5,202,155.4,201,156z M218.2,56L185.3,23c-7.2-7.2-21.3-13-31.5-13H43.2c-10.1,0-18.4,8.3-18.4,18.4v199.1c0,10.1,8.3,18.4,18.4,18.4h169.6c10.1,0,18.4-8.3,18.4-18.4V87.4C231.3,77.3,225.4,63.1,218.2,56z M207.8,66.4c0.7,0.7,1.4,1.6,2.1,2.6h-37.7V31.3c1,0.7,1.9,1.4,2.6,2.1L207.8,66.4z M216.5,227.5c0,2-1.7,3.7-3.7,3.7H43.2c-2,0-3.7-1.7-3.7-3.7V28.4c0-2,1.7-3.7,3.7-3.7h110.6c1.1,0,2.4,0.1,3.7,0.4v58.6h58.6c0.2,1.3,0.4,2.6,0.4,3.7V227.5z" /></g><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /></g></g>
            </svg></a>
          )
        }
      }
    },
    { name: 'serial', label: 'Serial' },
    {
      name: 'imagen', label: 'Imagen', options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const maquina = maquinas[tableMeta.rowIndex];
          return (
            <img src={`http://${ruta}:4000/images/img/${maquina.placa}/${value}`} alt="Imagen de la máquina" />
          )
        }
      }
    },
    { name: 'descripción', label: 'Descripción' },
    { name: 'estado', label: 'Estado' },
    { name: 'id_area', label: 'Nombre Área' },
    { name: 'id_ambiente', label: 'Nombre Ambiente' },
    { name: 'estado_maquina', label: 'Estado Máquina' },
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
              <button onClick={() => handleDesactivarMaquina(maquina.id_maquina)} className=" px-2 py-1 rounded ml-2 ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600 stroke-[3px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                </svg>

              </button>
              <button onClick={() => historial(maquina.id_maquina)} className="text-white px-2 py-1 rounded ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor " className="w-6 h-6 text-blue-500 stroke-[3px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>


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
      <h2 className="text-black text-3xl font-bold mb-5 px-6 w-full">Lista De Máquinas</h2>
      <div className='justify-between px-4'>
        <div>
          <button className='text-white w-40 h-10 bg-green-600 rounded-md' onClick={() => openModal(null)}>
            Registrar
          </button>
          <button className='bg-blue-400 p-2 ml-4 rounded text-white' onClick={() => exportToExcel(maquinas, columnsExcel)}>Exportar a Excel</button>
        </div>
      </div>
      <div className="mt-8 mx-6">
        <MUIDataTable
          title={"Maquinas"}
          data={maquinas.map(maquina => [maquina.id_maquina, maquina.nombre_maquina, maquina.marca, maquina.placa, maquina.modelo, maquina.manual, maquina.serial, maquina.imagen, maquina.descripcion, maquina.estado, maquina.nombre_area, maquina.nombre_ambiente, maquina.estado_maquina])}
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
          <div className="bg-white  p-6 rounded shadow-lg grid grid-cols-2 gap-4">

            <form>

              <div className="  col-span-1">
                <h2 className="text-xl font-bold mb-4 text-black">ACTUALIZAR EQUIPOS</h2>
                {/* Columna 1 */}

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
                  <div className="text-red-500">{errors.map((error) => error.path == 'id_maquina' ? error.msg : '')}</div>
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
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950"
                    placeholder="nombre"
                  />
                  <div className="text-red-500">{errors.map((error) => error.path == 'nombre' ? error.msg : '')}</div>
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
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                    placeholder="Nueva Marca"
                  />
                  <div className="text-red-500">{errors.map((error) => error.path == 'marca' ? error.msg : '')}</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="placa" className="block text-sm font-bold text-gray-700">
                    Placa Sena:
                  </label>
                  <input
                    type="text"
                    id="placa"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                    placeholder="Nueva Placa"
                  />
                  <div className="text-red-500">{errors.map((error) => error.path == 'placa' ? error.msg : '')}</div>

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
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                    placeholder="Nuevo Modelo"
                  />
                  <div className="text-red-500">{errors.map((error) => error.path == 'modelo' ? error.msg : '')}</div>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="manual" className="block text-sm font-bold text-gray-700">
                  Manual:
                </label>
                <input
                  type="file"
                  id="manual"
                  name='manual'
                  onChange={(e) => handleManualChange(e)}
                  className="w-full mt-1"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'manual' ? error.msg : '')}</div>
              </div>

            </form>

            <div className="  col-span-1" >
              <div className="mb-4 mt-11">
                <label htmlFor="serial" className="block text-sm font-bold text-gray-700">
                  Serial:
                </label>
                <input
                  type="text"
                  id="serial"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                  placeholder="Nuevo Serial"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'serial' ? error.msg : '')}</div>
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
                <div className="text-red-500">{errors.map((error) => error.path == 'imagen' ? error.msg : '')}</div>
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
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                  placeholder="Nueva Descripción"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'descripcion' ? error.msg : '')}</div>
              </div>
              <div className="mb-4">
                <label htmlFor="estado" className="block text-sm font-bold text-gray-700">
                  Estado:
                </label>
                {console.log(estado)}
                <select id="estado"
                  defaultValue={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950 "
                >
                  <option value="">Selecciona un tipo </option>
                  <option value="con_mantenimiento">Con mantenimiento, no aplica calibracion</option>
                  <option value="calibracion_vigente">Con mantenimiento y calibracion vigente</option>
                  <option value="no_realizado_calibracion">Con mantenimiento y no realizada la calibracion</option>
                  <option value="sin_calibracion">Con mantenimiento y sin calibracion vigente</option>
                  <option value="dar_baja">En proceso para dar de baja</option>
                  <option value="no_cuenta_mantenimienton">No cuenta con mantenimiento ni calibracion</option>
                  <option value="mantenimiento_correctivo">Requiere mantenimiento correctivo</option>
                  <option value="mantenimiento_preventivo">Requiere mantenimiento, no aplica calibracion</option>
                </select>
                <div className="text-red-500">{errors.map((error) => error.path == 'estado' ? error.msg : '')}</div>
              </div>


              <div className="mb-4">
                <label htmlFor="id_ambiente" className="block text-sm font-bold text-gray-700">Ambiente:</label>

                <Select
                  id="id_ambiente"
                  onChange={(option) => setSelectedAmbiente(option)}
                  defaultValue={{ value: ambienteId, label: ambientes.find(ambiente => ambiente.id_ambiente === ambienteId)?.nombre || '' }}
                  options={ambientes.map(ambiente => ({ value: ambiente.id_ambiente, label: ambiente.nombre }))}
                  className="w-full mt-1 text-black"
                  placeholder="Selecciona el ambiente"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'id_ambiente' ? error.msg : '')}</div>
              </div>

              <div className="mb-4">
                <label htmlFor="estado_maquina" className="block text-sm font-bold text-gray-700">
                  Estado:
                </label>
                <select id="estado_maquina"
                  defaultValue={estado_maquina}
                  onChange={(e) => setestado_maquina(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950 "
                >
                  <option value="">Selecciona un tipo </option>
                  <option value="funcional">Funcional</option>
                  <option value="fuera_de_servicio">Fuera de servicio</option>

                </select>
                <div className="text-red-500">{errors.map((error) => error.path == 'estado_maquina' ? error.msg : '')}</div>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="text-white font-bold hover:bg-blue-800 w-40 h-10 bg-blue-600 rounded"
                  onClick={handleActualizarMaquina}
                >
                  Actualizar Máquina
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
          <div className="bg-white  p-6 rounded shadow-lg grid grid-cols-2 gap-4">
            <form>

              <div className="  col-span-1">
                <h2 className="text-xl font-bold mb-4 text-black">Registrar Máquina</h2>

                <div className="mb-4">
                  <label htmlFor="nombre_maquina" className="block text-sm font-bold text-gray-700">
                    Nombre:
                  </label>
                  <input
                    type="text"
                    id="nombre_maquina"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                    placeholder="nombre"
                  />
                  <div className="text-red-500">{errors.map((error) => error.path == 'nombre' ? error.msg : '')}</div>
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
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                    placeholder="Marca"
                  />
                  <div className="text-red-500">{errors.map((error) => error.path == 'marca' ? error.msg : '')}</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="placa" className="block text-sm font-bold text-gray-700">
                    Placa Sena:
                  </label>
                  <input
                    type="text"
                    id="placa"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                    placeholder="Placa"
                  />
                  <div className="text-red-500">{errors.map((error) => error.path == 'placa' ? error.msg : '')}</div>
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
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                    placeholder="Modelo"
                  />
                  <div className="text-red-500">{errors.map((error) => error.path == 'modelo' ? error.msg : '')}</div>
                </div>

              </div>

              <div className="mb-4">
                <label htmlFor="manual" className="block text-sm font-bold text-gray-700">  Manual:    </label>
                <input
                  type="file"
                  id="manual"
                  name='manual'
                  onChange={(e) => handleManualChange(e)}
                  placeholder="Manual"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'manual' ? error.msg : '')}</div>
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
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                  placeholder="Serial"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'serial' ? error.msg : '')}</div>
              </div>
            </form>
            <div className="  col-span-1" >
              <div className="mb-4 mt-11">
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
                <div className="text-red-500">{errors.map((error) => error.path == 'img' ? error.msg : '')}</div>
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
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                  placeholder="Descripcion"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'descripcion' ? error.msg : '')}</div>
              </div>
              <div className="mb-4">
                <label htmlFor="estado" className="block text-sm font-bold text-gray-700">
                  Estado:
                </label>
                <select id="estado"
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950 "
                >
                  <option value="">Selecciona un tipo </option>
                  <option value="con_mantenimiento">Con mantenimiento, no aplica calibracion</option>
                  <option value="calibracion_vigente">Con mantenimiento y calibracion vigente</option>
                  <option value="no_realizado_calibracion">Con mantenimiento y no realizada la calibracion</option>
                  <option value="sin_calibracion">Con mantenimiento y sin calibracion vigente</option>
                  <option value="dar_baja">En proceso para dar de baja</option>
                  <option value="no_cuenta_mantenimienton">No cuenta con mantenimiento ni calibracion</option>
                  <option value="mantenimiento_correctivo">Requiere mantenimiento correctivo</option>
                  <option value="mantenimiento_preventivo">Requiere mantenimiento, no aplica calibracion</option>
                </select>
                <div className="text-red-500">{errors.map((error) => error.path == 'estado' ? error.msg : '')}</div>
              </div>
              <div className="mb-4">
                <label htmlFor="id_ambiente" className="block text-sm font-bold text-gray-700">Ambiente:</label>
                <Select
                  id="id_ambiente"
                  value={selectedAmbiente}
                  onChange={(option) => setSelectedAmbiente(option)}
                  options={ambientes.map(ambiente => ({ value: ambiente.id_ambiente, label: ambiente.nombre }))}
                  className="w-full mt-1 text-black"
                  placeholder="Selecciona el ambiente"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'id_ambiente' ? error.msg : '')}</div>
              </div>

              <div className="mb-4">
                <label htmlFor="estado_maquina" className="block text-sm font-bold text-gray-700">
                  Estado Maquina:
                </label>
                <select id="estado_maquina"
                  onChange={(e) => setestado_maquina(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950 "
                >
                  <option value="">Selecciona un tipo </option>
                  <option value="funcional">Funcional</option>
                  <option value="fuera_de_servicio">Fuera de servicio</option>
                </select>
                <div className="text-red-500">{errors.map((error) => error.path == 'estado_maquina' ? error.msg : '')}</div>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="text-white font-bold hover:bg-green-800 w-40 h-10 bg-green-600 rounded"
                  onClick={handleRegistrarMaquina}
                >
                  Registrar Máquina
                </button>
                <button
                  type='button'
                  className="bg-gray-500 hover:bg-gray-800 text-white font-bold py-2 px-8 rounded"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>

        )}
      </Modal>
    </div>
  );
};

export default Maquina;   