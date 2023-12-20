import React, { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Box } from '@mantine/core';
import classes from './Cars.module.css';
import { useCars } from '@/context/Cars'; // Import the useCars hook

function CarDisplay() {
  const { displayCars } = useCars(); // Use the useCars hook to access the cars
  const [opened, { open, close }] = useDisclosure();
  const [selectedCar, setSelectedCar] = useState(null); // State for the selected car

  const handleOpenModal = (car) => {
    setSelectedCar(car);
    open();
  };

  return (
    <Box className={classes.box}>
      {displayCars.length > 0 ? (
        displayCars.map((car, index) => (
          <div key={index} className={classes.carItem}>
            <img src={car.images[1]} alt={car.model} className={classes.carImg} />
            <div className={classes.carInfo}>
              <h3>{car.model}</h3>
              <p>{car.description}</p>

              <Button onClick={() => handleOpenModal(car)}>Más información</Button>
            </div>
            {/* Add more car details as needed */}
          </div>
        ))
      ) : (
        <p>No cars available.</p>
      )}

      <Modal opened={opened} onClose={close} title={selectedCar?.model}>
        {/* Display the selected car details here */}
        <p>{selectedCar?.description}</p>
        {/* You can add more details about the selected car here */}
      </Modal>
    </Box>
  );
}

export default CarDisplay;
