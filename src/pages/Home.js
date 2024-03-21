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
import Search from "../components/Search";
import { isEmpty, isNull, orderBy } from "lodash";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = ({ setActive, user, active }) => {
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [trendSongs, setTrendSongs] = useState([]);
  const queryString = useQuery();
  const searchQuery = queryString.get("searchQuery");
  const location = useLocation();

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
    setSearch("");
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
  }, [setActive, active]);

  const searchSongs = async () => {
    const songRef = collection(db, "songs");
    const searchTitleQuery = query(songRef, where("title", "==", searchQuery));
    const searchTagQuery = query(
      songRef,
      where("tags", "array-contains", searchQuery)
    );
    const titleSnapshot = await getDocs(searchTitleQuery);
    const tagSnapshot = await getDocs(searchTagQuery);
    let searchTitleSongs = [];
    let searchTagSongs = [];
    titleSnapshot.forEach((doc) => {
      searchTitleSongs.push({ id: doc.id, ...doc.data() });
    });
    tagSnapshot.forEach((doc) => {
      searchTagSongs.push({ id: doc.id, ...doc.data() });
    });
    const combinedSearchSongs = searchTitleSongs.concat(searchTagSongs);
    setSongs(combinedSearchSongs);
    setActive("");
  };
  useEffect(() => {
    if (!isNull(searchQuery)) {
      searchSongs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

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

  const getSongs = async () => {
    const songRef = collection(db, "songs");
    // const songsQuery = query(songRef, orderBy("title"));
    const docSnapshot = await getDocs(songRef);
    setSongs(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };
  const handleChange = (e) => {
    const { value } = e.target;
    if (isEmpty(value)) {
      getSongs();
    }
    setSearch(value);
  };

  return (
    <div className="container-fluid pb-4 pt-4 padding">
      <div className="container padding">
        <div className="row mx-0">
          <Trending songs={trendSongs} />
          <div className="col-md-8">
            <div className="blog-heading text-start py-2 mb-4">
              Recent Songs
            </div>
            {songs.length === 0 && location.pathname !== "/" && (
              <>
                <h4>
                  No Song found with the name: <strong>{searchQuery}</strong>
                </h4>
              </>
            )}
            <SongSection
              songs={songs}
              user={user}
              handleDelete={handleDelete}
            />
          </div>
          <div className="col-md-3">
            <Search search={search} handleChange={handleChange} />
            <Tags tags={tags} />
            <MostPopular songs={songs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
