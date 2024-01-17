import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase.init";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import axios from "axios";
import "./signup.css";

export default function Signup() {
  const baseurl = "https://monogram.onrender.com";
  // const baseurl = "http://localhost:4500";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [myerror, setMyError] = useState("");

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const handleCreateUser = async () => {
    try {
      let res = await axios.post(`${baseurl}/user/register`, {
        email,
        name,
      });
      return console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  if (user) {
    handleCreateUser();
    alert("Account created successfully! Please log in.");
  }

  if (error) {
    alert(error.message);
  }

  if (loading) {
    console.log("loading");
  }

  const handleSubmitForm = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(email, password);
  };

  return (
    <div className="d-flex vh-100 w-100 loginpage">
      <section className="w-50 bg-danger sideWallpaper"></section>
      <section className="w-50 d-flex justify-content-center align-items-center">
        <form
          className="w-50 border d-flex justify-content-start align-items-center flex-column gap-3 p-3 rounded"
          onSubmit={handleSubmitForm}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/128/2111/2111463.png"
            alt=""
            className="w-25"
          />
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-danger">
            Sign Up
          </button>

          <p className="text-center">Or</p>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
