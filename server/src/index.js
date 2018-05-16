import express from 'express';
import http from 'http';

import Socket from './services/socket';

const PORT = 8080;
const app = express();
const httpServer = http.Server(app);

Socket.createChannel(httpServer);

httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});