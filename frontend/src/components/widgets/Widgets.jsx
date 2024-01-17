import React, { useEffect, useState } from "react";
import "./widgets.css";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function Widgets() {
  const [news, setNews] = useState([]);
  // const fetchLatestNews = async () => {
  //   try {
  //     let res = await axios.get(`https://monogram.onrender.com/news`);
  //     // setNews(res.data.);
  //     console.log(res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    // fetchLatestNews();
  }, []);
  return (
    <main className="vh-100 w-50 mywidgetsbar">
      <div className="d-flex flex-column gap-2 overflow-auto h-100 newsDiv">
        <p className="fs-1 bg-dark text-light p-2 position-sticky top-0">
          Trending
        </p>
        {news
          ? news.map((ele, index) => {
              return (
                <div className="newsCard" key={index}>
                  <LazyLoadImage
                    src={ele.urlToImage}
                    alt="image"
                    className="w-100"
                  />
                  <details>
                    <summary className="fs-5">{ele.title}</summary>
                    <p>{ele.description}</p>
                  </details>
                </div>
              );
            })
          : null}
      </div>
    </main>
  );
}
