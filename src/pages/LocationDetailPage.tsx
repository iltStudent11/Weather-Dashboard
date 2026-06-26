import { Link, useParams } from 'react-router-dom'
import { useWeather } from '../hooks/useWeather'
import { WEATHER_CODE_LABELS } from '../services/weatherApi'

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function LocationDetailPage() {
  const { query = '' } = useParams()
  const decodedQuery = safeDecodeURIComponent(query)
  const { status, weather, error } = useWeather(decodedQuery)

  return (
    <section className="page-section">
      <h1>Location Detail</h1>
      <p>Showing weather for: {decodedQuery}</p>

      {status === 'loading' && <p className="message">Loading weather data...</p>}

      {status === 'error' && <p className="message error">{error}</p>}

      {status === 'success' && weather && (
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

      <p>
        <Link to="/">Back to locations</Link>
      </p>
    </section>
  )
}

export default LocationDetailPage
