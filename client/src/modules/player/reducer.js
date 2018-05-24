import { Map, List, fromJS } from 'immutable';
import {
  UPDATE_STATE,
  SET_MODE,
  SELECT,
  DESELECT,
  RESET,
  WAIT,
} from './actions';

const initialState = Map({
  hand: List([]),
  selected: List([]),
  waiting: true,
  mode: 'idle',
});

const reducer = (state = initialState, action) => {
  const data = action.payload;

  switch (action.type) {
    case UPDATE_STATE:
      return state.mergeDeep(fromJS(data));

    case SET_MODE:
      return state.set('mode', data);

    case SELECT:
      return state.update('selected', lst => lst.push(data));

    case DESELECT:
      return state.update('selected', lst => lst.filter((val) => {
        if (val !== data) return true;
        return false;
      }));

    case WAIT:
      return state.set('waiting', true);

    case RESET:
      return initialState;

    default:
      return state;
  }
};

export default reducer;
