import React from "react";
import "./sidebar.css";
import { Link } from "react-router-dom";

export default function SideBar() {
  return (
    <div className="vh-100 d-flex flex-column mysidebar align-items-center border p-1">
      <i className="bx bxl-instagram-alt fs-2 py-4 px-2 "></i>
      <span className="fw-bold fs-5">Monogram</span>
      <div className="h-100 w-100 d-flex flex-column gap-3 p-4">
        <Link to="/" className="myButton text-center">
          <i className="bx bx-home"></i>
          <span>Home</span>
        </Link>
        <Link to="/explore" className="myButton text-center">
          <i className="bx bx-search-alt-2"></i>
          <span>Explore</span>
        </Link>
        <button className="myButton">
          <i className="bx bx-bell"></i>
          <span>Notifications</span>
        </button>
        <button className="myButton">
          <i className="bx bxl-messenger"></i>
          <span>Messages</span>
        </button>
        <button className="myButton">
          <i className="bx bx-list-ul"></i>
          <span>Lists</span>
        </button>
        <button className="myButton">
          <i className="bx bx-bookmarks"></i>
          <span>Bookmarks</span>
        </button>
        <button className="myButton">
          <i className="bx bx-link-external"></i>
          <span>More..</span>
        </button>
      </div>
    </div>
  );
}
