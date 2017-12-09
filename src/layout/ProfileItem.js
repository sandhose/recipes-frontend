import PropTypes from "prop-types";
import ApolloClient from "apollo-client";
import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import gql from "graphql-tag";
import { graphql, withApollo, compose } from "react-apollo";
import { propType } from "graphql-anywhere";

import { logout } from "../auth";

const PROFILE_QUERY = gql`
  query {
    me {
      fullName
    }
  }
`;

class ProfileItem extends Component {
  static propTypes = {
    data: propType(PROFILE_QUERY).isRequired,
    client: PropTypes.instanceOf(ApolloClient).isRequired
  };

  logout = () => {
    logout();
    this.props.client.resetStore();
  };

  render() {
    const { loading, error, me } = this.props.data;

    if (loading) {
      return <Menu.Item disabled>Loading…</Menu.Item>;
    }

    if (error) {
      return <Menu.Item error>Error.</Menu.Item>;
    }

    if (me) {
      return (
        <React.Fragment>
          <Menu.Item as={NavLink} to="/me">
            {me.fullName}
          </Menu.Item>
          <Menu.Item link onClick={this.logout}>
            Logout
          </Menu.Item>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <Menu.Item as={NavLink} to="/login">
          Log-in
        </Menu.Item>
        <Menu.Item as={NavLink} to="/signup">
          Sign-up
        </Menu.Item>
      </React.Fragment>
    );
  }
}

export default compose(graphql(PROFILE_QUERY), withApollo)(ProfileItem);
