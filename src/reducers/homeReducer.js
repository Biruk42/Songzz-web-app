const SET_SONGS = "SET_SONGS";

const initialState = {
  songs: [],
};

const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SONGS:
      return {
        ...state,
        songs: action.payload,
      };
    default:
      return state;
  }
};

export const setSongs = (songs) => ({
  type: SET_SONGS,
  payload: songs,
});

export default homeReducer;
