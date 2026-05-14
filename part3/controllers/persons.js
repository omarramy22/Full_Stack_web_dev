const Person = require('../models/person')
const PersonRouter = require('express').Router()

PersonRouter.get('/', (req, res) => {
    Person.find({}).then(result => {
        res.json(result)
    })
})

PersonRouter.get('/:id', (request, response, next) => {
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

PersonRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(() => {
    response.status(204).end()
  })
  .catch(error => {
    next(error)
  })
})


PersonRouter.post('/', (request, response, next) => {
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

PersonRouter.put('/:id', (request, response, next) => {
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

export default PersonRouter