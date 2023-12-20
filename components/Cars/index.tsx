import React from 'react';
import { Box } from '@mantine/core';
import { useCars } from '@/context/Cars'; // Import the useCars hook
import classes from './Cars.module.css'; // You may need to create or update CSS for car display

function CarDisplay() {
  const { displayCars } = useCars(); // Use the useCars hook to access the cars

  return (
    <Box className={classes.box}>
      {displayCars.length > 0 ? (
        displayCars.map((car, index) => (
          <div key={index} className={classes.carItem}>
            <h3>Modelo: {car.model}</h3>
            <p>Descripcion: {car.description}</p>
            <p>Color: {car.color}</p>
            <p>Año: {car.year}</p>
            <p>Precio: {car.price}</p>
            {/* Add more car details as needed */}
          </div>
        ))
      ) : (
        <p>No cars available.</p>
      )}
    </Box>
  );
}

export default CarDisplay;
