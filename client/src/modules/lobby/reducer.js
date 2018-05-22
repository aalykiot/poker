import { Map } from 'immutable';
import { UPDATE_STATUS } from './actions';

const initialState = Map({
  status: 'Connecting to server...',
});

const reducer = (state = initialState, action) => {
  const data = action.payload;
  switch (action.type) {
    case UPDATE_STATUS:
      return state.set('status', data);
    default:
      return state;
  }
};

export default reducer;
