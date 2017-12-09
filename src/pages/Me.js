import React from "react";
import gql from "graphql-tag";
import { compose } from "recompose";
import { graphql } from "react-apollo";
import { propType } from "graphql-anywhere";
import { Card, Grid } from "semantic-ui-react";

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
        {me.recipes.nodes.map(RecipeCard)}
      </Card.Group>
    </Grid.Column>
  </Grid>
);

Me.propTypes = {
  data: propType(PROFILE_QUERY).isRequired
};

export default compose(
  needsLogin,
  graphql(PROFILE_QUERY),
  renderWhileLoading(),
  renderForError()
)(Me);
