import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import { LocationsProvider } from './context/LocationsContext'
import LocationDetailPage from './pages/LocationDetailPage'
import LocationsPage from './pages/LocationsPage'
import NotFoundPage from './pages/NotFoundPage'
import SearchLocationPage from './pages/SearchLocationPage'

function App() {
  return (
    <LocationsProvider>
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
          <Route path="/" element={<LocationsPage />} />
          <Route path="/location/:query" element={<LocationDetailPage />} />
          <Route path="/search" element={<SearchLocationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </LocationsProvider>
  )
}

export default App
