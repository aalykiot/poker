export const UPDATE_STATE = 'UPDATE_PLAYER_STATE';
export const SET_MODE = 'SET_MODE';
export const RESET = 'RESET_PLAYER';

export const updateState = state => ({
  type: UPDATE_STATE,
  payload: state,
});

export const setMode = mode => ({
  type: SET_MODE,
  payload: mode,
});

export const resetState = () => ({
  type: RESET,
});
