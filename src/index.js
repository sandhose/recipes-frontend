import * as React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter } from "react-router-dom";

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

const render = App =>
  ReactDOM.render(
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>,
    document.getElementById("root")
  );

render(App);

if (module.hot) {
  module.hot.accept("./App", () => {
    render(require("./App").default);
  });
}
