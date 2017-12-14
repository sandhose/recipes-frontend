import PropTypes from "prop-types";
import React from "react";
import { Card } from "semantic-ui-react";
import { Link } from "react-router-dom";
import gql from "graphql-tag";

import Media from "./Media";

const RecipeCard = ({ id, name, description, serves, categories, medias }) => (
  <Card
    style={{ alignSelf: "flex-start" }}
    link
    as={Link}
    to={`/recipes/${id}`}
    key={id}
  >
    {medias.nodes[0] && <Media {...medias.nodes[0]} />}
    <Card.Content>
      <Card.Header>{name}</Card.Header>
      <Card.Meta>
        {serves} servings • {categories.nodes[0].name}
      </Card.Meta>
      <Card.Description>
        {/* TODO: fix line breaks */}
        {// eslint-disable-next-line react/no-array-index-key
        description.split("\\n").map((c, i) => <p key={i}>{c}</p>)}
      </Card.Description>
    </Card.Content>
    {/* TODO: timers */}
  </Card>
);

RecipeCard.fragments = {
  entry: gql`
    fragment RecipeCard on Recipe {
      id
      name
      description
      serves
      medias(first: 1) {
        nodes {
          ...Media
        }
      }
      categories(first: 1) {
        nodes {
          name
        }
      }
    }

    ${Media.fragments.entry}
  `
};

RecipeCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  serves: PropTypes.number.isRequired,
  medias: PropTypes.shape({
    nodes: PropTypes.arrayOf(PropTypes.shape(Media.propTypes)).isRequired
  }).isRequired,
  categories: PropTypes.shape({
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired
};

export default RecipeCard;
