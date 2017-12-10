import PropTypes from "prop-types";
import React from "react";
import { Card, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import gql from "graphql-tag";

const RecipeCard = ({ id, name, description, serves, categories }) => (
  <Card link as={Link} to={`/recipes/${id}`} key={id}>
    <Card.Content>
      <Card.Header>
        {categories.nodes.length !== 0 ? (
          <Label ribbon>{categories.nodes[0].name}</Label>
        ) : null}
        {name}
        {serves ? <em> ({serves} persons)</em> : null}
      </Card.Header>
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
      categories: cat(first: 1) {
        nodes {
          name
        }
      }
    }
  `
};

RecipeCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  serves: PropTypes.number.isRequired,
  categories: PropTypes.shape({
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired
};

export default RecipeCard;
