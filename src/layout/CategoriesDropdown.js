import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Dropdown, Label, Menu } from "semantic-ui-react";
import gql from "graphql-tag";
import { propType } from "graphql-anywhere";
import { graphql } from "react-apollo";
import { compose } from "recompose";

import { renderWhileLoading, renderForError } from "../utils";

const CATEGORIES_QUERY = gql`
  query {
    rootCategories {
      nodes {
        id
        name
        children {
          nodes {
            id
            name
            recipes {
              totalCount
            }
          }
        }
      }
    }
  }
`;

const SubcategoryItem = ({ id, name, recipes }) => (
  <Dropdown.Item key={id} as={Link} to={`/categories/${id}`}>
    <Label>{recipes.totalCount}</Label>
    {name}
  </Dropdown.Item>
);

SubcategoryItem.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  recipes: PropTypes.shape({
    totalCount: PropTypes.number.isRequired
  }).isRequired
};

const CategoriesLoading = () => <Menu.Item disabled>Loading… </Menu.Item>;

const CategoriesError = () => <Menu.Item error>Error.</Menu.Item>;

const CategoriesDropdown = ({ data: { rootCategories } }) =>
  rootCategories &&
  rootCategories.nodes.map(({ id, name, children }) => (
    <Dropdown key={id} item pointing text={name}>
      <Dropdown.Menu>{children.nodes.map(SubcategoryItem)}</Dropdown.Menu>
    </Dropdown>
  ));

CategoriesDropdown.propTypes = {
  data: propType(CATEGORIES_QUERY).isRequired
};

export default compose(
  graphql(CATEGORIES_QUERY),
  renderWhileLoading(CategoriesLoading),
  renderForError(CategoriesError)
)(CategoriesDropdown);
