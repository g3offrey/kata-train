const { getSeatsIdAvailableForReservation } = require("./seats-finder");

describe("reservation seats-finder", () => {
  describe("getSeatsIdAvailableForReservation", () => {
    describe("without available seats", () => {
      it("should return an empty array", () => {
        const numberOfResservation = 1;
        const train = {
          coachs: [
            {
              id: "A",
              seats: [{ id: "1A", reservation: {} }]
            }
          ]
        };

        const reservedSeats = getSeatsIdAvailableForReservation(
          train,
          numberOfResservation
        );

        expect(reservedSeats).toEqual([]);
      });
    });

    describe("with available seats", () => {
      describe("when we reserve one seat", () => {
        it("should return a reserved seat", () => {
          const numberOfResservation = 1;
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

          const reservedSeats = getSeatsIdAvailableForReservation(
            train,
            numberOfResservation
          );

          expect(reservedSeats).toEqual(["1A"]);
        });
      });

      describe("when we reserve multiple seats", () => {
        it("should return multiple reserved seats", () => {
          const numberOfResservation = 2;
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

          const reservedSeats = getSeatsIdAvailableForReservation(
            train,
            numberOfResservation
          );

          expect(reservedSeats).toEqual(["1A", "2A"]);
        });
      });

      describe("when the train have more than 70% of reservations", () => {
        it("shouldn't return seats", () => {
          const numberOfResservation = 1;
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

          const reservedSeats = getSeatsIdAvailableForReservation(
            train,
            numberOfResservation
          );

          expect(reservedSeats).toEqual([]);
        });
      });

      describe("when the train will be filled with more than 70% after the reservations", () => {
        it("shouldn't return seats", () => {
          const numberOfResservation = 2;
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
              }
            ]
          };

          const reservedSeats = getSeatsIdAvailableForReservation(
            train,
            numberOfResservation
          );

          expect(reservedSeats).toEqual([]);
        });
      });

      describe("when a coach is filled with more than 70% of reservations", () => {
        it("should return seats from another coach", () => {
          const numberOfResservation = 1;
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

          const reservedSeats = getSeatsIdAvailableForReservation(
            train,
            numberOfResservation
          );

          expect(reservedSeats).toEqual(["1B"]);
        });
      });

      describe("when a coach will be filled with more than 70% after the reservations", () => {
        it("should return seats from another coach", () => {
          const numberOfResservation = 2;
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

          const reservedSeats = getSeatsIdAvailableForReservation(
            train,
            numberOfResservation
          );

          expect(reservedSeats).toEqual(["1B", "2B"]);
        });
      });

      describe("when there is no coach filled with less than 70% of reservations", () => {
        it("should return the first available seats in same coach", () => {
          const numberOfResservation = 2;
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

          const reservedSeats = getSeatsIdAvailableForReservation(
            train,
            numberOfResservation
          );

          expect(reservedSeats).toEqual(["2E", "3E"]);
        });

        describe("when there is not enough free seats in one coach", () => {
          it("should split seats across coachs", () => {
            const numberOfResservation = 2;
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

            const reservedSeats = getSeatsIdAvailableForReservation(
              train,
              numberOfResservation
            );

            expect(reservedSeats).toEqual(["2A", "2B"]);
          });
        });
      });
    });
  });
});
