import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RiMailLine } from "react-icons/ri";
import Api from "../../components/Api";
import Swal from 'sweetalert2';


const ForgetPassword = () => {
  const [email, setCorreo] = useState('');
  const [load, setLoad] = useState(false);

  const recuperar = async (e) => {
    e.preventDefault();
    try {
      setLoad(true)
      let resp = await Api.post('/api/recuperar', {
        correo: email
      })

      if (resp.data.status == true) {
        Swal.fire({
          icon: 'success',
          title: 'Recuperación correcta.',
          text: resp.data.message
        });
        setLoad(false)
      } else {
        if (resp.data.empty) {
          Swal.fire({
            icon: 'error',
            title: 'No encontrado!',
            text: resp.data.empty
          });
          setLoad(false)
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ocurrió un error!',
            text: resp.data.message
          });
          setLoad(false)
        }
      }
    } catch (error) {
      console.log('CORREO: ' + error);
      Swal.fire({
        icon: 'error',
        title: 'Error del servidor!',
        // text: resp.data.message
      });
      setLoad(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">

      <div className="img"></div>

      <div className="forget-password-container">
        <h1 className="forget-password-title">
          <span className="forget-password-title-highlight "> Recuperar contraseña</span>
          <div className='logo'></div>
        </h1>
        <form className="forget-password-form" onSubmit={(e) => recuperar(e)}>
          <div className="relative mb-8">
            <RiMailLine className="forget-password-icon" />
            <input
              onChange={(e) => setCorreo(e.target.value)}
              type="email"
              className="forget-password-input text-black"
              placeholder="Correo electrónico"
            />
          </div>
          <div>
            <button
              type="submit"
              className="forget-password-button"
            >
              {load == true ? 'Enviando Correo...' :
                'Enviar instrucciones'
              }
            </button>
          </div>
        </form>
        <div className="forget-password-links">
          <span className="forget-password-link">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="forget-password-link-text"
            >
              Ingresa
            </Link>
          </span>
        </div>
      </div>
      <style>{`
          .logo{
            background-image: url('img/logo.jpg');
            background-size: contain; /* Ajusta el tamaño del logo para que se ajuste al contenedor */
            background-repeat: no-repeat; /* Evita la repetición del logo */
            width: 150px; /* Tamaño deseado del logo */
            height: 150px; /* Tamaño deseado del logo */
            margin: auto; /* Centra el logo horizontalmente */
            margin-bottom: 20px; /* Ajusta el margen inferior según sea necesario */
          }
          .img {
            background-image: url('https://lavozdelaregion.co/wp-content/uploads/2023/09/ENCC-Pitalito.jpg'); /* Ruta de tu imagen de fondo */
            background-size: cover;
            background-position: center;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            z-index: -1; /* Asegura que la imagen de fondo esté detrás de otros elementos */
          }
        .forget-password-container {
          background-color: #f3f4f6;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        .forget-password-title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 24px;
          text-align: center;
        }

        .forget-password-title-highlight {
          color: #3182ce;
        }

        .forget-password-form {
          margin-bottom: 24px;
        }

        .forget-password-icon {
          position: absolute;
          top: 50%;
          left: 16px;
          transform: translateY(-50%);
          color: #3182ce;
        }

        .forget-password-input {
          padding: 12px 40px 12px 32px;
          border-radius: 8px;
          border: 1px solid #cbd5e0;
          width: 100%;
          font-size: 16px;
        }

        .forget-password-button {
          background-color: #3182ce;
          color: white;
          font-weight: bold;
          padding: 12px;
          border-radius: 8px;
          width: 100%;
          font-size: 16px;
          cursor: pointer;
        }

        .forget-password-links {
          text-align: center;
        }

        .forget-password-link {
          color: #3182ce;
          font-size: 14px;
        }

        .forget-password-link-text {
          color: #3182ce;
          text-decoration: none;
        }

        .forget-password-link-text:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default ForgetPassword;
