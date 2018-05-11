const TRAIN_RESERVATION_PERCENTAGE_THRESHOLD = 70;
const COACH_RESERVATION_PERCENTAGE_THRESHOLD = 70;

function getTrainSeats(train) {
  return train.coachs.reduce((seats, coach) => [...seats, ...coach.seats], []);
}

function getPercentageOfSeatsOccupied(seats) {
  let numberOfSeats = 0;
  let numberOfSeatsOccupied = 0;

  const isReserved = seat => seat.reservation;

  seats.forEach(seat => {
    if (isReserved(seat)) {
      numberOfSeatsOccupied += 1;
    }

    numberOfSeats += 1;
  });

  return numberOfSeatsOccupied / numberOfSeats * 100;
}

function getPercentageOfSeatsOccupiedInTrain(train) {
  const seats = getTrainSeats(train);

  return getPercentageOfSeatsOccupied(seats);
}

function getPercentageOfSeatsOccupiedInCoach(coach) {
  const seats = coach.seats || [];

  return getPercentageOfSeatsOccupied(seats);
}

function reserve(train, numberOfReservation) {
  const reservations = [];
  const isReserved = seat => seat.reservation;
  const shouldReserveSeat = () => reservations.length < numberOfReservation;
  const canReserveSeatInTrain =
    getPercentageOfSeatsOccupiedInTrain(train) <
    TRAIN_RESERVATION_PERCENTAGE_THRESHOLD;
  const canReserveSeatInCoach = coach =>
    getPercentageOfSeatsOccupiedInCoach(coach) <=
    COACH_RESERVATION_PERCENTAGE_THRESHOLD;

  if (!canReserveSeatInTrain) {
    return reservations;
  }

  train.coachs.forEach(
    coach =>
      canReserveSeatInCoach(coach) &&
      coach.seats.forEach(
        seat =>
          shouldReserveSeat() && !isReserved(seat) && reservations.push(seat.id)
      )
  );

  return reservations;
}

module.exports = {
  reserve,
  getPercentageOfSeatsOccupiedInTrain,
  getPercentageOfSeatsOccupiedInCoach
};
