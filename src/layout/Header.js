import React from "react";
import { NavLink } from "react-router-dom";
import { Menu, Icon } from "semantic-ui-react";

import CategoriesDropdown from "./CategoriesDropdown";
import ProfileItem from "./ProfileItem";

const Header = () => (
  <Menu pointing secondary>
    <Menu.Item as={NavLink} to="/" exact header>
      <Icon name="food" />
      Recipes.
    </Menu.Item>
    <CategoriesDropdown />
    <Menu.Menu position="right">
      <ProfileItem />
    </Menu.Menu>
  </Menu>
);

export default Header;
