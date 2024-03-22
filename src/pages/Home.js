import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  orderBy,
  where,
  startAfter,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import SongSection from "../components/SongSection";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import Tags from "../components/Tags";
import FeatureSongs from "../components/FeatureSongs";
import Trending from "../components/Trending";
import Search from "../components/Search";
import { isEmpty, isNull } from "lodash";
import { useLocation } from "react-router-dom";
import Category from "../components/Category";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = ({ setActive, user, active }) => {
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [lastVisible, setLastVisible] = useState(null);
  const [trendSongs, setTrendSongs] = useState([]);
  const [totalSongs, setTotalSongs] = useState(null);
  const [hide, setHide] = useState(false);
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
        setTotalSongs(list);
        // setSongs(list);
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

  useEffect(() => {
    getSongs();
    setHide(false);
  }, [active]);

  const getSongs = async () => {
    const songRef = collection(db, "songs");
    const firstFour = query(songRef, orderBy("title"), limit(4));
    // const songsQuery = query(songRef, orderBy("title"));
    const docSnapshot = await getDocs(firstFour);
    setSongs(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
  };

  const updateState = (docSnapshot) => {
    const isCollectionEmpty = docSnapshot.size === 0;
    if (!isCollectionEmpty) {
      const songsData = docSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSongs((songs) => [...songs, ...songsData]);
      setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
    } else {
      toast.info("No more songs to display");
      setHide(true);
    }
  };

  const fetchMore = async () => {
    setLoading(true);
    const songRef = collection(db, "songs");
    const nextFour = query(
      songRef,
      orderBy("title"),
      limit(4),
      startAfter(lastVisible)
    );
    const docSnapshot = await getDocs(nextFour);
    updateState(docSnapshot);
    setLoading(false);
  };

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
    setHide(true);
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

  const handleChange = (e) => {
    const { value } = e.target;
    if (isEmpty(value)) {
      getSongs();
      setHide(false);
    }
    setSearch(value);
  };

  const counts = totalSongs.reduce((prevValue, currentValue) => {
    let name = currentValue.category;
    if (!prevValue.hasOwnProperty(name)) {
      prevValue[name] = 0;
    }
    prevValue[name]++;
    delete prevValue["undefined"];
    return prevValue;
  }, {});

  const categoryCount = Object.keys(counts).map((k) => {
    return {
      category: k,
      count: counts[k],
    };
  });

  console.log(categoryCount);
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
            {songs?.map((song) => (
              <SongSection
                key={song.id}
                user={user}
                handleDelete={handleDelete}
                {...song}
              />
            ))}
            {!hide && (
              <button className="btn btn-primary" onClick={fetchMore}>
                Load More
              </button>
            )}
          </div>
          <div className="col-md-3">
            <Search search={search} handleChange={handleChange} />
            <div className="blog-heading text-start py-2 mb-4">Tags</div>
            <Tags tags={tags} />
            <FeatureSongs title={"Most Popular"} songs={songs} />
            <Category catgSongsCount={categoryCount} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
