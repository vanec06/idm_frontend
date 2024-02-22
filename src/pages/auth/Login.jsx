import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiUserLine, RiLockLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import Cookies from 'js-cookie';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [identificacion, setIdentificacion] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/api/login', {
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

        const redirectTo = localStorage.getItem("redirectTo") || "/";
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="login-container">
        <h1 className="login-title">
          Iniciar <span className="login-title-highlight">sesión</span>
        </h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <RiUserLine className="login-icon" />
            <input
              type="text"
              value={identificacion}
              onChange={(e) => setIdentificacion(e.target.value)}
              className="login-input"
              placeholder="Identificacion"
            />
          </div>
          <div className="relative mb-8">
            <RiLockLine className="login-icon" />
            <input
              type={showPassword ? "text" : "password"}
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              className="login-input"
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
        .login-container {
          background-color: #f3f4f6;
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
