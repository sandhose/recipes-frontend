import PropTypes from "prop-types";
import React from "react";
import { Card, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import gql from "graphql-tag";

const CategoryCard = ({ id, name, description, recipes }) => (
  <Card link as={Link} to={`/categories/${id}`} key={id}>
    <Card.Content>
      <Card.Header>{name}</Card.Header>
      <Card.Description>
        {description}
        <Label>{recipes.totalCount} recipes</Label>
      </Card.Description>
    </Card.Content>
  </Card>
);

CategoryCard.fragments = {
  entry: gql`
    fragment CategoryCard on Category {
      id
      name
      description
      recipes {
        totalCount
      }
    }
  `
};

CategoryCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  recipes: PropTypes.shape({
    totalCount: PropTypes.number.isRequired
  }).isRequired
};

export default CategoryCard;
