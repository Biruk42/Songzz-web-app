import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import SongSection from "../components/SongSection";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import Tags from "../components/Tags";
import MostPopular from "../components/MostPopular";

const Home = ({ setActive, user }) => {
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "songs"),
      (snapshot) => {
        let list = [];
        let tags = [];
        snapshot.docs.forEach((doc) => {
          tags.push(...doc.get("tags"));
          list.push({ id: doc.id, ...doc.data() });
        });
        const uniqueTags = [...new Set(tags)];
        setTags(uniqueTags);
        setSongs(list);
        setLoading(false);
        setActive("home");
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  });

  if (loading) {
    return <Spinner />;
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete that song?")) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, "songs", id));
        toast.success("Song deleted successfully");
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="container-fluid pb-4 pt-4 padding">
      <div className="container padding">
        <div className="row mx-0">
          <h2>Trending</h2>
          <div className="col-md-8">
            <SongSection
              songs={songs}
              user={user}
              handleDelete={handleDelete}
            />
          </div>
          <div className="col-md-3">
            <Tags tags={tags} />
            <MostPopular songs={songs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
