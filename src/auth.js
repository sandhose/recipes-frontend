import { setContext } from "apollo-link-context";

const KEY = "recipes-token";
export const ANONYMOUS = "ANONYMOUS";
export const AUTHENTICATED = "AUTHENTICATED";
export const ADMIN = "ADMIN";

export const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(KEY);
  if (token) {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`
      }
    };
  }
  return {};
});

export const saveToken = token => localStorage.setItem(KEY, token);
export const logout = () => localStorage.removeItem(KEY);
