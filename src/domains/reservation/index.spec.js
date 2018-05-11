const {
  reserve,
  getPercentageOfSeatsReservedInTrain,
  getPercentageOfSeatsReservedInCoach
} = require("./.");

describe("reservation", () => {
  describe("reserve", () => {
    describe("without available seats", () => {
      it("should return an empty array", () => {
        const numberOfPlaces = 1;
        const train = {
          coachs: [
            {
              id: "A",
              seats: [{ id: "1A", reservation: {} }]
            }
          ]
        };

        const reservedSeats = reserve(train, numberOfPlaces);

        expect(reservedSeats).toEqual([]);
      });
    });

    describe("with available seats", () => {
      describe("when we reserve one seats", () => {
        it("should return an reserved seats", () => {
          const numberOfPlaces = 1;
          const train = {
            coachs: [
              {
                id: "A",
                seats: [
                  { id: "1A", reservation: null },
                  { id: "2A", reservation: null }
                ]
              }
            ]
          };

          const reservedSeats = reserve(train, numberOfPlaces);

          expect(reservedSeats).toEqual(["1A"]);
        });
      });

      describe("when we reserve multiple seats", () => {
        it("should return multiple reserved seats", () => {
          const numberOfPlaces = 2;
          const train = {
            coachs: [
              {
                id: "A",
                seats: [
                  { id: "1A", reservation: null },
                  { id: "2A", reservation: null },
                  { id: "3A", reservation: null }
                ]
              }
            ]
          };

          const reservedSeats = reserve(train, numberOfPlaces);

          expect(reservedSeats).toEqual(["1A", "2A"]);
        });
      });

      describe("when the train have more than 70% of reservations", () => {
        it("shouldn't reserve seats", () => {
          const numberOfPlaces = 1;
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

          const reservedSeats = reserve(train, numberOfPlaces);

          expect(reservedSeats).toEqual([]);
        });
      });

      describe("when a coach is filled with more than 70% of reservations", () => {
        it("should reserve seats in another coach", () => {
          const numberOfPlaces = 1;
          const train = {
            coachs: [
              {
                id: "A",
                seats: [
                  { id: "1A", reservation: {} },
                  { id: "2A", reservation: {} },
                  { id: "3A", reservation: {} },
                  { id: "4A", reservation: null }
                ]
              },
              {
                id: "B",
                seats: [{ id: "1B", reservation: null }]
              }
            ]
          };

          const reservedSeats = reserve(train, numberOfPlaces);

          expect(reservedSeats).toEqual(["1B"]);
        });
      });
    });
  });

  describe("getPercentageOfSeatsReservedInTrain", () => {
    describe("with halt of place reserved", () => {
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

    describe("with 3/4 of place reserved", () => {
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
    describe("with half of place reserved", () => {
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

    describe("with 3/4 of place reserved", () => {
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
