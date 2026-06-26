import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LocationsPage from './LocationsPage'

describe('LocationsPage', () => {
  test('renders location links and handles delete action', async () => {
    const user = userEvent.setup()
    const onDeleteLocation = vi.fn()

    render(
      <MemoryRouter>
        <LocationsPage
          locations={['London', 'New York']}
          onDeleteLocation={onDeleteLocation}
        />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('link', {
        name: 'London',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', {
        name: 'New York',
      }),
    ).toBeInTheDocument()

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })
    await user.click(deleteButtons[0])

    expect(onDeleteLocation).toHaveBeenCalledWith('London')
  })
})
