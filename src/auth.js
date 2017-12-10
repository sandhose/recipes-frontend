import gql from "graphql-tag";
import { setContext } from "apollo-link-context";

const KEY = "recipes-token";
export const ANONYMOUS = "ANONYMOUS";
export const AUTHENTICATED = "AUTHENTICATED";
export const ADMIN = "ADMIN";

let token = localStorage.getItem(KEY);

export const authLink = setContext((_, { headers }) => {
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

export const saveToken = newToken => {
  token = newToken;
  localStorage.setItem(KEY, token);
};

export const logout = () => {
  token = null;
  localStorage.removeItem(KEY);
};

export const USER_LEVEL_QUERY = gql`
  query {
    authLevel
  }
`;
