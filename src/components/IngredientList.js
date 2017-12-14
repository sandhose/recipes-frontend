import PropTypes from "prop-types";
import React from "react";
import { Segment, Table, Header } from "semantic-ui-react";
import gql from "graphql-tag";
import {
  mapPropsStreamWithConfig,
  createEventHandlerWithConfig
} from "recompose";
import rxjsConfig from "recompose/rxjsObservableConfig";

const round = n => Math.round(n * 4) / 4;

const IngredientList = ({ ingredients, serves, inputValue, handler }) => (
  <Segment>
    <Header>
      For
      <input
        type="number"
        value={inputValue}
        style={{
          width: `${Math.floor(Math.log10(inputValue)) + 3}ch`,
          textAlign: "center",
          margin: "0 0.5ch"
        }}
        onChange={handler}
      />
      servings
    </Header>
    <Table size="small" basic="very" compact>
      <Table.Body>
        {ingredients.nodes.map(({ id, name, quantity, unit }) => (
          <Table.Row key={id}>
            <Table.Cell collapsing textAlign="right">
              {quantity ? `${round(quantity * serves)} ${unit || ""}` : null}
            </Table.Cell>
            <Table.Cell>{name}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </Segment>
);

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
  serves: PropTypes.number.isRequired,
  inputValue: PropTypes.number.isRequired,
  handler: PropTypes.func.isRequired
};

const enhance = mapPropsStreamWithConfig(rxjsConfig)(props$ => {
  const { handler, stream } = createEventHandlerWithConfig(rxjsConfig)();

  const stream$ = stream
    .map(event => parseInt(event.target.value, 10))
    .merge(props$.map(({ serves }) => serves))
    .filter(v => !(v <= 0));

  return props$
    .combineLatest(stream$, (props, inputValue) => ({
      ...props,
      handler,
      inputValue
    }))
    .combineLatest(stream$.filter(n => !Number.isNaN(n)), (props, serves) => ({
      ...props,
      serves
    }));
});

const EnhancedIngredientList = enhance(IngredientList);

EnhancedIngredientList.fragments = {
  entry: gql`
    fragment IngredientCard on IngredientView {
      id
      name
      quantity
      unit
    }
  `
};

export default EnhancedIngredientList;
