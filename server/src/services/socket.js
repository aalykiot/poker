import socketIO from 'socket.io';

export default class Socket {

    static createChannel(httpServer) {
        const io = socketIO(httpServer);
    }

};  