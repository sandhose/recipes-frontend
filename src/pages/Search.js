import React from "react";
import gql from "graphql-tag";
import {
  compose,
  mapPropsStreamWithConfig,
  createEventHandlerWithConfig
} from "recompose";
import rxjsConfig from "recompose/rxjsObservableConfig";
import { graphql } from "react-apollo";
import { propType } from "graphql-anywhere";
import { Card, Grid, Input } from "semantic-ui-react";

import RecipeCard from "../components/RecipeCard";

const SEARCH_QUERY = gql`
  query($search: String!) {
    search(term: $search, first: 10) {
      nodes {
        ...RecipeCard
      }
    }
  }

  ${RecipeCard.fragments.entry}
`;

const Search = ({ data: { loading, search }, change, value }) => (
  <Grid>
    <Grid.Row centered>
      <Grid.Column width={4}>
        <Input
          value={value}
          onChange={change}
          icon="search"
          size="huge"
          loading={loading}
          placeholder="Search…"
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Card.Group itemsPerRow={4}>
        {search && search.nodes.map(RecipeCard)}
      </Card.Group>
    </Grid.Row>
  </Grid>
);

Search.propTypes = {
  data: propType(SEARCH_QUERY).isRequired
};

const enhance = mapPropsStreamWithConfig(rxjsConfig)(props$ => {
  const { handler, stream } = createEventHandlerWithConfig(rxjsConfig)();

  const stream$ = stream.startWith("cake");
  const search$ = stream$.debounceTime(200).startWith("");

  return props$
    .map(props => ({ ...props, change: e => handler(e.target.value) }))
    .combineLatest(stream$, (props, value) => ({ ...props, value }))
    .combineLatest(search$, (props, search) => ({ ...props, search }));
});

export default compose(
  enhance,
  graphql(SEARCH_QUERY, {
    options: ({ search }) => ({ variables: { search } })
  })
)(Search);
