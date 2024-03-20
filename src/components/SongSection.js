import React, { useEffect } from "react";
import FontAwesome from "react-fontawesome";
import { Link } from "react-router-dom";
import { excerpt } from "../utility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const SongSection = ({ songs, user, handleDelete }) => {
  const userId = user?.uid;
  return (
    <div>
      <div className="blog-heading text-start py-2 mb-4">Recent Songs</div>
      {songs?.map((item) => (
        <div className="row pb-4" key={item.id}>
          <div className="col-md-5">
            <div className="hover-blogs-img">
              <div className="blogs-img">
                <img src={item.imgUrl} alt={item.title} />
                <div></div>
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <div className="text-start">
              <h6 className="category catg-color">{item.category}</h6>
              <span className="title py-2">{item.title}</span>
              <span className="meta-info">
                <p className="author">{item.author}</p> -&nbsp;
                {item.timestamp.toDate().toDateString()}
              </span>
            </div>
            <div className="short-description text-start">
              {excerpt(item.description, 90)}
            </div>
            <Link to={`/detail/${item.id}`}>
              <button className="btn btn-read">Show Lyrics</button>
            </Link>
            {userId && item.userId === userId && (
              <div style={{ float: "right" }}>
                <Link to={`/update/${item.id}`}>
                  <FontAwesome
                    name="edit"
                    style={{ margin: "15px", cursor: "pointer" }}
                    size="2x"
                  />
                </Link>
                <FontAwesomeIcon
                  icon={faTrash}
                  // name="trash"
                  style={{ cursor: "pointer" }}
                  size="2x"
                  onClick={() => handleDelete(item.id)}
                />
              </div>
            )}
          </div>
        </div>
      ))}
      ;
    </div>
  );
};

export default SongSection;
