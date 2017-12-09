import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

const DefaultLoadingPlaceholder = () => (
  <Dimmer active>
    <Loader />
  </Dimmer>
);

export default DefaultLoadingPlaceholder;
