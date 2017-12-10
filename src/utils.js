import React from "react";
import { Redirect } from "react-router-dom";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { compose, branch, renderComponent } from "recompose";

import DefaultLoadingPlaceholder from "./components/DefaultLoadingPlaceholder";
import DefaultErrorComponent from "./components/DefaultErrorComponent";
import { ANONYMOUS } from "./auth";

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

// TODO: error handling
export const renderForAuthLevel = (
  level,
  component,
  loadingComponent = () => null,
  errorComponent = () => null
) =>
  compose(
    graphql(USER_LEVEL_QUERY, { name: "auth" }),
    renderWhileLoading(loadingComponent, "auth"),
    renderForError(errorComponent, "auth"),
    branch(
      props => props.auth && props.auth.authLevel === level,
      renderComponent(component)
    )
  );

const LoginRedirect = () => <Redirect to="/login" />;

export const needsLogin = renderForAuthLevel(ANONYMOUS, LoginRedirect);
