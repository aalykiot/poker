export const UPDATE_STATE = 'UPDATE_PLAYER_STATE';
export const SET_MODE = 'SET_MODE';
export const RESET = 'RESET_PLAYER';
export const SELECT = 'SELECT_CARD';
export const DESELECT = 'DESELECT_CARD';
export const CLEAR_SELECTED = 'CLEAR_SELECTED';
export const WAIT = 'WAIT';

export const updateState = state => ({
  type: UPDATE_STATE,
  payload: state,
});

export const setMode = mode => ({
  type: SET_MODE,
  payload: mode,
});

export const selectCard = index => ({
  type: SELECT,
  payload: index,
});

export const deselectCard = index => ({
  type: DESELECT,
  payload: index,
});

export const resetState = () => ({
  type: RESET,
});

export const clearSelected = () => ({
  type: CLEAR_SELECTED,
});

export const wait = () => ({
  type: WAIT,
});
