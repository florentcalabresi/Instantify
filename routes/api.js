const verifyToken = require("../middleware/verifyToken");
const express = require("express");
const router = express.Router();

router.post('/notify', verifyToken, (req, res) => {
    const io = req.app.get('socketio');
    const clients = req.app.get('clients');
    const { user_id, channel, data } = req.body;

    const clientsFilter = clients.filter((client) => client.user_id == user_id)
    if(clientsFilter == undefined) return res.json({ message: 'Users undefined.' })
    if(clientsFilter.length == 0) return res.json({ message: 'Users list empty.' })

    if (!data) {
        return res.status(400).json({ error: 'Message is required' });
    }

    clientsFilter.forEach((client) => {
        io.to(`${channel}_${client.socket_id}`).emit('notification', { channel: channel, data: data });
    })
    res.json({ channel: channel, message: 'Message sent' });
});

router.post('/client/', verifyToken, (req, res) => {
    const io = req.app.get('socketio');
    const clients = req.app.get('clients');
    const { client_id } = req.body

    if (!client_id) {
        return res.status(400).json({ error: 'Client is required' });
    }

    const client = clients.find((client) => client.user_id == client_id)

    res.json({ client: client });
});

module.exports = router;