import React from 'react';
import { Box } from '@mantine/core';
import { useCar } from '@/context/Cars'; // Import your useCar hook
import classes from './CarList.module.css'; // Use or create a CSS module for styling

function CarList() {
  const { cars } = useCar();

  return (
    <Box className={classes.box}>
      {cars.map((car, index) => (
        <div key={index} className={classes.carItem}>
          <h2>{car.model}</h2>
          <p>Description: {car.description}</p>
          <p>Year: {car.year}</p>
          <p>Price: ${car.price}</p>
          <p>Color: {car.color}</p>
          {/* Display car images if available */}
          {car.images && car.images.map((image, imgIndex) => (
            <img key={imgIndex} src={image} alt={`${car.model} image`} className={classes.carImage} />
          ))}
        </div>
      ))}
    </Box>
  );
}

export default CarList;
