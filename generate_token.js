require('dotenv').config()
const jwt = require('jsonwebtoken');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Please enter your id: ', (id) => {
    const token = jwt.sign({ username: id }, process.env.SECRET_KEY);
    console.log('Token:', token);
    process.exit(0)
});

