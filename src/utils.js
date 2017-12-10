import React from "react";
import { Redirect } from "react-router-dom";
import { graphql } from "react-apollo";
import { compose, branch, renderComponent } from "recompose";

import { ANONYMOUS, USER_LEVEL_QUERY } from "./auth";
import DefaultLoadingPlaceholder from "./components/DefaultLoadingPlaceholder";
import DefaultErrorComponent from "./components/DefaultErrorComponent";

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

// TODO: error handling
export const renderForAuthLevel = (
  check,
  component,
  loadingComponent = () => null,
  errorComponent = () => null
) =>
  compose(
    graphql(USER_LEVEL_QUERY, { name: "auth" }),
    renderWhileLoading(loadingComponent, "auth"),
    renderForError(errorComponent, "auth"),
    branch(
      props => props.auth && check(props.auth.authLevel),
      renderComponent(component)
    )
  );

const LoginRedirect = () => <Redirect to="/login" />;

export const needsLogin = renderForAuthLevel(
  level => level === ANONYMOUS,
  LoginRedirect
);
