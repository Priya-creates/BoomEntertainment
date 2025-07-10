import React from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowGoBackLine } from "react-icons/ri";
import "./style.css";

const CustomNavbar = () => {
  const navigate = useNavigate();
  return (
    <div className="customnavbar-wrapper">
      <nav className="inner-flex" onClick={() => navigate(-1)}>
        <div >Go Back</div>
        <RiArrowGoBackLine className="back-logo" size="17" />
      </nav>
    </div>
  );
};

export default CustomNavbar;
