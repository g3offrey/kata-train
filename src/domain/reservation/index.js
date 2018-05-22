const { isSeatNotReserved, isSeatReserved } = require("../seat/");

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

  seats.forEach(seat => {
    if (isSeatReserved(seat)) {
      numberOfSeatsReserved += 1;
    }

    numberOfSeats += 1;
  });

  return numberOfSeatsReserved / numberOfSeats * 100;
}

/**
 * Get the percentage of seats which has been reserved in the whole train
 * @param {Object} train
 * @param {number} numberOfReservation
 * @returns {number} percentage of seats reserved
 */
function getPercentageOfSeatsReservedInTrain(train, numberOfReservation) {
  const seats = getTrainSeats(train);

  return getPercentageOfSeatsReserved(seats, numberOfReservation);
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
 * Get the available seats in coach
 * @param {Object} coach
 * @returns {Object[]} available seats
 */
function getAvailableSeatInCoach(coach) {
  return coach.seats.filter(isSeatNotReserved);
}

/**
 * Reserve XX seats from the seats list
 * @param {Object[]} seats
 * @param {number} numberOfReservation
 * @returns {Array} ID of the seats reserved
 */
function reserveSeats(seats, numberOfReservation) {
  const reservations = [];
  const hasNoMoreSeatsToReserve = () =>
    reservations.length >= numberOfReservation;

  seats.map(seat => seat.id).some(seatId => {
    reservations.push(seatId);

    return hasNoMoreSeatsToReserve();
  });

  return reservations;
}

/**
 * Do XX reservation in the same coach if possible
 * @param {Object[]} coachs
 * @param {number} numberOfReservation
 * @returns {Array} ID of the seats reserved
 */
function reserveSeatsInSameCoach(coachs, numberOfReservation) {
  const hasEnoughtSeats = seats => seats.length >= numberOfReservation;

  const seatsAvailableToReserve = coachs
    .map(getAvailableSeatInCoach)
    .find(hasEnoughtSeats);

  return seatsAvailableToReserve
    ? reserveSeats(seatsAvailableToReserve, numberOfReservation)
    : [];
}

/**
 * Do XX reservations in the train randomly
 * @param {Object} train
 * @param {number} numberOfReservation
 * @returns {Array} ID of the seats reserved
 */
function reserveSeatsRandomly(train, numberOfReservation) {
  const availableSeats = getTrainSeats(train).filter(isSeatNotReserved);

  return reserveSeats(availableSeats, numberOfReservation);
}

/**
 * Do XX reservation for the train
 * @param {Object} train
 * @param {number} numberOfReservation
 * @returns {Array} ID of the seats reserved
 */
function reserve(train, numberOfReservation) {
  const canReserveInTrain =
    getPercentageOfSeatsReservedInTrain(train, numberOfReservation) <
    TRAIN_RESERVATION_PERCENTAGE_THRESHOLD;
  const coachDontOverflowReservationLimit = coach =>
    getPercentageOfSeatsReservedInCoach(coach, numberOfReservation) <=
    COACH_RESERVATION_PERCENTAGE_THRESHOLD;

  if (!canReserveInTrain) {
    return [];
  }

  const coachUnderReservationLimit = train.coachs.filter(
    coachDontOverflowReservationLimit
  );
  const availableCoachs = coachUnderReservationLimit.length
    ? coachUnderReservationLimit
    : train.coachs;

  const sameCoachReservations = reserveSeatsInSameCoach(
    availableCoachs,
    numberOfReservation
  );

  if (sameCoachReservations.length === numberOfReservation) {
    return sameCoachReservations;
  }

  return reserveSeatsRandomly(train, numberOfReservation);
}

module.exports = {
  reserve,
  getPercentageOfSeatsReservedInTrain,
  getPercentageOfSeatsReservedInCoach
};
