import PropTypes from "prop-types";
import React from "react";
import { Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import gql from "graphql-tag";
import { graphql, withApollo } from "react-apollo";
import { propType } from "graphql-anywhere";
import { compose, withHandlers } from "recompose";

import { logout, ANONYMOUS } from "../auth";
import {
  renderForAuthLevel,
  renderForError,
  renderWhileLoading
} from "../utils";

const PROFILE_QUERY = gql`
  query {
    me {
      fullName
    }
  }
`;

const ProfileItem = ({ data: { me }, onLogout }) => (
  <React.Fragment>
    <Menu.Item as={NavLink} to="/me">
      {me.fullName}
    </Menu.Item>
    <Menu.Item link onClick={onLogout}>
      Logout
    </Menu.Item>
  </React.Fragment>
);

ProfileItem.propTypes = {
  data: propType(PROFILE_QUERY).isRequired,
  onLogout: PropTypes.func.isRequired
};

const LoginItem = () => (
  <React.Fragment>
    <Menu.Item as={NavLink} to="/login">
      Log-in
    </Menu.Item>
    <Menu.Item as={NavLink} to="/signup">
      Sign-up
    </Menu.Item>
  </React.Fragment>
);

export default compose(
  renderForAuthLevel(level => level === ANONYMOUS, LoginItem),
  graphql(PROFILE_QUERY),
  withApollo,
  withHandlers({
    onLogout: ({ client }) => () => {
      logout();
      client.resetStore();
      // FIXME: hack because the store resets weirdly
      window.location.reload();
    }
  }),
  renderWhileLoading(() => <Menu.Item disabled>Loading…</Menu.Item>),
  renderForError(() => <Menu.Item error>Error.</Menu.Item>)
)(ProfileItem);
