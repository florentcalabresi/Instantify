const verifyToken = require("../middleware/verifyToken");
const express = require("express");
const router = express.Router();

router.post('/test', verifyToken, (req, res) => {
    const io = req.app.get('socketio');
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    io.emit('message', { message: message });
    res.json({ message: 'Message sent' });
});

module.exports = router;