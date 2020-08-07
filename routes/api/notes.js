const express = require('express')
const path = require('path')
const uuid = require('uuid')
const { Writer } = require('../../helper/writer')

const router = express.Router()

//GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
router.get('/', async (req, res) => {
    const dbpath = path.join(__dirname, '../../db', '/db.json')
    let writer = new Writer()
    let db = await writer.printFile(dbpath)
    res.json(db)
})

//GET Single Note `/api/notes/:id`
router.get('/:id', async (req, res) => {
    const dbpath = path.join(__dirname, '../../db', '/db.json')
    let writer = new Writer()
    let db = await writer.printFile(dbpath)
    const found = db.some(note => note.id === req.params.id)
    if(found) {
        res.json(db.filter(note => note.id === req.params.id))
    }
    else {
        res.status(404).json({ msg: `No note is available with index ${req.params.id}`})
    }
})

//POST `/api/notes` Create a Note 
router.post('/', async (req, res) => {
    const dbpath = path.join(__dirname, '../../db', '/db.json')
    let writer = new Writer()
    let db = await writer.printFile(dbpath)
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
router.put('/:id', async (req, res) => {
    const dbpath = path.join(__dirname, '../../db', '/db.json')
    let writer = new Writer()
    let db = await writer.printFile(dbpath)

    const found = db.some(note => note.id === req.params.id)
    if(found) {
        const updatedNote = req.body
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
router.delete('/:id', async (req, res) => {
    const dbpath = path.join(__dirname, '../../db', '/db.json')
    let writer = new Writer()
    let db = await writer.printFile(dbpath)

    const found = db.some(note => note.id === req.params.id)
    if(found) {
        let buffer = db.filter(note => note.id !== req.params.id)
        res.json({
            msg: `Deleted Note, ID: ${req.params.id}`, 
            notes: db.filter(note => note.id !== req.params.id)             
        })
        if(buffer === '') { 
            buffer = []
        }
        writer.fileClear(dbpath)
        writer.fileAppend(dbpath, JSON.stringify(buffer), 'DELETE')
    }
    else {
        res.status(404).json({ msg: `No note is available with index ${req.params.id}`})
    }
})

module.exports = router