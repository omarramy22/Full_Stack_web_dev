import { useState, useEffect} from 'react'
import axios from 'axios'
import Filter from './components/search'
import countriesService from './services/countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countriesService.getAllCountries().then(data => {
      setCountries(data)
    })
  }, [])

  const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    if (search) {
      if (filteredCountries.length === 1) 
        countriesService.getWeather(filteredCountries[0].capital).then(data => {
          setWeather(data)
        })
    }
  }, [filteredCountries])


  return (
    <div>
      <Filter searchTerm={search} setSearchTerm={setSearch} />
      <h2>Countries</h2>
      {filteredCountries.length === 0 && <p>No matches found.</p>}
      {filteredCountries.length === 1 && (
        <div>
          <h3>{filteredCountries[0].name.common}</h3>
          <p>Capital: {filteredCountries[0].capital}</p>
          <p>Population: {filteredCountries[0].population}</p>
          <p>Languages: {Object.values(filteredCountries[0].languages).join(', ')}</p>
          <p>Area: {filteredCountries[0].area}</p>
          <img src={filteredCountries[0].flags.png} alt={`Flag of ${filteredCountries[0].name.common}`} width="150" />
        </div>
      )}
      {filteredCountries.length < 10 ? (
        filteredCountries.map(country => (
          <div key={country.cca3}>
            {country.name.common} <button onClick={() => setSearch(country.name.common)}>show</button>
          </div>
        ))
      ) : (
        <p>Too many matches. Please be more specific.</p>
      )}
      {filteredCountries.length === 1 && (
        <div>
          <h3>Weather in {filteredCountries[0].capital}</h3>
          <p>Temperature: {weather?.main.temp} °C</p>
          <p>Wind: {weather?.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}
export default App