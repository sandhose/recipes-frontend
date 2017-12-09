import React from "react";
import gql from "graphql-tag";
import { compose } from "recompose";
import { graphql } from "react-apollo";
import { Card, Dimmer, Loader, Header, Icon, Grid } from "semantic-ui-react";
import { Redirect } from "react-router-dom";

import { renderWhileLoading, renderForError, needsLogin } from "../utils";
import RecipeCard from "../components/RecipeCard";
import ProfileCard from "../components/ProfileCard";
import ProfileStatistics from "../components/ProfileStatistics";

const PROFILE_QUERY = gql`
  query {
    me {
      email
      ...ProfileCard
      ...ProfileStatistics
      recipes {
        nodes {
          ...RecipeCard
        }
      }
    }
  }

  ${RecipeCard.fragments.entry}
  ${ProfileCard.fragments.entry}
  ${ProfileStatistics.fragments.entry}
`;

const Me = ({ data: { me } }) => (
  <Grid>
    <Grid.Column width={4}>
      <ProfileCard {...me} />
    </Grid.Column>

    <Grid.Column width={10} floated="right">
      <ProfileStatistics {...me} />

      <Card.Group itemsPerRow={1}>
        {me.recipes.nodes.map(data => <RecipeCard {...data} />)}
      </Card.Group>
    </Grid.Column>
  </Grid>
);

export default compose(
  needsLogin,
  graphql(PROFILE_QUERY),
  renderWhileLoading(),
  renderForError()
)(Me);
