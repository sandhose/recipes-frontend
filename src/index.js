import * as React from "react";
import { render } from "react-dom";

import ApolloClient from "apollo-client";
import { HttpLink, InMemoryCache } from "apollo-client-preset";
import { ApolloProvider } from "react-apollo";

import App from "./App";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "/graphql"
  }),
  cache: new InMemoryCache().restore({})
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
