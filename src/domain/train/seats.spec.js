const { getTrainSeats } = require("./seats");

describe("train seats", () => {
  describe("getTrainSeats", () => {
    it("should return all seats from train", () => {
      const train = {
        coachs: [
          { id: "A", seats: [{ id: "1A" }, { id: "2A" }] },
          { id: "B", seats: [{ id: "1B" }, { id: "2B" }] }
        ]
      };

      const seats = getTrainSeats(train);

      expect(seats).toEqual([
        { id: "1A" },
        { id: "2A" },
        { id: "1B" },
        { id: "2B" }
      ]);
    });
  });
});
