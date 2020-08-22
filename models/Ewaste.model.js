const mongoose = require('mongoose')
const validator = require('validator')

//Name
//Photos
//Price
//Used for
//Specifications if any
//Pin code
//Location

const ewasteSchema = new mongoose.Schema({
    name: {type:String, required:true},
    photos: [String],
    price: {type:Number,required:true},
    used_for: {type:String},
    specifications: {type: String, required: true},
    pincode: {type:Number,required:true},
    location: {type:String, required:true},
    owner: {type:mongoose.Schema.Types.ObjectId, required: true, ref: 'Users'}
},{
    timestamps: true
})

const ewasteModel = mongoose.model('Ewaste',ewasteSchema)
module.exports = ewasteModel