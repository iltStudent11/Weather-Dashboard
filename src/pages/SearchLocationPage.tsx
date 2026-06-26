import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLocationsContext } from '../context/LocationsContext'

interface SearchFormData {
  location: string
}

interface SearchFormErrors {
  location?: string
}

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function SearchLocationPage() {
  const [formData, setFormData] = useState<SearchFormData>({
    location: '',
  })
  const [errors, setErrors] = useState<SearchFormErrors>({})
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addLocation, editLocation } = useLocationsContext()

  const editParam = searchParams.get('edit')
  const locationToEdit = editParam ? safeDecodeURIComponent(editParam) : ''
  const isEditMode = Boolean(locationToEdit)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }))

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: undefined,
    }))
  }

  const validateForm = (): SearchFormErrors => {
    const nextErrors: SearchFormErrors = {}
    const trimmedLocation = formData.location.trim()

    if (!trimmedLocation) {
      nextErrors.location = 'Location is required.'
    }

    return nextErrors
  }

  useEffect(() => {
    if (isEditMode) {
      setFormData((previousFormData) => ({
        ...previousFormData,
        location: locationToEdit,
      }))
      setErrors({})
    }
  }, [isEditMode, locationToEdit])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validationErrors = validateForm()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const trimmedQuery = formData.location.trim()

    if (isEditMode) {
      editLocation(locationToEdit, trimmedQuery)
    } else {
      addLocation(trimmedQuery)
    }

    navigate(`/location/${encodeURIComponent(trimmedQuery)}`)
  }

  return (
    <section className="page-section">
      <h1>{isEditMode ? 'Edit Location' : 'Add Location'}</h1>
      <p>
        {isEditMode
          ? 'Update the city name or U.S. zip code and save your changes.'
          : 'Enter a city name or U.S. zip code to add a location.'}
      </p>

      <form className="search-form" onSubmit={handleSubmit}>
        <label htmlFor="search-input">City or Zip Code</label>
        <input
          id="search-input"
          name="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter city or zip code"
        />
        {errors.location && <p className="message error">{errors.location}</p>}

        <button type="submit">{isEditMode ? 'Save Changes' : 'Add Location'}</button>
      </form>
    </section>
  )
}

export default SearchLocationPage
