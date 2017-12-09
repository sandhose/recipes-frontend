import React from "react";
import { Redirect } from "react-router-dom";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import DefaultLoadingPlaceholder from "./components/DefaultLoadingPlaceholder";
import DefaultErrorComponent from "./components/DefaultErrorComponent";
import { compose, branch, renderComponent } from "recompose";

export const renderWhileLoading = (
  component = DefaultLoadingPlaceholder,
  name = "data"
) =>
  branch(
    props => props[name] && props[name].loading,
    renderComponent(component)
  );

export const renderForError = (
  component = DefaultErrorComponent,
  name = "data"
) =>
  branch(props => props[name] && props[name].error, renderComponent(component));

const USER_LEVEL_QUERY = gql`
  query {
    authLevel
  }
`;

const LoginRedirect = () => <Redirect to="/login" />;

export const needsLogin = compose(
  graphql(USER_LEVEL_QUERY, { name: "auth" }),
  // FIXME: handle loading & errors
  branch(props => props.auth.loading || props.auth.error, () => () => null),
  branch(
    props => props.auth && props.auth.authLevel == "ANONYMOUS",
    renderComponent(LoginRedirect)
  )
);
