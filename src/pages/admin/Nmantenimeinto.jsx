import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import MUIDataTable from "mui-datatables";
import Swal from "sweetalert2";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Api, { ruta } from "../../components/Api";
import { exportToExcel } from "../../components/Reportes";

const Nmantenimiento = () => {
  const [id_notificacion, setIdNotificacion] = useState("");
  const [id_maquina, setidMaquina] = useState("");
  const [maquinas, setMaquinas] = useState([]);
  const [selectedMaquina, setSelectedMaquina] = useState(null);
  const [fecha, setFecha] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [tipo_mantenimiento, setTipoMantenimiento] = useState("");
  const [notificaciones, setNotificaciones] = useState([]);
  const [selectedNotificacion, setSelectedNotificacion] = useState(null);
  const [isOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState([]);
  const [estado, setEstado] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listarNotificaciones();
    listarMaquinas();
  }, []);

  const columnsExcel = [
    { key: "fecha", label: "Fecha" },
    { key: "nombre_maquina", label: "Maquina" },
    { key: "tipo_mantenimiento", label: "Tipo" },
    { key: "estado", label: "Estado" },
    { key: "comentarios", label: "Descripción" },
  ];

  const listarMaquinas = async () => {
    try {
      const response = await fetch(`http://${ruta}:4000/maquina/listar`, {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        setMaquinas(data);
      } else {
        console.error("Error al listar máquinas:", data.message);
      }
    } catch (error) {
      console.error("Error al listar máquinas:", error);
    }
  };

  const listarNotificaciones = async () => {
    try {
      const response = await Api.post(
        `http://${ruta}:4000/notificacion/listar`
      );
      const data = response.data;

      // console.log(data);

      if (data.length > 0) {
        setNotificaciones(data);
      } else {
        console.error("Error al listar las Notificaciones:", data.message);
      }
    } catch (error) {
      console.error("Error al listar las Notificaciones:", error);
    }
  };

  const openModal = (notificacion_mantenimiento) => {
    setSelectedNotificacion(notificacion_mantenimiento);
    setModalIsOpen(true);
    console.log("DATA: ", notificacion_mantenimiento.fecha);

    if (notificacion_mantenimiento) {
      const date = notificacion_mantenimiento.fecha;
      const dateSplit = date.split('T');

      setidMaquina(notificacion_mantenimiento.id_maquina);
      setIdNotificacion(notificacion_mantenimiento.id_notificacion);
      setFecha(dateSplit[0]);
      setComentarios(notificacion_mantenimiento.comentarios);
      setTipoMantenimiento(notificacion_mantenimiento.tipo_mantenimiento);
      setSelectedMaquina({
        value: notificacion_mantenimiento.id_maquina,
        label: notificacion_mantenimiento.nombre_maquina,
      });
      setEstado(notificacion_mantenimiento.estado);
    } else {
      setIdNotificacion("");
      setFecha("");
      setComentarios("");
      setTipoMantenimiento("");
      setSelectedMaquina("");
    }
  };

  const closeModal = () => {
    setSelectedNotificacion(null);
    setModalIsOpen(false);
    setIdNotificacion("");
    setFecha("");
    setComentarios("");
    setTipoMantenimiento("");
    setSelectedMaquina("");
    setErrors([]);
  };

  const handleNotificarMantenimiento = async () => {
    setLoading(true)
    const nuevaNotificacion = {
      id_notificacion,
      fecha,
      comentarios,
      tipo_mantenimiento,
      id_maquina: selectedMaquina.value,
    };
    try {
      const response = await fetch(
        `http://${ruta}:4000/notificacion/registrar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevaNotificacion),
        }
      );

      const responseData = await response.json();

      setLoading(false)
      if (response.ok) {
        listarNotificaciones();
        closeModal();
        Swal.fire({
          icon: "success",
          title: "Notificación registrado correctamente",
        });
        toast.success(
          "Notificación de mantenimiento registrada correctamente!"
        );
      } else {
        setLoading(false)
        setErrors(
          responseData.errors || ["Error al registrar la notificación"]
        );
      }
    } catch (error) {
      console.error("Error al registrar la notificación:", error);
      setErrors(["Error al registrar la notificación"]);
    }
  };

  const handleActualizarNotificacion = async () => {
    setLoading(true)
    const notificacionActualizado = {
      id_notificacion: selectedNotificacion.id_notificacion,
      fecha,
      comentarios,
      tipo_mantenimiento,
      id_maquina: selectedMaquina ? selectedMaquina.value : id_maquina,
      estado: estado,
    };
    console.log('ID XD MAQUIN: ', notificacionActualizado);
    // return
    try {
      const response = await fetch(
        `http://${ruta}:4000/notificacion/actualizar/${notificacionActualizado.id_notificacion}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notificacionActualizado),
        }
      );

      const responseData = await response.json();

      setLoading(false)
      if (response.ok) {
        listarNotificaciones();
        closeModal();
        Swal.fire({
          icon: "success",
          title: "Notificación actualizada correctamente",
        });
        toast.success(
          "Notificación de notificación actualizada correctamente!"
        );
      } else {
        setLoading(false)
        setErrors(
          responseData.errors || ["Error al actualizar la notificación"]
        );
      }
    } catch (error) {
      console.error("Error al actualizar la notificación:", error);
      setErrors(["Error al actualizar la notificación"]);
    }
  };

  const handleEliminarNotificacion = async (id_notificacion) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el notificación permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(
            `http://${ruta}:4000/notificacion/eliminar/${id_notificacion}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          listarNotificaciones();
          Swal.fire({
            icon: "success",
            title: "Notificación eliminada correctamente",
          });
        } catch (error) {
          console.error("Error al eliminar notificación:", error);
          Swal.fire({
            icon: "error",
            title: "Error al eliminar notificación",
            text: "Ocurrió un error al intentar eliminar la notificación.",
          });
        }
      }
    });
  };

  const columns = [
    {
      name: "id_notificacion",
      label: "ID",
    },
    {
      name: "fecha",
      label: "Fecha",
    },
    {
      name: "comentarios",
      label: "Comentarios",
    },
    {
      name: "tipo_mantenimiento",
      label: "Tipo",
    },
    {
      name: "nombre_maquina",
      label: "Nombre Máquina",
    },
    {
      name: "estado",
      label: "Estado",
    },
    {
      name: "acciones",
      label: "Acciones",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const notificacion = notificaciones[tableMeta.rowIndex];
          return (
            <div className="flex justify-between">
              <button onClick={() => openModal(notificacion)}>
                <FaEdit className="text-orange-400 text-xl" />
              </button>
              <button
                onClick={() =>
                  handleEliminarNotificacion(notificacion.id_notificacion)
                }
              >
                <FaTrashAlt className="text-red-500 text-xl" />
              </button>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    filterType: "checkbox",
    responsive: "standard",
    print: false,
    viewColumns: false,
    download: false,
    filter: false,
    selectableRows: "none", // If you don't want checkboxes for row selection
  };

  return (
    <div>
      <h2 className="text-black text-3xl font-bold mb-5 px-6 w-full">
        Lista de Notificaciones
      </h2>
      <div className="justify-between px-4">
        <div>
          <button
            className="text-white w-40 h-10 bg-green-600 rounded-md"
            onClick={() => openModal(null)}
          >
            Registrar
          </button>
          <button
            className="bg-blue-400 p-2 ml-4 rounded text-white"
            onClick={() => exportToExcel(notificaciones, columnsExcel)}
          >
            Exportar a Excel
          </button>
        </div>
      </div>
      <div className="mt-8 mx-6">
        <MUIDataTable
          title={"Mantenimientos"}
          data={notificaciones}
          columns={columns}
          options={options}
        />
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={Modal}
        contentLabel="Modal Mantenimiento"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        appElement={document.getElementById("root")}
      >
        {selectedNotificacion ? (
          <div className="bg-white w-96 p-6 rounded shadow-lg grid gap-4">
            <h2 className="text-xl font-bold mb-4 text-stone-950">
              Actualizar Notificacion
            </h2>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="id_notificacion"
                  className="block text-sm font-bold text-gray-700 "
                >
                  ID Notificacion:
                </label>
                <input
                  type="text"
                  id="id_notificacion"
                  value={selectedNotificacion?.id_notificacion || ""}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="fecha"
                  className="block text-sm font-bold text-gray-700"
                >
                  Fecha:
                </label>
                <input
                  type="date"
                  id="fecha"
                  defaultValue={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                  placeholder="Nueva Fecha"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'fecha' ? error.msg : '')}</div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="comentarios"
                  className="block text-sm font-bold text-gray-700"
                >
                  Comentarios:
                </label>
                <input
                  type="text"
                  id="comentarios"
                  defaultValue={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                  placeholder="Nuevo Comentario"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'comentarios' ? error.msg : '')}</div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="tipo_mantenimiento"
                  className="block text-sm font-bold text-gray-700"
                >
                  Tipo Mantenimiento:
                </label>
                <select
                  id="tipo_mantenimiento"
                  defaultValue={tipo_mantenimiento}
                  onChange={(e) => setTipoMantenimiento(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950 "
                >
                  <option value="">Selecciona un tipo de mantenimiento</option>
                  <option value="preventivo">Preventivo</option>
                  <option value="correctivo">Correctivo</option>
                  <option value="calibracion">calibracion</option>
                </select>
                <div className="text-red-500">{errors.map((error) => error.path == 'tipo_mantenimiento' ? error.msg : '')}</div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="id_maquina"
                  className="block text-sm font-bold text-gray-700"
                >
                  Máquina:
                </label>
                <Select
                  id="id_maquina"
                  defaultValue={selectedMaquina}
                  onChange={(option) => setSelectedMaquina(option)}
                  options={maquinas.map((maquina) => ({
                    value: maquina.id_maquina,
                    label: maquina.nombre_maquina + ' - ' + maquina.placa,
                  }))}
                  className="w-full mt-1  text-black"
                  placeholder="Selecciona una máquina"
                />
                <div className="text-red-500">{errors.map((error) => error.path === "id_maquina" ? error.msg : ""
                )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  disabled={loading}
                  type="button"
                  className="text-white font-bold hover:bg-blue-800 w-40 h-10 bg-blue-600 rounded"
                  onClick={handleActualizarNotificacion}
                >
                  {loading == true ?
                    <div
                      class="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status">
                      <span
                        class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                      >Loading...</span
                      >
                    </div> : 'Actualizar'
                  }
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-800 text-white font-bold py-2 px-8 rounded"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white w-96 p-6 rounded shadow-lg grid gap-4">
            <h2 className="text-xl font-bold mb-4 text-stone-950">
              Registrar Notificacion
            </h2>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="fecha"
                  className="block text-sm font-bold text-gray-700"
                >
                  Fecha:
                </label>
                <input
                  type="date"
                  id="fecha"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                  placeholder="Nuevo Fecha"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'fecha' ? error.msg : '')}</div>

              </div>

              <div className="mb-4">
                <label
                  htmlFor="comentarios"
                  className="block text-sm font-bold text-gray-700"
                >
                  Comentarios:
                </label>
                <input
                  type="text"
                  id="comentarios"
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                  placeholder="Nuevo Comentario"
                />
                <div className="text-red-500">{errors.map((error) => error.path == 'comentarios' ? error.msg : '')}</div>
              </div>


              <div className="mb-4">
                <label
                  htmlFor="tipo_mantenimiento"
                  className="block text-sm font-bold text-gray-700"
                >
                  Tipo Mantenimiento:
                </label>
                <select
                  id="tipo_mantenimiento"
                  value={tipo_mantenimiento}
                  onChange={(e) => setTipoMantenimiento(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-stone-950 "
                >
                  <option value="">Selecciona un tipo de mantenimiento</option>
                  <option value="preventivo">Preventivo</option>
                  <option value="correctivo">Correctivo</option>
                  <option value="calibracion">calibracion</option>
                </select>
                <div className="text-red-500">{errors.map((error) => error.path == 'tipo_mantenimiento' ? error.msg : '')}</div>
              </div>


              <div className="mb-4 ">
                <label
                  htmlFor="id_maquina"
                  className="block text-sm font-bold text-gray-700"
                >
                  Máquina:
                </label>
                <Select
                  id="id_maquina"
                  value={selectedMaquina}
                  onChange={(option) => setSelectedMaquina(option)}
                  options={maquinas.map((maquina) => ({
                    value: maquina.id_maquina,
                    label: maquina.nombre_maquina + ' - ' + maquina.placa,
                  }))}
                  className="w-full mt-1  text-black"
                  placeholder="Selecciona una máquina"
                />
                <div className="text-red-500">
                  {errors.map((error) =>
                    error.path === "id_maquina" ? error.msg : ""
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  disabled={loading}
                  type="button"
                  className="text-white font-bold hover:bg-green-800 w-40 h-10 bg-green-600 rounded"
                  onClick={handleNotificarMantenimiento}
                >
                  {loading == true ?
                    <div
                      class="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status">
                      <span
                        class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                      >Loading...</span
                      >
                    </div> : 'Registrar'
                  }
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-800 text-white font-bold py-2 px-8 rounded"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Nmantenimiento;
