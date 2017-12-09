import React from "react";
import PropTypes from "prop-types";
import { ApolloError } from "apollo-client/errors/ApolloError";
import { Dimmer, Header, Icon } from "semantic-ui-react";

const DefaultErrorComponent = ({ error }) => (
  <Dimmer active>
    <Header icon inverted>
      <Icon name="life ring" />
      {error.message}
    </Header>
  </Dimmer>
);

DefaultErrorComponent.propTypes = {
  error: PropTypes.instanceOf(ApolloError).isRequired
};

export default DefaultErrorComponent;
