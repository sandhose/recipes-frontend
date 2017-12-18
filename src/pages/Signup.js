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

const REGISTER_QUERY = gql`
  mutation register(
    $username: String!
    $password: String!
    $email: String!
    $fullName: String!
  ) {
    register(
      input: {
        username: $username
        password: $password
        email: $email
        fullName: $fullName
      }
    ) {
      jwtToken
    }
  }
`;

class Signup extends Component {
  static propTypes = {
    register: PropTypes.func.isRequired,
    client: PropTypes.instanceOf(ApolloClient).isRequired
  };

  state = {
    username: "",
    password: "",
    email: "",
    fullName: "",
    error: null,
    loading: false
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = async () => {
    const { username, password, email, fullName } = this.state;
    this.setState({ loading: true });
    const { data, error } = await this.props.register(
      username,
      password,
      email,
      fullName
    );

    if (error) {
      this.setState({ error, loading: false });
    }

    if (!data.register.jwtToken) {
      this.setState({ error: "Invalid credentials", loading: false });
    } else {
      saveToken(data.register.jwtToken);
      this.props.client.resetStore();
    }
  };

  render() {
    const { username, password, fullName, email, error, loading } = this.state;
    return (
      <Grid
        centered
        verticalAlign="middle"
        style={{
          minHeight: "calc(100vh - 150px)"
        }}
      >
        <Grid.Column style={{ maxWidth: 300 }} textAlign="center">
          <Header as="h2">Signup</Header>
          <Segment stacked>
            <Form
              onSubmit={this.handleSubmit}
              loading={loading}
              error={!!error}
            >
              {error ? (
                <Message error header="Can't register" content={error} />
              ) : null}
              <Form.Input
                placeholder="Full name"
                icon="pencil"
                iconPosition="left"
                name="fullName"
                value={fullName}
                onChange={this.handleChange}
              />
              <Form.Input
                placeholder="Email"
                icon="mail"
                iconPosition="left"
                name="email"
                type="email"
                value={email}
                onChange={this.handleChange}
              />
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
                Signup
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
  graphql(REGISTER_QUERY, {
    props: ({ mutate }) => ({
      register: (username, password, email, fullName) =>
        mutate({
          variables: { username, password, email, fullName }
        })
    })
  }),
  withApollo
)(Signup);
