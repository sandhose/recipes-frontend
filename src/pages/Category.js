import React from "react";
import gql from "graphql-tag";
import { Header, Card, Divider } from "semantic-ui-react";
import { graphql } from "react-apollo";
import { compose } from "recompose";

import { renderWhileLoading, renderForError } from "../utils";
import RecipeCard from "../components/RecipeCard";
import CategoryCard from "../components/CategoryCard";

const CATEGORY_QUERY = gql`
  query Category($id: Int!) {
    category: categoryById(id: $id) {
      id,
      name,
      description,
      recipes {
        nodes {
          ...RecipeCard
        }
      }
      children {
        nodes {
          ...CategoryCard
        }
      }
    }
  }

  ${RecipeCard.fragments.entry}
  ${CategoryCard.fragments.entry}
`;

const CategoryPage = ({ data: { category } }) => (
  <React.Fragment>
    <Header as="h1">{category.name}</Header>
    <Header.Subheader>{category.description}</Header.Subheader>

    {category.children.nodes.length > 0 ? (
      <React.Fragment>
        <Divider />
        <Header as="h2">Sub-categories</Header>
        <Card.Group itemsPerRow={4}>
          {category.children.nodes.map(CategoryCard)}
        </Card.Group>
      </React.Fragment>
    ) : null}
    {category.recipes.nodes.length > 0 ? (
      <React.Fragment>
        <Divider />
        <Header as="h2">Recipes</Header>
        <Card.Group itemsPerRow={2}>
          {category.recipes.nodes.map(RecipeCard)}
        </Card.Group>
      </React.Fragment>
    ) : null}
  </React.Fragment>
);

export default compose(
  graphql(CATEGORY_QUERY, {
    options: ({ match }) => ({ variables: { id: match.params.id } })
  }),
  renderWhileLoading(),
  renderForError()
)(CategoryPage);
