import React from "react";
import { Route, Switch } from "react-router";

import Header from "./layout/Header";

const Home = () => <div>Hey.</div>;
const Login = () => <div>Login.</div>;

const App = () => (
  <React.Fragment>
    <Header />
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Home} />
    </Switch>
  </React.Fragment>
);
export default App;
