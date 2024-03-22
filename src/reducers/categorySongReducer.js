const SET_CATEGORY_SONGS = "SET_CATEGORY_SONGS";
const SET_LOADING = "SET_LOADING";
const initialState = {
  categorySongs: [],
  loading: false,
};

const categorySongReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CATEGORY_SONGS:
      return {
        ...state,
        categorySongs: action.payload,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const setCategorySongs = (songs) => ({
  type: SET_CATEGORY_SONGS,
  payload: songs,
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

export default categorySongReducer;
