import { formatDateLong, formatMonth } from "../../src/lib/writingStyle";

describe("formatDateLong()", () => {
  const expectations = [
    { in: "1 April 2021", out: "1 Apr 21" },
    { in: "1 April 2022", out: "1 Apr 22" },
    { in: "31 October 2028", out: "31 Oct 28" },
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
