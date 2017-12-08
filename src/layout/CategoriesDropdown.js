import React from "react";
import { Dropdown, Label } from "semantic-ui-react";

import gql from "graphql-tag";
import { graphql } from "react-apollo";

const CATEGORIES_QUERY = gql`
  query {
    rootCategories {
      nodes {
        name
        children {
          nodes {
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

const CategoriesDropdown = ({ data }) => {
  const { loading, error, rootCategories } = data;

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
          rootCategories.nodes.map(({ name, children }, index) => (
            <Dropdown.Item key={index}>
              {name}
              <Dropdown>
                <Dropdown.Menu>
                  {children.nodes.map(({ name, recipes }, index) => (
                    <Dropdown.Item key={index}>
                      <Label>{recipes.totalCount}</Label>
                      {name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default graphql(CATEGORIES_QUERY)(CategoriesDropdown);
