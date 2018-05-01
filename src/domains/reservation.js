const OVERALL_TRAIN_THRESHOLD = 70;

function getTrainSeats(train) {
  return train.coachs.reduce((seats, coach) => [...seats, ...coach.seats], []);
}

function getPercentageOfSeatsOccupied(train) {
  let numberOfSeats = 0;
  let numberOfSeatsOccupied = 0;

  const isReserved = seat => seat.reservation;

  getTrainSeats(train).forEach(seat => {
    if (isReserved(seat)) {
      numberOfSeatsOccupied += 1;
    }

    numberOfSeats += 1;
  });

  return numberOfSeatsOccupied / numberOfSeats * 100;
}

function reserve(train, numberOfReservation) {
  const reservations = [];
  const isReserved = seat => seat.reservation;
  const shouldReserveSeat = () => reservations.length < numberOfReservation;

  if (getPercentageOfSeatsOccupied(train) > OVERALL_TRAIN_THRESHOLD) {
    return reservations;
  }

  train.coachs.forEach(coach =>
    coach.seats.forEach(
      seat =>
        shouldReserveSeat() && !isReserved(seat) && reservations.push(seat.id)
    )
  );

  return reservations;
}

module.exports = {
  reserve,
  getPercentageOfSeatsOccupied
};
