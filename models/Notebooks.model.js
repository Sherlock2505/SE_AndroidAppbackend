const mongoose = require('mongoose')
const validator = require('validator')

const noteSchema = new mongoose.Schema({
    name: {type:String, required: true},
    price: {type:Number, required: true},
    description: {type: String, required: true},
    photos: [String],
    pincode: {type:Number, required: true},
    location: {type:String, required: true},
    owner: {type:mongoose.Schema.Types.ObjectId, required: true, ref: 'Users'}
},{
    timestamps: true
})

const notesModel = mongoose.model("Notebooks",noteSchema)
module.exports = notesModel