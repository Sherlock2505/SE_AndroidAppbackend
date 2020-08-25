const jwt = require('jsonwebtoken')
const User = require('../models/User.model.js')

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user){
            throw new Error()
        }

        req.user = user
        req.token = token
        next()
    }catch(e){
        // console.log(e)
        // console.log(req.baseUrl)
        if(req.url.split("/").length > 2 && req.url.split("/")[1] == "view"){
            res.redirect(`${req.baseUrl}/view_noauth/${req.params.id}`)
        }
        else{
            res.status(401).send({error: 'Please authenticate.' })    
        }
    }
}

module.exports = auth