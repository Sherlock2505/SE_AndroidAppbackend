const express = require('express')
const router = new express.Router()
const User = require('../models/User.model')
const multer = require('multer')
const auth = require('../middleware/auth')
const upload = require('../db/upload')
const ewasteModel = require('../models/Ewaste.model')
const NwasteModel = require('../models/Notebooks.model')
const TwasteModel = require('../models/Textbooks.model')
const { array } = require('../db/upload')

//Route for getting profile of user
router.get('/me', auth, (req, res) => {
    res.send(req.user.toJSON())
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
router.patch('/update',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    
    try{
        const user = req.user

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
router.post('/wishlist/:id', auth, async (req, res) => {
    try{
        req.user.wishlist.push(req.params.id)
        await req.user.save()
    }catch(e){
        res.status(400).send(e)
    }
})

//Route for getting the wishlist of user
router.get('/wishlist', auth, async (req, res) => {

    let items = []

    req.user.wishlist.map(async (item_id) => {
        item = await ewasteModel.findById(item_id)
        if(!item){
            item = await NwasteModel.findById(item_id)
        }
        if(!item){
            item = await TwasteModel.findById(item_id)
        }
        items.push(item)
    })
    
    res.send(items)
})

module.exports = router