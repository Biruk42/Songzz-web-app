export const LOGIN = "auth/login";
export const LOGOUT = "auth/logout";

export const login = (credentials) => ({
  type: LOGIN,
  payload: credentials,
});

export const logout = () => ({
  type: LOGOUT,
});
