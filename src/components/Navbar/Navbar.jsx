import React, { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import Api from "../Api";



const Navbar = ({ }) => {
  
  useEffect(() => {
    listarAreas()
  }, [])

  const [areas, setArea] = useState([]);

  const listarAreas = async () => {
    try {
      const resp = await Api.get('/area/listar')
      setArea(resp.data)
      // console.log(resp.data);
    } catch (error) {
      console.log('AREA ERROR LISTA: ', resp.data);
    }
  }

  // return (
  //   <div className="bg-[#2A5D84] dark:bg-gray-900 dark:text-white duration-200 relative z-40">
  //     <div className="py-4">
  //       <div className="container flex justify-between items-center">
  //         {/* LOGO */}
  //         <div className="flex items-center gap-4">
  //           <a
  //             className="text-primary font-semibold tracking-widest text-2xl uppercase sm:text-3xl text-white">
  //             IDM
  //           </a>
  //           {/* MENU*/}
  //           <div className="hidden lg:block">
  //           </div>
  //         </div>

  //         {/* SECCIONES */}
  //         <div className="flex justify-between items-center gap-4">
  //           {/* BUSCAR */}
  //           <div className="relative group hidden sm:block">
  //             <div className="relative">
  //               <input
  //                 type="text"
  //                 placeholder="Buscar"
  //                 className="search-bar pl-10" />
  //               <IoMdSearch className="text-xl text-[#2A5D84] absolute top-1/2 -translate-y-1/2 left-3" />
  //             </div>
  //           </div>

  //           {/* SELECT DE AREA */}
  //           <div>
  //             <select className="bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1" onChange={(e) => filtrarPorArea(e.target.value)}>
  //               {areas.map((index) => (
  //                 <option key={index.id_area} value={index.id_area}>{index.nombre}</option>
  //               ))}
  //             </select>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default Navbar;


