import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase.init";
import axios from "axios";
import "./feed.css";
import Post from "../post/Post";

export default function Feed() {
  // const baseurl = "http://localhost:4500";
  const baseurl = "https://monogram.onrender.com";
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [resposnse, setResponse] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [user] = useAuthState(auth);
  const IMAGEBB_KEY = "5a1d021bb2e374d8d8aeba929645b229";

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (title) {
      setIsUploading(true);
      try {
        let formData = new FormData();
        formData.append("title", title);
        formData.append("email", user.email);

        if (!image) {
          const response = await axios.post(`${baseurl}/post/`, formData);
          setResponse(response);
        } else {
          let formDataForImage = new FormData();
          formDataForImage.append("image", image);
          let imgres = await axios.post(
            `https://api.imgbb.com/1/upload?key=${IMAGEBB_KEY}`,
            formDataForImage
          );
          console.log(imgres.data);
          formData.append("imageUrl", imgres.data.data.url);
          const response = await axios.post(`${baseurl}/post/`, formData);
          setResponse(response);
        }
      } catch (error) {
        setResponse(error.response);
      } finally {
        setTitle("");
        setImage(null);
        setPreviewImage(null);
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
      <h6 className="w-100 px-3 pt-3 h2">Home</h6>
      <form
        className="d-flex gap-1 p-3 bg-primary border-bottom"
        onSubmit={handlePostSubmit}
      >
        <input
          type="text"
          placeholder="Whats happening ?"
          className="form-control"
          onChange={(e) => setTitle(e.target.value)}
        />
        <label
          htmlFor="file-upload"
          className="custom-file-upload btn btn-light"
        >
          <i class="bx bxs-camera-plus"></i>
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
            "Tweet"
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
