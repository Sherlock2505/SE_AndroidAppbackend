const mongoose = require('mongoose')
const validator = require('validator')

const url = "mongodb+srv://taskapp:taskApp123@cluster0-f7gks.mongodb.net/SE_App?retryWrites=true&w=majority"

mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

const connection = mongoose.connection
connection.once('open',() => {
    console.log('Connection to Db is successful')
})

module.exports = connection