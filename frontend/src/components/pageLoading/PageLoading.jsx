import React from "react";
import "./pageloading.css";

export default function PageLoading() {
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center w-100">
      <div className="loader-container">
        <div className="loader"></div>
        <div className="loader-text">Loading...</div>
      </div>
    </div>
  );
}
