import { combineReducers } from 'redux';
import lobbyReducer from '../modules/lobby/reducer';
import tableReducer from '../modules/table/reducer';

const rootReducers = combineReducers({
    lobby: lobbyReducer,
    table: tableReducer
});

export default rootReducers;