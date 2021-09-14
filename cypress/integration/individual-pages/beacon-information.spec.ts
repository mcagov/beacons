import {
  givenIHaveACookieSetAndIVisit,
  givenIHaveSignedIn,
  iCanClickTheBackLinkToGoToPreviousPage,
  iCanSeeAPageHeadingThatContains,
  requiredFieldErrorMessage,
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  thenMyFocusMovesTo,
  thenTheInputShouldOnlyContain,
  thenTheUrlShouldContain,
  whenIClickContinue,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenIType,
} from "../../common/selectors-and-assertions.spec";

describe("As a beacon owner, I want to submit information about my beacon", () => {
  const previousPageUrl = "/register-a-beacon/check-beacon-detail";
  const pageUrl = "/register-a-beacon/beacon-information";
  const manufacturerSerialNumberFieldSelector = "#manufacturerSerialNumber";
  const batteryExpiryDateMonthFieldSelector = "#batteryExpiryDateMonth";
  const batteryExpiryDateYearFieldSelector = "#batteryExpiryDateYear";
  const lastServicedDateMonthFieldSelector = "#lastServicedDateMonth";
  const lastServicedDateYearFieldSelector = "#lastServicedDateYear";

  const dateInThePastErrorMessage = "date in the past";
  const mustBeAfter1980ErrorMessage = "must be after 1980";

  const invalidYear = "202n";
  const invalidMonth = "00";
  const validYear = "2030";
  const validMonth = "12";

  beforeEach(() => {
    givenIHaveSignedIn();
    givenIHaveACookieSetAndIVisit(pageUrl);
  });

  it("shows me the page title", () => {
    iCanSeeAPageHeadingThatContains("Beacon information");
  });

  it("should route to the previous page when I click the back button", () => {
    iCanClickTheBackLinkToGoToPreviousPage(previousPageUrl);
  });

  it("routes to the next page if there are no errors with the form submission", () => {
    whenIType("ASOS", manufacturerSerialNumberFieldSelector);
    whenIClickContinue();

    thenTheUrlShouldContain("/register-a-beacon/beacon-use");
  });

  describe("the manufacturer serial number field", () => {
    it("displays errors if no manufacturer serial number is submitted", () => {
      whenIType(" ", manufacturerSerialNumberFieldSelector);
      whenIClickContinue();
      thenIShouldSeeAnErrorSummaryLinkThatContains(requiredFieldErrorMessage);

      thenIShouldSeeAnErrorSummaryLinkThatContains(
        "manufacturer serial number",
        requiredFieldErrorMessage
      );
      thenIShouldSeeAnErrorMessageThatContains(
        "manufacturer serial number",
        requiredFieldErrorMessage
      );

      whenIClickOnTheErrorSummaryLinkContaining("manufacturer", "required");
      thenMyFocusMovesTo(manufacturerSerialNumberFieldSelector);
    });
  });

  describe("the Battery expiry month field", () => {
    const batteryExpiryDateErrorMessage = "correct battery expiry date";

    it("adds a leading zero to the battery expiry and last serviced month", () => {
      whenIType("1", batteryExpiryDateMonthFieldSelector);
      whenIClickContinue();
      thenTheInputShouldOnlyContain("01", batteryExpiryDateMonthFieldSelector);
    });

    it("displays errors if the battery expiry month is invalid", () => {
      whenIType(invalidMonth, batteryExpiryDateMonthFieldSelector);
      whenIType(validYear, batteryExpiryDateYearFieldSelector);
      whenIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(
        batteryExpiryDateErrorMessage
      );
      thenIShouldSeeAnErrorMessageThatContains(batteryExpiryDateErrorMessage);
    });

    it("displays errors if the battery expiry year is invalid", () => {
      whenIType(validMonth, batteryExpiryDateMonthFieldSelector);
      whenIType(invalidYear, batteryExpiryDateYearFieldSelector);
      whenIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(
        batteryExpiryDateErrorMessage
      );
      thenIShouldSeeAnErrorMessageThatContains(batteryExpiryDateErrorMessage);
    });

    it("displays errors if the battery expiry date is a valid date but before 1980", () => {
      whenIType(validMonth, batteryExpiryDateMonthFieldSelector);
      whenIType("1979", batteryExpiryDateYearFieldSelector);
      whenIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(mustBeAfter1980ErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(mustBeAfter1980ErrorMessage);
    });

    xit("focuses me on the month input field if that is invalid", () => {
      // TODO issue #149 (https://github.com/mcagov/beacons-webapp/issues/149)
      whenIType(invalidMonth, batteryExpiryDateMonthFieldSelector);
      whenIType(validYear, batteryExpiryDateYearFieldSelector);
      whenIClickContinue();
      thenIShouldSeeAnErrorSummaryLinkThatContains(
        batteryExpiryDateErrorMessage
      );
      thenIShouldSeeAnErrorMessageThatContains(batteryExpiryDateErrorMessage);

      whenIClickOnTheErrorSummaryLinkContaining(batteryExpiryDateErrorMessage);
      thenMyFocusMovesTo(batteryExpiryDateMonthFieldSelector);
    });

    xit("focuses me on the year input field if that is invalid", () => {
      // TODO issue #149 (https://github.com/mcagov/beacons-webapp/issues/149)

      whenIType(validMonth, batteryExpiryDateMonthFieldSelector);
      whenIType(invalidYear, batteryExpiryDateYearFieldSelector);
      whenIClickContinue();
      thenIShouldSeeAnErrorSummaryLinkThatContains(
        batteryExpiryDateErrorMessage
      );
      thenIShouldSeeAnErrorMessageThatContains(batteryExpiryDateErrorMessage);

      whenIClickOnTheErrorSummaryLinkContaining(batteryExpiryDateErrorMessage);
      thenMyFocusMovesTo(batteryExpiryDateYearFieldSelector);
    });
  });

  describe("The Last serviced month", () => {
    const lastServicedDateErrorMessage = "correct last serviced date";

    it("adds a leading zero to the battery expiry and last serviced month", () => {
      whenIType("1", lastServicedDateMonthFieldSelector);
      whenIClickContinue();
      thenTheInputShouldOnlyContain("01", lastServicedDateMonthFieldSelector);
    });

    it("displays errors if the last serviced month is invalid", () => {
      whenIType(invalidMonth, lastServicedDateMonthFieldSelector);
      whenIType(validYear, lastServicedDateYearFieldSelector);
      whenIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(
        lastServicedDateErrorMessage
      );
      thenIShouldSeeAnErrorMessageThatContains(lastServicedDateErrorMessage);
    });

    it("displays errors if the last serviced year is invalid", () => {
      whenIType(validMonth, lastServicedDateMonthFieldSelector);
      whenIType(invalidYear, lastServicedDateYearFieldSelector);
      whenIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(
        lastServicedDateErrorMessage
      );
      thenIShouldSeeAnErrorMessageThatContains(lastServicedDateErrorMessage);
    });

    it("displays errors if the last serviced date is a valid date but before 1980", () => {
      whenIType(validMonth, lastServicedDateMonthFieldSelector);
      whenIType("1979", lastServicedDateYearFieldSelector);
      whenIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(mustBeAfter1980ErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(mustBeAfter1980ErrorMessage);
    });

    it("displays errors if the last serviced date in the future", () => {
      const date = new Date();
      const futureYear = date.getFullYear() + 1;
      whenIType(`${date.getMonth()}`, lastServicedDateMonthFieldSelector);
      whenIType(`${futureYear}`, lastServicedDateYearFieldSelector);
      whenIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(dateInThePastErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(dateInThePastErrorMessage);
    });

    xit("focuses me on the month input field if that is invalid", () => {
      // TODO issue #149 (https://github.com/mcagov/beacons-webapp/issues/149)
      whenIType(invalidMonth, batteryExpiryDateMonthFieldSelector);
      whenIType(validYear, batteryExpiryDateYearFieldSelector);
      whenIClickContinue();
      thenIShouldSeeAnErrorSummaryLinkThatContains(
        lastServicedDateErrorMessage
      );
      thenIShouldSeeAnErrorMessageThatContains(lastServicedDateErrorMessage);

      whenIClickOnTheErrorSummaryLinkContaining(lastServicedDateErrorMessage);
      thenMyFocusMovesTo(batteryExpiryDateMonthFieldSelector);
    });

    xit("focuses me on the year input field if that is invalid", () => {
      // TODO issue #149 (https://github.com/mcagov/beacons-webapp/issues/149)

      whenIType(validMonth, batteryExpiryDateMonthFieldSelector);
      whenIType(invalidYear, batteryExpiryDateYearFieldSelector);
      whenIClickContinue();
      thenIShouldSeeAnErrorSummaryLinkThatContains(
        lastServicedDateErrorMessage
      );
      thenIShouldSeeAnErrorMessageThatContains(lastServicedDateErrorMessage);

      whenIClickOnTheErrorSummaryLinkContaining(lastServicedDateErrorMessage);
      thenMyFocusMovesTo(batteryExpiryDateYearFieldSelector);
    });
  });
});
