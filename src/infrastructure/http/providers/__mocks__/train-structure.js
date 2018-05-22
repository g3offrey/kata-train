const fakeTrainsData = {
  express_2000: `{"seats": {"1A": {"booking_reference": "", "seat_number": "1", "coach": "A"}, "2A": {"booking_reference": "", "seat_number": "2", "coach": "A"}}}`
};

const getTrainStructure = jest.fn(trainId => {
  const fakeTrainData = fakeTrainsData[trainId];

  return fakeTrainData ? JSON.parse(fakeTrainData) : null;
});

const reserveSeats = jest.fn(() => Promise.resolve());

module.exports = {
  getTrainStructure,
  reserveSeats
};
