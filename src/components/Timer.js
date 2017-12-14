import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";
import { Icon } from "semantic-ui-react";
import moment from "moment";

const formatTime = t => moment.duration(t, "seconds").humanize();

const Timer = ({ type, timeMin, timeMax }) => {
  let timeString;
  if (timeMin === timeMax || !timeMin || !timeMax) {
    timeString = formatTime(timeMin || timeMax);
  } else {
    timeString = `${formatTime(timeMin)} to ${formatTime(timeMax)}`;
  }

  return (
    <div>
      <Icon name="clock" />
      {type && `${type}: `}
      {timeString}
    </div>
  );
};

Timer.fragments = {
  entry: gql`
    fragment Timer on Timer {
      timeMin
      timeMax
      type
    }
  `
};

Timer.propTypes = {
  type: PropTypes.string.isRequired,
  timeMin: PropTypes.number.isRequired,
  timeMax: PropTypes.number.isRequired
};

export default Timer;
