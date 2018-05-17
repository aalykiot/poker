import _ from 'lodash';
import { Map, List } from 'immutable';

import { Cards } from '../util/poker';

class Socket {

    static actions(io) {

        let clients = 0;
        let initialState = Map({
            deck: Cards,
            deckIndex: 0,
            pot: 0,
            winner: null,
            turn: null,
            players: List()
        });
        let state = initialState;
        
        io.on('connection', socket => {

            if (++clients <= 2) {

                socket.emit('table_is_joinable');

            } else {
                socket.emit('table_is_full');
                socket.disconnect();
            }

            socket.on('join', () => {
                
                state = state.updateIn(['players'], players => players.push(Map({
                    id: socket.id,
                    next: false,
                    hand: List(),
                    money: 1500,
                    bet: 0
                })));

                if (clients == 2) {

                    state = state.set('deck', _.shuffle(state.get('deck')));
                    state = state
                        .setIn(['players', 0, 'hand'], _.slice(state.get('deck'), 0, 5))
                        .setIn(['players', 1, 'hand'], _.slice(state.get('deck'), 5, 10))
                        .set('turn', 0)
                        .set('deckIndex', 10);

                    io.sockets.connected[state.getIn(['players', 0]).get('id')].emit('update_state', state);

                    io.sockets.connected[state.getIn(['players', 1]).get('id')].emit('update_state', state);
                                
                } else {
                    socket.emit('wait_for_opponent');
                }

            });

            socket.on('disconnect', () => {
                clients--;
                state = initialState;
                io.sockets.emit('restart');
            });

        });

    }

};

export default Socket;