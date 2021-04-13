import {
  givenIHaveACookieSetAndIVisit,
  givenIHaveTyped,
  requiredFieldErrorMessage,
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  thenMyFocusMovesTo,
  thenTheUrlShouldContain,
  tooManyCharactersErrorMessage,
  whenIClickContinue,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenIType,
} from "../common/selectors-and-assertions.spec";

describe("As a beacon owner, I want to submit information about my beacon", () => {
  const thisPageUrl = "/register-a-beacon/about-the-vessel";
  const nextPageUrl = "/register-a-beacon/vessel-communications";

  const maxCapacityFieldSelector = "#maxCapacity";
  const areaOfOperationFieldSelector = "#areaOfOperation";
  const beaconLocationFieldSelector = "#beaconLocation";

  beforeEach(() => {
    givenIHaveACookieSetAndIVisit(thisPageUrl);
  });

  it("routes to the next page if there are no errors with the form submission", () => {
    whenIType("42", maxCapacityFieldSelector);
    whenIClickContinue();

    thenTheUrlShouldContain(nextPageUrl);
  });

  describe("the Maximum capacity field", () => {
    it("displays errors if no maximum vessel capacity is submitted", () => {
      whenIType(" ", maxCapacityFieldSelector);
      whenIClickContinue();
      thenIShouldSeeAnErrorSummaryLinkThatContains(
        "Maximum number of persons",
        requiredFieldErrorMessage
      );

      thenIShouldSeeAnErrorMessageThatContains(
        "Maximum number of persons",
        requiredFieldErrorMessage
      );

      whenIClickOnTheErrorSummaryLinkContaining(
        "Maximum number of persons",
        requiredFieldErrorMessage
      );
      thenMyFocusMovesTo(maxCapacityFieldSelector);
    });

    it("displays errors if a none-integer value is submitted", () => {
      const mustBeAWholeNumberErrorMessageContains = [
        "Maximum number of persons",
        "whole number",
      ];
      whenIType("1.3", maxCapacityFieldSelector);
      whenIClickContinue();
      thenIShouldSeeAnErrorSummaryLinkThatContains(
        ...mustBeAWholeNumberErrorMessageContains
      );

      thenIShouldSeeAnErrorMessageThatContains(
        ...mustBeAWholeNumberErrorMessageContains
      );

      whenIClickOnTheErrorSummaryLinkContaining(
        ...mustBeAWholeNumberErrorMessageContains
      );
      thenMyFocusMovesTo(maxCapacityFieldSelector);
    });
  });

  describe("the Area of operation field", () => {
    it("displays errors if more than 250 characters are submitted", () => {
      const tooLongErrorMessageContains = [
        "Typical area of operation",
        tooManyCharactersErrorMessage,
      ];
      whenIType("z".repeat(251), areaOfOperationFieldSelector);
      whenIClickContinue();
      thenIShouldSeeAnErrorSummaryLinkThatContains(
        ...tooLongErrorMessageContains
      );

      thenIShouldSeeAnErrorMessageThatContains(...tooLongErrorMessageContains);

      whenIClickOnTheErrorSummaryLinkContaining(...tooLongErrorMessageContains);
      thenMyFocusMovesTo(areaOfOperationFieldSelector);
    });

    it("submits if less than 250 characters are submitted", () => {
      const requiredFieldValue = "42";
      givenIHaveTyped(requiredFieldValue, maxCapacityFieldSelector);

      whenIType("z".repeat(249), areaOfOperationFieldSelector);
      whenIClickContinue();
      thenTheUrlShouldContain(nextPageUrl);
    });
  });

  describe("the Beacon location field", () => {
    it("displays errors if more than 100 characters are submitted", () => {
      const tooLongErrorMessageContains = [
        "Where the beacon is kept",
        tooManyCharactersErrorMessage,
      ];
      whenIType("z".repeat(101), beaconLocationFieldSelector);
      whenIClickContinue();
      thenIShouldSeeAnErrorSummaryLinkThatContains(
        ...tooLongErrorMessageContains
      );

      thenIShouldSeeAnErrorMessageThatContains(...tooLongErrorMessageContains);

      whenIClickOnTheErrorSummaryLinkContaining(...tooLongErrorMessageContains);
      thenMyFocusMovesTo(beaconLocationFieldSelector);
    });

    it("submits if less than 100 characters are submitted", () => {
      const requiredFieldValue = "42";
      givenIHaveTyped(requiredFieldValue, maxCapacityFieldSelector);

      whenIType("z".repeat(99), beaconLocationFieldSelector);
      whenIClickContinue();
      thenTheUrlShouldContain(nextPageUrl);
    });
  });
});
