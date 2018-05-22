jest.mock("../../infrastructure/http/providers/train-structure");
jest.mock("../../infrastructure/http/providers/reservation-reference");

const {
  getTrainStructure,
  reserveSeats
} = require("../../infrastructure/http/providers/train-structure");
const {
  getReservationReference
} = require("../../infrastructure/http/providers/reservation-reference");
const { reserve } = require("./");

describe("reserve", () => {
  it("should get train structure", async () => {
    const trainId = "express_2000";
    const numberOfReservations = 2;

    await reserve(trainId, numberOfReservations);

    expect(getTrainStructure).toHaveBeenCalledTimes(1);
    expect(getTrainStructure).toHaveBeenCalledWith("express_2000");
  });

  it("should get a reservation reference", async () => {
    const trainId = "express_2000";
    const numberOfReservations = 2;

    await reserve(trainId, numberOfReservations);

    expect(getReservationReference).toHaveBeenCalledTimes(1);
  });

  it("should reserve the seats", async () => {
    const trainId = "express_2000";
    const numberOfReservations = 2;

    await reserve(trainId, numberOfReservations);

    expect(reserveSeats).toHaveBeenCalledTimes(1);
    expect(reserveSeats).toHaveBeenCalledWith("express_2000", "123456", [
      "1A",
      "2A"
    ]);
  });

  it("should return the reserved seats id and reservation reference associated", async () => {
    const trainId = "express_2000";
    const numberOfReservations = 2;

    const result = await reserve(trainId, numberOfReservations);

    expect(result).toEqual({
      reservationReference: "123456",
      reservedSeats: ["1A", "2A"]
    });
  });
});
