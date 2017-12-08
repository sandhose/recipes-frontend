import React from "react";
import { Statistic } from "semantic-ui-react";
import gql from "graphql-tag";

const ProfileStatistics = ({ recipes, fridge, plannings, shoppingLists }) => (
  <Statistic.Group widths={4}>
    <Statistic label="recipes" value={recipes.totalCount} />
    <Statistic label="items in fridge" value={fridge.totalCount} />
    <Statistic label="plannings" value={plannings.totalCount} />
    <Statistic label="shopping lists" value={shoppingLists.totalCount} />
  </Statistic.Group>
);

ProfileStatistics.fragments = {
  entry: gql`
    fragment ProfileStatistics on Profile {
      recipes {
        totalCount
      }
      fridge {
        totalCount
      }
      plannings {
        totalCount
      }
      shoppingLists {
        totalCount
      }
    }
  `
};

export default ProfileStatistics;
