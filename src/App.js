import React from "react";
import { Route, Switch } from "react-router";
import { Container } from "semantic-ui-react";

import Header from "./layout/Header";
import Login from "./pages/Login";
import Me from "./pages/Me";

const Home = () => <div>Hey.</div>;

const App = () => (
  <React.Fragment>
    <Header />
    <Container>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/me" component={Me} />
        <Route path="/" component={Home} />
      </Switch>
    </Container>
  </React.Fragment>
);
export default App;
