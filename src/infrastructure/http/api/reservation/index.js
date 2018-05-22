const { reserve } = require("../../../../app/reservation/");

async function reserveHandler(req, res, next) {
  const trainId = req.body.train_id;
  const seatCount = Number(req.body.seat_count);

  const { reservedSeats, reservationReference } = await reserve(
    trainId,
    seatCount
  );
  const result = {
    train_id: trainId,
    booking_reference: reservationReference,
    seats: reservedSeats
  };

  res.send(result);

  next();
}

module.exports = server => {
  server.post("/reserve", reserveHandler);
};
