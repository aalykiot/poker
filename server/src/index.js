import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import socket from './network/socket';

const PORT = 8080;
const app = express();
const httpServer = http.Server(app);
const io = socketIO(httpServer);

socket.create(io);

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
