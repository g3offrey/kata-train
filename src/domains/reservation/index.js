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
 * Make XX reservation in the coachs
 * @param {Object[]} coachs
 * @param {number} numberOfReservation
 * @returns {Array} ID of the seats reserved
 */
function reserveSeatsInCoachs(coachs, numberOfReservation) {
  let reservations = [];
  const isNotReserved = seat => !seat.reservation;
  const hasNoMoreSeatsToReserve = () => reservations.length >= numberOfReservation;
  coachs.some(coach => {
    const availableSeats = coach.seats.filter(isNotReserved).map(seat => seat.id)
    reservations = availableSeats.slice(0, numberOfReservation)

    return hasNoMoreSeatsToReserve()
  })

  return reservations
}

/**
 * Make XX reservation for the train
 * @param {Object} train
 * @param {number} numberOfReservation
 * @returns {Array} ID of the seats reserved
 */
function reserve(train, numberOfReservation) {
  const canReserveSeatInTrain =
    getPercentageOfSeatsReservedInTrain(train) <
    TRAIN_RESERVATION_PERCENTAGE_THRESHOLD;
  const coachDontOverflowReservationLimit = coach =>
    getPercentageOfSeatsReservedInCoach(coach, numberOfReservation) <=
    COACH_RESERVATION_PERCENTAGE_THRESHOLD;

  if (!canReserveSeatInTrain) {
    return [];
  }

  const coachUnderLimit = train.coachs.filter(coachDontOverflowReservationLimit)
  const availableCoachs = coachUnderLimit.length ? coachUnderLimit : train.coachs

  return reserveSeatsInCoachs(availableCoachs, numberOfReservation)
}

module.exports = {
  reserve,
  getPercentageOfSeatsReservedInTrain,
  getPercentageOfSeatsReservedInCoach
};
