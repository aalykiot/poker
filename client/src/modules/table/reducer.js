import { Map } from 'immutable';
import {
    UPDATE_JOINED
} from './actions';

const initialState = Map({
    joined: false
});

const reducer = (state = initialState, action) => {
    const data = action.payload;
    switch (action.type) {
        case UPDATE_JOINED:
            return state.set('joined', data);
        
        default:
            return state;
    }
};

export default reducer;