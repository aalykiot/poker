import io from 'socket.io-client';
import * as lobby from '../modules/lobby/actions';
import * as table from '../modules/table/actions';

class SocketConnection {

    static open(endpoint, store) {

        this.socket = io(endpoint);

        const socket = this.socket;

        socket.on('update_state', data => {
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
            socket.emit('join');
            store.dispatch(lobby.setStatus('Joining table...'));
        });

    }

    static emit() {
        const socket = this.socket;
        if (typeof socket === 'undefined') throw Error('Socket connection not open!');
    }

};

export default SocketConnection;