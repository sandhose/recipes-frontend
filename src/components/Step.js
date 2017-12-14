import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";
import { Segment, Grid } from "semantic-ui-react";

import Media from "./Media";

const Step = ({ id, description, media }) => (
  <Segment key={id}>
    <Grid>
      <Grid.Row>
        <Grid.Column width={4}>
          {media && <Media floated="left" {...media} />}
        </Grid.Column>
        <Grid.Column width={8}>{description}</Grid.Column>
      </Grid.Row>
    </Grid>
  </Segment>
);

Step.propTypes = {
  id: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  media: PropTypes.shape(Media.propTypes).isRequired
};

Step.fragments = {
  entry: gql`
    fragment Step on Step {
      id
      description
      media {
        ...Media
      }
    }

    ${Media.fragments.entry}
  `
};

export default Step;
