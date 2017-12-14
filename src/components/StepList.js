import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";
import { Segment, Grid } from "semantic-ui-react";

import Media from "./Media";
import Timer from "./Timer";

const attached = (index, steps) => {
  if (index === 0) return "top";
  else if (index === steps.length - 1) return "bottom";
  return true;
};

const pad = (index, steps) => {
  if (index === 0) return { paddingBottom: 0 };
  else if (index === steps.length - 1) return { paddingTop: 0 };
  return { padding: 0 };
};

const StepList = ({ steps }) => (
  <React.Fragment>
    {steps.map((step, index) => (
      <Grid.Row
        key={step.id}
        style={{ ...pad(index, steps), marginBottom: -1 }}
      >
        <Grid.Column width={12} stretched>
          <Segment attached={attached(index, steps)}>
            {step.description}
          </Segment>
        </Grid.Column>
        <Grid.Column width={4}>
          {step.media && (
            <Media {...step.media} style={{ paddingBottom: "1em" }} />
          )}
          {step.timer && <Timer {...step.timer} />}
        </Grid.Column>
      </Grid.Row>
    ))}
  </React.Fragment>
);

StepList.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired
    })
  ).isRequired
};

StepList.fragments = {
  entry: gql`
    fragment Step on Step {
      id
      description
      media {
        ...Media
      }
      timer {
        ...Timer
      }
    }

    ${Media.fragments.entry}
    ${Timer.fragments.entry}
  `
};

export default StepList;
