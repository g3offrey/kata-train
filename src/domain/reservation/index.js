const { isSeatNotReserved, isSeatReserved } = require("../seat/");

const TRAIN_RESERVATION_PERCENTAGE_THRESHOLD = 70;
const COACH_RESERVATION_PERCENTAGE_THRESHOLD = 70;

function getTrainSeats(train) {
  return train.coachs.reduce((seats, coach) => [...seats, ...coach.seats], []);
}

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

function getAvailableSeatInCoach(coach) {
  return coach.seats.filter(isSeatNotReserved);
}

function getSeatsIdAvailable(seats, numberOfReservation) {
  const reservations = [];
  const hasNoMoreSeatsToReserve = () =>
    reservations.length >= numberOfReservation;

  seats.map(seat => seat.id).some(seatId => {
    reservations.push(seatId);

    return hasNoMoreSeatsToReserve();
  });

  return reservations;
}

function getSeatsIdAvailableInSameCoach(coachs, numberOfReservation) {
  const hasEnoughtSeats = seats => seats.length >= numberOfReservation;

  const seatsAvailableToReserve = coachs
    .map(getAvailableSeatInCoach)
    .find(hasEnoughtSeats);

  return seatsAvailableToReserve
    ? getSeatsIdAvailable(seatsAvailableToReserve, numberOfReservation)
    : [];
}

function getSeatsIdAvailableRandomly(train, numberOfReservation) {
  const availableSeats = getTrainSeats(train).filter(isSeatNotReserved);

  return getSeatsIdAvailable(availableSeats, numberOfReservation);
}

/**
 * Get available seats for reservation
 * @param {Object} train
 * @param {number} numberOfReservation
 * @returns {Array} ID of the available seats
 */
function getSeatsIdAvailableForReservation(train, numberOfReservation) {
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

  const sameCoachReservations = getSeatsIdAvailableInSameCoach(
    availableCoachs,
    numberOfReservation
  );

  if (sameCoachReservations.length === numberOfReservation) {
    return sameCoachReservations;
  }

  return getSeatsIdAvailableRandomly(train, numberOfReservation);
}

module.exports = {
  getSeatsIdAvailableForReservation,
  getPercentageOfSeatsReservedInTrain,
  getPercentageOfSeatsReservedInCoach
};
