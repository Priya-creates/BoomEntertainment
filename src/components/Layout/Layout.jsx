import React from "react";
import Navbar from "../Navbar/Navbar";
import CustomNavbar from "../CustomNavbar/CustomNavbar";
import { Outlet, useLocation } from "react-router-dom";
import "./style.css";
import BackgroundSecond from "../BackgroundSecond/BackgroundSecond";

const Layout = () => {
  const location = useLocation();

  const isBuyGiftPage = location.pathname.includes("/video/details");

  return (
    <>
      {isBuyGiftPage ? <CustomNavbar /> : <Navbar />}
      <BackgroundSecond/>
      <div className="main-container">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
