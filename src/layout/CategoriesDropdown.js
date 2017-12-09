import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Dropdown, Label } from "semantic-ui-react";
import gql from "graphql-tag";
import { propType } from "graphql-anywhere";
import { graphql } from "react-apollo";

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

const CategoriesDropdown = ({ data }) => {
  const { loading, error, rootCategories } = data;

  // FIXME: submenu
  return (
    <Dropdown
      loading={loading}
      disabled={error}
      error={error}
      item
      pointing
      text="Categories"
    >
      <Dropdown.Menu>
        {rootCategories &&
          rootCategories.nodes.map(({ id, name, children }) => (
            <Dropdown.Item key={id}>
              {name}
              <Dropdown>
                <Dropdown.Menu>
                  {children.nodes.map(SubcategoryItem)}
                </Dropdown.Menu>
              </Dropdown>
            </Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

CategoriesDropdown.propTypes = {
  data: propType(CATEGORIES_QUERY).isRequired
};

export default graphql(CATEGORIES_QUERY)(CategoriesDropdown);
