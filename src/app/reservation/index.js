const {
  reserveSeats,
  getTrainStructure
} = require("../../infrastructure/http/providers/train-structure");
const {
  getReservationReference
} = require("../../infrastructure/http/providers/reservation-reference");
const { reserve: getReservedSeats } = require("../../domain/reservation/");

function buildTrainFromTrainStrucure(trainId, trainStructure) {
  const { seats } = trainStructure;
  const seatsIds = Object.keys(seats);

  const trainCoachs = seatsIds.reduce((coachAcc, seatId) => {
    const { coach: coachId, booking_reference: bookingReference } = seats[
      seatId
    ];
    const reservation = bookingReference ? { id: bookingReference } : null;
    const newSeat = { id: seatId, reservation };
    const coachInTrain = coachAcc.find(coach => coach.id === coachId);

    if (coachInTrain) {
      coachInTrain.seats.push(newSeat);
      return coachAcc;
    }

    const newCoach = { id: coachId, seats: [newSeat] };
    return [...coachAcc, newCoach];
  }, []);

  return {
    id: trainId,
    coachs: trainCoachs
  };
}

async function reserve(trainId, numberOfReservation) {
  const trainStructure = await getTrainStructure(trainId);
  const train = buildTrainFromTrainStrucure(trainId, trainStructure);

  const reservedSeatsIds = getReservedSeats(train, numberOfReservation);

  const reservationReference = await getReservationReference();
  await reserveSeats(trainId, reservationReference, reservedSeatsIds);

  return { reservationReference, reservedSeats: reservedSeatsIds };
}

module.exports = {
  reserve
};
