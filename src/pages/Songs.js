import {
  collection,
  endAt,
  endBefore,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import SongSection from "../components/SongSection";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import { db } from "../firebase";

const Songs = ({ setActive }) => {
  const [loading, setLoading] = useState(false);
  const [songs, setSongs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastVisible, setLastVisible] = useState(null);
  const [noOfPages, setNoOfPages] = useState(null);
  const [count, setCount] = useState(null);

  const getSongsData = async () => {
    setLoading(true);
    const songRef = collection(db, "songs");
    const first = query(songRef, orderBy("title"), limit(4));
    const docSnapshot = await getDocs(first);
    setSongs(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setCount(docSnapshot.size);
    setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
    setLoading(false);
  };

  const getTotalSongs = async () => {
    const songRef = collection(db, "songs");
    const docSnapshot = await getDocs(songRef);
    const totalSongs = docSnapshot.size;
    const totalPage = Math.ceil(totalSongs / 4);
    setNoOfPages(totalPage);
  };

  const fetchMore = async () => {
    setLoading(true);
    const songRef = collection(db, "songs");
    const nextSongsQuery = query(
      songRef,
      orderBy("title"),
      startAfter(lastVisible),
      limit(4)
    );
    const nextSongsSnaphot = await getDocs(nextSongsQuery);
    setSongs(
      nextSongsSnaphot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
    setCount(nextSongsSnaphot.size);
    setLastVisible(nextSongsSnaphot.docs[nextSongsSnaphot.docs.length - 1]);
    setLoading(false);
  };
  const fetchPrev = async () => {
    setLoading(true);
    const songRef = collection(db, "songs");
    const end =
      noOfPages !== currentPage ? endAt(lastVisible) : endBefore(lastVisible);
    const limitData =
      noOfPages !== currentPage
        ? limit(4)
        : count <= 4 && noOfPages % 2 === 0
        ? limit(4)
        : limitToLast(4);
    const prevSongsQuery = query(songRef, orderBy("title"), end, limitData);
    const prevSongsSnaphot = await getDocs(prevSongsQuery);
    setSongs(
      prevSongsSnaphot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
    setCount(prevSongsSnaphot.size);
    setLastVisible(prevSongsSnaphot.docs[prevSongsSnaphot.docs.length - 1]);
    setLoading(false);
  };
  useEffect(() => {
    getSongsData();
    getTotalSongs();
    setActive("songs");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Spinner />;
  }
  const handlePageChange = (value) => {
    if (value === "Next") {
      setCurrentPage((page) => page + 1);
      fetchMore();
    } else if (value === "Prev") {
      setCurrentPage((page) => page - 1);
      fetchPrev();
    }
  };
  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="blog-heading text-center py-2 mb-4">Recent Songs</div>
          {songs?.map((song) => (
            <div className="col-md-6" key={song.id}>
              <SongSection {...song} />
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          noOfPages={noOfPages}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Songs;
