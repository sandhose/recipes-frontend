import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { propType } from "graphql-anywhere";
import { compose } from "recompose";
import { Grid, Header, Icon, Segment } from "semantic-ui-react";

import { renderWhileLoading, renderForError } from "../utils";
import ProfileCard from "../components/ProfileCard";
import IngredientList from "../components/IngredientList";

const RECIPE_QUERY = gql`
  fragment StepCard on Step {
    id
    description
  }

  query Recipe($id: Int!) {
    recipe: recipeById(id: $id) {
      name
      description
      serves
      author: profileByAuthorId {
        ...ProfileCard
      }
      ingredients {
        nodes {
          ...IngredientCard
        }
      }
      steps: stepsByRecipeId(orderBy: POSITION_ASC) {
        nodes {
          ...StepCard
        }
      }
    }
  }

  ${ProfileCard.fragments.entry}
  ${IngredientList.fragments.entry}
`;

const StepList = ({ steps }) => (
  <Segment.Group>
    {steps.map(({ id, description }) => (
      <Segment key={id}>{description}</Segment>
    ))}
  </Segment.Group>
);

StepList.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired
    })
  ).isRequired
};

const RecipePage = ({
  data: { recipe: { name, description, steps, ingredients, serves, author } }
}) => (
  <Grid>
    <Grid.Row>
      <Grid.Column centered>
        <Header as="h1" textAlign="center" icon>
          <Icon name="food" circular />
          {name}
          {description
            .split("\\n")
            .map((d, i) => <Header.Subheader key={i}>{d}</Header.Subheader>)}
        </Header>
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column width={4}>
        <IngredientList ingredients={ingredients} serves={serves} />
        <ProfileCard {...author} />
      </Grid.Column>
      <Grid.Column width={12}>
        <StepList steps={steps.nodes} />
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

RecipePage.propTypes = {
  data: propType(RECIPE_QUERY).isRequired
};

export default compose(
  graphql(RECIPE_QUERY, {
    options: ({ match }) => ({ variables: { id: match.params.id } })
  }),
  renderWhileLoading(),
  renderForError()
)(RecipePage);
