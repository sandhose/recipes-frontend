import React from "react";
import { Dimmer, Header, Icon } from "semantic-ui-react";

const DefaultErrorComponent = ({ error }) => (
  <Dimmer active>
    <Header icon inverted>
      <Icon name="life ring" />
      {error.message}
    </Header>
  </Dimmer>
);

export default DefaultErrorComponent;
