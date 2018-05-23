import io from 'socket.io-client';
import * as lobby from '../modules/lobby/actions';
import * as table from '../modules/table/actions';
import * as player from '../modules/player/actions';
import * as opponent from '../modules/opponent/actions';

class SocketConnection {
  static open(endpoint, store) {
    this.socket = io(endpoint);

    const socket = this.socket;

    socket.on('update_state', (data) => {
      store.dispatch(table.updateState(data.table));
      store.dispatch(player.updateState(data.player));
      store.dispatch(opponent.updateState(data.opponent));
    });

    socket.on('joined', () => {
      store.dispatch(table.updateJoined(true));
    });

    socket.on('table_is_joinable', () => {
      socket.emit('join');
      store.dispatch(lobby.setStatus('Joining table...'));
    });

    socket.on('status_update', (status) => {
      store.dispatch(table.updateJoined(false));
      store.dispatch(lobby.setStatus(status));
    });

    socket.on('connect_error', () => {
      store.dispatch(lobby.setStatus('Can\'t connect to server...'));
    });

    socket.on('rejoin', () => {
      store.dispatch(table.resetState());
      store.dispatch(player.resetState());
      store.dispatch(opponent.resetState());
      store.dispatch(lobby.setStatus('Joining table...'));
      socket.emit('join');
    });
  }

  static emit() {
    if (typeof this.socket === 'undefined') throw Error('Socket connection not open!');
  }
}

export default SocketConnection;
