import React, { useState, useEffect } from 'react';
import Api, { ruta } from '../../components/Api';
import Swal from 'sweetalert2';

const Profile = ({ usuario }) => {
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        buscarUsuario();
    }, [usuario])



    const [identificacion, setIdentificacion] = useState("");
    const [foto, setFoto] = useState("/img/perfil/default.png");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [rol, setRol] = useState("");
    const [estado, setEstado] = useState("");
    const [id, setId] = useState("");

    const buscarUsuario = async () => {
        try {
            const resp = await Api.get('/usuario/buscar/' + usuario.identificacion)
            setInfo(resp.data)
            setIdentificacion(resp.data.identificacion)
            setNombre(resp.data.nombres)
            setApellido(resp.data.apellidos)
            setCorreo(resp.data.correo)
            setTelefono(resp.data.telefono)
            setRol(resp.data.rol)
            setEstado(resp.data.estado)
            setId(resp.data.id_usuario)

        } catch (error) {
            console.log(error);
        }
    }


    const actualizarDatos = async (e) => {
        e.preventDefault();
        try {
            const datos = {
                identificacion: identificacion,
                nombres: nombre,
                apellidos: apellido,
                telefono: telefono,
                correo: correo,
                rol: rol,
                estado: estado,
            }
            const resp = await Api.put(`/usuario/actualizar/${id}`, datos);
            console.log(resp.data.status);

            if (resp.data.status == true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Se actualizó el perfil correctamente.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error en la actualización.',
                });
            }

        } catch (error) {
            console.log(error);
        }


    };

    const handleIdentificacion = (e) => {
        setIdentificacion(e.target.value)
    }

    return (
        <div className="border-box pd-none">

            <link rel="stylesheet" href="../public/css/vistauser.css" />
            <div className="title-info-row">
                <h2>Información Personal</h2>
            </div>
            {!info ? ( // Mostrar un indicador de carga si la búsqueda está en progreso
                <p>Cargando...</p>
            ) : (
                <div className="row">
                    <div className="col-sm-10">
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="row-info-box cursor-none">
                                    <div className="first-column"><label htmlFor="nombre">IDENTIFICACION</label></div>
                                    <div className="last-column">
                                        <input type="text" id="identificacion" className="profle-input" defaultValue={info.identificacion} onChange={handleIdentificacion} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="row-info-box">
                                    <div className="first-column"><label htmlFor="nombre">NOMBRE</label></div>
                                    <div className="last-column">
                                        <input type="text" id="nombre" className="profle-input" defaultValue={info.nombres} onChange={(e) => setNombre(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="row-info-box">
                                    <div className="first-column"><label htmlFor="nombre">APELLIDOS</label></div>
                                    <div className="last-column">
                                        <input type="text" id="nombre" className="profle-input" defaultValue={info.apellidos} onChange={(e) => setApellido(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="row-info-box">
                                    <div className="first-column"><label htmlFor="correo">CORREO</label></div>
                                    <div className="last-column">
                                        <input type="text" id="correo" className="profle-input" defaultValue={info.correo} onChange={(e) => setCorreo(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="row-info-box">
                                    <div className="first-column"><label htmlFor="direccion">ROL</label></div>
                                    <div className="last-column">
                                        <input type="text" id="direccion" className="profle-input" defaultValue={info.rol} disabled />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="row-info-box">
                                    <div className="first-column"><label htmlFor="telefono">TELÉFONO</label></div>
                                    <div className="last-column">
                                        <input type="text" id="telefono" className="profle-input" defaultValue={info.telefono} onChange={(e) => setTelefono(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-2">
                                <button className="btn btn-primary" onClick={(e) => actualizarDatos(e)}>Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;