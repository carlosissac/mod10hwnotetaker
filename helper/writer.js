const fs = require('fs')
const { promisify } = require('util')
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

module.exports = { Writer }