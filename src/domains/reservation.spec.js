const { reserve, getPercentageOfSeatsOccupied } = require("./reservation");

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

      describe("when the train have above 70% of reservations", () => {
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
    });
  });

  describe("getPercentageOfSeatsOccupied", () => {
    describe("with halt of place occupied", () => {
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

        const percentage = getPercentageOfSeatsOccupied(train);

        expect(percentage).toBe(50);
      });
    });

    describe("with 3/4 of place occupied", () => {
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

        const percentage = getPercentageOfSeatsOccupied(train);

        expect(percentage).toBe(75);
      });
    });
  });
});
