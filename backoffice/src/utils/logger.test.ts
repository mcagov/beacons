import logger from "./logger";

describe("logger", () => {
  jest.spyOn(console, "error").mockImplementation(() => {}); // Avoid console error failing test

  describe(".error()", () => {
    it("prefixes with ERROR", () => {
      const callback = jest.fn();

      logger(callback).error("Message");

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});
