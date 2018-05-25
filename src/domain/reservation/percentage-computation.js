const { isSeatReserved } = require("../seat/");
const { getTrainSeats } = require("../train/");

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

function getPercentageOfSeatsReservedInTrain(train, numberOfReservation) {
  const seats = getTrainSeats(train);

  return getPercentageOfSeatsReserved(seats, numberOfReservation);
}

function getPercentageOfSeatsReservedInCoach(coach, numberOfReservation) {
  return getPercentageOfSeatsReserved(coach.seats, numberOfReservation);
}

module.exports = {
  getPercentageOfSeatsReservedInCoach,
  getPercentageOfSeatsReservedInTrain
};
