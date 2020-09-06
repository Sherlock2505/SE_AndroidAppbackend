const mongoose = require('mongoose')
const validator = require('validator')
const faqschema = require('./faq_schema')

const noteSchema = new mongoose.Schema({
    name: {type:String, required: true},
    price: {type:Number, required: true},
    description: {type: String, required: true},
    thumbnail: {type: String, required: true},
    photos: [String],
    pincode: {type:Number, required: true},
    location: {type:String, required: true},
    faqs: [faqschema],
    owner: {type:mongoose.Schema.Types.ObjectId, required: true, ref: 'Users'}
},{
    timestamps: true
})

noteSchema.methods.toJSON = function(){
    const nwaste = this

    const nwasteObject = nwaste.toObject()

    delete nwasteObject.location
    delete nwasteObject.description
    delete nwasteObject.owner
    delete nwasteObject.faqs

    return nwasteObject
}

const notesModel = mongoose.model("Notebooks",noteSchema)
module.exports = notesModel