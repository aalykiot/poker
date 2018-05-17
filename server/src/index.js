import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

import Socket from './services/socketActions';

const PORT = 8080;
const app = express();
const httpServer = http.Server(app);
const io = socketIO(httpServer);

Socket.actions(io);

httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});