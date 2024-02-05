import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useUser } from "../../protectedRoutes";
import { Link } from "react-router-dom";

export default function ViewProfile() {
  const profileData = useUser();
  const [renderJsx, setRenderJsx] = useState();

  console.log(profileData);

  const onShowPosts = () => {
    let str = "Posts";
    setRenderJsx(str);
  };
  const onShowFollowers = () => {
    let str = "Followers";
    setRenderJsx(str);
  };
  return (
    <div className="h-100 w-100">
      <div className="border d-flex flex-column justify-content-center px-3 py-1 h-50">
        <LazyLoadImage
          src={
            profileData?.coverPhoto
              ? profileData.coverPhoto
              : "https://www.survivorsuk.org/wp-content/uploads/2017/01/no-image.jpg"
          }
          className="h-50 w-100 object-fit-cover"
          alt={"cover"}
        />
        <div className="d-flex profile-picture gap-3 align-items-center h-50">
          <LazyLoadImage
            src={
              profileData?.profilePhoto
                ? profileData.profilePhoto
                : "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
            }
            alt="Profile"
            className="img-fluid rounded-circle"
            width={100}
          />
          <section className="d-flex flex-column align-items-start ">
            <span className="fs-4">{profileData?.name}</span>
            <span className="fs-6 text-secondary">{profileData?.email}</span>
            <span className="fs-6">
              {profileData?.followersCount ? profileData.followersCount : 0}{" "}
              followers
            </span>
          </section>
        </div>
        {/* options for switching posts and followers */}
        <section className="d-flex gap-3 p-1">
          <button className="btn btn-primary" onClick={onShowPosts}>
            Posts
          </button>
          <button className="btn btn-primary" onClick={onShowFollowers}>
            Followers
          </button>
          <Link className="btn btn-primary" to="/settings">
            <i className="bx bxs-cog"></i>
          </Link>
        </section>
      </div>
      {/* show here posts and followers */}
      <section className="overflow-auto h-50 px-3 py-1 border">
        {renderJsx}
      </section>
    </div>
  );
}
