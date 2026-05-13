const mongoose = require('mongoose')
require('dotenv').config()

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const url = process.env.MongoDB_URI
mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', phoneSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
else if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]
 const person = new Person({
    name: name,
    number: number,
  })
  person.save().then(result => {
    console.log(`Added ${person.name} with number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}
else {
  console.log('invalid number of arguments')
  process.exit(1)
}
