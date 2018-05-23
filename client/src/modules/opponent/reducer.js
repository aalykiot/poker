import { Map, List, fromJS } from 'immutable';
import {
  UPDATE_STATE,
  RESET,
} from './actions';

const initialState = Map({
  hand: List([]),
});

const reducer = (state = initialState, action) => {
  const data = action.payload;

  switch (action.type) {
    case UPDATE_STATE:
      return state.mergeDeep(fromJS(data));

    case RESET:
      return initialState;

    default:
      return state;
  }
};

export default reducer;
