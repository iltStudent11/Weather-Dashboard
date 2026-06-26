import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchLocationPage from './SearchLocationPage'
import { LocationsProvider } from '../context/LocationsContext'

function renderSearchPage() {
  return render(
    <MemoryRouter initialEntries={['/search']}>
      <LocationsProvider>
        <Routes>
          <Route path="/search" element={<SearchLocationPage />} />
          <Route path="/location/:query" element={<p>Detail Route</p>} />
        </Routes>
      </LocationsProvider>
    </MemoryRouter>,
  )
}

describe('SearchLocationPage', () => {
  test('shows validation error when submitted without a location', async () => {
    const user = userEvent.setup()

    renderSearchPage()

    await user.click(screen.getByRole('button', { name: 'Add Location' }))

    expect(screen.getByText('Location is required.')).toBeInTheDocument()
  })

  test('submits a valid location and navigates to detail route', async () => {
    const user = userEvent.setup()

    renderSearchPage()

    await user.type(screen.getByLabelText('City or Zip Code'), 'Dover NH')
    await user.click(screen.getByRole('button', { name: 'Add Location' }))

    expect(screen.getByText('Detail Route')).toBeInTheDocument()
  })
})
