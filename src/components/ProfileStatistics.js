import PropTypes from "prop-types";
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

ProfileStatistics.propTypes = {
  recipes: PropTypes.shape({
    totalCount: PropTypes.number.isRequired
  }).isRequired,
  fridge: PropTypes.shape({
    totalCount: PropTypes.number.isRequired
  }).isRequired,
  plannings: PropTypes.shape({
    totalCount: PropTypes.number.isRequired
  }).isRequired,
  shoppingLists: PropTypes.shape({
    totalCount: PropTypes.number.isRequired
  }).isRequired
};

export default ProfileStatistics;
