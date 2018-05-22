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
      describe("when we reserve one seat", () => {
        it("should return a reserved seats", () => {
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
                seats: [
                  { id: "1B", reservation: null },
                  { id: "2B", reservation: null },
                  { id: "3B", reservation: null },
                  { id: "4B", reservation: null }
                ]
              }
            ]
          };

          const reservedSeats = reserve(train, numberOfPlaces);

          expect(reservedSeats).toEqual(["1B"]);
        });
      });

      describe("when a coach will be filled with more than 70% after the reservations", () => {
        it("should reserve seats in another coach", () => {
          const numberOfPlaces = 2;
          const train = {
            coachs: [
              {
                id: "A",
                seats: [
                  { id: "1A", reservation: {} },
                  { id: "2A", reservation: {} },
                  { id: "3A", reservation: {} },
                  { id: "4A", reservation: {} },
                  { id: "5A", reservation: {} },
                  { id: "6A", reservation: {} },
                  { id: "7A", reservation: null },
                  { id: "8A", reservation: null },
                  { id: "9A", reservation: null },
                  { id: "10A", reservation: null }
                ]
              },
              {
                id: "B",
                seats: [
                  { id: "1B", reservation: null },
                  { id: "2B", reservation: null },
                  { id: "3B", reservation: null },
                  { id: "4B", reservation: null }
                ]
              }
            ]
          };

          const reservedSeats = reserve(train, numberOfPlaces);

          expect(reservedSeats).toEqual(["1B", "2B"]);
        });
      });

      describe("when there is no coach filled with less than 70% of reservations", () => {
        it("should reserve the first available places in same coach", () => {
          const numberOfPlaces = 2;
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
              },
              {
                id: "C",
                seats: [{ id: "1C", reservation: null }]
              },
              {
                id: "D",
                seats: [{ id: "1D", reservation: null }]
              },
              {
                id: "E",
                seats: [
                  { id: "1E", reservation: {} },
                  { id: "2E", reservation: null },
                  { id: "3E", reservation: null },
                  { id: "4E", reservation: {} }
                ]
              }
            ]
          };

          const reservedSeats = reserve(train, numberOfPlaces);

          expect(reservedSeats).toEqual(["2E", "3E"]);
        });

        describe("when there is not enought free seats in one coach", () => {
          it("should split reservations across coachs", () => {
            const numberOfPlaces = 2;
            const train = {
              coachs: [
                {
                  id: "A",
                  seats: [
                    { id: "1A", reservation: {} },
                    { id: "2A", reservation: null }
                  ]
                },
                {
                  id: "B",
                  seats: [
                    { id: "1B", reservation: {} },
                    { id: "2B", reservation: null }
                  ]
                },
                {
                  id: "C",
                  seats: [{ id: "1C", reservation: null }]
                },
                {
                  id: "D",
                  seats: [{ id: "1D", reservation: null }]
                }
              ]
            };

            const reservedSeats = reserve(train, numberOfPlaces);

            expect(reservedSeats).toEqual(["2A", "2B"]);
          });
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
