import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LocationsPage from './LocationsPage'
import { LocationsProvider } from '../context/LocationsContext'

describe('LocationsPage', () => {
  test('renders location links and handles delete action', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <LocationsProvider>
          <LocationsPage />
        </LocationsProvider>
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('link', {
        name: 'London',
      }),
    ).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'New York' })).toBeInTheDocument()

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })
    await user.click(deleteButtons[0])

    expect(screen.queryByRole('link', { name: 'London' })).not.toBeInTheDocument()
  })
})
