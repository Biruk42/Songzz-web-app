
const SET_SONG = 'SET_SONG';
const SET_COMMENTS = 'SET_COMMENTS';
const SET_LIKES = 'SET_LIKES';

const initialState = {
  song: null,
  comments: [],
  likes: [],
};

const detailReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SONG:
      return {
        ...state,
        song: action.payload,
      };
    case SET_COMMENTS:
      return {
        ...state,
        comments: action.payload,
      };
    case SET_LIKES:
      return {
        ...state,
        likes: action.payload,
      };
    default:
      return state;
  }
};

export const setSong = (song) => ({
  type: SET_SONG,
  payload: song,
});

export const setComments = (comments) => ({
  type: SET_COMMENTS,
  payload: comments,
});

export const setLikes = (likes) => ({
  type: SET_LIKES,
  payload: likes,
});

export default detailReducer;
