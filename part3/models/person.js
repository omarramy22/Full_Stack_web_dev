require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MongoDB_URI
mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 }).then(() => {
  console.log('connected to MongoDB')
}).catch((error) => {
  console.log('error connecting to MongoDB:', error.message)
})


const phoneSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 100
  },
  number: {
    type: String,
    minlength: 4,
    maxlength: 100
  }
})

phoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', phoneSchema)