const {
  reserveSeats,
  getTrainStructure
} = require("../../infrastructure/http/providers/train-structure");
const {
  getReservationReference
} = require("../../infrastructure/http/providers/reservation-reference");
const {
  getSeatsIdAvailableForReservation
} = require("../../domain/reservation/");

function buildTrainFromTrainStrucure(trainId, trainStructure) {
  const { seats } = trainStructure;
  const seatsIds = Object.keys(seats);

  const trainCoachs = seatsIds.reduce((coachs, seatId) => {
    const { coach: coachId, booking_reference: bookingReference } = seats[
      seatId
    ];
    const reservation = bookingReference ? { id: bookingReference } : null;
    const newSeat = { id: seatId, reservation };
    const coachInTrain = coachs.find(coach => coach.id === coachId);

    if (coachInTrain) {
      coachInTrain.seats.push(newSeat);
      return coachs;
    }

    const newCoach = { id: coachId, seats: [newSeat] };
    return [...coachs, newCoach];
  }, []);

  return {
    id: trainId,
    coachs: trainCoachs
  };
}

async function reserve(trainId, numberOfReservation) {
  const trainStructure = await getTrainStructure(trainId);
  const train = buildTrainFromTrainStrucure(trainId, trainStructure);

  const reservedSeatsIds = getSeatsIdAvailableForReservation(
    train,
    numberOfReservation
  );

  const reservationReference = await getReservationReference();
  await reserveSeats(trainId, reservationReference, reservedSeatsIds);

  return { reservationReference, reservedSeats: reservedSeatsIds };
}

module.exports = {
  reserve
};
