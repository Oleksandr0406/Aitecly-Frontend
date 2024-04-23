export const token_key = "jwt_token";

export const setToken = (token) => {
  localStorage.setItem(token_key, token);
};

export const getToken = () => localStorage.getItem(token_key);

export const clearToken = () => {
  localStorage.clear(token_key);
};
