const ADD_SONG = "ADD_SONG";
const DELETE_SONG = "DELETE_SONG";

const initialState = {
  songs: [],
};

const songReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SONG:
      return {
        ...state,
        songs: [...state.songs, action.payload],
      };
    case DELETE_SONG:
      return {
        ...state,
        songs: state.songs.filter((song) => song.id !== action.payload),
      };
    default:
      return state;
  }
};

export const addSong = (song) => ({
  type: ADD_SONG,
  payload: song,
});

export const deleteSong = (songId) => ({
  type: DELETE_SONG,
  payload: songId,
});

export default songReducer;
