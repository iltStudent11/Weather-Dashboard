import { useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import LocationDetailPage from './pages/LocationDetailPage'
import LocationsPage from './pages/LocationsPage'
import NotFoundPage from './pages/NotFoundPage'
import SearchLocationPage from './pages/SearchLocationPage'

const INITIAL_LOCATIONS = ['London', 'New York', '03827']

function App() {
  const [locations, setLocations] = useState(INITIAL_LOCATIONS)

  const handleAddLocation = (locationToAdd) => {
    setLocations((previousLocations) => {
      const alreadyExists = previousLocations.some(
        (existingLocation) =>
          existingLocation.toLowerCase() === locationToAdd.toLowerCase(),
      )

      if (alreadyExists) {
        return previousLocations
      }

      return [...previousLocations, locationToAdd]
    })
  }

  const handleEditLocation = (originalLocation, updatedLocation) => {
    setLocations((previousLocations) => {
      const originalIndex = previousLocations.findIndex(
        (existingLocation) =>
          existingLocation.toLowerCase() === originalLocation.toLowerCase(),
      )

      if (originalIndex === -1) {
        return previousLocations
      }

      const duplicateIndex = previousLocations.findIndex(
        (existingLocation) =>
          existingLocation.toLowerCase() === updatedLocation.toLowerCase(),
      )

      if (duplicateIndex !== -1 && duplicateIndex !== originalIndex) {
        return previousLocations.filter((_, index) => index !== originalIndex)
      }

      const nextLocations = [...previousLocations]
      nextLocations[originalIndex] = updatedLocation
      return nextLocations
    })
  }

  const handleDeleteLocation = (locationToDelete) => {
    setLocations((previousLocations) =>
      previousLocations.filter(
        (existingLocation) =>
          existingLocation.toLowerCase() !== locationToDelete.toLowerCase(),
      ),
    )
  }

  return (
    <main className="dashboard">
      <header className="app-header">
        <h1>Weather Dashboard</h1>
        <nav className="app-nav" aria-label="Main navigation">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
            end
          >
            Locations
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            Add
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <LocationsPage
              locations={locations}
              onDeleteLocation={handleDeleteLocation}
            />
          }
        />
        <Route path="/location/:query" element={<LocationDetailPage />} />
        <Route
          path="/search"
          element={
            <SearchLocationPage
              onAddLocation={handleAddLocation}
              onEditLocation={handleEditLocation}
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  )
}

export default App
