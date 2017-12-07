import React from "react";
import { Menu } from "semantic-ui-react";

import CategoriesDropdown from "./CategoriesDropdown";
import ProfileItem from "./ProfileItem";

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
