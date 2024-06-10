require('dotenv').config()
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const apiRoutes = require('./routes/api');
const jwt = require('jsonwebtoken');
const Client = require('./api/client')
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*'
    }
});
const cors = require('cors');
const PORT = process.env.PORT || 3000;
let clients = [];
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api', apiRoutes);
app.set('socketio', io);
app.set('clients', clients);
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const user_id = socket.handshake.query.user_id;
    if (token && user_id) {
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return next(new Error('Authentication error'));
            }
            
            if(clients.find((client) => client.user_id == user_id)) return next(new Error('Authentication error'));

            clients.push(new Client(socket.id, user_id));
            //Update list
            app.set('clients', clients);
            socket.decoded = decoded;
            next();
        });
    } else {
        next(new Error('Token or User_ID is not valid.'));
    }
});

io.on('connection', (socket) => {
    socket.on('subscribe_channel', (channel) => {
        socket.join(`${channel}_${socket.id}`);
    })
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        clients = clients.filter(client => client.socket_id !== socket.id);

        //Update list
        app.set('clients', clients);
    });
});

server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});