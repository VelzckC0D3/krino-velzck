import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '@mantine/hooks';

// Define the structure of a car object.
export type Car = {
  id: string;
  make: string;
  model: string;
  color: string;
};

// Define the context type.
type CarsContextType = {
  displayCars: Car[];
  addCar: (car: Car) => void;
  getCars: () => Car[];
};

// Initialize the context with default values.
const CarsContext = createContext<CarsContextType>({
  displayCars: [],
  addCar: () => {},
  getCars: () => [],
});

export const CarsProvider = ({ children }: { children: React.ReactNode }) => {
  // Use local storage to persist the cars array under 'displayCars'.
  const [displayCars, setDisplayCars] = useLocalStorage<Car[]>({
    key: 'displayCars',
    defaultValue: [],
  });

  // Function to add a new car to the display list.
  const addCar = (newCar: Car) => {
    setDisplayCars((prevCars) => [...prevCars, newCar]);
  };

  // Function to get the list of cars.
  const getCars = () => displayCars;

  return (
    <CarsContext.Provider value={{ displayCars, addCar, getCars }}>
      {children}
    </CarsContext.Provider>
  );
};

// Hook to use the CarsContext.
export const useCars = () => {
  const context = useContext(CarsContext);
  if (!context) {
    throw new Error('useCars must be used within a CarsProvider');
  }
  return context;
};

export default CarsContext;
