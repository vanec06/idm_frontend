import React from "react";
import { Link } from "react-router-dom";
import { RiMailLine } from "react-icons/ri";

const ForgetPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="forget-password-container">
        <h1 className="forget-password-title">
          Recuperar <span className="forget-password-title-highlight">contraseña</span>
        </h1>
        <form className="forget-password-form">
          <div className="relative mb-8">
            <RiMailLine className="forget-password-icon" />
            <input
              type="email"
              className="forget-password-input"
              placeholder="Correo electrónico"
            />
          </div>
          <div>
            <button
              type="submit"
              className="forget-password-button"
            >
              Enviar instrucciones
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
 