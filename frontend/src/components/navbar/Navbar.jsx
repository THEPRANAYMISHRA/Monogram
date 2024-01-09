import React from "react";
import "./navbar.css";

export default function Navbar(props) {
  return (
    <nav className="border w-100 d-none justify-content-between gap-3 p-2 mynavbar">
      <button className="myButtonForNavbar">
        <i className="bx bx-home"></i>
      </button>
      <button className="myButtonForNavbar">
        <i className="bx bx-search-alt-2"></i>
      </button>
      <button className="myButtonForNavbar">
        <i className="bx bx-bell"></i>
      </button>
      <button className="myButtonForNavbar">
        <i className="bx bxl-messenger"></i>
      </button>
      <button className="myButtonForNavbar">
        <i className="bx bx-link-external"></i>
      </button>
    </nav>
  );
}
