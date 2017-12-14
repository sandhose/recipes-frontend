import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { propType } from "graphql-anywhere";
import { compose } from "recompose";
import { Grid, Header } from "semantic-ui-react";

import { renderWhileLoading, renderForError } from "../utils";
import ProfileCard from "../components/ProfileCard";
import IngredientList from "../components/IngredientList";
import Media from "../components/Media";
import StepList from "../components/StepList";
import RecipeHeader from "../components/RecipeHeader";

const RECIPE_QUERY = gql`
  query Recipe($id: Int!) {
    recipe: recipeById(id: $id) {
      serves
      ...RecipeHeader
      medias {
        nodes {
          ...Media
          hash
        }
      }
      author {
        ...ProfileCard
      }
      ingredients {
        nodes {
          ...IngredientCard
        }
      }
      steps {
        nodes {
          ...Step
        }
      }
    }
  }

  ${ProfileCard.fragments.entry}
  ${IngredientList.fragments.entry}
  ${Media.fragments.entry}
  ${StepList.fragments.entry}
  ${RecipeHeader.fragments.entry}
`;

const RecipePage = ({
  data: {
    recipe: {
      name,
      description,
      steps,
      ingredients,
      serves,
      author,
      medias,
      timers
    }
  }
}) => (
  <Grid>
    <Grid.Row>
      <Grid.Column>
        <RecipeHeader
          name={name}
          description={description}
          timers={timers}
          media={medias.nodes[0]}
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column width={4}>
        <IngredientList ingredients={ingredients} serves={serves} />
        <ProfileCard {...author} />
      </Grid.Column>
      <Grid.Column width={12}>
        <Grid>
          <StepList steps={steps.nodes} />
          <Header as="h2">All images</Header>
          <Grid.Row>
            {medias.nodes.map(media => (
              <Grid.Column key={media.hash} width={4}>
                <Media rounded {...media} />
              </Grid.Column>
            ))}
          </Grid.Row>
        </Grid>
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
