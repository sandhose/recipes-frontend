import React from "react";
import { Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

import gql from "graphql-tag";
import { graphql } from "react-apollo";

const PROFILE_QUERY = gql`
  query {
    me {
      fullName
    }
  }
`;

const ProfileItem = ({ data }) => {
  const { loading, error, me } = data;

  if (loading) {
    return <Menu.Item disabled>Loading…</Menu.Item>;
  }

  if (error) {
    return <Menu.Item error>Error.</Menu.Item>;
  }

  if (me) {
    return (
      <Menu.Item as={NavLink} to="/me">
        {me.fullName}
      </Menu.Item>
    );
  } else {
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
};

export default graphql(PROFILE_QUERY)(ProfileItem);
