import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";
import { Image } from "semantic-ui-react";

const PREFIX = "/media";

const Media = ({ file, name, ...props }) => (
  <Image src={`${PREFIX}/${file}`} alt={name} {...props} />
);

Media.propTypes = {
  file: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

Media.fragments = {
  entry: gql`
    fragment Media on Media {
      name
      file
    }
  `
};

export default Media;
