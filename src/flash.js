import PropTypes from "prop-types";
import React from "react";
import {
  compose,
  withContext,
  getContext,
  createEventHandlerWithConfig,
  mapPropsStreamWithConfig,
  createSink
} from "recompose";
import { Observable } from "rxjs";
import rxjsConfig from "recompose/rxjsObservableConfig";
import { Message } from "semantic-ui-react";

export const createFlashStore = () => {
  const createHandler = createEventHandlerWithConfig(rxjsConfig);
  const { handler: flash, stream: flash$ } = createHandler();
  const { handler: dismiss, stream: dismiss$ } = createHandler();

  const ADD = "ADD";
  const DISMISS = "DISMISS";

  const messages$ = Observable.merge(
    flash$.map(message => ({ type: ADD, message })),
    dismiss$.map(message => ({ type: DISMISS, message }))
  )
    .scan(
      (state, { type, message }) => {
        if (type === ADD) {
          return {
            count: state.count + 1,
            messages: [...state.messages, { id: state.count, ...message }]
          };
        } else if (type === DISMISS) {
          return {
            ...state,
            messages: state.messages.filter(({ id }) => id !== message.id)
          };
        }
        return state;
      },
      { count: 0, messages: [] }
    )
    .map(({ messages }) => messages);

  return {
    flash,
    dismiss,
    messages$
  };
};

export const FlashProvider = withContext(
  {
    flash: PropTypes.func.isRequired,
    dismiss: PropTypes.func.isRequired,
    messages$: PropTypes.any.isRequired
  },
  ({ store }) => store
)(props => React.Children.only(props.children));

export const Flash = getContext({ flash: PropTypes.func.isRequired })(
  createSink(({ error = false, message, flash }) => flash({ message, error }))
);

Flash.displayName = "Flash";

const FlashMessage = ({ id, message, error, dismiss }) => (
  <Message key={id} error={error} content={message} onDismiss={dismiss} />
);

FlashMessage.displayName = "FlashMessage";

FlashMessage.propTypes = {
  id: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired,
  dismiss: PropTypes.func.isRequired
};

const FlashMessageList = ({ messages, dismiss }) => (
  <React.Fragment>
    {messages
      .map(props => ({ dismiss: () => dismiss(props), ...props }))
      .map(FlashMessage)}
  </React.Fragment>
);

FlashMessageList.propTypes = {
  dismiss: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      error: PropTypes.bool.isRequired
    })
  ).isRequired
};

export const FlashStream = compose(
  getContext({
    messages$: PropTypes.any.isRequired,
    dismiss: PropTypes.func.isRequired
  }),
  mapPropsStreamWithConfig(rxjsConfig)(props$ =>
    props$
      .map(({ messages$, ...props }) =>
        messages$.map(messages => ({ ...props, messages }))
      )
      .concatAll()
  )
)(FlashMessageList);

FlashStream.displayName = "FlashStream";

export default Flash;
