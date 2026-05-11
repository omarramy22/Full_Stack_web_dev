import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/name'
const allCountriesUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather'
const API_KEY = 'API_KEY' // Note: In a production environment, the API key should be stored securely and not hardcoded in the source code, but for the sake of this exercise, we will keep it here.

// replace the API_KEY with your actual OpenWeatherMap API key before running the application.

const getAllCountries = () => {
  return axios.get(allCountriesUrl).then(response => response.data)
}

const getCountry = (name) => {
  return axios.get(`${baseUrl}/${name}`).then(response => response.data[0])
}

const getWeather = (city) => {
  return axios.get(`${weatherUrl}?q=${city}&appid=${API_KEY}&units=metric`).then(response => response.data)
}


export default { getAllCountries, getCountry, getWeather } 


