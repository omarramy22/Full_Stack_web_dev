import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = () => {
  return axios.get(baseUrl).then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)
}

export default { getAll, create, update, setToken}