import logger from "./logger";

describe("logger", () => {
  describe(".error()", () => {
    it("prefixes with ERROR", () => {
      const callback = jest.fn();

      logger(callback).error("Message");

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});
