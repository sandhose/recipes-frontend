import * as React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import ApolloClient from "apollo-client";
import { HttpLink, InMemoryCache } from "apollo-client-preset";
import { ApolloProvider } from "react-apollo";

import { authLink } from "./auth";
import App from "./App";
import { createFlashStore, FlashProvider } from "./flash";

const httpLink = new HttpLink({
  uri: "/graphql"
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache().restore({})
});

const flashStore = createFlashStore();

const render = NextApp => {
  ReactDOM.render(
    <BrowserRouter>
      <ApolloProvider client={client}>
        <FlashProvider store={flashStore}>
          <NextApp />
        </FlashProvider>
      </ApolloProvider>
    </BrowserRouter>,
    document.getElementById("root")
  );
};

render(App);

if (module.hot) {
  module.hot.accept("./App", () => {
    render(require("./App").default); // eslint-disable-line global-require
  });
}
