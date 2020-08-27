const express = require('express')
const ewasteModel = require('../models/Ewaste.model')
const router = new express.Router()
const auth = require('../middleware/auth')
const upload = require('../db/upload')

//Route for creating e-waste product
router.post('/create',auth, upload.fields([{name:'thumbnail', maxCount:1},{name:'gallery', maxCount:8}]),async (req, res) => {
    const ewaste = new ewasteModel(req.body)
    ewaste.owner = req.user._id

    try{
        if(req.files){
            let all_file = req.files['gallery']
            const thumbnail_pic = req.files['thumbnail'][0].filename
            pics_url = all_file.map((file) => {return file.filename})
            ewaste.photos = pics_url
            ewaste.thumbnail = thumbnail_pic
        }
        await ewaste.save()
        res.status(201).send(ewaste)
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }

})

//Route for deleting ewaste product
router.post('/delete/:id',auth,async (req, res)=> {
    
    const id = req.params.id

    try{
        const ewaste = await ewasteModel.find({owner:req.user._id,id:_id})
        if(ewaste){
            await ewasteModel.deleteOne({_id:id})
            res.status(200).send(ewastes)
        }else{
            throw new Error('Only owner can delete item on sale')
        }
    }catch(e){
        res.status(400).send(e)
    }

})

//Route for viewing individual ewaste (authenticated)
router.get('/view/:id',auth, async(req, res) => {
    const id = req.params.id
    const ewaste = await ewasteModel.findById(id)
    // console.log(ewaste)
    try{
        res.send(ewaste)
    }catch(e){
        res.status(400).send(e)
    }
})

//Route for viewing individual ewaste (not authenticated)
//Seller info will not be available to user
router.get('/view_noauth/:id', async(req, res) => {
    const id = req.params.id
    try{
        let ewaste = await ewasteModel.findById(id)

        ewaste = {
            _id: ewaste._id,
            name: ewaste.name,
            thumbnail: ewaste.thumbnail,
            price: ewaste.price,
            used_for: ewaste.used_for,
            specifications: ewaste.specifications,
            pincode: ewaste.pincode,
            location: "Login to get full info",
            owner: "Login to get full info"
        }

        res.send(ewaste)
    
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

//Route for sending all on sale ewastes by user
router.get('/all/me',auth,async(req,res) => {

    try{
        const all_ewaste = await ewasteModel.find({owner: req.user._id})
        // const ewastes = all_ewaste.map(ewaste => ewaste.toObject())
        res.send(all_ewaste)
    }catch(e){
        res.status(400).send(e)
    }

})

//Route for sending all ewastes on sale
router.get('/all', async(req, res)=>{

    try{
        const ewastes = await ewasteModel.find()
        let ewastes_mod = ewastes.map(ewaste => {return ewaste.toJSON()})        
        res.send(ewastes_mod)

    }catch(e){
        res.status(400).send(e)
    }
})

//Route for sending e-wastes by location filter
router.get('/all/:pin', async(req, res) => {

    try{
        const ewastes = await ewasteModel.find({pincode:req.params.pin})
        
        let ewastes_mod = ewastes.map(ewaste => {return ewaste.toJSON()})        
        res.send(ewastes_mod)

    }catch(e){
        res.status(400).send(e)
    }
    
})

module.exports = router