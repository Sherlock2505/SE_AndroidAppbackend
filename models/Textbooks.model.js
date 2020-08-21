const mongoose = require('mongoose')
const validator = require('validator')

const textSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    snapshots: [String],
    author: {
        type: String,
    },
    edition: {
        type: String
    }
},{
    timestamps: true
})

const textModel = mongoose.model('Textbooks',textSchema)
module.exports = textModel