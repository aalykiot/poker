import buildStateObject from '../util/builder';
import Manager from '../util/manager';

class Socket {
  static create(io) {
    const manager = new Manager();

    io.on('connection', (socket) => {
      if (manager.getState().clients.length < 2) {
        socket.emit('table_is_joinable');
      } else {
        socket.emit('status_update', 'Table is full. Try again later...');
        socket.disconnect();
      }

      socket.on('join', () => {
        manager.execute('ADD_PLAYER', socket.id);

        if (manager.getState().clients.length === 2) {
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

          io.sockets.connected[manager.getState().clients[0]].emit('update_state', buildStateObject(manager.getState(), 0));
          io.sockets.connected[manager.getState().clients[1]].emit('update_state', buildStateObject(manager.getState(), 1));
        } else {
          socket.emit('status_update', 'Waiting for opponent to join. Please wait...');
        }
      });

      socket.on('bet', (bet) => {
        const index = manager.getState().clients.indexOf(socket.id);

        manager.execute('PLAYER_BETS', {
          index,
          bet,
        });

        io.sockets.connected[manager.getState().clients[0]].emit('update_state', buildStateObject(manager.getState(), 0));
        io.sockets.connected[manager.getState().clients[1]].emit('update_state', buildStateObject(manager.getState(), 1));


        if (manager.getState().roundTrips === 4) {
          manager.execute('FIND_WINNER');

          io.sockets.connected[manager.getState().clients[0]].emit('update_state', buildStateObject(manager.getState(), 0, true));
          io.sockets.connected[manager.getState().clients[1]].emit('update_state', buildStateObject(manager.getState(), 1, true));


          if (manager.getState().winner.isTie) {
            manager.execute('RETURN_BETS');
          } else {
            manager.execute('GIVE_EARNINGS');
          }

          manager.execute('NEW_ROUND');
          manager.execute('SHUFFLE_DECK');
          manager.execute('DRAW_PLAYER_CARDS', {
            index: 0,
            waiting: false,
          });
          manager.execute('DRAW_PLAYER_CARDS', {
            index: 1,
            waiting: true,
          });

          io.sockets.connected[manager.getState().clients[0]].emit('new_round', buildStateObject(manager.getState(), 0));
          io.sockets.connected[manager.getState().clients[1]].emit('new_round', buildStateObject(manager.getState(), 1));
        }
      });

      socket.on('replace', (cards) => {
        const index = manager.getState().clients.indexOf(socket.id);
        manager.execute('REPLACE_CARDS', {
          index,
          cards,
        });
        socket.emit('update_state', {
          player: { hand: manager.getState().players[index].hand },
        });
      });

      socket.on('disconnect', () => {
        const isJoinedPlayer = manager.getState().clients.indexOf(socket.id);
        if (isJoinedPlayer !== -1) {
          manager.execute('RESET');
          io.sockets.emit('rejoin');
        }
      });
    });
  }
}

export default Socket;
