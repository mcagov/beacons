import { BeaconUse } from "../src/entities/BeaconUse";
import { prettyUseName } from "../src/lib/writingStyle";

describe("prettyUseName", () => {
  interface Expectation {
    in: BeaconUse;
    out: string;
  }
  const expectations: Expectation[] = [
    {
      in: {
        environment: "Maritime",
        purpose: "Pleasure",
        activity: "Motor vessel",
      } as BeaconUse,
      out: "Maritime - Motor vessel (Pleasure)",
    },
    {
      in: {
        environment: "Land",
        activity: "Monster truck racing",
      } as BeaconUse,
      out: "Land - Monster truck racing",
    },
  ];

  expectations.forEach((expectation) => {
    it(`given ${expectation.in} returns ${expectation.out}`, () => {
      expect(prettyUseName(expectation.in)).toEqual(expectation.out);
    });
  });
});
