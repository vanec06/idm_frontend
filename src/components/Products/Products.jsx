import React, { useEffect, useState } from "react";
import Heading from "../Shared/Heading";
import ProductCard from "./ProductCard";
import Modal from "./Modal";
import Api, { ruta } from "../Api";
import { IoMdSearch } from "react-icons/io";
import isEmpty from 'lodash/isEmpty';
import { Link } from 'react-router-dom';


const Products = () => {
  const [data, setData] = useState([]); // 
  const [areas, setArea] = useState([]);
  const [ambientes, setAmbientes] = useState([]);
  const [disable, setDisabled] = useState(true);
  const [disableBuscar, setDisabledBuscar] = useState(true);
  const [buscar, setBuscar] = useState('');
  const [valueAmbiente, selectedOption] = useState('');

  useEffect(() => {
    listarMaquinas({ limite: true });
    listarAreas()
  }, []);

  const listarMaquinas = async (filter = {}) => {
    try {

      const resp = await Api.post('/maquina/listar', filter);
      const dataM = resp.data;
      console.log('DATA U: ', isEmpty(filter));
      console.log('FILTER MAIN: ', filter);
      setData(dataM)
      if (dataM.length > 0 && !('limite' in filter) || ('buscar' in filter)) {
        setDisabledBuscar(false)
      } else {
        setDisabledBuscar(true)
      }
      // setData(dataM); 
    } catch (error) {
      console.log('DATA U ERROR: ', error);
      // alert('Error al cargar las máquinas');
    }
  };

  const filtrarPorArea = (data) => {
    if (data != 'null') {
      const filtro = { area: data }
      listarMaquinas(filtro)
      listarAmbiente(data)
      setDisabled(false)
      setDisabledBuscar(false)
    } else {
      listarMaquinas({ limite: true, area: 'null', ambiente: 'null' })
      selectedOption('')
      setDisabledBuscar(true)
      setDisabled(true)
    }
  }

  const filtrarPorAmbiente = (data) => {
    const filtro = { ambiente: data }
    console.log('FILTRO AMBIENTE: ', data);
    listarMaquinas(filtro)
    selectedOption(data)
    // if (data) {
    //   setDisabled(false)
    // } else {
    //   setDisabled(true)
    // }
  }

  const [selectedMachine, setSelectedMachine] = useState(null);

  const handleDescriptionClick = (machine) => {
    setSelectedMachine(machine);
  };

  const handleCloseModal = () => {
    setSelectedMachine(null);
  };


  const listarAreas = async () => {
    try {
      const resp = await Api.get('/area/listar')
      setArea(resp.data)
      // console.log(resp.data);
    } catch (error) {
      console.log('AREA ERROR LISTA: ', resp.data);
    }
  }

  const listarAmbiente = async (filter = {}) => {
    try {
      console.log('FILTRO AMBIETNET: ', filter);
      const resp = await Api.post('/ambiente/listar', { area: filter })
      setAmbientes(resp.data)
      console.log('AMBIENTE: ', resp);
      // console.log(resp.data);
    } catch (error) {
      console.log('AMBIENTE ERROR LISTAR: ', resp.data);
    }
  }

  const valueBuscar = (event) => {
    console.log('VAU: ', event.target.value);
    setBuscar(event.target.value)
    if (event.target.value == '') {
      listarMaquinas({ buscar: 'null' })
    }
  }

  const buscarMaquina = async () => {
    if (buscar != '') {
      listarMaquinas({ buscar: buscar })
    } else {
      listarMaquinas({ buscar: 'null' })
    }
  }

  return (
    <div>
      <div className="bg-gray-900:text-white duration-200 relative z-40">
        <div className="py-4">
          <div className="container flex justify-between items-center  fixed top-8">

            {/* SECCIONES */}
            <div className="fixed top-0 left-0 w-full bg-gray-100 shadow-md">
              <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center gap-4">
                  {/* BUSCAR */}
                  <div className="relative group flex-grow">
                    <input
                      disabled={disableBuscar}
                      onChange={valueBuscar}
                      type="text"
                      placeholder="Buscar"
                      className="search-bar pl-10 text-gray-700 bg-gray-200 rounded-full py-2 px-4 focus:outline-none focus:bg-white focus:border-gray-500 transition-colors duration-300 ease-in-out w-full"
                    />
                    {!disableBuscar && (
                      <IoMdSearch
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-gray-700 transition-colors duration-300 ease-in-out"
                        onClick={() => buscarMaquina()}
                      />
                    )}
                  </div>

                  {/* SELECT DE AREA */}
                  <select
                    className="select-style"
                    onChange={(e) => filtrarPorArea(e.target.value)}
                  >
                    <option value={'null'}>Seleccione un área</option>
                    {areas.map((index) => (
                      <option key={index.id_area} value={index.id_area}>{index.nombre}</option>
                    ))}
                  </select>

                  {/* SELECT DE AMBIENTE */}
                  <select
                    disabled={disable}
                    className="select-style"
                    value={valueAmbiente}
                    onChange={(e) => filtrarPorAmbiente(e.target.value)}
                  >
                    <option value={'null'}>Seleccione un ambiente</option>
                    {ambientes.map((index) => (
                      <option key={index.id_ambiente} value={index.id_ambiente}>{index.nombre}</option>
                    ))}
                  </select>

                  {/* Botón de Iniciar Sesión */}
                  <Link to="/login">
                    <button className="bg-blue-500 hover:bg-blue-600 font-semibold py-2 px-4 rounded transition duration-300 ease-in-out">
                      Iniciar Sesión
                    </button>
                  </Link>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      <div className="container h-[500px]">
        <Heading title={<span style={{ color: 'black' }}>Inventario</span>} subtitle={"Explora las máquinas"} />
        <ProductCard data={data} onDescriptionClick={handleDescriptionClick} />
        {selectedMachine && (
          <Modal onClose={handleCloseModal}>
            <div className="text-black grid grid-cols-2 w-[960px] items-center">
              <div className="h-[400px] w-full flex items-center justify-center p-2 bg-gray-100">
                <img className="h-full" src={`http://${ruta}:4000/images/img/${selectedMachine.placa}/${selectedMachine.imagen}`} alt="" />
              </div>
              <div className="h-full w-full flex justify-center p-2 flex-col gap-2 ml-5">
                <div className="font-bold  text-blue-700 text-[1.3em]">{selectedMachine.nombre_maquina}</div>
                <b>Descripción: </b><div className="h-[130px] text-[14px] w-[93%] overflow-y-auto bg-gray-100 p-2 rounded text-justify">{selectedMachine.descripcion}</div>
                <div className=""><b>Marca: </b>{selectedMachine.marca}</div>
                <div className=""><b>Modelo: </b>{selectedMachine.modelo}</div>
                <div className=""><b>Serial: </b>{selectedMachine.serial}</div>
                <div className=""><b>Placa: </b>{selectedMachine.placa}</div>
                <div className=""><b>Estado: </b>{selectedMachine.estado_maquina}</div>
                <div className=""><b>Ambiente: </b>{selectedMachine.nombre_ambiente}</div>
                <a href={`http://${ruta}:4000/images/pdf/${selectedMachine.placa}/${selectedMachine.manual}`} target="_blank" title='Ver manual PDF'><div className="bg-blue-500 cursor-pointer rounded p-2 w-max font-bold text-white">Ver Manual</div></a>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div >
  );
};

export default Products;
