const request = require("request-promise");

const TRAIN_STRUCTURE_ENDPOINT = `${
  process.env.TRAIN_STRUCTURE_API
}/data_for_train/`;
const TRAIN_RESERVE_ENDPOINT = `${process.env.TRAIN_STRUCTURE_API}/reserve/`;

async function getTrainStructure(trainId) {
  const response = await request.get(TRAIN_STRUCTURE_ENDPOINT + trainId);

  return JSON.parse(response);
}

function parseSeatsIdsToJSON(seatsIds) {
  const stringifiedSeatsIds = seatsIds.map(seatId => `"${seatId}"`).join(",");
  return `[${stringifiedSeatsIds}]`;
}

async function reserveSeats(trainId, reservationReference, seatsIds) {
  return request.post(TRAIN_RESERVE_ENDPOINT, {
    formData: {
      train_id: trainId,
      booking_reference: reservationReference,
      seats: parseSeatsIdsToJSON(seatsIds)
    }
  });
}

module.exports = {
  getTrainStructure,
  reserveSeats
};
