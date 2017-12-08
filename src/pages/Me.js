import React from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import {
  Card,
  Dimmer,
  Loader,
  Header,
  Icon,
  Grid,
  Statistic
} from "semantic-ui-react";
import { Redirect } from "react-router-dom";

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

const Me = ({ data }) => {
  const { loading, error, me } = data;

  // FIXME: refactor this
  if (loading) {
    return (
      <Dimmer active>
        <Loader />
      </Dimmer>
    );
  }

  if (error) {
    return (
      <Dimmer active>
        <Header icon inverted>
          <Icon name="life ring" />
          {error.message}
        </Header>
      </Dimmer>
    );
  }

  if (!me) {
    return <Redirect to="/login" />;
  }

  return (
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
};

export default graphql(PROFILE_QUERY)(Me);
