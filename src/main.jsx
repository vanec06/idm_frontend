import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Modal from 'react-modal';
import "./index.css";

const rootElement = document.getElementById("root");

Modal.setAppElement(rootElement);

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
