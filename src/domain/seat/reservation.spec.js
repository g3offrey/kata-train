const { isSeatReserved, isSeatNotReserved } = require("./");

describe("seat reservation", () => {
  describe("isSeatReserved", () => {
    it("should return true when seat.reservation is a truethy object", () => {
      const seat = { reservation: {} };

      const isReserved = isSeatReserved(seat);

      expect(isReserved).toBe(true);
    });

    it("should return false when seat.reservation is null", () => {
      const seat = { reservation: null };

      const isReserved = isSeatReserved(seat);

      expect(isReserved).toBe(false);
    });
  });

  describe("isSeatNotReserved", () => {
    it("should return true when seat.reservation is a truethy object", () => {
      const seat = { reservation: {} };

      const isNotReserved = isSeatNotReserved(seat);

      expect(isNotReserved).toBe(false);
    });

    it("should return false when seat.reservation is null", () => {
      const seat = { reservation: null };

      const isNotReserved = isSeatNotReserved(seat);

      expect(isNotReserved).toBe(true);
    });
  });
});
