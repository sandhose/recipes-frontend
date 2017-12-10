import PropTypes from "prop-types";
import React from "react";
import { Segment, Table, Header } from "semantic-ui-react";
import gql from "graphql-tag";

const IngredientList = ({ ingredients, serves }) => (
  <Segment>
    <Header>For {serves} servings</Header>
    <Table size="small" basic="very" compact>
      {ingredients.nodes.map(({ id, name, quantity, unit }) => (
        <Table.Row key={id}>
          <Table.Cell collapsing textAlign="right">
            {quantity ? `${quantity} ${unit || ""}` : null}
          </Table.Cell>
          <Table.Cell>{name}</Table.Cell>
        </Table.Row>
      ))}
    </Table>
  </Segment>
);

IngredientList.fragments = {
  entry: gql`
    fragment IngredientCard on IngredientView {
      id
      name
      quantity
      unit
    }
  `
};

IngredientList.propTypes = {
  ingredients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      unit: PropTypes.number.isRequired
    })
  ).isRequired,
  serves: PropTypes.number.isRequired
};

export default IngredientList;
