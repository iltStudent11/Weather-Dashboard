import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchLocationPage from './SearchLocationPage'

function renderSearchPage({ onAddLocation = vi.fn(), onEditLocation = vi.fn() } = {}) {
  return render(
    <MemoryRouter initialEntries={['/search']}>
      <Routes>
        <Route
          path="/search"
          element={
            <SearchLocationPage
              onAddLocation={onAddLocation}
              onEditLocation={onEditLocation}
            />
          }
        />
        <Route path="/location/:query" element={<p>Detail Route</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('SearchLocationPage', () => {
  test('shows validation error when submitted without a location', async () => {
    const user = userEvent.setup()
    const onAddLocation = vi.fn()

    renderSearchPage({ onAddLocation })

    await user.click(screen.getByRole('button', { name: 'Add Location' }))

    expect(screen.getByText('Location is required.')).toBeInTheDocument()
    expect(onAddLocation).not.toHaveBeenCalled()
  })

  test('submits a valid location and navigates to detail route', async () => {
    const user = userEvent.setup()
    const onAddLocation = vi.fn()

    renderSearchPage({ onAddLocation })

    await user.type(screen.getByLabelText('City or Zip Code'), 'Dover NH')
    await user.click(screen.getByRole('button', { name: 'Add Location' }))

    expect(onAddLocation).toHaveBeenCalledWith('Dover NH')
    expect(screen.getByText('Detail Route')).toBeInTheDocument()
  })
})
