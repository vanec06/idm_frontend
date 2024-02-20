import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiUserLine, RiLockLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [identificacion, setIdentificacion] = useState('');
  const [contraseña, setContraseña] = useState('');
  const navigate = useNavigate();

  const [error, setError] = useState(null);

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
      <div className="bg-secondary-100 p-8 rounded-xl shadow-2xl w-auto lg:w-[450px]">
        <h1 className="text-3xl text-center uppercase font-bold tracking-[5px] text-white mb-8">
          Iniciar <span className="text-primary">sesión</span>
        </h1>
        <form className="mb-8" onSubmit={handleSubmit}>
          <div className="relative mb-4">
          <RiUserLine className="absolute top-1/2 -translate-y-1/2 left-2 text-primary" />
            <input
              type="int"
              value={identificacion}
              onChange={(e) => setIdentificacion(e.target.value)}
              className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
              placeholder="Identificacion"
            />
          </div>
          <div className="relative mb-8">
            <RiLockLine className="absolute top-1/2 -translate-y-1/2 left-2 text-primary" />
            <input
              type={showPassword ? "text" : "password"}
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              className="py-3 px-8 bg-secondary-900 w-full outline-none rounded-lg"
              placeholder="Contraseña"
            />
            {showPassword ? (
              <RiEyeOffLine
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer text-primary"
              />
            ) : (
              <RiEyeLine
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer text-primary"
              />
            )}
          </div>
          <div>
            <button
              type="submit"
              className="bg-primary text-black uppercase font-bold text-sm w-full py-3 px-4 rounded-lg"
            >
              Ingresar
            </button>
          </div>
        </form>
        <div className="flex flex-col items-center gap-4">
          <Link
            to="/olvide-password"
            className="hover:text-primary transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
