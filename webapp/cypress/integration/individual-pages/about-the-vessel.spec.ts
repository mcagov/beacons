import {
  givenIHaveACookieSetAndIVisit,
  givenIHaveSignedIn,
  givenIHaveTyped,
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  thenMyFocusMovesTo,
  thenTheUrlShouldContain,
  tooManyCharactersErrorMessage,
  whenIClickContinue,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenIType,
} from "../../common/selectors-and-assertions.spec";

describe("As a beacon owner, I want to submit information about my beacon", () => {
  const thisPageUrl = "/register-a-beacon/about-the-vessel";
  const nextPageUrl = "/register-a-beacon/vessel-communications";

  const maxCapacityFieldSelector = "#maxCapacity";
  const areaOfOperationFieldSelector = "#areaOfOperation";
  const beaconLocationFieldSelector = "#beaconLocation";

  beforeEach(() => {
    givenIHaveSignedIn();
    givenIHaveACookieSetAndIVisit(thisPageUrl);
  });

  it("routes to the next page if there are no errors with the form submission", () => {
    whenIType("42", maxCapacityFieldSelector);
    whenIClickContinue();

    thenTheUrlShouldContain(nextPageUrl);
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
