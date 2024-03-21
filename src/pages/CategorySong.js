import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SongSection from "../components/SongSection";
import Spinner from "../components/Spinner";
import { db } from "../firebase";

const CategorySong = ({ setActive }) => {
  const [categorySongs, setCategorySongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { category } = useParams();

  const getCategorySongs = async () => {
    setLoading(true);
    const songRef = collection(db, "songs");
    const categorySongQuery = query(songRef, where("category", "==", category));
    const docSnapshot = await getDocs(categorySongQuery);
    let categorySongs = [];
    docSnapshot.forEach((doc) => {
      categorySongs.push({ id: doc.id, ...doc.data() });
    });
    setCategorySongs(categorySongs);
    setLoading(false);
  };

  useEffect(() => {
    getCategorySongs();
    setActive(null);
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="blog-heading text-center py-2 mb-4">
            Category: <strong>{category.toLocaleUpperCase()}</strong>
          </div>
          {categorySongs?.map((item) => (
            <div className="col-md-6">
              <SongSection key={item.id} {...item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySong;
