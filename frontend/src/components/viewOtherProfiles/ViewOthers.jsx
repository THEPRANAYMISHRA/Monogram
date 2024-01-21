import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useLocation } from "react-router-dom";

export default function ViewOthers() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryThisUser = queryParams.get("q");
  const [query] = useState(queryThisUser);
  const [renderJsx, setRenderJsx] = useState();
  const profileData = null;

  useEffect(() => {
    console.log(query);
  }, [query]);

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
      <div className="border d-flex flex-column justify-content-center p-3 h-25 gap-2">
        <div className="d-flex profile-picture gap-3 align-items-center">
          <LazyLoadImage
            src={
              profileData?.imageurl
                ? profileData.imageurl
                : "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
            }
            alt="Profile"
            className="img-fluid rounded-circle"
            width={70}
          />
          <section className="d-flex flex-column align-items-start ">
            <span className="fs-4">{profileData?.name}</span>
            <span className="fs-6 text-secondary">{queryThisUser}</span>
            <span className="fs-6">
              {profileData?.followers?.count ? profileData.followers.count : 10}{" "}
              followers
            </span>
          </section>
        </div>
        {/* options for switching posts and followers */}
        <section className="d-flex gap-3">
          <button className="btn btn-light" onClick={onShowPosts}>
            Posts
          </button>
          <button className="btn btn-light" onClick={onShowFollowers}>
            Followers
          </button>
        </section>
      </div>
      {/* show here posts and followers */}
      <section className="overflow-auto h-75 p-3 border">{renderJsx}</section>
    </div>
  );
}
