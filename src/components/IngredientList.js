import PropTypes from "prop-types";
import React from "react";
import { Segment, Table, Header } from "semantic-ui-react";
import gql from "graphql-tag";

const IngredientList = ({ ingredients, serves }) => (
  <Segment>
    <Header>For {serves} servings</Header>
    <Table size="small" basic="very" compact>
      <Table.Body>
        {ingredients.nodes.map(({ id, name, quantity, unit }) => (
          <Table.Row key={id}>
            <Table.Cell collapsing textAlign="right">
              {quantity ? `${quantity} ${unit || ""}` : null}
            </Table.Cell>
            <Table.Cell>{name}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
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
  ingredients: PropTypes.shape({
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        unit: PropTypes.string
      })
    ).isRequired
  }).isRequired,
  serves: PropTypes.number.isRequired
};

export default IngredientList;
