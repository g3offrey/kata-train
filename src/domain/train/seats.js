function getTrainSeats(train) {
  return train.coachs.reduce((seats, coach) => [...seats, ...coach.seats], []);
}

module.exports = {
  getTrainSeats
};
