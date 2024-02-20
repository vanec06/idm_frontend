// import React, { useEffect, useState, useRef } from "react"
// import { useNavigate } from "react-router-dom";
// import Api from "../services/api";
// import Sweet from "../helpers/Sweet";
// import "../style/cafe.css";


// const Cafe = () => {
//     const [cafes, setCafes] = useState([]);
//     const [selectedCafeId, setSelectedCafeId] = useState(null);
//     const [modalCafe, setModalCafe] = useState(null);
//     const [isRegistrarModalOpen, setRegistrarModalOpen] = useState(false);
//     const [lote, setLotes] = useState([]);
//     const [variedades, setvariedades] = useState([]);
//     const [dataSelect, setDataSelect] = useState({});


//     const lotes_id = useRef();


//     const variedades_id = useRef();

//     const navigate = useNavigate()

//     useEffect(() => {
//         const buscarcafe = async () => {
//             try {
//                 const response = await Api.get('cafe/listar');
//                 setCafes(response.data);
//                 console.log(response)
//             } catch (error) {
//                 console.error('Error fetching tasks:', error);
//             }
//         }
//         buscarcafe();
//     }, []);

//     useEffect(() => {
//         const buscarLotes = async () => {
//             try {
//                 const response = await Api.get("lote/listar");
//                 setLotes(response.data);
//             } catch (error) {
//                 console.error("Error fetching tasks:", error);
//             }
//         };
//         buscarLotes();
//     }, []);

//     useEffect(() => {
//         const buscarvariedades = async () => {
//             try {
//                 const response = await Api.get('variedad/listar');
//                 setvariedades(response.data);
//             } catch (error) {
//                 console.error('Error fetching tasks:', error);
//             }
//         }
//         buscarvariedades();
//     }, []);


//     const openModal = async (cafeId) => {
//         setSelectedCafeId(cafeId);
//         try {
//             const response = await Api.get(/cafe/buscar/${cafeId});
//             setModalCafe(response.data[0]);
//         } catch (error) {
//             console.error('Error buscando el cafe', error);
//         }
//     };

//     const closeModal = () => {
//         setSelectedCafeId(null);
//         setModalCafe(null);
//     };

//     const handleEditUser1 = async () => {
//         try {
//             await Api.put(/cafe/actualizar/${selectedCafeId}, modalCafe);
//             Sweet.actualizacionExitosa();
//             closeModal();
//             // Recargar la lista de Cafes después de la actualización
//             const response = await Api.get("cafe/listar");
//             setCafes(response.data);
//         } catch (error) {
//             console.error("Error editando el Cafe: ", error);
//         }
//     };
//     const handleEditUser2 = async () => {
//         const result = await Sweet.confimarDeshabilitar({
//         });
//         if (result.isConfirmed) {
//             try {
//                 await Api.patch(/cafe/desactivar/${selectedCafeId}, modalCafe);
//                 closeModal();
//                 // Recargar la lista de cafes después de la desactivación
//                 const response = await Api.get("cafe/listar");
//                 setCafes(response.data);
//             } catch (error) {
//                 console.error("Error desactivando el Cafe: ", error);
//             }
//         }
//     };
//     const handleEditUser3 = async () => {
//         const result = await Sweet.confimarHabilitar({});
//         if (result.isConfirmed) {
//             try {
//                 await Api.patch(/cafe/activar/${selectedCafeId}, modalCafe);
//                 closeModal();
//                 // Recargar la lista de cafes después de la activación
//                 const response = await Api.get("cafe/listar");
//                 setCafes(response.data);
//             } catch (error) {
//                 console.error("Error activando el cafe: ", error);
//             }
//         }
//     };
//     const openRegistrarModal = () => {
//         setRegistrarModalOpen(true);
//     };

//     const closeRegistrarModal = () => {
//         setRegistrarModalOpen(false);
//     };

//     const handleRegistrar = async (data) => {
//         console.log(data, "dataaaaaaa")
//         const headers = {
//             headers: {
//                 token: "xd",
//             },
//         };

//         try {
//             await Api.post("cafe/registrar", data, headers);
//             Sweet.registroExitoso();
//             closeRegistrarModal();
//             // Recargar la lista de cafes después del registro
//             const response = await Api.get("cafe/listar");
//             setCafes(response.data);
//         } catch (error) {
//             console.error("Error al registrar el cafe:", error);
//         }
//     };

