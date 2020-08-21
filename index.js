const express = require('express')
//Models exported
const User = require('./models/User.model')
const Textbook = require('./models/Textbooks.model')
const Notebook = require('./models/Notebooks.model')
const Ewaste = require('./models/Ewaste.model')
//Routes exported
const userRouter = require('./routes/user')
const imageRouter = require('./routes/supporting/images')

const connection = require('./db/mongoose')
const mongoose = require('mongoose')
const app = express()

app.use(express.json())
app.use('/users',userRouter)
app.use('/images',imageRouter)

const port = 3000
app.listen(port, () => {
    console.log('Server is up at port '+port)
})

let gfs
connection.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(connection.db, { bucketName: 'uploads' })
  app.locals.gfs = gfs
})
