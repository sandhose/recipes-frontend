import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { propType } from "graphql-anywhere";
import { compose } from "recompose";
import { Grid, Image, Header, Icon, Segment } from "semantic-ui-react";

import { renderWhileLoading, renderForError } from "../utils";
import ProfileCard from "../components/ProfileCard";
import IngredientList from "../components/IngredientList";
import Media from "../components/Media";

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
          ...StepCard
        }
      }
    }
  }

  ${ProfileCard.fragments.entry}
  ${IngredientList.fragments.entry}
  ${Media.fragments.entry}
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
        <StepList steps={steps.nodes} />
        <Image.Group size="small">
          {medias.nodes.map(media => (
            <Media rounded {...media} key={media.hash} />
          ))}
        </Image.Group>
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
