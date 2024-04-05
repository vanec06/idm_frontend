import React, { useEffect, useState } from "react";
import Heading from "../Shared/Heading";
import ProductCard from "./ProductCard";
import Modal from "./Modal";
import Api, { ruta } from "../Api";

const Products = () => {
  const [data, setData] = useState([]); // 

  useEffect(() => {
    listarMaquinas(); //
  }, []);

  const listarMaquinas = async () => {
    try {
      const resp = await Api.post('/maquina/listar');
      const dataM = resp.data;
      console.log('DATA U: ', dataM);
      setData(dataM); // 
    } catch (error) {
      console.log('DATA U ERROR: ', error);
      alert('Error al cargar las máquinas');
    }
  };

  const [selectedMachine, setSelectedMachine] = useState(null);

  const handleDescriptionClick = (machine) => {
    setSelectedMachine(machine);
  };

  const handleCloseModal = () => {
    setSelectedMachine(null);
  };

  return (
    <div>
      <div className="container">
      <Heading title={<span style={{color: 'black'}}>Inventario</span>} subtitle={"Explora las máquinas"} />
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
                <a href={`http://${ruta}:4000/images/pdf/${selectedMachine.placa}/${selectedMachine.manual}`} target="_blank" title='Ver manual PDF'><div className="bg-blue-500 cursor-pointer rounded p-2 w-max font-bold text-white">Ver Manual</div></a>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Products;
