require('dotenv').config()
const { io } = require('socket.io-client');

// Connecter au serveur Socket.io avec le token
const socket = io(`http://localhost:${process.env.PORT}`, {
    query: {token: process.env.JWT_TEST}
});

socket.on('connect', () => {
    console.log('Connected!')
    socket.on('message', (args) => {
        console.log('Message: ', args.message)
    })
})
