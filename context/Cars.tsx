import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useLocalStorage } from '@mantine/hooks';

type CarImages = string[]; // Assuming images are URLs

export type Car = {
  model: string;
  description: string;
  year: number;
  price: number;
  color: string;
  images: CarImages;
};

type CarContextType = {
  cars: Car[];
  addCar: (car: Car, onAdded?: () => void) => void;
};

const CarContext = createContext<CarContextType>({
  cars: [],
  addCar: () => {},
});

export const CarProvider = ({ children }: { children: ReactNode }) => {
  const [cars, setCars] = useLocalStorage<Car[]>({
    key: 'cars',
    defaultValue: [],
  });

  const addCar = useCallback((newCar: Car, onAdded?: () => void) => {
    console.log('Adding car:', newCar);
    setCars((prevCars) => {
      const updatedCars = [...prevCars, newCar];
      console.log('Updated cars list:', updatedCars);
      return updatedCars;
    });
    if (onAdded) {
      onAdded();
    }
  }, [setCars]);

  return (
    <CarContext.Provider value={{ cars, addCar }}>
      {children}
    </CarContext.Provider>
  );
};

export const useCar = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCar must be used within a CarProvider');
  }
  return context;
};
