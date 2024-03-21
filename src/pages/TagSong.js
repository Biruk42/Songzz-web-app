import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SongSection from "../components/SongSection";
import Spinner from "../components/Spinner";
import { db } from "../firebase";

const TagSong = ({ setActive }) => {
  const [tagSongs, setTagSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { tag } = useParams();

  const getTagSongs = async () => {
    setLoading(true);
    const songRef = collection(db, "songs");
    const tagSongQuery = query(songRef, where("tags", "array-contains", tag));
    const docSnapshot = await getDocs(tagSongQuery);
    let tagSongs = [];
    docSnapshot.forEach((doc) => {
      tagSongs.push({ id: doc.id, ...doc.data() });
    });
    setTagSongs(tagSongs);
    setLoading(false);
  };

  useEffect(() => {
    getTagSongs();
    setActive(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="blog-heading text-center py-2 mb-4">
            Tag: <strong>{tag.toLocaleUpperCase()}</strong>
          </div>
          {tagSongs?.map((item) => (
            <div className="col-md-6">
              <SongSection key={item.id} {...item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagSong;
