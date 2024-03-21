import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import Tags from "../components/Tags";
import MostPopular from "../components/MostPopular";
import RelatedSong from "../components/RelatedSong";
import { isEmpty } from "lodash";
import UserComments from "../components/UserComments";
import CommentBox from "../components/CommentBox";
import { toast } from "react-toastify";

const Detail = ({ setActive, user }) => {
  const userId = user?.uid;
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [songs, setSongs] = useState([]);
  const [tags, setTags] = useState([]);
  const [comments, setComments] = useState([]);
  const [userComment, setUserComment] = useState("");
  const [relatedSongs, setRelatedSongs] = useState([]);
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
    const songRef = collection(db, "songs");
    const docRef = doc(db, "songs", id);
    const songDetail = await getDoc(docRef);
    const songs = await getDocs(songRef);
    let tags = [];
    songs.docs.map((doc) => tags.push(...doc.get("tags")));
    let uniqueTags = [...new Set(tags)];
    setTags(uniqueTags);
    setSong(songDetail.data());
    const relatedSongsQuery = query(
      songRef,
      where("tags", "array-contains-any", songDetail.data().tags, limit(3))
    );
    setComments(songDetail.data().comments ? songDetail.data().comments : []);
    const relatedSongSnapshot = await getDocs(relatedSongsQuery);
    const relatedSongs = [];
    relatedSongSnapshot.forEach((doc) => {
      relatedSongs.push({ id: doc.id, ...doc.data() });
    });
    setRelatedSongs(relatedSongs);
    setActive(null);
  };
  const handleComment = async (e) => {
    e.preventDefault();
    comments.push({
      createdAt: Timestamp.fromDate(new Date()),
      userId,
      name: user?.displayName,
      body: userComment,
    });
    toast.success("Comment posted successfully");
    await updateDoc(doc(db, "songs", id), {
      ...song,
      comments,
      timestamp: serverTimestamp(),
    });
    setComments(comments);
    setUserComment("");
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
              <div className="text-start">
                <Tags tags={song?.tags} />
              </div>
              <br />
              <div className="custombox">
                <h4 className="small-title">{comments?.length} Comment</h4>
                {isEmpty(comments) ? (
                  <UserComments
                    msg={
                      "No Comment yet posted on this song. Be the first to comment"
                    }
                  />
                ) : (
                  <>
                    {comments?.map((comment) => (
                      <UserComments {...comment} />
                    ))}
                  </>
                )}
              </div>
              <CommentBox
                userId={userId}
                userComment={userComment}
                setUserComment={setUserComment}
                handleComment={handleComment}
              />
            </div>

            <div className="col-md-3">
              <div className="blog-heading text-start py-2 mb-4">Tags</div>
              <Tags tags={tags} />
              <MostPopular title={"Recent Songs"} songs={songs} />
            </div>
          </div>
          <RelatedSong id={id} songs={relatedSongs} />
        </div>
      </div>
    </div>
  );
};

export default Detail;
