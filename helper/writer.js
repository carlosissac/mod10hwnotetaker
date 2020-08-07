const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
const truncate = promisify(fs.truncate)
const appendFile = promisify(fs.appendFile)

const Writer = function () {}

Writer.prototype.handleError = function(error) {
    console.log(`File Write Error >>>> ${error}`)
}

Writer.prototype.fileAppend = async function(filepath, text, id) {
    await appendFile(filepath, text, (error) => {//if(error) throw error //handleError(error)
    })
    return `Appended ${id}`
}

Writer.prototype.fileClear = async function(filepath) {
    await truncate(filepath)
    return `Cleared ${filepath}`
}

Writer.prototype.readFile = async function(filepath) {
    const content = await readFile(filepath, 'utf-8')
    return content
}

Writer.prototype.printFile = async function(filepath) {
    let array = []
    let promise = await Promise.all([this.readFile(filepath)])
    JSON.parse(promise).forEach(element => {
        array.push(element)
    })

    return array
}

module.exports = { Writer }