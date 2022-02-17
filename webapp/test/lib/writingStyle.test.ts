import { BeaconUse } from "../../src/entities/BeaconUse";
import {
  formatDateLong,
  formatDateTruncated,
  formatMonth,
  prettyUseName,
} from "../../src/lib/writingStyle";

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

describe("formatDateTruncated()", () => {
  const expectations = [
    { in: "1 April 2021", out: "1 Apr 21" },
    { in: "1 April 2022", out: "1 Apr 22" },
    { in: "31 October 2028", out: "31 Oct 28" },
  ];

  expectations.forEach((expectation) => {
    it(`formats ${JSON.stringify(expectation.in)} ==> ${
      expectation.out
    }`, () => {
      expect(formatDateTruncated(expectation.in)).toEqual(expectation.out);
    });
  });
});

describe("formatDateLong()", () => {
  const expectations = [
    { in: "1994-05-29", out: "29 May 1994" },
    { in: "2020-10-28", out: "28 October 2020" },
    { in: "1989-10-11", out: "11 October 1989" },
  ];

  expectations.forEach((expectation) => {
    it(`formats ${JSON.stringify(expectation.in)} ==> ${
      expectation.out
    }`, () => {
      expect(formatDateLong(expectation.in)).toEqual(expectation.out);
    });
  });
});

describe("formatMonth()", () => {
  const expectations = [
    { in: "2020-02-01T00:00:00.000Z", out: "February 2020" },
    { in: "2021-05-06T10:00:03.592854", out: "May 2021" },
  ];

  expectations.forEach((expectation) => {
    it(`formats ${JSON.stringify(expectation.in)} ==> ${
      expectation.out
    }`, () => {
      expect(formatMonth(expectation.in)).toEqual(expectation.out);
    });
  });
});
