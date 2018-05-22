import { combineReducers } from 'redux';
import lobbyReducer from '../modules/lobby/reducer';
import tableReducer from '../modules/table/reducer';
import playerReducer from '../modules/player/reducer';
import opponentReducer from '../modules/opponent/reducer';

const rootReducers = combineReducers({
  lobby: lobbyReducer,
  table: tableReducer,
  player: playerReducer,
  opponent: opponentReducer,
});

export default rootReducers;
