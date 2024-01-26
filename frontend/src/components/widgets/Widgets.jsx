import React from "react";
import "./widgets.css";
import { Tweet } from "react-tweet";

export default function Widgets() {
  return (
    <main className="vh-100 w-50 mywidgetsbar border p-2">
      <div className="d-flex flex-column gap-2 overflow-auto h-100 newsDiv p-2">
        <input
          type="text"
          className="searchbar"
          placeholder="Search Tweets"
          style={{ backgroundColor: "#E1E8ED" }}
        />
        <div data-theme="light">
          <Tweet id="1629307668568633344" />
        </div>
      </div>
    </main>
  );
}
