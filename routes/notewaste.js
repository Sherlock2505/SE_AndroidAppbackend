const express = require('express')
const router = new express.Router()
const nwasteModel = require('../models/Notebooks.model')
const auth = require('../middleware/auth')
const upload = require('../db/upload')

//Route for creating text-waste product
router.post('/create',auth, upload.fields([{name:'gallery', maxCount:8}]),async (req, res) => {
    const nwaste = new nwasteModel(req.body)
    nwaste.owner = req.user._id

    try{
        if(req.files){
            let all_file = req.files['gallery']
            pics_url = all_file.map((file) => {return file.filename})
            nwaste.photos = pics_url
        }
        await nwaste.save()
        res.status(201).send(nwaste)
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }

})

//Route for deleting nwaste product
router.post('/delete/:id',auth,async (req, res)=> {
    
    const id = req.params.id
    const ewatses = await nwasteModel.find({owner:req.user._id})

    try{
        await nwasteModel.deleteOne({_id:id})
        res.status(200).send(nwastes)
    }catch(e){
        res.status(400).send(e)
    }

})

//Route for viewing individual nwaste (authenticated)
router.get('/view/:id',auth, async(req, res) => {
    const id = req.params.id
    const nwaste = await nwasteModel.findById(id)

    try{
        res.send(nwaste)
    }catch(e){
        res.status(400).send(e)
    }
})

//Route for viewing individual nwaste (not authenticated)
//Seller info will not be available to user
router.get('/view_noauth/:id', async(req, res) => {
    const id = req.params.id
    const nwaste = await nwasteModel.findById(id)

    nwaste = {
        _id: nwaste._id,
        name: nwaste.name,
        photos: nwaste.photos,
        price: nwaste.price,
        used_for: nwaste.used_for,
        description: nwaste.description,
        pincode: nwaste.pincode,
        location: "Login to get full info",
        owner: "Login to get full info"
    }

    try{
        res.send(nwaste)
    }catch(e){
        res.status(400).send(e)
    }
})

//Route for sending all on sale nwastes by user
router.get('/all/me',auth,async(req,res) => {

    try{
        const all_nwaste = await nwasteModel.find({owner: req.user._id})
        res.status(200).send(all_nwaste)
    }catch(e){
        res.status(400).send(e)
    }

})

//Route for sending all nwastes on sale
router.get('/all', async(req, res)=>{

    try{
        const nwastes = await nwasteModel.find()
        let nwastes_mod = nwastes.map(nwaste => {return nwaste.toJSON()})        
        res.send(nwastes_mod)

    }catch(e){
        res.status(400).send(e)
    }
})

//Route for sending nwastes by location filter
router.get('/all/:pin', async(req, res) => {

    try{
        const nwastes = await nwasteModel.find({pincode:req.params.pin})
        
        let nwastes_mod = nwastes.map(nwaste => {return nwaste.toJSON()})        
        res.send(nwastes_mod)

    }catch(e){
        res.status(400).send(e)
    }
    
})

module.exports = router