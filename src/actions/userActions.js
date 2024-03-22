export const FETCH_USER_DATA = "user/fetchUserData";
export const UPDATE_USER_DATA = "user/updateUserData";
export const DELETE_USER_DATA = "user/deleteUserData";

export const fetchUserData = (userId) => ({
  type: FETCH_USER_DATA,
  payload: userId,
});

export const updateUserData = (userData) => ({
  type: UPDATE_USER_DATA,
  payload: userData,
});

export const deleteUserData = (userId) => ({
  type: DELETE_USER_DATA,
  payload: userId,
});
