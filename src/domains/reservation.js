const TRAIN_RESERVATION_PERCENTAGE_THRESHOLD = 70;
const COACH_RESERVATION_PERCENTAGE_THRESHOLD = 70;

/**
 * Return an array of all the train seats
 * @param {Object} train
 * @returns {Object[]} All seats of train
 */
function getTrainSeats(train) {
  return train.coachs.reduce((seats, coach) => [...seats, ...coach.seats], []);
}

/**
 * Return the percentage of seats occupied
 * @param {Object[]} seats
 * @returns {number} percentage of seats occupied
 */
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

/**
 * Get the percentage of seats which has been reserved in the whole train
 * @param train
 * @returns {number} percentage of seats reserved
 */
function getPercentageOfSeatsOccupiedInTrain(train) {
  const seats = getTrainSeats(train);

  return getPercentageOfSeatsOccupied(seats);
}

/**
 * Get the percentage of seats which has been reserved in a coach
 * @param coach
 * @returns {number} percentage of seats reserved
 */
function getPercentageOfSeatsOccupiedInCoach(coach) {
  const seats = coach.seats || [];

  return getPercentageOfSeatsOccupied(seats);
}

/**
 * Make XX reservation for the train
 * @param train
 * @param numberOfReservation
 * @returns {Array} ID of the seats reserved
 */
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
