import React from "react";
import { ruta } from "../Api";

const ProductCard = ({ data, onDescriptionClick }) => {
  return (
    <div className="mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 place-items-center">
        {data.map((item) => (
          <div
            data-aos="fade-up"
            data-aos-delay={item.aosDelay}
            className="group"
            key={item.id_maquina}
          >
            <div className="relative">
              <img
                src={`http://${ruta}:4000/images/img/${item.placa}/${item.imagen}`}
                alt=""
                className="h-[180px] w-[260px] object-cover rounded-md"
              />
            </div>
            <div className="leading-7">
              <h2 className="font-semibold text-black">{item.nombre_maquina}</h2>
              <button
                className="font-bold text-blue-500"
                onClick={() => onDescriptionClick(item)}
              >
                Ver descripción
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;


