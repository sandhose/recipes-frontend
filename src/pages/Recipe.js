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
import Media from "../components/Media";
import StepList from "../components/StepList";

const RECIPE_QUERY = gql`
  query Recipe($id: Int!) {
    recipe: recipeById(id: $id) {
      name
      description
      serves
      medias: media {
        nodes {
          ...Media
          hash
        }
      }
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
          ...Step
        }
      }
    }
  }

  ${ProfileCard.fragments.entry}
  ${IngredientList.fragments.entry}
  ${Media.fragments.entry}
  ${StepList.fragments.entry}
`;

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

const RecipePage = ({
  data: {
    recipe: { name, description, steps, ingredients, serves, author, medias }
  }
}) => (
  <Grid>
    <Grid.Row>
      <Grid.Column>
        <Segment inverted size="massive">
          <Header
            as="h1"
            textAlign="center"
            style={{
              maxWidth: 400,
              position: "relative",
              zIndex: 1
            }}
            inverted
            icon
          >
            <Icon name="food" inverted circular />
            {name}
            {description
              .split("\\n")
              .map((d, i) => <Header.Subheader key={i}>{d}</Header.Subheader>)}
          </Header>
          {medias.nodes[0] && <BackgroundImage file={medias.nodes[0].file} />}
        </Segment>
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
