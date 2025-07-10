import React, { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { MdAccountBalanceWallet } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import "./style.css";
import { useUser } from "../../context/UserContext";

const Navbar = () => {
  const { name, balance, setName, loggedIn, setLoggedIn } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSmall, setIsSmall] = useState(window.innerWidth < 1200);
 
  const [isLogout, setIsLogout] = React.useState(false);

  const navigate = useNavigate();
 

  const handleLogout = () => {
    setIsLogout(true);
    setTimeout(() => {
      setName("User");
      localStorage.removeItem("token");
      setLoggedIn(false);
      setIsLogout(false);
      navigate("/");
    }, 600);
  };


  useEffect(() => {
    const handleResize = () => setIsSmall(window.innerWidth < 1190);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  
  const navLinks = (
    <>
     

      <NavLink
        to="/feed"
        className={({ isActive }) => (isActive ? "nav-active" : "nav-item")}
      >
        Feed
      </NavLink>

      <NavLink
        to="/my-videos"
        className={({ isActive }) => (isActive ? "nav-active" : "nav-item")}
      >
        My Videos
      </NavLink>
      <NavLink
        to="/my-purchases"
        className={({ isActive }) => (isActive ? "nav-active" : "nav-item")}
      >
        My Purchases
      </NavLink>
      <NavLink
        to="/upload"
        className={({ isActive }) => (isActive ? "nav-active" : "nav-item")}
      >
        Upload Video
      </NavLink>
      <NavLink
        to="/recharge-wallet"
        className={({ isActive }) => (isActive ? "nav-active" : "nav-item")}
      >
        Recharge Wallet
      </NavLink>
      <div className="nav-account">
        <MdAccountBalanceWallet size="20" />
        <span>₹{balance}</span>
      </div>
      <div
        onClick={handleLogout}
        className={`nav-item ${isLogout ? "nav-active" : ""}`}
      >
        Logout
      </div>
    </>
  );

  return (
    <>
      <div className="navbar">
        <div className="nav-logo">
          <img src="/boom_logo.png" alt="logo" width={20} height={20}/>
          <span>Boom Entertainment</span>
        </div>

        <div className="nav-item">
          Hello {name ? name.split(" ")[0] : "User"} 👋
        </div>

        {!isSmall && (
          <div className="nav-right">
            {loggedIn ? (
              navLinks
            ) : (
              <>
                <NavLink to="/" className={({ isActive }) => (isActive ? "nav-active" : "nav-item")}>
                  Home
                </NavLink>
                <NavLink to="/feed" className={({ isActive }) => (isActive ? "nav-active" : "nav-item")}>
                  Feed
                </NavLink>
                <NavLink to="/login" className={({ isActive }) => (isActive ? "nav-active" : "nav-item")}>
                  Login
                </NavLink>
                <NavLink to="/register" className={({ isActive }) => (isActive ? "nav-active" : "nav-item")}>
                  Register
                </NavLink>
              </>
            )}
          </div>
        )}

        {isSmall && (
          <div className="nav-right">
            <button
              onClick={() => setMenuOpen(true)}
              className="menu-btn"
              disabled={menuOpen}
            >
              <AiOutlineMenu className="icon-style" />
            </button>
          </div>
        )}
      </div>

   
      {isSmall && (
        <div className={`outer-box ${menuOpen ? "open" : ""}`}>
          <button className="cross-box" onClick={() => setMenuOpen(false)}>
            <RxCross2 className="icon-style" />
          </button>
          <div className="navbar-ms">
            {loggedIn ? (
              navLinks
            ) : (
              <>
                <NavLink to="/" className={({ isActive }) => (isActive ? "nav-active" : "nav-item")}>
                  Home
                </NavLink>
                <NavLink to="/feed" className={({ isActive }) => (isActive ? "nav-active" : "nav-item")}>
                  Feed
                </NavLink>
                <NavLink to="/login" className={({ isActive }) => (isActive ? "nav-active" : "nav-item")}>
                  Login
                </NavLink>
                <NavLink to="/register" className={({ isActive }) => (isActive ? "nav-active" : "nav-item")}>
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
