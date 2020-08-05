const express = require('express')
const path = require('path')
const logger = require('./middleware/logger')
const { read } = require('fs')
const { url } = require('inspector')

const app = express()

/*app.get(`/`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})*/

//init custom middleware 
app.use(logger)

//init built-in middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//static folder setup HTML, and other static elements can be hosted here 
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/notes', require('./routes/api/notes'))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))


