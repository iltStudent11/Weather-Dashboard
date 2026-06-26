import { useEffect, useState } from 'react'
import './App.css'

const WEATHER_CODE_LABELS = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
}

const US_ZIP_CODE_PATTERN = /^\d{5}(?:-\d{4})?$/

function App() {
  const [city, setCity] = useState('London')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchWeather = async (location) => {
    setIsLoading(true)
    setError('')

    try {
      const isZipCode = US_ZIP_CODE_PATTERN.test(location)
      let selectedLocation

      if (isZipCode) {
        const zipCode = location.slice(0, 5)
        const zipResponse = await fetch(
          `https://api.zippopotam.us/us/${encodeURIComponent(zipCode)}`,
        )

        if (!zipResponse.ok) {
          throw new Error('U.S. zip code not found. Please try another zip code.')
        }

        const zipData = await zipResponse.json()
        const zipPlace = zipData.places?.[0]

        if (!zipPlace) {
          throw new Error('U.S. zip code not found. Please try another zip code.')
        }

        selectedLocation = {
          name: `${zipPlace['place name']}, ${zipPlace['state abbreviation']}`,
          country: 'United States',
          latitude: Number(zipPlace.latitude),
          longitude: Number(zipPlace.longitude),
        }
      } else {
        const geocodeResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`,
        )
        const geocodeData = await geocodeResponse.json()
        const selectedCity = geocodeData.results?.[0]

        if (!selectedCity) {
          throw new Error('City not found. Please try another search.')
        }

        selectedLocation = selectedCity
      }

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${selectedLocation.latitude}&longitude=${selectedLocation.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&timezone=auto`,
      )
      const weatherData = await weatherResponse.json()

      setWeather({
        city: selectedLocation.name,
        country: selectedLocation.country,
        ...weatherData.current,
      })
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to fetch weather data.',
      )
      setWeather(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather('London')
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!city.trim()) {
      setError('Please enter a city or U.S. zip code.')
      setWeather(null)
      return
    }

    fetchWeather(city.trim())
  }

  return (
    <main className="dashboard">
      <h1>Weather Dashboard</h1>

      <form className="search-form" onSubmit={handleSubmit}>
        <label htmlFor="city-input">City or Zip Code</label>
        <input
          id="city-input"
          type="text"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Enter city or zip code"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Get Weather'}
        </button>
      </form>

      {error && <p className="message error">{error}</p>}

      {weather && (
        <section className="weather-card" aria-live="polite">
          <h2>
            {weather.city}, {weather.country}
          </h2>
          <p>{WEATHER_CODE_LABELS[weather.weather_code] ?? 'Unknown conditions'}</p>
          <dl>
            <div>
              <dt>Temperature</dt>
              <dd>{weather.temperature_2m}°F</dd>
            </div>
            <div>
              <dt>Humidity</dt>
              <dd>{weather.relative_humidity_2m}%</dd>
            </div>
            <div>
              <dt>Wind Speed</dt>
              <dd>{weather.wind_speed_10m} km/h</dd>
            </div>
          </dl>
        </section>
      )}
    </main>
  )
}

export default App
