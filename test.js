require('dotenv').config()
const { io } = require('socket.io-client');

// Connecter au serveur Socket.io avec le token
const socket = io(`http://localhost:${process.env.PORT}`, {
    query: {user_id: '1234'},
    auth: {token: process.env.JWT_TEST}
});

socket.on('connect', () => {
    console.log('Connected!', socket.id)

    subscribeChannel('friends_demand', (args) => {
        console.log('Channel Notificcation', args)
    })

    socket.on('disconnect', () => {
        
    })
})

function subscribeChannel(channelName, callback) {
    socket.emit('subscribe_channel', channelName)
    socket.on('notification', callback)
}