const {
  getPercentageOfSeatsReservedInTrain,
  getPercentageOfSeatsReservedInCoach
} = require("./percentage-computation");

describe("reservation percentage-computation", () => {
  describe("getPercentageOfSeatsReservedInTrain", () => {
    describe("with half of seats reserved", () => {
      it("should return 50", () => {
        const train = {
          coachs: [
            {
              id: "A",
              seats: [
                { id: "1A", reservation: {} },
                { id: "2A", reservation: null }
              ]
            }
          ]
        };

        const percentage = getPercentageOfSeatsReservedInTrain(train);

        expect(percentage).toBe(50);
      });
    });

    describe("with 3/4 of seats reserved", () => {
      it("should return 75", () => {
        const train = {
          coachs: [
            {
              id: "A",
              seats: [
                { id: "1A", reservation: {} },
                { id: "2A", reservation: {} },
                { id: "3A", reservation: {} }
              ]
            },
            {
              id: "B",
              seats: [{ id: "1B", reservation: null }]
            }
          ]
        };

        const percentage = getPercentageOfSeatsReservedInTrain(train);

        expect(percentage).toBe(75);
      });
    });
  });

  describe("getPercentageOfSeatsReservedInCoach", () => {
    describe("with half of seats reserved", () => {
      it("should return 50", () => {
        const coach = {
          id: "A",
          seats: [
            { id: "1A", reservation: {} },
            { id: "2A", reservation: {} },
            { id: "3A", reservation: null },
            { id: "4A", reservation: null }
          ]
        };

        const percentage = getPercentageOfSeatsReservedInCoach(coach);

        expect(percentage).toBe(50);
      });
    });

    describe("with 3/4 of seats reserved", () => {
      it("should return 75", () => {
        const coach = {
          id: "A",
          seats: [
            { id: "1A", reservation: {} },
            { id: "2A", reservation: {} },
            { id: "3A", reservation: {} },
            { id: "4A", reservation: null }
          ]
        };

        const percentage = getPercentageOfSeatsReservedInCoach(coach);

        expect(percentage).toBe(75);
      });
    });
  });
});
