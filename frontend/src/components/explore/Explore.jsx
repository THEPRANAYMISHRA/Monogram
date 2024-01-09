import axios from "axios";
import React, { useEffect, useState } from "react";
import "./explore.css";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function Explore() {
  const [query, setQuery] = useState("random");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const handleFetchImages = async () => {
    try {
      setIsLoading(true);
      let res = await axios.get(
        `https://api.unsplash.com/search/photos?page=1&query=${
          query || "random"
        }&client_id=tnAmX5jo2TDw2qTrcJpPfwQhyHp6uh-8RzBt1kI4aTw`
      );
      let resData = res?.data?.results?.map((ele, index) => {
        return ele?.urls.full;
      });

      setData(resData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let timerOut = setTimeout(() => {
      handleFetchImages();
    }, 3000);
    return () => clearTimeout(timerOut);
  }, [query]);

  return (
    <main className="w-100 vh-100 p-4 d-flex flex-column gap-3">
      <p className="fs-1">Explore</p>
      <input
        type="text"
        className="form-control"
        placeholder="Search 'Trending'"
        onChange={(e) => setQuery(e.target.value)}
      />

      {isLoading ? (
        <div className="loadingBox">
          <div className="loader-container">
            <div className="loader"></div>
            <div className="loader-text">Loading...</div>
          </div>
        </div>
      ) : (
        <div className="myexplore">
          {data ? (
            data.map((image) => {
              return <LazyLoadImage src={image} alt="image" />;
            })
          ) : (
            <h1>Oops! Nothing to show</h1>
          )}
        </div>
      )}
    </main>
  );
}
