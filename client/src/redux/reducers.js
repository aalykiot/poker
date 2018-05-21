import { combineReducers } from 'redux';
import lobbyReducer from '../modules/lobby/reducer';
import tableReducer from '../modules/table/reducer';
import playerReducer from '../modules/player/reducer';

const rootReducers = combineReducers({
    lobby: lobbyReducer,
    table: tableReducer,
    player: playerReducer
});

export default rootReducers;
