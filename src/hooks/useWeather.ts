import { useEffect, useState } from 'react'
import { fetchWeatherByLocation, type WeatherData } from '../services/weatherApi'

type WeatherStatus = 'loading' | 'success' | 'error'

interface UseWeatherResult {
  status: WeatherStatus
  weather: WeatherData | null
  error: string
}

export function useWeather(query: string): UseWeatherResult {
  const [status, setStatus] = useState<WeatherStatus>('loading')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCancelled = false

    const loadWeather = async () => {
      setStatus('loading')
      setError('')

      try {
        const weatherData = await fetchWeatherByLocation(query)

        if (!isCancelled) {
          setWeather(weatherData)
          setStatus('success')
        }
      } catch (requestError) {
        if (!isCancelled) {
          setWeather(null)
          setStatus('error')
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Unable to fetch weather data.',
          )
        }
      }
    }

    loadWeather()

    return () => {
      isCancelled = true
    }
  }, [query])

  return {
    status,
    weather,
    error,
  }
}
