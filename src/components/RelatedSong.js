import React from "react";
import Card from "./Card";

const RelatedSong = ({ songs, id }) => {
  return (
    <div>
      <div className="song-heading text-start pt-3 py-2 mb-4">
        Related Songs
      </div>
      <div className="col-md-12 text-left justify-content-center">
        <div className="row gx-5">
          {songs.length === 1 && (
            <h5 className="text-center">
              No related songs found with this current song
            </h5>
          )}
          {songs
            ?.filter((songs) => songs.id !== id)
            .map((item) => (
              <Card {...item} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedSong;