//     function clearFocusInput(Element) {
//         let inputSearch = document.getElementById(Element)

//         if (inputSearch) {
            
//             let divOptions = inputSearch.parentNode.querySelectorAll(".select-options-input");
//             if(divOptions.length > 0){
//                 divOptions[0].style.display = "none"
//             }
//             let select = inputSearch.parentNode.querySelectorAll(".option-select-search")
//             for (let s = 0; s < select.length; s++) {
//                 let elementValue = inputSearch.getAttribute("id")
                
//                 if(dataSelect[inputSearch.getAttribute("id")].value == select[s].getAttribute("data-id")){
//                     select[s].classList.add("option-select-focus")
//                 }else{
//                     select[s].classList.remove("option-select-focus")
//                 }
                
//             }
//         }
//     }
//     useEffect(() => {

//         let inputSearch = document.querySelectorAll(".input-search")

//         if (inputSearch.length > 0) {
//             for (let s = 0; s < inputSearch.length; s++) {
//                 inputSearch[s].addEventListener("blur",function(){
//                     let divOptions = inputSearch[s].parentNode.querySelectorAll(".select-options-input");
//                     if(divOptions.length > 0){
//                        setTimeout(() => {
//                         divOptions[0].style.display = "none"
//                        }, 100);
//                     }

//                 })
//                 inputSearch[s].addEventListener("input", function () {
//                     let parent = inputSearch[s].parentNode
//                     if (parent) {
//                         let selectOptionsInput = parent.querySelectorAll(".select-options-input");
//                         if (selectOptionsInput[0]) {
//                             selectOptionsInput[0].style.display = "block"
//                             let options = selectOptionsInput[0].querySelectorAll("div");
//                             for (let o = 0; o < options.length; o++) {
//                                 if (options[o].innerHTML.toLowerCase().includes(inputSearch[s].value.toLowerCase())) {
//                                     options[o].style.display = "block"
//                                 } else {
//                                     options[o].style.display = "none"
//                                 }
//                                 if (options[o].innerHTML.toLowerCase() == inputSearch[s].value.toLowerCase()) {
//                                     let focusSelect = document.querySelectorAll(".option-select-focus")
//                                     if (focusSelect.length > 0) {
//                                         console.log(focusSelect[0].classList)
//                                         focusSelect[0].classList.remove("option-select-focus")
//                                     }
//                                     inputSearch[s].value = options[o].innerHTML
//                                     if(!dataSelect[inputSearch[s].getAttribute("data-id")]){
//                                         dataSelect[inputSearch[s].getAttribute("data-id")] = {}
//                                     }
//                                     dataSelect[inputSearch[s].getAttribute("data-id")].value = options[o].getAttribute("data-id")
//                                     options[o].classList.add("option-select-focus")
//                                 } else {
//                                     options[o].classList.remove("option-select-focus")
//                                 }
//                             }
//                         }
//                     }
//                 })
//             }
//         }
//     }, [isRegistrarModalOpen])
//     return (<>
//         {modalCafe && <div className="overlay" onClick={closeModal}></div>}
//         {isRegistrarModalOpen && (
//             <div className="overlay" onClick={closeRegistrarModal}></div>
//         )}
//         <img src="../../public/img/fondo.png" alt="" className="fondo2" />
//         <div className="tablalistar">
//             <h1 className="titu"> Listado de  cafe</h1>

//             <button to="/cafe/registrar" className="btn-registrar-lote" onClick={openRegistrarModal}>
//                 Registrar cafe
//             </button>

//             <table className="tableprincipal">
//                 <thead>
//                     <tr className="bg-gray-200">
//                         <th>id</th>
//                         <th>Propietario</th>
//                         <th>finca</th>
//                         <th>Municipio</th>
//                         <th>lote</th>
//                         <th>variedad</th>
//                         <th>Estado</th>
//                         <th>opciones</th>

