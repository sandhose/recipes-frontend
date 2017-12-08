import React from "react";
import { Card } from "semantic-ui-react";
import gql from "graphql-tag";

const ProfileCard = ({ fullName, username, biography }) => (
  <Card>
    <Card.Content>
      <Card.Header>{fullName}</Card.Header>
      <Card.Meta>{username}</Card.Meta>
      <Card.Description>{biography}</Card.Description>
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

export default ProfileCard;