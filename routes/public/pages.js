const express = require('express');
const path = require('path')
const app = express();
const PORT = process.env.PORT || 3000

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'notes.html'))
})

app.get('/assets/css/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/assets/css', 'styles.css'))
})

app.get('/assets/js/index.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/assets/js', 'index.js'))
})

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../../public', 'index.html'))
})

module.exports = app
