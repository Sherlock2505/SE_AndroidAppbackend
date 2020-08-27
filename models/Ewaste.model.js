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
    thumbnail: {type: String, required: true},
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

ewasteSchema.methods.toJSON = function() {
    const ewaste = this
    const ewasteObj = ewaste.toObject()

    delete ewasteObj.location
    delete ewasteObj.specifications
    delete ewasteObj.owner
    
    return ewasteObj
}

const ewasteModel = mongoose.model('Ewaste',ewasteSchema)
module.exports = ewasteModel