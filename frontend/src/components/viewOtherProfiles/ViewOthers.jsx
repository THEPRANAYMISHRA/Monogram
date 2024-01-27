import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../protectedRoutes";

export default function ViewOthers() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryThisUser = queryParams.get("q");
  const [query] = useState(queryThisUser);
  const [userData, setUserData] = useState();
  const [FollowingUser, setFollowingUser] = useState(false);
  const profileData = useUser();
  // const baseurl = "http://localhost:4500";
  const baseurl = "https://monogram.onrender.com";

  const fetchUser = async () => {
    try {
      const response = await axios.post(`${baseurl}/user/details`, {
        // providing email as a fake token
        tokenEmail: profileData.email,
        email: query,
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user details", error);
    }
  };

  const isFollowingThisUser = () => {
    if (profileData.followers) {
      profileData?.followers.forEach((ele) => {
        if (ele === query) setFollowingUser(true);
      });
    }
  };

  useEffect(() => {
    fetchUser();
    isFollowingThisUser();
  }, [query]);

  // const onShowPosts = () => {
  //   let str = "Posts";
  //   setRenderJsx(str);
  // };
  // const onShowFollowers = () => {
  //   let str = "Followers";
  //   setRenderJsx(str);
  // };

  return (
    <div className="h-100 w-100">
      <div className="border d-flex flex-column justify-content-center p-3 h-25 gap-2">
        <div className="d-flex profile-picture gap-3 align-items-center">
          <LazyLoadImage
            src={
              userData?.imageurl
                ? userData.imageurl
                : "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
            }
            alt="Profile"
            className="img-fluid rounded-circle"
            width={70}
          />
          <section className="d-flex flex-column align-items-start ">
            <span className="fs-4">{userData?.name}</span>
            <span className="fs-6 text-secondary">{queryThisUser}</span>
            <span className="fs-6">
              {userData?.followersCount ? userData.followersCount : 0} followers
            </span>
          </section>
        </div>
        {/* options for switching posts and followers */}
        <section className="d-flex gap-3">
          <button className="btn btn-light">
            <i className="bx bxs-user-plus"></i>
            {FollowingUser ? "Following" : "Follow"}
          </button>
        </section>
      </div>
      {/* show here posts and followers */}
      <section className="overflow-auto h-75 p-3 border">
        Some Details for user
      </section>
    </div>
  );
}
