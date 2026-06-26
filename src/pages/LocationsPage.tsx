import { Link } from 'react-router-dom'
import { useLocationsContext } from '../context/LocationsContext'

interface LocationRowProps {
  location: string
  onDelete: (location: string) => void
}

function LocationRow({ location, onDelete }: LocationRowProps) {
  return (
    <li className="location-item">
      <Link className="location-link" to={`/location/${encodeURIComponent(location)}`}>
        {location}
      </Link>
      <div className="location-actions">
        <Link className="location-edit-link" to={`/search?edit=${encodeURIComponent(location)}`}>
          Edit
        </Link>
        <button
          type="button"
          className="location-delete-button"
          onClick={() => onDelete(location)}
        >
          Delete
        </button>
      </div>
    </li>
  )
}

function LocationsPage() {
  const { locations, deleteLocation } = useLocationsContext()

  return (
    <section className="page-section">
      <h1>Weather Locations</h1>
      <p>Choose a location to view current weather details.</p>

      <ul className="location-list">
        {locations.map((location) => (
          <LocationRow key={location} location={location} onDelete={deleteLocation} />
        ))}
      </ul>
    </section>
  )
}

export default LocationsPage
