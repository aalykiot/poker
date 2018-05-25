import _ from 'lodash';
import { Cards } from '../util/poker';
import buildStateObject from '../util/stateObjectBuilder';
import getWinner from '../util/winner';

class Socket {
  static actions(io) {
    const initialState = Object.freeze({
      deck: Cards,
      deckIndex: 0,
      pot: 0,
      winner: null,
      players: [],
      roundTrips: 0,
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
          state.players[0].waiting = false;
          state.players[1].hand = _.slice(state.deck, 5, 10);
          state.players[1].waiting = true;

          io.sockets.connected[clients[0]].emit('update_state', buildStateObject(state, 0));
          io.sockets.connected[clients[1]].emit('update_state', buildStateObject(state, 1));
        } else {
          socket.emit('status_update', 'Waiting for opponent to join. Please wait...');
        }
      });

      socket.on('bet', (bet) => {
        state.roundTrips += 1;

        const winner = (state.roundTrips === 4) ? getWinner(state.players) : null;
        const clientIndex = clients.indexOf(socket.id);

        state.players[clientIndex].bet = parseInt(bet, 10);
        state.players[clientIndex].money -= parseInt(bet, 10);
        state.players[clientIndex].waiting = true;
        state.players[Math.abs(clientIndex - 1)].waiting = (winner !== null);
        state.pot += parseInt(bet, 10);
        state.winner = (winner !== -1) ? clients[winner] : 'None';

        io.sockets.connected[clients[0]].emit('update_state', buildStateObject(state, 0, winner));
        io.sockets.connected[clients[1]].emit('update_state', buildStateObject(state, 1, winner));
      });

      socket.on('replace', (cards) => {
        const clientIndex = clients.indexOf(socket.id);
        const { hand } = state.players[clientIndex];
        const reducedHand = _.filter(hand, (card, index) => {
          if (_.indexOf(cards, index) === -1) return true;
          return false;
        });
        state.players[clientIndex].hand = _.concat(
          reducedHand,
          _.slice(state.deck, state.deckIndex, state.deckIndex + cards.length),
        );
        state.deckIndex += cards.length;
        socket.emit('update_state', {
          player: { hand: state.players[clientIndex].hand },
        });
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
