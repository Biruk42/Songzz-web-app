import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import SongSection from "../components/SongSection";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import Tags from "../components/Tags";
import MostPopular from "../components/MostPopular";
import Trending from "../components/Trending";

const Home = ({ setActive, user }) => {
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);
  const [tags, setTags] = useState([]);
  const [trendSongs, setTrendSongs] = useState([]);

  const getTrendingSongs = async () => {
    const songRef = collection(db, "songs");
    const trendQuery = query(songRef, where("trending", "==", "yes"));
    const querySnapshot = await getDocs(trendQuery);
    let trendSongs = [];
    querySnapshot.forEach((doc) => {
      trendSongs.push({ id: doc.id, ...doc.data() });
    });
    setTrendSongs(trendSongs);
  };

  useEffect(() => {
    getTrendingSongs();
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
      getTrendingSongs();
    };
  }, [setActive]);

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
          <Trending songs={trendSongs} />
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