//                     </tr>
//                 </thead>
//                 <tbody>
//                     {cafes
//                         .map((task) => (
//                             <tr key={task.id} className="border-t">
//                                 <td>{task.id}</td>
//                                 <td>{task.nombre_usuario}</td>
//                                 <td>{task.nombre_finca}</td>
//                                 <td>{task.nombre_municipio}</td>
//                                 <td>{task.numero_lote}</td>
//                                 <td>{task.nombre_variedad}</td>
//                                 <td>{task.estado === 1 ? 'Activo' : 'Desactivado'}</td>
//                                 <td>
//                                     <button
//                                         type="button"
//                                         className="btn-primary"
//                                         onClick={() => openModal(task.id)}
//                                     >
//                                         Modificar
//                                     </button>
//                                 </td>

//                             </tr>
//                         ))}
//                 </tbody>
//             </table>
//         </div>

//         {modalCafe && (
//             <div className="tabla3">
//                 <h1 className="text-center font-bold underline text-3xl p-3 m-2">Editar Cafe</h1>
//                 <div className="max-w-xs">
//                     <input
//                         className="input-field"
//                         type="number"
//                         placeholder="lotes_id"
//                         value={modalCafe.lotes_id}
//                         onChange={(e) => setModalCafe({ ...modalCafe, lotes_id: e.target.value })}
//                     />

//                     <input
//                         className="input-field"
//                         type="number" placeholder="variedades_id"
//                         value={modalCafe.variedades_id}
//                         onChange={(e) => setModalCafe({ ...modalCafe, variedades_id: e.target.value })}
//                     />
//                     <button
//                         className="btn-primary"
//                         onClick={handleEditUser1}
//                     >
//                         Actualizar
//                     </button>
//                     {modalCafe.estado === 1 ? (
//                         <button
//                             className="btn-secondary"
//                             onClick={handleEditUser2}
//                         >
//                             Desactivar
//                         </button>
//                     ) : (
//                         <button
//                             className="btn-tertiary"
//                             onClick={handleEditUser3}
//                         >
//                             Activar
//                         </button>
//                     )}
//                     <button
//                         className="close-modal-btn"
//                         onClick={closeModal}
//                     >
//                         Cerrar
//                     </button>
//                 </div>
//             </div>
//         )}

//         {isRegistrarModalOpen && (
//             <div className="overlay" onClick={closeRegistrarModal}></div>
//         )}
//         {isRegistrarModalOpen && (
//             <div className="tabla2">
//                 <h1 className="text-center font-bold underline text-3xl p-3 m-2">
//                     Registrar Cafe
//                 </h1>

//                 <form
//                     className="contenido-regi"
//                     onSubmit={(e) => {
//                         e.preventDefault();
//                         handleRegistrar({
//                             variedades_id: dataSelect.variedades_id.value,
//                             lotes_id: dataSelect.lotes_id.value
//                         });
//                     }}
//                     method="post"
//                 >

//                     <div className="div-input">
//                         <input className="input-search" type="text" id="lotes_id" />
//                         <label htmlFor="lotes_id" className='label'>Lote</label>
//                         <div className="select-options-input">
//                             {lote.map((key, index) => (
//                                 (
//                                     <div className="option-select-search" data-id={key.id} onClick={() => { document.getElementById("lotes_id").value = key.Nombre_Finca + ", " + key.nombre; !dataSelect.lotes_id ? dataSelect.lotes_id = {} : "";dataSelect.lotes_id.value = key.id; clearFocusInput("lotes_id") }} key={key.id}>{key.Nombre_Finca + ", " + key.nombre}</div>
//                                 )
//                             ))}
//                         </div>
//                     </div>
//                     <div className="div-input">
//                     <input className="input-search" type="text" id="variedades_id" />
//                     <label htmlFor="variedades_id" className='label'>Variedad</label>
//                         <div className="select-options-input">
//                             {variedades.map((key, index) => (
//                                 (
//                                     <div className="option-select-search" data-id={key.id} onClick={() => { document.getElementById("variedades_id").value = key.nombre; !dataSelect.variedades_id ? dataSelect.variedades_id = {} : "";dataSelect.variedades_id.value = key.id; clearFocusInput("variedades_id") }} key={key.id}>{key.nombre}</div>
//                                 )
//                             ))}
//                         </div>
//                     </div>          

//                     <button className="btn-register-lote"
//                         type="submit">Registrar Cafe</button>
//                     <button
//                         className="close-modal-btn"
//                         onClick={closeRegistrarModal}
//                     >
//                         Cerrar
//                     </button>
//                 </form>
//             </div>
//         )}

//     </>
//     )
// }

// export default Cafe