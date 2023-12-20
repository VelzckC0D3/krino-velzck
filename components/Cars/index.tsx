/* eslint-disable max-len */
/* eslint-disable @next/next/no-img-element */
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

  const renderCars = () => {
    // Check if there are more than 5 cars
    if (displayCars.length > 5) {
      // If yes, return only the last car
      const lastCar = displayCars[displayCars.length - 1];
      return renderCarItem(lastCar, displayCars.length - 1);
    } else {
      // If no, return all cars
      return displayCars.map((car, index) => renderCarItem(car, index));
    }
  };

  const renderCarItem = (car, index) => (
    <div key={index} className={classes.carItem}>
      <img src={car?.images[1]} alt={car.model} className={classes.carImg} />
      <div className={classes.carInfo}>
        <h3>{car.model}</h3>
        <p>{car.description}</p>

        <Button className={classes.modalButton} onClick={() => handleOpenModal(car)}>
          Más información
        </Button>
      </div>
      {/* Add more car details as needed */}
    </div>
  );

  return (
    <Box className={classes.box}>
      {displayCars.length > 0 ? (
        renderCars()
      ) : (
        <div className={classes.temporalBgCont}>
          <div className={classes.temporalTitle}>
            <h2>Buscador De Vehiculos Land Rover</h2>
            <p>
              Describe el automovil que buscas o escribe 'vehiculos disponibles' para ver los que
              estan disponibles
            </p>
          </div>
          <img
            className={classes.temporalBg}
            src="https://i.postimg.cc/SKj4CK6S/semi-front.webp"
            alt=""
          />
        </div>
      )}

      <Modal
        size={1500}
        opened={opened}
        onClose={close}
        title={selectedCar?.model}
        styles={{ inner: { alignItems: 'center' } }}
      >
        {/* Display the selected car details here */}
        <div className={classes.modalImageCont}>
          <img src={selectedCar?.images[0]} alt="" />
          <img src={selectedCar?.images[1]} alt="" />
          <img src={selectedCar?.images[2]} alt="" />
        </div>
        <p className={classes.modalText}>{selectedCar?.description}</p>
        <div className={classes.modalInfoCont}>
          <p className={classes.modalInfoT}>
            {' '}
            <span className={classes.modalSpam}> Precio: </span> $
            {selectedCar?.price.toLocaleString()}
          </p>
          <p className={classes.modalInfoT}>
            {' '}
            <span className={classes.modalSpam}> Modelo: </span> {selectedCar?.year}
          </p>
          <p className={classes.modalInfoT}>
            {' '}
            <span className={classes.modalSpam}> Color: </span> {selectedCar?.color}
          </p>
        </div>
        {/* You can add more details about the selected car here */}
      </Modal>
    </Box>
  );
}

export default CarDisplay;
