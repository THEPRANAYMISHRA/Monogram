import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase.init";
import axios from "axios";
import {
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const baseurl = "https://monogram.onrender.com";
  // const baseurl = "http://localhost:4500";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const [signInWithGoogle, googleUser] = useSignInWithGoogle(auth);

  if (googleUser) {
    let displayName = googleUser.user.displayName;
    let email = googleUser.user.email;

    axios
      .post(`${baseurl}/user/register`, {
        name: displayName,
        email: email,
      })
      .then((res) => {
        return setTimeout(() => {
          navigate("/");
        }, 500);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (user) {
    return setTimeout(() => {
      navigate("/");
    }, 500);
  }

  if (error) {
    axios
      .post(`${baseurl}/user/failedAttempt`, {
        email: email,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (loading) {
    console.log("loading");
  }

  const handleSubmitForm = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(email, password);
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle();
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
            Login
          </button>

          <p className="text-center">Or</p>
          <p>
            Don't have an account?{" "}
            <Link to="/register">Create New Account</Link>
          </p>

          <button
            className="btn btn-primary d-flex justify-content-center align-items-center gap-2"
            onClick={handleGoogleSignIn}
          >
            Login with
            <img
              src="https://cdn-icons-png.flaticon.com/128/300/300221.png"
              width={20}
              alt=""
            />
          </button>
        </form>
      </section>
    </div>
  );
}
