import _ from 'lodash';
import { Cards } from '../util/poker';

class Socket {

    static actions(io) {

        let clients = [];
        const initialState = Object.freeze({
            deck: Cards,
            deckIndex: 0,
            pot: 0,
            winner: null,
            turn: null,
            players: []
        });

        let state = Object.assign({}, initialState);
        
        io.on('connection', socket => {

            if (clients.length < 2) {

                socket.emit('table_is_joinable');

            } else {

                socket.emit('status_update', 'Table is full. Try again later...');
                socket.disconnect();

            }

            socket.on('join', () => {

                clients.push(socket.id);

                state.players = _.concat(state.players, {
                    id: socket.id,
                    next: false,
                    hand: [],
                    money: 1500,
                    bet: 0
                });

                if (clients.length === 2) {

                    state.deck = _.shuffle(state.deck);
                    state.players[0].hand = _.slice(state.deck, 0, 5);
                    state.players[1].hand = _.slice(state.deck, 5, 10);
                    state.turn = 0;
                    state.deckIndex = 10;

                    io.sockets.connected[clients[0]].emit('update_state', state);
                    io.sockets.connected[clients[1]].emit('update_state', state);
                                
                } else {
                    socket.emit('status_update', 'Waiting for opponent to join. Please wait...');
                }

            });

            socket.on('disconnect', () => {
                const isJoinedPlayer = clients.indexOf(socket.id);
                if (isJoinedPlayer !== -1) {
                    clients = [];
                    state = Object.assign({}, initialState);
                    io.sockets.emit('rejoin');
                }
            });

        });

    }

};

export default Socket;