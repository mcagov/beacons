import { withSingleMainUse } from "../../../src/lib/helpers/withSingleMainUse";
import { DraftBeaconUse } from "../../../src/entities/DraftBeaconUse";

describe("withSingleMainUse", () => {
  const use = (
    activity: string,
    mainUse: boolean | undefined,
  ): DraftBeaconUse => ({
    environment: "MARITIME",
    activity,
    moreDetails: "More info",
    mainUse,
  });

  it("keeps only the first main use when several uses are main", () => {
    const uses = [
      use("FISHING_VESSEL", false),
      use("SAILING", true),
      use("MOTOR_VESSEL", true),
    ];

    const result = withSingleMainUse(uses);

    expect(result.map((u) => u.mainUse)).toEqual([false, true, false]);
  });

  it("makes the first use the main use when no use is main", () => {
    const uses = [use("FISHING_VESSEL", false), use("SAILING", false)];

    const result = withSingleMainUse(uses);

    expect(result.map((u) => u.mainUse)).toEqual([true, false]);
  });

  it("makes the first use the main use when mainUse is not set", () => {
    const uses = [use("FISHING_VESSEL", undefined), use("SAILING", undefined)];

    const result = withSingleMainUse(uses);

    expect(result.map((u) => u.mainUse)).toEqual([true, false]);
  });

  it("leaves a single main use untouched", () => {
    const uses = [use("FISHING_VESSEL", false), use("SAILING", true)];

    const result = withSingleMainUse(uses);

    expect(result.map((u) => u.mainUse)).toEqual([false, true]);
  });

  it("returns an empty array when there are no uses", () => {
    expect(withSingleMainUse([])).toEqual([]);
  });

  it("preserves the order and the other properties of each use", () => {
    const uses = [use("FISHING_VESSEL", true), use("SAILING", true)];

    const result = withSingleMainUse(uses);

    expect(result.map((u) => u.activity)).toEqual([
      "FISHING_VESSEL",
      "SAILING",
    ]);
    expect(result[1].moreDetails).toEqual("More info");
  });

  it("does not mutate the uses it is given", () => {
    const uses = [use("FISHING_VESSEL", true), use("SAILING", true)];

    withSingleMainUse(uses);

    expect(uses.map((u) => u.mainUse)).toEqual([true, true]);
  });
});
