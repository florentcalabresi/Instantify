require('dotenv').config()
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const apiRoutes = require('./routes/api');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', apiRoutes);
app.set('socketio', io);
io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return next(new Error('Authentication error'));
            }
            
            socket.decoded = decoded;
            next();
        });
    } else {
        next(new Error('Authentication error'));
    }
});

io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté');

    socket.on('message', (msg) => {
        console.log('Message reçu:', msg);
        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur est déconnecté');
    });
});

server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});