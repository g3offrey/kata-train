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
 * Return the percentage of seats reserved
 * @param {Object[]} seats
 * @param {number} numberOfReservation
 * @returns {number} percentage of seats reserved
 */
function getPercentageOfSeatsReserved(seats = [], numberOfReservation = 0) {
  let numberOfSeats = 0;
  let numberOfSeatsReserved = numberOfReservation;

  const isReserved = seat => seat.reservation;

  seats.forEach(seat => {
    if (isReserved(seat)) {
      numberOfSeatsReserved += 1;
    }

    numberOfSeats += 1;
  });

  return numberOfSeatsReserved / numberOfSeats * 100;
}

/**
 * Get the percentage of seats which has been reserved in the whole train
 * @param {Object} train
 * @returns {number} percentage of seats reserved
 */
function getPercentageOfSeatsReservedInTrain(train) {
  const seats = getTrainSeats(train);

  return getPercentageOfSeatsReserved(seats);
}

/**
 * Get the percentage of seats which has been reserved in a coach
 * @param {Object} coach
 * @param {number} numberOfReservation
 * @returns {number} percentage of seats reserved
 */
function getPercentageOfSeatsReservedInCoach(coach, numberOfReservation) {
  return getPercentageOfSeatsReserved(coach.seats, numberOfReservation);
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
    getPercentageOfSeatsReservedInTrain(train) <
    TRAIN_RESERVATION_PERCENTAGE_THRESHOLD;
  const canReserveSeatInCoach = coach =>
    getPercentageOfSeatsReservedInCoach(coach, numberOfReservation) <=
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
  getPercentageOfSeatsReservedInTrain,
  getPercentageOfSeatsReservedInCoach
};
