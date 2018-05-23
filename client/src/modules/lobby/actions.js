export const UPDATE_STATUS = 'UPDATE_STATUS';
export const RESET = 'RESET_TABLE';

export const setStatus = status => ({
  type: UPDATE_STATUS,
  payload: status,
});

export const resetState = () => ({
  type: RESET,
});
