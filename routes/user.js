const express = require('express')
const router = new express.Router()
const User = require('../models/User.model')
const multer = require('multer')
const auth = require('../middleware/auth')
const upload = require('../db/upload')
const ewasteModel = require('../models/Ewaste.model')
const nwasteModel = require('../models/Notebooks.model')
const twasteModel = require('../models/Textbooks.model')
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
router.post('/create', async (req, res)=>{
    const user = new User(req.body)

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
router.patch('/update', auth, upload.single('prof_pic'), async (req, res) => {
    const updates = Object.keys(req.body)
    const user = req.user

    if(req.file){
        user.dp_url = req.file.filename
    }

    try{
        
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
    let item_id = req.body.item_id
    try{
        const ewaste = await ewasteModel.findById(item_id)
        const textbook = await twasteModel.findById(item_id)
        const notebook = await nwasteModel.findById(item_id)
        
        if(ewaste && ewaste.owner._id.equals(req.user._id)){
            throw new Error('Seller of the item cannot wishlist the item')
        }else if(textbook && textbook.owner._id.equals(req.user._id)){
            throw new Error('Seller of the item cannot wishlist the item')
        }else if(notebook && notebook.owner._id.equals(req.user._id)){
            throw new Error('Seller of the item cannot wishlist the item')
        }

        if(req.user.wishlist.includes(item_id)){
            throw new Error('item already exists in wishlist')
        }
        req.user.wishlist.push(item_id)
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
            const textbook = await twasteModel.findById(item_id)
            const notebook = await nwasteModel.findById(item_id)
            
            let new_Obj
            if(ewaste){
                new_Obj = ewaste.toJSON()
                delete new_Obj.photos
                new_Obj.category = 'ewaste'
                items.push(new_Obj)
            }else if(textbook){
                new_Obj = textbook.toJSON()
                delete new_Obj.photos
                new_Obj.category = 'twaste'
                items.push(new_Obj)
            }else if(notebook){
                new_Obj = notebook.toJSON()
                delete new_Obj.photos
                new_Obj.category = 'nwaste'
                items.push(new_Obj)
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
