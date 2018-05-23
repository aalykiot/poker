export const UPDATE_STATE = 'UPDATE_OPPONENT_STATE';
export const RESET = 'RESET_OPPONENT';

export const updateState = state => ({
  type: UPDATE_STATE,
  payload: state,
});

export const resetState = () => ({
  type: RESET,
});
