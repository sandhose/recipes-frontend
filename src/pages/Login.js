import PropTypes from "prop-types";
import React, { Component } from "react";
import gql from "graphql-tag";
import ApolloClient from "apollo-client";
import { graphql, compose, withApollo } from "react-apollo";
import { Redirect } from "react-router-dom";
import { Form, Card, Button, Message } from "semantic-ui-react";

import { saveToken, USER_LEVEL_QUERY, ANONYMOUS } from "../auth";
import { renderForAuthLevel } from "../utils";

const AUTHENTICATE_QUERY = gql`
  mutation login($username: String!, $password: String!) {
    authenticate(input: { username: $username, password: $password }) {
      jwtToken
    }
  }
`;

class Login extends Component {
  propTypes = {
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
    this.setState({ loading: false });

    if (error) {
      this.setState({ error });
    }

    if (!data.authenticate.jwtToken) {
      this.setState({ error: "Invalid credentials" });
    } else {
      saveToken(data.authenticate.jwtToken);
      this.props.client.resetStore();
    }
  };

  render() {
    const { username, password, error, loading } = this.state;
    return (
      <Card centered>
        <Card.Content>
          <Card.Header>Login</Card.Header>
          <Card.Meta>
            Tip: use <code>afranke</code> / <code>afranke</code>
          </Card.Meta>
        </Card.Content>
        <Card.Content>
          <Form onSubmit={this.handleSubmit} loading={loading} error={!!error}>
            {error ? (
              <Message error header="Can't log in" content={error} />
            ) : null}
            <Form.Input
              label="Username"
              name="username"
              value={username}
              onChange={this.handleChange}
            />
            <Form.Input
              label="Password"
              name="password"
              value={password}
              onChange={this.handleChange}
              type="password"
            />
            <Button type="submit" primary floated="right">
              Login
            </Button>
          </Form>
        </Card.Content>
      </Card>
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
