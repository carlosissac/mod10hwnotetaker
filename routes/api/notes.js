const express = require('express')
const uuid = require('uuid')
const router = express.Router()
const db = require('../../db/db.json')
const path = require('path')
const { Writer } = require('../../helper/writer')


//GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
router.get('/', (req, res) => res.json(db))

//GET Single Note `/api/notes/:id`
router.get('/:id', (req, res) => {
    const found = db.some(note => note.id === req.params.id)
    if(found) {
        res.json(db.filter(note => note.id === req.params.id))
    }
    else {
        res.status(404).json({ msg: `No note is available with index ${req.params.id}`})
    }
})

//POST `/api/notes` Create a Note 
router.post('/', (req, res) => {
    let writer = new Writer()
    let dbpath = path.resolve(__dirname,'../../db/')
    dbpath += '/db.json'
    genId = uuid.v4()

    const newNote = {
        id: genId.slice(genId.length-5),
        title: req.body.title,
        text: req.body.text
    }

    if(!newNote.title || !newNote.text) {
        return res.status(400).json({ msg: 'Bad Request: Please check Title and Text'})
    }

    db.push(newNote)
    writer.fileClear(dbpath)
    writer.fileAppend(dbpath, JSON.stringify(db), 'POST')
    res.json(db)
}) 

//PUT `/api/notes/:id` Update an existing note
router.put('/:id', (req, res) => {
    const found = db.some(note => note.id === req.params.id)
    if(found) {
        const updatedNote = req.body
        //res.json(db.filter(note => note.id === req.params.id))
        db.forEach(note => {
            if(note.id === req.params.id) {
                //new title is sent we will update attribute if not we will keep the old one
                note.title = updatedNote.title ? updatedNote.title : note.title
                note.text = updatedNote.text ? updatedNote.text : updatedNote.text
                res.json({ msg: 'Note updated', note })
            }
        })
    }
    else {
        res.status(404).json({ msg: `No note is available with index ${req.params.id}`})
    }
})

//DELETE `/api/notes/:id` Delete an existing note
router.delete('/:id', function (req, res) {
    let writer = new Writer()
    let dbpath = path.resolve(__dirname,'../../db/')
    dbpath += '/db.json'
    const found = db.some(note => note.id === req.params.id)
    if(found) {
        let buffer = db.filter(note => note.id !== req.params.id)
        res.json({
            msg: `Deleted Note, ID: ${req.params.id}`, 
            notes: db.filter(note => note.id !== req.params.id) 
        })
        writer.fileClear(dbpath)
        writer.fileAppend(dbpath, JSON.stringify(buffer), 'POST')
    }
    else {
        res.status(404).json({ msg: `No note is available with index ${req.params.id}`})
    }
})

module.exports = router