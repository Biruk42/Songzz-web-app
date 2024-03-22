import React from "react";
import { Link } from "react-router-dom";

const Category = ({ catgSongsCount }) => {
  return (
    <div className="widget">
      <div className="song-heading text-start py-2 mb-4">Category</div>
      <div className="link-widget">
        <ul>
          {catgSongsCount?.map((item, index) => (
            <li key={index}>
              <Link
                className="category-link"
                to={`/category/${item.category}`}
                style={{
                  textDecoration: "none",
                  float: "left",
                  color: "#777",
                }}>
                {item.category}
                <span>({item.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Category;
