import {
  formatDateLong,
  formatDateTime,
  formatMonth,
  convertToISODateTime,
} from "./dateTime";

describe("formatDateLong()", () => {
  const expectations = [
    { in: "2024-03-22T10:28:35.537234Z", out: "22 March 2024" },
    { in: "2023-04-10", out: "10 April 2023" },
    { in: "2012-01-01", out: "1 January 2012" },
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

describe("formatDateTime()", () => {
  const expectations = [
    { in: "2024-03-22T10:28:35.537234Z", out: "22/03/2024" },
    { in: "2023-04-10", out: "10/04/2023" },
    { in: "2012-01-01", out: "01/01/2012" },
    { in: "25/04/2019", out: "25/04/2019" },
    { in: "01/07/2025", out: "01/07/2025" },
    { in: "01/2028", out: "01/2028" },
    { in: "24 December 2012", out: "24/12/2012" },
  ];

  expectations.forEach((expectation) => {
    it(`formats ${JSON.stringify(expectation.in)} ==> ${
      expectation.out
    }`, () => {
      expect(formatDateTime(expectation.in)).toEqual(expectation.out);
    });
  });
});

describe("convertToISODateTime()", () => {
  const expectations = [
    { in: "2024-03-22T10:28:35.537234Z", out: "2024-03-22T10:28:35.537234Z" },
    { in: "25/12/2025", out: "2025-12-25T00:00:00.000Z" },
    { in: "01/07/2024", out: "2024-07-01T00:00:00.000Z" },
    { in: "01/01/2012", out: "2012-01-01T00:00:00.000Z" },
  ];

  expectations.forEach((expectation) => {
    it(`formats ${JSON.stringify(expectation.in)} ==> ${
      expectation.out
    }`, () => {
      expect(convertToISODateTime(expectation.in)).toEqual(expectation.out);
    });
  });
});
