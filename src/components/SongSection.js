import React from "react";
import FontAwesome from "react-fontawesome";
import { Link } from "react-router-dom";
import { excerpt } from "../utility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const SongSection = ({
  id,
  title,
  description,
  category,
  imgUrl,
  author,
  userId,
  user,
  handleDelete,
}) => {
  return (
    <div>
      <div className="row pb-4" key={id}>
        <div className="col-md-5">
          <div className="hover-songs-img">
            <div className="songs-img">
              <img src={imgUrl} alt={title} />
              <div></div>
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="text-start">
            <h6 className="category catg-color">{category}</h6>
            <span className="title py-2">{title}</span>
            <span className="meta-info">
              <p className="author">{author}</p>
            </span>
          </div>
          <div className="short-description text-start">
            {excerpt(description, 50)}
          </div>
          <Link to={`/detail/${id}`}>
            <button className="btn btn-read">Show Lyrics</button>
          </Link>
          {user && user.uid === userId && (
            <div style={{ float: "right" }}>
              <Link to={`/update/${id}`}>
                <FontAwesome
                  name="edit"
                  className="edit-icon"
                  style={{ margin: "15px", cursor: "pointer" }}
                  size="1x"
                />
              </Link>
              <FontAwesomeIcon
                icon={faTrash}
                className="delete-icon"
                style={{ cursor: "pointer" }}
                size="1x"
                onClick={() => handleDelete(id)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongSection;
