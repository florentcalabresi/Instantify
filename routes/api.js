const verifyToken = require("../middleware/verifyToken");
const express = require("express");
const router = express.Router();

router.post('/test', verifyToken, (req, res) => {
    const io = req.app.get('socketio');
    const clients = req.app.get('clients');
    const { user_id, channel, data } = req.body;

    const client = clients.find((client) => client.user_id == user_id)
    if(client == undefined) return res.json({ message: 'User disconnected.' })

    if (!data) {
        return res.status(400).json({ error: 'Message is required' });
    }

    console.log("Send to ", `${channel}_${user_id}`)
    io.to(`${channel}_${client.socket_id}`).emit('notification', { channel: channel, data: data });
    res.json({ channel: channel, message: 'Message sent' });
});

module.exports = router;