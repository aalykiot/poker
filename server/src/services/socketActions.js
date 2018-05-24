import _ from 'lodash';
import { Cards } from '../util/poker';
import buildStateObject from '../util/stateObjectBuilder';

class Socket {
  static actions(io) {
    const initialState = Object.freeze({
      deck: Cards,
      deckIndex: 0,
      pot: 0,
      winner: null,
      players: [],
    });

    let clients = [];
    let state = {
      ...initialState,
      players: [...initialState.players],
    };

    io.on('connection', (socket) => {
      if (clients.length < 2) {
        socket.emit('table_is_joinable');
      } else {
        socket.emit('status_update', 'Table is full. Try again later...');
        socket.disconnect();
      }

      socket.on('join', () => {
        clients.push(socket.id);

        state.players.push({
          id: socket.id,
          hand: [],
          money: 1500,
          bet: 0,
        });

        if (clients.length === 2) {
          io.sockets.emit('joined');

          state.deck = _.shuffle(state.deck);
          state.deckIndex = 10;
          state.players[0].hand = _.slice(state.deck, 0, 5);
          state.players[0].mode = 'idle';
          state.players[1].hand = _.slice(state.deck, 5, 10);
          state.players[1].mode = 'waiting';

          io.sockets.connected[clients[0]].emit('update_state', buildStateObject(state, 0));
          io.sockets.connected[clients[1]].emit('update_state', buildStateObject(state, 1));
        } else {
          socket.emit('status_update', 'Waiting for opponent to join. Please wait...');
        }
      });

      socket.on('bet', (bet) => {
        const clientIndex = clients.indexOf(socket.id);

        state.players[clientIndex].bet = parseInt(bet, 10);
        state.players[clientIndex].money -= parseInt(bet, 10);
        state.players[clientIndex].mode = 'waiting';
        state.players[Math.abs(clientIndex - 1)].mode = 'idle';
        state.pot += parseInt(bet, 10);

        io.sockets.connected[clients[0]].emit('update_state', buildStateObject(state, 0));
        io.sockets.connected[clients[1]].emit('update_state', buildStateObject(state, 1));
      });

      socket.on('disconnect', () => {
        const isJoinedPlayer = clients.indexOf(socket.id);
        if (isJoinedPlayer !== -1) {
          clients = [];
          state = {
            ...initialState,
            players: [...initialState.players],
          };
          io.sockets.emit('rejoin');
        }
      });
    });
  }
}

export default Socket;
