import PropTypes from "prop-types";
import React from "react";
import { Card } from "semantic-ui-react";
import gql from "graphql-tag";

const ProfileCard = ({ fullName, username, biography }) => (
  <Card fluid>
    <Card.Content>
      <Card.Header>{fullName}</Card.Header>
      <Card.Meta>{username}</Card.Meta>
      <Card.Description>
        {biography.split("\\n").map((p, i) => <p key={i}>{p}</p>)}
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
    }
  `
};

ProfileCard.propTypes = {
  fullName: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  biography: PropTypes.string.isRequired
};

export default ProfileCard;
