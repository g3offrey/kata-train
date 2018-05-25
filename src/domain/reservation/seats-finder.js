const { isSeatNotReserved } = require("../seat/");
const { getTrainSeats } = require("../train/");
const {
  getPercentageOfSeatsReservedInCoach,
  getPercentageOfSeatsReservedInTrain
} = require("./percentage-computation");

const TRAIN_RESERVATION_PERCENTAGE_THRESHOLD = 70;
const COACH_RESERVATION_PERCENTAGE_THRESHOLD = 70;

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
  getSeatsIdAvailableForReservation
};
