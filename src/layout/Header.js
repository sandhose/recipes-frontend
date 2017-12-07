import React from "react";
import { Dropdown, Menu, Label } from "semantic-ui-react";

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

const CategoriesDropdown = graphql(CATEGORIES_QUERY)(({ data }) => {
  const { loading, error, rootCategories } = data;

  if (loading) {
    return <Dropdown loading item pointing text="Categories" />;
  }

  if (error) {
    return <Dropdown error disabled item pointing text="Categories" />;
  }

  return (
    <Dropdown item pointing text="Categories">
      <Dropdown.Menu>
        {rootCategories.nodes.map(({ name, children }, index) => (
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
});

const PROFILE_QUERY = gql`
  query {
    me {
      fullName
    }
  }
`;

const ProfileItem = graphql(PROFILE_QUERY)(({ data }) => {
  const { loading, error, me } = data;

  if (loading) {
    return <Menu.Item disabled>Loading…</Menu.Item>;
  }

  if (error) {
    return <Menu.Item error>Error.</Menu.Item>;
  }

  if (me) {
    return <Menu.Item link>{me.fullName}</Menu.Item>;
  } else {
    return <Menu.Item link>Login</Menu.Item>;
  }
});

const Header = () => (
  <Menu pointing secondary>
    <Menu.Item header>Recipes.</Menu.Item>
    <CategoriesDropdown />
    <Menu.Menu position="right">
      <ProfileItem />
    </Menu.Menu>
  </Menu>
);

export default Header;
