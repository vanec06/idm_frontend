import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiUserLine, RiLockLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import Cookies from 'js-cookie';
import { ruta } from '../../components/Api';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [identificacion, setIdentificacion] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://${ruta}:4000/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identificacion, contraseña }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Autenticación exitosa. Token:", data.token);

        Cookies.set("token", data.token, { expires: 1 });

        const redirectTo = localStorage.getItem("redirectTo") || "/sidebar";
        localStorage.removeItem("redirectTo");
        navigate(redirectTo);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      console.error("Error de red:", error);
      setError("Error de conexión. Inténtalo de nuevo más tarde.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">

      <div className="img"></div>
      
      <div className="login-container">
        <h1 className="login-title  ">
          <span className="login-title-highlight "> Iniciar sesión</span>
        </h1>
        <div className='logo'></div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <RiUserLine className="login-icon" />
            <input
              type="text"
              value={identificacion}
              onChange={(e) => setIdentificacion(e.target.value)}
              className="login-input text-black"
              placeholder="Identificacion"
            />
          </div>
          <div className="relative mb-8">
            <RiLockLine className="login-icon" />
            <input
              type={showPassword ? "text" : "password"}
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              className="login-input text-black"
              placeholder="Contraseña"
            />
            {showPassword ? (
              <RiEyeOffLine
                onClick={() => setShowPassword(!showPassword)}
                className="login-toggle-password"
              />
            ) : (
              <RiEyeLine
                onClick={() => setShowPassword(!showPassword)}
                className="login-toggle-password"
              />
            )}
          </div>
          <div>
            <button
              type="submit"
              className="login-button"
            >
              Ingresar
            </button>
          </div>
        </form>
        <div className="login-links">
          <Link
            to="/olvide-password"
            className="login-link"
          >
            ¿Olvidaste tu contraseña?
          </Link>
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
  
        .login-container {
          background-color: #f3f4f4;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        .login-title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 24px;
          text-align: center;
        }

        .login-title-highlight {
          color: #3182ce;
        }

        .login-form {
          margin-bottom: 24px;
        }

        .login-icon {
          position: absolute;
          top: 50%;
          left: 16px;
          transform: translateY(-50%);
          color: #3182ce;
        }

        .login-input {
          padding: 12px 40px 12px 32px;
          border-radius: 8px;
          border: 1px solid #cbd5e0;
          width: 100%;
          font-size: 16px;
        }

        .login-toggle-password {
          position: absolute;
          top: 50%;
          right: 16px;
          transform: translateY(-50%);
          cursor: pointer;
          color: #3182ce;
        }

        .login-button {
          background-color: #3182ce;
          color: white;
          font-weight: bold;
          padding: 12px;
          border-radius: 8px;
          width: 100%;
          font-size: 16px;
          cursor: pointer;
        }

        .login-links {
          text-align: center;
        }

        .login-link {
          color: #3182ce;
          text-decoration: none;
          font-size: 14px;
        }

        .login-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Login;