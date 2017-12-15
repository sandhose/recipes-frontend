import PropTypes from "prop-types";
import React from "react";
import { Card } from "semantic-ui-react";
import gql from "graphql-tag";
import Markdown from "react-markdown";

import Media from "./Media";

const ProfileCard = ({ fullName, username, biography, picture }) => (
  <Card fluid>
    {picture && <Media {...picture} />}
    <Card.Content>
      <Card.Header>{fullName}</Card.Header>
      <Card.Meta>{username}</Card.Meta>
      <Card.Description>
        <Markdown source={biography.replace(/\\n/g, "\n\n")} />
      </Card.Description>
    </Card.Content>
  </Card>
);

ProfileCard.fragments = {
  entry: gql`
    fragment ProfileCard on Profile {
      fullName
      username
      biography
      picture {
        ...Media
      }
    }

    ${Media.fragments.entry}
  `
};

ProfileCard.propTypes = {
  fullName: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  biography: PropTypes.string.isRequired,
  picture: PropTypes.shape({
    file: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired
};

export default ProfileCard;
