const mongoose = require('mongoose')
const validator = require('validator')
const faqschema = require('./faq_schema')

const textSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required:true
    },
    description: {
        type: String,
        required: true
    },
    used_for: {type: String},
    thumbnail: {type: String, required: true},
    photos: [String],
    author: {
        type: String,
        required: true
    },
    edition: {
        type: Number
    },
    faqs: [faqschema],
    pincode: {type:Number, required: true},
    location: {type:String, required: true},
    owner: {type:mongoose.Schema.Types.ObjectId, required: true, ref: 'Users'}
},{
    timestamps: true
})

textSchema.methods.toJSON = function(){
    const twaste = this

    const twasteObject = twaste.toObject()

    delete twasteObject.location
    delete twasteObject.description
    delete twasteObject.owner

    return twasteObject
}

const textModel = mongoose.model('Textbooks',textSchema)
module.exports = textModel
