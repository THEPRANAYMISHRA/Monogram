import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "./posts.css";
import Cards from "../loadingCards/Cards";
import { Link } from "react-router-dom";

export default function Post() {
  const baseurl = "https://monogram.onrender.com";
  // const baseurl = "http://localhost:4500";
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [commentBox, setCommentBox] = useState(null);
  const [commentInput, setCommentInput] = useState(null);
  const sectionRef = useRef(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      let res = await axios.get(`${baseurl}/post/?page=${page}`);
      if (posts) {
        setPosts((prev) => [...prev, ...res.data.data]);
        setTotalPages(res.data.totalPages);
      } else {
        setPosts(res.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handelInfiniteScroll = async () => {
    try {
      const section = sectionRef.current;
      if (
        section.scrollTop + section.offsetHeight + 1 >=
        section.scrollHeight
      ) {
        page < totalPages && setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostLike = () => {
    console.log("Clicked like button");
  };

  const handlePostComment = (index) => {
    commentBox === index ? setCommentBox(null) : setCommentBox(index);
  };

  const handleCommentSubmit = async (e, post_id) => {
    e.preventDefault();
    try {
      const data = { postId: post_id, commentText: commentInput };
      let res = await axios.post(`${baseurl}/post/comment`, data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (totalPages === page) {
      return;
    } else {
      fetchPosts();
    }
  }, [page]);

  useEffect(() => {
    const section = sectionRef.current;
    if (section) {
      section.addEventListener("scroll", handelInfiniteScroll);
    }
    return () => {
      if (section) {
        section.removeEventListener("scroll", handelInfiniteScroll);
      }
    };
  }, []);

  return (
    <section
      className="overflow-auto d-flex flex-column gap-3 h-100 myposts"
      ref={sectionRef}
    >
      {isLoading && <Cards />}

      {posts &&
        isLoading === false &&
        posts.map((post, index) => (
          <div
            className="d-flex flex-column w-100 border p-2 rounded gap-2"
            key={index}
          >
            <Link
              className="d-flex align-items-center gap-2"
              to={`/user?q=${post.email}`}
            >
              <i className="bx bxs-user-circle fs-3"></i> {post.email}
            </Link>

            <p>{post.title}</p>
            {post.imageUrl && (
              <LazyLoadImage
                src={post.imageUrl}
                height={400}
                className="rounded img-fluid"
                alt="Image Alt"
              />
            )}
            <div className="d-flex align-items-center justify-content-center gap-2">
              <button className="btn btn-light w-100" onClick={handlePostLike}>
                <i className="bx bx-heart"></i>
              </button>
              <button
                className="btn btn-light w-100"
                onClick={() => handlePostComment(index)}
              >
                <i className="bx bx-comment-add"></i>
              </button>
            </div>
            <form
              className={commentBox === index ? "d-flex gap-2" : "d-none"}
              onSubmit={(e) => handleCommentSubmit(e, post?._id)}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Write Comment"
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Comment
              </button>
            </form>
            <section
              className={
                commentBox === index
                  ? "d-flex flex-column bg-secondary p-2 gap-2"
                  : "d-none"
              }
            >
              {post.comments &&
                post.comments.map((ele, index) => {
                  return (
                    <div className="card" key={index}>
                      <div className="card-header">
                        <i className="bx bxs-user-circle"></i> {ele.author}
                      </div>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">{ele.comment}</li>
                      </ul>
                    </div>
                  );
                })}

              {!posts && !isLoading && (
                <div className="d-flex justify-content-center align-items-center flex-column h-100">
                  <img
                    src="https://img.freepik.com/premium-vector/nothing-here-flat-illustration_418302-77.jpg"
                    alt=""
                    className="w-100"
                  />
                </div>
              )}
            </section>
          </div>
        ))}
    </section>
  );
}
