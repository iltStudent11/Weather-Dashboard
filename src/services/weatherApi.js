export const WEATHER_CODE_LABELS = {
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

const US_STATE_ABBREVIATIONS = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
  DC: 'District of Columbia',
}

const US_STATE_NAMES_TO_ABBREVIATIONS = Object.fromEntries(
  Object.entries(US_STATE_ABBREVIATIONS).map(([abbreviation, name]) => [
    name.toLowerCase(),
    abbreviation,
  ]),
)

function normalizeText(value) {
  return value.trim().toLowerCase().replace(/\./g, '')
}

function parseUsCityStateInput(searchTerm) {
  const normalizedSearchTerm = searchTerm.trim().replace(/\s+/g, ' ')
  const commaPatternMatch = normalizedSearchTerm.match(/^(.+?),\s*([A-Za-z ]+)$/)
  const spacePatternMatch = normalizedSearchTerm.match(/^(.+)\s+([A-Za-z]{2})$/)

  let cityPart
  let statePart

  if (commaPatternMatch) {
    cityPart = commaPatternMatch[1].trim()
    statePart = commaPatternMatch[2].trim()
  } else if (spacePatternMatch) {
    cityPart = spacePatternMatch[1].trim()
    statePart = spacePatternMatch[2].trim()
  } else {
    return null
  }

  const uppercaseStatePart = statePart.toUpperCase()

  if (US_STATE_ABBREVIATIONS[uppercaseStatePart]) {
    return {
      cityQuery: cityPart,
      stateAbbreviation: uppercaseStatePart,
      stateName: US_STATE_ABBREVIATIONS[uppercaseStatePart],
    }
  }

  const normalizedStateName = normalizeText(statePart)
  const stateAbbreviation = US_STATE_NAMES_TO_ABBREVIATIONS[normalizedStateName]

  if (!stateAbbreviation) {
    return null
  }

  return {
    cityQuery: cityPart,
    stateAbbreviation,
    stateName: US_STATE_ABBREVIATIONS[stateAbbreviation],
  }
}

async function resolveLocation(searchTerm) {
  const isZipCode = US_ZIP_CODE_PATTERN.test(searchTerm)
  const usCityStateInput = parseUsCityStateInput(searchTerm)

  if (isZipCode) {
    const zipCode = searchTerm.slice(0, 5)
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

    return {
      city: `${zipPlace['place name']}, ${zipPlace['state abbreviation']}`,
      country: 'United States',
      latitude: Number(zipPlace.latitude),
      longitude: Number(zipPlace.longitude),
    }
  }

  if (usCityStateInput) {
    const geocodeResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(usCityStateInput.cityQuery)}&count=10&language=en&format=json&countryCode=US`,
    )

    if (!geocodeResponse.ok) {
      throw new Error('Unable to fetch location details.')
    }

    const geocodeData = await geocodeResponse.json()
    const stateMatchedCity = geocodeData.results?.find(
      (result) => normalizeText(result.admin1 ?? '') === normalizeText(usCityStateInput.stateName),
    )

    if (!stateMatchedCity) {
      throw new Error(
        `City not found in ${usCityStateInput.stateName}. Please try another search.`,
      )
    }

    return {
      city: `${stateMatchedCity.name}, ${usCityStateInput.stateAbbreviation}`,
      country: stateMatchedCity.country,
      latitude: Number(stateMatchedCity.latitude),
      longitude: Number(stateMatchedCity.longitude),
    }
  }

  const geocodeResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchTerm)}&count=1&language=en&format=json`,
  )

  if (!geocodeResponse.ok) {
    throw new Error('Unable to fetch location details.')
  }

  const geocodeData = await geocodeResponse.json()
  const selectedCity = geocodeData.results?.[0]

  if (!selectedCity) {
    throw new Error('City not found. Please try another search.')
  }

  return {
    city: selectedCity.name,
    country: selectedCity.country,
    latitude: Number(selectedCity.latitude),
    longitude: Number(selectedCity.longitude),
  }
}

export async function fetchWeatherByLocation(searchTerm) {
  const location = await resolveLocation(searchTerm)

  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&timezone=auto`,
  )

  if (!weatherResponse.ok) {
    throw new Error('Unable to fetch weather data.')
  }

  const weatherData = await weatherResponse.json()

  return {
    city: location.city,
    country: location.country,
    ...weatherData.current,
  }
}