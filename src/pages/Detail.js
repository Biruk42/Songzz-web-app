import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";

const Detail = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [setActive] = useState(null);
  useEffect(() => {
    id && getSongDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const getSongDetail = async () => {
    const docRef = doc(db, "songs", id);
    const songDetail = await getDoc(docRef);
    setSong(songDetail.data());
    setActive(null);
  };
  return (
    <div className="single">
      <div
        className="blog-title-box"
        style={{ backgroundImage: `url('${song?.imgUrl}')` }}>
        <div className="overlay"></div>
        <div className="blog-title">
          <span>{song?.timestamp.toDate().toDateString()}</span>
          <h2>{song?.title}</h2>
        </div>
      </div>
      <div className="container-fluid pb-4 pt-4 padding blog-single-content">
        <div className="container padding">
          <div className="row mx-0">
            <div className="col-md-8">
              <span className="meta-info text-start">
                By <p className="author">{song?.author}</p> -&nbsp;
                {song?.timestamp.toDate().toDateString()}
              </span>
              <p className="text-start">{song?.description}</p>
            </div>
            <div className="col-md-3">
              <h2>Tags</h2>
              <h2>Most Popular</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
