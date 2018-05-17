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

        socket.on('table_is_full', () => {
            store.dispatch(lobby.setStatus('Table is full. Try again later...'));
        });

        socket.on('wait_for_opponent', () => {
            store.dispatch(lobby.setStatus('Waiting for opponent to join. Please wait...'));
        });

        socket.on('connect_error', () => {
            store.dispatch(lobby.setStatus('Can\'t connect to server...'));
        });

        socket.on('restart', () => {
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