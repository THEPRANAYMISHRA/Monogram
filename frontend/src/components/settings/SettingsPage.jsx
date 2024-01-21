import React, { useState } from "react";
import { useUser } from "../../protectedRoutes";
import { LazyLoadImage } from "react-lazy-load-image-component";
import axios from "axios";

export default function SettingsPage() {
  const profileData = useUser();
  const baseurl = "https://monogram.onrender.com";
  const [name, setName] = useState(profileData.name);
  const [updatedProfile, setUpdatedProfile] = useState(false);
  const [updateProfileError, setUpdateProfileError] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profilePrivacy, setProfilePrivacy] = useState(
    profileData.profilePrivacy ? profileData.profilePrivacy : "Everyone"
  );

  const handleUpdateUserDetails = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.patch(`${baseurl}/user/update/details`, {
        name,
        profilePrivacy,
      });
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
      onSubmit={handleUpdateUserDetails}
    >
      <p className="fs-1">Settings</p>
      {updatedProfile && (
        <div class="alert alert-primary w-100" role="alert">
          Profile info is updated!
        </div>
      )}
      {updateProfileError && (
        <div class="alert alert-danger w-100" role="alert">
          Profile info is not updated!
        </div>
      )}
      <LazyLoadImage
        src={profileData.imageurl}
        alt="Profile"
        className="img-fluid rounded-circle"
        width={100}
      />
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
