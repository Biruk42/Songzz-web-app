const SET_FORM = "SET_FORM";
const RESET_FORM = "RESET_FORM";

const initialState = {
  title: "",
  tags: [],
  trending: "no",
  category: "",
  description: "",
  imgUrl: "",
};

const addEditSongReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FORM:
      return {
        ...state,
        ...action.payload,
      };
    case RESET_FORM:
      return initialState;
    default:
      return state;
  }
};

// Action creators
export const setForm = (formData) => ({
  type: SET_FORM,
  payload: formData,
});

export const resetForm = () => ({
  type: RESET_FORM,
});

export default addEditSongReducer;
