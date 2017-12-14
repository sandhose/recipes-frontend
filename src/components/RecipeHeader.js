import PropTypes from "prop-types";
import React from "react";
import { Header, Icon, Segment } from "semantic-ui-react";
import gql from "graphql-tag";

import Timer from "./Timer";

const BackgroundImage = ({ file }) => (
  <div
    style={{
      position: "absolute",
      zIndex: 0,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      opacity: 0.5,
      backgroundImage: `url('/media/${file}')`,
      backgroundPosition: "center center",
      backgroundSize: "cover"
    }}
  />
);

BackgroundImage.propTypes = {
  file: PropTypes.string.isRequired
};

const RecipeHeader = ({ name, description, timers, media }) => (
  <Segment inverted>
    <div
      style={{
        maxWidth: 600,
        textAlign: "center",
        position: "relative",
        zIndex: 1,
        margin: "auto"
      }}
    >
      <Header as="h1" inverted icon>
        <Icon name="food" inverted circular />
        {name}
        {description
          .split("\\n")
          .map((d, i) => <Header.Subheader key={i}>{d}</Header.Subheader>)}
      </Header>
      {timers.nodes.map(({ id, ...props }) => <Timer key={id} {...props} />)}
    </div>
    {media && <BackgroundImage file={media.file} />}
  </Segment>
);

RecipeHeader.fragments = {
  entry: gql`
    fragment RecipeHeader on Recipe {
      name
      description
      timers {
        nodes {
          id
          ...Timer
        }
      }
    }

    ${Timer.fragments.entry}
  `
};

RecipeHeader.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  timers: PropTypes.shape({
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        ...Timer.propTypes
      })
    ).isRequired
  }).isRequired,
  media: PropTypes.shape(BackgroundImage.propTypes).isRequired
};

export default RecipeHeader;
