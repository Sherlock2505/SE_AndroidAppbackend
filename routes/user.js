const express = require('express')
const router = new express.Router()
const User = require('../models/User.model')
const multer = require('multer')
const auth = require('../middleware/auth')
const upload = require('../db/upload')
const ewasteModel = require('../models/Ewaste.model')
const NwasteModel = require('../models/Notebooks.model')
const TwasteModel = require('../models/Textbooks.model')
const notesModel = require('../models/Notebooks.model')
const mongoose = require('mongoose')

//Route for getting profile of user
router.get('/me', auth, (req, res) => {
    res.send(req.user.toJSON())
})

//Route for viewing other's(owner) profile
router.get('/other/:id', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(user){
            const user_pub = {
                _id: user._id,
                name: user.name,
                dp_url: user.dp_url,
                phone: user.phone,
                email: user.email
            }
            res.status(200).send(user_pub)
        }else{
            throw new Error('No such user found')
        }
    }catch(e){
        res.status(400).send(e)
    }
    
})

//Route for sign up of user(creating user)
router.post('/create', upload.single('prof_pic'), async (req, res)=>{
    const user = new User(req.body)
    
    if(req.file!=undefined){
        user.dp_url = req.file.filename
    }

    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
})

//Route to login 
router.post('/login',async(req,res) => {
    
    try{
        const user = await User.findByCredentials(req.body.phone, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
    
})

//Route to Logout user
router.post('/logout', auth, async (req, res) => {

    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send()

    }catch(e){
        res.status(400).send(e)
    }
})

//Route to update user
//Route to update userjfubfbfu
router.patch('/update',auth, upload.single('prof_pic'), async (req, res) => {
    const updates = Object.keys(req.body)
    
    try{
        const user = req.user
        if(req.file){
            user.dp_url = req.file.filename
        }
        updates.forEach((update) => {
            user[update] = req.body[update]
        })

        await user.save()

        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }

})

//Route to add item to wishlist
router.post('/add/wishlist', auth, async (req, res) => {
    try{
        req.user.wishlist.push(req.body.item_id)
        await req.user.save()
        
        res.status(200).send("Successfull")
    }catch(e){
        res.status(400).send(e)
    }
})

//Route to remove item from wishlist
router.delete('/remove/wishlist', auth, async (req, res) => {

    try{
        const id = mongoose.Types.ObjectId(req.body.item_id);

        req.user.wishlist = req.user.wishlist.filter((item_id) => {
            return item_id.equals(id)===false
        })

        await req.user.save()
        res.status(200).send({msg:"Deleted item succesfully from wishlist"})
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }

})

//Route for getting the wishlist of user
router.get('/wishlist/me', auth,async (req, res) => {

    try{
        let items = []
        let removables = []
        const wishlist = req.user.wishlist
        for(let i=0;i<wishlist.length;i++){
            const item_id = wishlist[i]
            const ewaste = await ewasteModel.findById(item_id)
            const textbook = await ewasteModel.findById(item_id)
            const notebook = await notesModel.findById(item_id)
            
            if((ewaste || textbook || notebook)){
                items.push((ewaste || textbook || notebook).toObject())
            }else{
                removables.push(item_id)
            }
        }
        req.user.wishlist = req.user.wishlist.filter((item_id) => {
            return removables.includes(item_id)===false
        })
        await req.user.save()
        res.send(items)
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }
    
})

module.exports = router
