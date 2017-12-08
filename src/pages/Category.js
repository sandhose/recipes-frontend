import React from "react";
import gql from "graphql-tag";
import { Header, Card } from "semantic-ui-react";
import { graphql } from "react-apollo";

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

const CategoryPage = ({ data }) => {
  const { loading, error, category } = data;

  // TODO: Error handling
  if (loading || error) {
    return null;
  }

  return (
    <React.Fragment>
      <Header>{category.name}</Header>
      <Header.Subheader>{category.description}</Header.Subheader>

      {category.children.nodes.length > 0 ? (
        <Card.Group itemsPerRow={4}>
          {category.children.nodes.map(data => <CategoryCard {...data} />)}
        </Card.Group>
      ) : null}
      {category.recipes.nodes.length > 0 ? (
        <Card.Group itemsPerRow={2}>
          {category.recipes.nodes.map(data => <RecipeCard {...data} />)}
        </Card.Group>
      ) : null}
    </React.Fragment>
  );
};

export default graphql(CATEGORY_QUERY, {
  options: ({ match }) => ({ variables: { id: match.params.id } })
})(CategoryPage);
