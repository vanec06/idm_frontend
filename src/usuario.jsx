import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Banner from "./components/Banner/Banner";

import cafe from "./assets/hero/cafe.png";

import Products from "./components/Products/Products";
import AOS from "aos";
import "aos/dist/aos.css";

const BannerData = {
  title: "INVENTARIO DE MAQUINAS",
  date: "Fecha de lanzamiento",
  image: cafe,
  title4:
    "Descripcion del programa",
  bgColor: "#2A5D84",
};


const Vista = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  React.useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
      offset: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 overflow-hidden">
      <Navbar handleOrderPopup={handleOrderPopup} />

      <Banner data={BannerData} />
      <Products />
    </div>
  );
};

export default Vista;
