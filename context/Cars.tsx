import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '@mantine/hooks';

// Define the structure of a car object.

export type Car = {
  model: string;
  images: string[];
  description: string;
  price: number;
  year: number;
  color: string;
  id: string;
};

// Define the context type.
type CarsContextType = {
  displayCars: Car[];
  addCar: (car: Car) => void;
  replaceCars: (newCars: Car[]) => void;
};

// Initialize the context with default values.
const CarsContext = createContext<CarsContextType>({
  displayCars: [],
  addCar: () => {},
  replaceCars: () => {},
});

export const CarsProvider = ({ children }: { children: React.ReactNode }) => {
  const [displayCars, setDisplayCars] = useLocalStorage<Car[]>({
    key: 'displayCars',
    defaultValue: [],
  });

  const addCar = (newCar: Car) => {
    console.log('Adding car:', newCar); // Log the car being added
    setDisplayCars((prevCars) => {
      // Ensure prevCars is always an array
      const updatedCars = Array.isArray(prevCars) ? [...prevCars, newCar] : [newCar];
      console.log('Updated cars:', updatedCars); // Log the updated list of cars
      return updatedCars;
    });
  };

  const replaceCars = (newCars: Car[]) => {
    console.log('Replacing cars with:', newCars); // Log the new list of cars
    setDisplayCars(newCars);
  };

  return (
    <CarsContext.Provider value={{ displayCars, addCar, replaceCars }}>
      {children}
    </CarsContext.Provider>
  );
};

export const useCars = () => {
  const context = useContext(CarsContext);
  if (!context) {
    throw new Error('useCars must be used within a CarsProvider');
  }
  return context;
};

export default CarsContext;
