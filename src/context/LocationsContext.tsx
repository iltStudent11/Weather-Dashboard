import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

interface LocationsContextValue {
  locations: string[]
  addLocation: (locationToAdd: string) => void
  editLocation: (originalLocation: string, updatedLocation: string) => void
  deleteLocation: (locationToDelete: string) => void
}

interface LocationsProviderProps {
  children: ReactNode
}

const INITIAL_LOCATIONS = ['London', 'New York', '03827']

const LocationsContext = createContext<LocationsContextValue | undefined>(undefined)

export function LocationsProvider({ children }: LocationsProviderProps) {
  const [locations, setLocations] = useState<string[]>(INITIAL_LOCATIONS)

  const addLocation = (locationToAdd: string) => {
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

  const editLocation = (originalLocation: string, updatedLocation: string) => {
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

  const deleteLocation = (locationToDelete: string) => {
    setLocations((previousLocations) =>
      previousLocations.filter(
        (existingLocation) =>
          existingLocation.toLowerCase() !== locationToDelete.toLowerCase(),
      ),
    )
  }

  const value = useMemo(
    () => ({
      locations,
      addLocation,
      editLocation,
      deleteLocation,
    }),
    [locations],
  )

  return <LocationsContext.Provider value={value}>{children}</LocationsContext.Provider>
}

export function useLocationsContext() {
  const context = useContext(LocationsContext)

  if (!context) {
    throw new Error('useLocationsContext must be used within a LocationsProvider')
  }

  return context
}
