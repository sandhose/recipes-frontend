import React from "react";
import { Route, Switch } from "react-router";
import { Container } from "semantic-ui-react";

import { FlashStream } from "./flash";
import Header from "./layout/Header";
import Login from "./pages/Login";
import Category from "./pages/Category";
import Me from "./pages/Me";
import Recipe from "./pages/Recipe";
import Search from "./pages/Search";

const App = () => (
  <React.Fragment>
    <Header />
    <Container>
      <FlashStream />
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/me" component={Me} />
        <Route path="/categories/:id" component={Category} />
        <Route path="/recipes/:id" component={Recipe} />
        <Route path="/" component={Search} />
      </Switch>
    </Container>
  </React.Fragment>
);
export default App;
