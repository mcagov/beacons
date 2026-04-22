import { BEACON_TYPES } from "./BeaconType";

describe("BEACON_TYPES", () => {
  it("should not contain any duplicate values", () => {
    const uniqueTypes = new Set(BEACON_TYPES);
    expect(uniqueTypes.size).toBe(BEACON_TYPES.length);
  });
});
