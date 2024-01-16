import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase.init";
import axios from "axios";
import "./feed.css";
import Post from "../post/Post";

export default function Feed() {
  const baseurl = "http://localhost:4500";
  // const baseurl = "https://monogram.onrender.com";
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [resposnse, setResponse] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [user] = useAuthState(auth);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (title) {
      setIsUploading(true);
      try {
        let formData = new FormData();
        formData.append("title", title);
        formData.append("email", user.email);
        if (image !== null) {
          formData.append("image", image);
        }
        const response = await axios.post(`${baseurl}/post/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setResponse(response);
        setTitle("");
        setImage(null);
        setPreviewImage(null);
      } catch (error) {
        setResponse(error.response);
      } finally {
        setIsUploading(false);
        setTimeout(() => {
          setResponse(null);
        }, 2000);
      }
    } else {
      return;
    }
  };

  const handleUnselectPhotos = () => {
    setImage(null);
    setPreviewImage(null);
  };

  const handleShowPreview = (e) => {
    const image = e.target.files[0];
    setImage(image);
    setPreviewImage(URL.createObjectURL(image));
  };

  return (
    <div className="h-100 w-75 d-flex flex-column myfeeds">
      <form className="d-flex gap-2 p-4" onSubmit={handlePostSubmit}>
        <input
          type="text"
          placeholder="Write Something..."
          className="form-control"
          onChange={(e) => setTitle(e.target.value)}
        />
        <label
          htmlFor="file-upload"
          className="custom-file-upload btn btn-warning"
        >
          <i className="bx bx-plus"></i>
        </label>
        <input
          id="file-upload"
          type="file"
          className="d-none"
          accept="image/*"
          onChange={handleShowPreview}
        />
        <button className="btn btn-primary" type="submit">
          {isUploading ? (
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : (
            "Post"
          )}
        </button>
      </form>
      {previewImage && (
        <div className="w-100 bg-dark py-2 px-3 d-flex justify-content-between gap-2">
          <div className="d-flex border w-100 p-1 rounded">
            <img
              src={previewImage}
              width={50}
              height={50}
              className="rounded"
              alt=""
            />
          </div>
          <button className="btn btn-secondary" onClick={handleUnselectPhotos}>
            <i className="bx bx-x"></i>
          </button>
        </div>
      )}
      <div
        className={
          resposnse?.status === 400 || resposnse?.status === 403
            ? "alert alert-danger"
            : resposnse?.status === 200
            ? "alert alert-primary"
            : "d-none"
        }
        role="alert"
      >
        {resposnse?.data?.message}
      </div>
      <Post />
    </div>
  );
}
