import { useState, useEffect} from 'react'
import axios from 'axios'
import Filter from './components/search'
import PersonForm from './components/person_Form'
import Persons from './components/Person'
import personService from './services/persons'
import noteService from './services/notes'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])

  const [newPerson, setNewPerson] = useState({
    name: '',
    number: ''
  })
  const [message, setMessage] = useState(null)

  const [isError, setIsError] = useState(false)

  useEffect(() => {
    personService.getAll().then(data => {
      setPersons(data)
    })
  }, [])

  
  const [searchTerm, setSearchTerm] = useState('')
  const handleSubmit = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name === newPerson.name)) {
      if (window.confirm(`${newPerson.name} is already added to phonebook, want to update the number?`)) {
        const personToUpdate = persons.find(person => person.name === newPerson.name)
        personService.update(personToUpdate.id, { ...personToUpdate, number: newPerson.number }).then(data => {
          setPersons(persons.map(person => person.id === data.id ? data : person))
        }).catch(error => {
          setIsError(true)
          setMessage(`Information of ${newPerson.name} has already been removed from server`)
          setTimeout(() => {
            setMessage(null)
            setIsError(false)
          }, 3000)
          setPersons(persons.filter(person => person.id !== personToUpdate.id))
        })
        setMessage(`Updated ${newPerson.name}'s number`)
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      }
    } else {
      setIsError(false)
      setMessage(`Added ${newPerson.name}`)
      setTimeout(() => {
        setMessage(null)
      }, 3000)
      setNewPerson({ name: '', number: '' })
      personService.create(newPerson).then(data => {
        setPersons(persons.concat(data))
      })
    }
  }
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login(newUser)
      window.localStorage.setItem('loggedPhonebookUser', JSON.stringify(user))
      noteService.setToken(user.token)
      setUser(user)
      setNewUser({ username: '', password: '' })
    } catch (error) {
      setIsError(true)
      setMessage('Wrong credentials')
      setTimeout(() => {
        setMessage(null)
        setIsError(false)
      }, 3000)
    }
  }

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this person?')) {
      return
    }
    personService.remove(id).then(() => {
      setPersons(persons.filter(person => person.id !== id))
    })
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} isError={isError} />
      <Filter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <h2>Add a new</h2>

      <PersonForm
        handleSubmit={handleSubmit}
        newPerson={newPerson}
        setNewPerson={setNewPerson}
      />

      <h2>Numbers</h2>

      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  )
}

export default App