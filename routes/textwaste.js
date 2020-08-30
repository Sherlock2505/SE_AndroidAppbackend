const express = require('express')
const router = new express.Router()
const twasteModel = require('../models/Textbooks.model')
const auth = require('../middleware/auth')
const upload = require('../db/upload')

//Route for creating text-waste product
router.post('/create',auth, upload.fields([{name:'thumbnail', maxCount:1}, {name:'gallery', maxCount:8}]),async (req, res) => {
    const twaste = new twasteModel(req.body)
    twaste.owner = req.user._id

    try{
        if(req.files){
            let all_file = req.files['gallery']
            if(!req.files['thumbnail']){
                throw new Error('thumbnail pic is required')
            }
            const thumbnail_url = req.files['thumbnail'][0].filename
            pics_url = all_file.map((file) => {return file.filename})
            twaste.photos = pics_url
            twaste.thumbnail = thumbnail_url
        }
        await twaste.save()
        res.status(201).send(twaste.toObject())
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }

})

//Route for deleting twaste product
router.post('/delete/:id',auth,async (req, res)=> {
    
    const id = req.params.id
    
    try{
        const twaste = await twasteModel.findOne({owner:req.user._id, _id:id})
        if(twaste){
            await twasteModel.deleteOne({_id:id})
            res.status(200).send({msg:"Deleted Successfully"})
        }else{
            throw new Error('Only owner can delete item on sell')
        }
        
    }catch(e){
        res.status(400).send(e)
    }

})

//Route for viewing individual twaste (authenticated)
router.get('/view/:id',auth, async(req, res) => {
    const id = req.params.id
    
    try{
        const twaste = await (await twasteModel.findById(id)).toObject()
        res.send(twaste)
    }catch(e){
        res.status(400).send(e)
    }
})

//Route for viewing individual twaste (not authenticated)
//Seller info will not be available to user
router.get('/view_noauth/:id', async(req, res) => {
    const id = req.params.id

    try{
        let twaste = await twasteModel.findById(id)
        twaste = {
            _id: twaste._id,
            name: twaste.name,
            thumbnail: twaste.thumbnail,
            price: twaste.price,
            used_for: twaste.used_for,
            description: twaste.description,
            author: twaste.author,
            edition: twaste.edition,
            pincode: twaste.pincode,
            location: "Login to get full info",
            owner: "Login to get full info"
        }
        res.send(twaste)
    }catch(e){
        res.status(400).send(e)
    }
})

//Route for sending all on sale twastes by user
router.get('/all/me',auth,async(req,res) => {

    try{
        const all_twaste = await twasteModel.find({owner: req.user._id})
        res.status(200).send(all_twaste.map((twaste) => {return twaste.toObject()}))
    }catch(e){
        res.status(400).send(e)
    }

})

//Route for sending all twastes on sale
router.get('/all', async(req, res)=>{

    try{
        const twastes = await twasteModel.find()
        let twastes_mod = twastes.map(twaste => {return twaste.toJSON()})        
        res.send(twastes_mod)

    }catch(e){
        res.status(400).send(e)
    }
})

//Route for sending twastes by location filter
router.get('/all/:pin', async(req, res) => {

    try{
        const twastes = await twasteModel.find({pincode:req.params.pin})
        
        let twastes_mod = twastes.map(twaste => {return twaste.toJSON()})        
        res.send(twastes_mod)

    }catch(e){
        res.status(400).send(e)
    }
    
})

module.exports = router