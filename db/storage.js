const crypto = require('crypto')
const path = require('path')
const GridFsStorage = require('multer-gridfs-storage')
// const uri = process.env.URI
const uri = "mongodb+srv://taskapp:taskApp123@cluster0-f7gks.mongodb.net/SE_App?retryWrites=true&w=majority"

const storage = new GridFsStorage({
    url: uri,
    file: (req, file) => {
      return new Promise((resolve, reject) => {

        crypto.randomBytes(16, (err, buf) => {
            if (err) {
                return reject(err)
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            // console.log(filename)
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
            }
            resolve(fileInfo)
        })
      })
    }
})

module.exports = storage