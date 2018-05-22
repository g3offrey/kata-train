const fakeBookingReferences = '123456';

const getReservationReference = jest.fn(() => {
  return Promise.resolve(fakeBookingReferences)
})

module.exports = {
  getReservationReference
}
