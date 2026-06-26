import { Link } from 'react-router-dom'

function LocationsPage({ locations, onDeleteLocation }) {
  return (
    <section className="page-section">
      <h1>Weather Locations</h1>
      <p>Choose a location to view current weather details.</p>

      <ul className="location-list">
        {locations.map((location) => (
          <li key={location} className="location-item">
            <Link className="location-link" to={`/location/${encodeURIComponent(location)}`}>
              {location}
            </Link>
            <div className="location-actions">
              <Link
                className="location-edit-link"
                to={`/search?edit=${encodeURIComponent(location)}`}
              >
                Edit
              </Link>
              <button
                type="button"
                className="location-delete-button"
                onClick={() => onDeleteLocation(location)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default LocationsPage