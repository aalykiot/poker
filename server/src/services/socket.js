import buildStateObject from '../util/builder';
import Manager from '../util/manager';

class Socket {
  static create(io) {
    const manager = new Manager();

    io.on('connection', (socket) => {
      if (manager.getClients().length < 2) {
        socket.emit('table_is_joinable');
      } else {
        socket.emit('status_update', 'Table is full. Try again later...');
        socket.disconnect();
      }

      socket.on('join', () => {
        manager.registerClient(socket.id);
        manager.execute('ADD_PLAYER', socket.id);

        if (manager.getClients().length === 2) {
          io.sockets.emit('joined');

          manager.execute('SHUFFLE_DECK');
          manager.execute('DRAW_PLAYER_CARDS', {
            index: 0,
            waiting: false,
          });
          manager.execute('DRAW_PLAYER_CARDS', {
            index: 1,
            waiting: true,
          });

          io.sockets.connected[manager.getClients()[0]].emit('update_state', buildStateObject(manager.getState(), 0));
          io.sockets.connected[manager.getClients()[1]].emit('update_state', buildStateObject(manager.getState(), 1));
        } else {
          socket.emit('status_update', 'Waiting for opponent to join. Please wait...');
        }
      });

      socket.on('bet', (bet) => {
        const index = manager.getClients().indexOf(socket.id);

        manager.execute('PLAYER_BETS', {
          index,
          bet,
        });

        io.sockets.connected[manager.getClients()[0]].emit('update_state', buildStateObject(manager.getState(), 0));
        io.sockets.connected[manager.getClients()[1]].emit('update_state', buildStateObject(manager.getState(), 1));
      });

      // socket.on('replace', (cards) => {
      //   const clientIndex = clients.indexOf(socket.id);
      //   const { hand } = state.players[clientIndex];
      //   const reducedHand = _.filter(hand, (card, index) => {
      //     if (_.indexOf(cards, index) === -1) return true;
      //     return false;
      //   });
      //   state.players[clientIndex].hand = _.concat(
      //     reducedHand,
      //     _.slice(state.deck, state.deckIndex, state.deckIndex + cards.length),
      //   );
      //   state.deckIndex += cards.length;
      //   socket.emit('update_state', {
      //     player: { hand: state.players[clientIndex].hand },
      //   });
      // });

      socket.on('disconnect', () => {
        const isJoinedPlayer = manager.getClients().indexOf(socket.id);
        if (isJoinedPlayer !== -1) {
          manager.clearClients();
          manager.execute('RESET');
          io.sockets.emit('rejoin');
        }
      });
    });
  }
}

export default Socket;
