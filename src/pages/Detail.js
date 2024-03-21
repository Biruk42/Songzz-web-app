import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import Tags from "../components/Tags";
import MostPopular from "../components/MostPopular";

const Detail = ({ setActive }) => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [songs, setSongs] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const getSongsData = async () => {
      const songRef = collection(db, "songs");
      const songs = await getDocs(songRef);
      setSongs(songs.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      let tags = [];
      songs.docs.map((doc) => tags.push(...doc.get("tags")));
      let uniqueTags = [...new Set(tags)];
      setTags(uniqueTags);
    };
    getSongsData();
  }, [id]);
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
              {/* <div className="text-start">
                <Tags tags={song?.tags} />
              </div> */}
            </div>
            <div className="col-md-3">
              {/* <div className="blog-heading text-start py-2 mb-4">Tags</div> */}
              <Tags tags={tags} />
              <MostPopular title={"Recent Songs"} songs={songs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
