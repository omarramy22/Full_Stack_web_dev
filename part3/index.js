require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())


const Person = require('./models/person')


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/info', (req, res) => {
  const date = new Date()
  Person.countDocuments().then(count => {
    res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
  })
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        res.json(result)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => {
    next(error)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(() => {
    response.status(204).end()
  })
  .catch(error => {
    next(error)
  })
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  Person.findOne({ name: body.name }).then(result => {
    if (result) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => {
        next(error)
    })
})
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const { name, number } = request.body
    if (!number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }
    Person.findById(id).then(result => {
      if (!result) {
        return response.status(404).json({
            error: 'person not found'
        })
        }
        result.number = number
        return result.save().then(updatedPerson => {
            response.json(updatedPerson)
        })
    })
    .catch(error => {
        next(error)
    }
)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})  