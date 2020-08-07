const express = require('express')
const path = require('path')
const logger = require('./middleware/logger')
const pages = require('./routes/public/pages')
const { read } = require('fs')

const app = express()
const PORT = process.env.PORT || 3000

//init built-in middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//init custom middleware 
app.use(logger)
app.use('/api/notes', require('./routes/api/notes'))
app.use(pages)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

