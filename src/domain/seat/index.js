function isSeatNotReserved(seat) {
  return !seat.reservation;
}

function isSeatReserved(seat) {
  return !!seat.reservation;
}

module.exports = {
  isSeatNotReserved,
  isSeatReserved
};
