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

const PROFILE_QUERY = gql`
  query {
    me {
      email
      fullName
      username
      biography
      recipes {
        totalCount
      }
      fridge {
        totalCount
      }
      plannings {
        totalCount
      }
      shoppingLists {
        totalCount
      }
    }
  }
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
        <Card>
          <Card.Content>
            <Card.Header>{me.fullName}</Card.Header>
            <Card.Meta>{me.username}</Card.Meta>
            <Card.Description>{me.biography}</Card.Description>
          </Card.Content>
        </Card>
      </Grid.Column>

      <Grid.Column width={10} floated="right">
        <Statistic.Group widths={4}>
          <Statistic label="recipes" value={me.recipes.totalCount} />
          <Statistic label="items in fridge" value={me.fridge.totalCount} />
          <Statistic label="plannings" value={me.plannings.totalCount} />
          <Statistic
            label="shopping lists"
            value={me.shoppingLists.totalCount}
          />
        </Statistic.Group>
      </Grid.Column>
    </Grid>
  );
};

export default graphql(PROFILE_QUERY)(Me);
