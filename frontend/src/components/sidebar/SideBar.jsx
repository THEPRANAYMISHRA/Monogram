import React from "react";
import "./sidebar.css";
import { NavLink, Link } from "react-router-dom";

export default function SideBar() {
  return (
    <div className="d-flex flex-column mysidebar align-items-center border p-1">
      <i className="bx bxl-twitter fs-2 py-4 px-2 text-primary text-center"></i>
      <div className="h-100 w-100 d-flex flex-column gap-3 p-3">
        <NavLink
          to="/"
          className="myButton text-center"
          activeClassName="active"
        >
          <i className="bx bx-home"></i>
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/explore"
          className="myButton text-center"
          activeClassName="active"
        >
          <i className="bx bx-search-alt-2"></i>
          <span>Explore</span>
        </NavLink>
        <button className="myButton">
          <i className="bx bx-bell"></i>
          <span>Notifications</span>
        </button>
        <button className="myButton">
          <i className="bx bxl-messenger"></i>
          <span>Messages</span>
        </button>
        <NavLink
          to="/membership"
          className="myButton text-center"
          activeClassName="active"
        >
          <i className="bx bxs-star-half"></i>
          <span>Membership</span>
        </NavLink>
        <button className="myButton">
          <i className="bx bx-bookmarks"></i>
          <span>Bookmarks</span>
        </button>
        <button className="myButton">
          <i className="bx bx-NavLink-external"></i>
          <span>More..</span>
        </button>
      </div>
      <Link className="text-center w-75 myProfileButton" to="/profile">
        <i className="bx bxs-user"></i>
        <span>Profile</span>
      </Link>
    </div>
  );
}
