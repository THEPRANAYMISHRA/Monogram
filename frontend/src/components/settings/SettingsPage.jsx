import React, { useState } from "react";
import { useUser } from "../../protectedRoutes";
import { LazyLoadImage } from "react-lazy-load-image-component";
import axios from "axios";

export default function SettingsPage() {
  const profileData = useUser();
  const baseurl = "https://monogram.onrender.com";
  // const baseurl = "http://localhost:4500";
  const [name, setName] = useState(profileData.name);
  const [profilePreviewImage, setProfilePreviewImage] = useState(
    profileData.profilePhoto
  );
  const [coverPreviewImage, setCoverPreviewImage] = useState(
    profileData.coverPhoto
  );
  const IMAGEBB_KEY = process.env.REACT_APP_IMAGEBB_KEY;
  const [updatedProfile, setUpdatedProfile] = useState(false);
  const [updateProfileError, setUpdateProfileError] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profilePrivacy, setProfilePrivacy] = useState(
    profileData.profilePrivacy ? profileData.profilePrivacy : "Everyone"
  );

  const handleNewCoverImage = async (e) => {
    try {
      const image = e.target.files[0];

      let formdata = new FormData();
      formdata.append("image", image);
      let imgres = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMAGEBB_KEY}`,
        formdata
      );
      setCoverPreviewImage(imgres.data.data.url);

      const payload = {
        coverPhoto: imgres.data.data.url,
        email: profileData.email,
      };

      let res = await axios.patch(`${baseurl}/user/update/details`, payload);
      setUpdatedProfile(true);
      setTimeout(() => {
        setUpdatedProfile(false);
      }, 2000);
      return console.log(res);
    } catch (error) {
      return console.log(error);
    }
  };

  const handleNewProfileImage = async (e) => {
    try {
      const image = e.target.files[0];

      let formdata = new FormData();
      formdata.append("image", image);
      let imgres = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMAGEBB_KEY}`,
        formdata
      );
      setProfilePreviewImage(imgres.data.data.url);

      const payload = {
        profilePhoto: imgres.data.data.url,
        email: profileData.email,
      };

      let res = await axios.patch(`${baseurl}/user/update/details`, payload);
      setUpdatedProfile(true);
      setTimeout(() => {
        setUpdatedProfile(false);
      }, 2000);
      return console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateUserDetails = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: name,
        profilePrivacy: profilePrivacy,
        email: profileData.email,
      };

      let res = await axios.patch(`${baseurl}/user/update/details`, payload);
      setUpdatedProfile(true);
      setTimeout(() => {
        setUpdatedProfile(false);
      }, 2000);
      return console.log(res);
    } catch (error) {
      setUpdateProfileError(true);
      setTimeout(() => {
        setUpdateProfileError(false);
      }, 2000);
      return console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form
      className="h-100 w-100 d-flex flex-column align-items-start gap-2 justify-content-start px-5 py-2"
      onSubmit={(e) => handleUpdateUserDetails(e)}
    >
      <p className="fs-1">Settings</p>
      {isUpdating && (
        <div className="alert alert-primary w-100" role="alert">
          updating...
        </div>
      )}
      {updatedProfile && (
        <div className="alert alert-success w-100" role="alert">
          Profile info is updated!
        </div>
      )}
      {updateProfileError && (
        <div className="alert alert-danger w-100" role="alert">
          Profile info is not updated!
        </div>
      )}
      {/* //cover view */}
      <section className="w-100 h-25 d-flex flex-column p-1 gap-1">
        <LazyLoadImage
          src={coverPreviewImage}
          alt="cover image"
          className="img-fluid border w-100 h-75 object-fit-cover"
        />
        <label htmlFor="newcoverphoto" className="btn btn-light w-100">
          <i class="bx bx-upload"></i>
        </label>
        <input
          type="file"
          id="newcoverphoto"
          className="d-none"
          onChange={handleNewCoverImage}
        />
      </section>
      {/* profile section */}
      <section className="d-flex justify-content-start align-items-center w-100 gap-1 p-1">
        <LazyLoadImage
          src={profilePreviewImage}
          alt="Profile"
          className="object-fit-cover rounded-circle border"
          width={100}
          height={100}
        />
        <label
          htmlFor="newprofilephoto"
          className="btn btn-light rounded-circle d-flex justify-content-center align-items-center border"
          style={{ width: 100, height: 100 }}
        >
          <i class="bx bx-upload"></i>
        </label>
        <input
          type="file"
          id="newprofilephoto"
          className="d-none"
          onChange={handleNewProfileImage}
        />
      </section>

      <div className="w-100">
        <label htmlFor="name" className="form-check-label font-weight-bold">
          Name
        </label>
        <input
          type="text"
          className="form-control w-75"
          placeholder="Name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="w-100">
        <span className="text-black fs-6 font-weight-bold">
          Who can see your profile photo?
        </span>
        <section className="form-check">
          <input
            className="form-check-input"
            type="radio"
            id="Everyone"
            value="Everyone"
            checked={profilePrivacy === "Everyone"}
            onChange={(e) => setProfilePrivacy(e.target.value)}
          />
          <label htmlFor="Everyone" className="form-check-label">
            Everyone
          </label>
        </section>
        <section className="form-check">
          <input
            className="form-check-input"
            type="radio"
            id="Followers"
            value="Followers"
            checked={profilePrivacy === "Followers"}
            onChange={(e) => setProfilePrivacy(e.target.value)}
          />
          <label htmlFor="Followers" className="form-check-label">
            Only followers
          </label>
        </section>
        <section className="form-check">
          <input
            className="form-check-input"
            type="radio"
            id="Nobody"
            value="Nobody"
            checked={profilePrivacy === "Nobody"}
            onChange={(e) => setProfilePrivacy(e.target.value)}
          />
          <label htmlFor="Nobody" className="form-check-label">
            Nobody
          </label>
        </section>
      </div>

      <button type="submit" className="btn btn-primary" disabled={isUpdating}>
        Update
      </button>
    </form>
  );
}
