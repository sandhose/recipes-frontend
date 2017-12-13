import PropTypes from "prop-types";
import React, { Component } from "react";
import gql from "graphql-tag";
import ApolloClient from "apollo-client";
import { graphql, compose, withApollo } from "react-apollo";
import { Redirect } from "react-router-dom";
import {
  Form,
  Grid,
  Segment,
  Header,
  Button,
  Message
} from "semantic-ui-react";

import { saveToken, ANONYMOUS } from "../auth";
import { renderForAuthLevel } from "../utils";

const AUTHENTICATE_QUERY = gql`
  mutation login($username: String!, $password: String!) {
    authenticate(input: { username: $username, password: $password }) {
      jwtToken
    }
  }
`;

class Login extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    client: PropTypes.instanceOf(ApolloClient).isRequired
  };

  state = {
    username: "",
    password: "",
    error: null,
    loading: false
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = async () => {
    const { username, password } = this.state;
    this.setState({ loading: true });
    const { data, error } = await this.props.login(username, password);

    if (error) {
      this.setState({ error, loading: false });
    }

    if (!data.authenticate.jwtToken) {
      this.setState({ error: "Invalid credentials", loading: false });
    } else {
      saveToken(data.authenticate.jwtToken);
      this.props.client.resetStore();
    }
  };

  render() {
    const { username, password, error, loading } = this.state;
    return (
      <Grid
        centered
        verticalAlign="middle"
        style={{
          minHeight: "calc(100vh - 150px)"
        }}
      >
        <Grid.Column style={{ maxWidth: 300 }} textAlign="center">
          <Header as="h2">Login</Header>
          <Header.Subheader>
            Tip: use <code>afranke</code> / <code>afranke</code>
          </Header.Subheader>
          <Segment stacked>
            <Form
              onSubmit={this.handleSubmit}
              loading={loading}
              error={!!error}
            >
              {error ? (
                <Message error header="Can't log in" content={error} />
              ) : null}
              <Form.Input
                placeholder="Username"
                icon="user"
                iconPosition="left"
                name="username"
                value={username}
                onChange={this.handleChange}
              />
              <Form.Input
                placeholder="Password"
                icon="lock"
                iconPosition="left"
                name="password"
                value={password}
                onChange={this.handleChange}
                type="password"
              />
              <Button type="submit" primary fluid size="big">
                Login
              </Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default compose(
  renderForAuthLevel(level => level !== ANONYMOUS, () => <Redirect to="/me" />),
  graphql(AUTHENTICATE_QUERY, {
    props: ({ mutate }) => ({
      login: (username, password) =>
        mutate({
          variables: { username, password }
        })
    })
  }),
  withApollo
)(Login);
