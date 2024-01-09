import React, { useEffect, useState } from "react";
import "./widgets.css";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function Widgets() {
  const [news, setNews] = useState([]);
  const fetchLatestNews = async () => {
    try {
      let res = await axios.get(
        `https://newsapi.org/v2/everything?q=technology&sortBy=latest&limit=5&apiKey=${process.env.newsapikey}`
      );
      setNews(res.data.articles);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLatestNews();
  }, []);
  return (
    <main classNameNameName="vh-100 w-50 mywidgetsbar">
      <div classNameNameName="d-flex flex-column gap-2 overflow-auto h-100 newsDiv">
        <p classNameNameName="fs-1 bg-dark text-light p-2 position-sticky top-0">
          Trending
        </p>
        {news
          ? news.map((ele, index) => {
              return (
                <div classNameNameName="newsCard" key={index}>
                  <LazyLoadImage
                    src={ele.urlToImage}
                    alt="image"
                    classNameNameName="w-100"
                  />
                  <details>
                    <summary classNameNameName="fs-5">{ele.title}</summary>
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
