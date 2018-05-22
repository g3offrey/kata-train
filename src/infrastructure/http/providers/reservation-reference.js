const request = require("request-promise");

const RESERVATION_REFERENCE_ENDPOINT = `${
  process.env.RESERVATION_REFERENCE_API
}/booking_reference`;

async function getReservationReference() {
  const response = await request.get(RESERVATION_REFERENCE_ENDPOINT);

  return response;
}

module.exports = {
  getReservationReference
};
