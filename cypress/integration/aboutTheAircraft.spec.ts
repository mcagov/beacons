import {
  givenIAmAt,
  givenIHaveTyped,
  iCanClickTheBackLinkToGoToPreviousPage,
  requiredFieldErrorMessage,
  thenIShouldSeeAnErrorMessageThatContains,
  thenMyFocusMovesTo,
  thenTheUrlShouldContain,
  tooManyCharactersErrorMessage,
  whenIClickContinue,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenIType,
} from "./common.spec";

describe("As a beacon owner, I want to submit information about my aircraft", () => {
  const previousPageUrl = "/register-a-beacon/primary-beacon-use";
  const thisPageUrl = "/register-a-beacon/about-the-aircraft";
  const nextPageUrl = "/register-a-beacon/aircraft-communications";

  const aircraftMaxCapacitySelector = "#aircraftMaxCapacity";
  const beaconPositionSelector = "#beaconPosition";

  beforeEach(() => {
    givenIAmAt(thisPageUrl);
  });

  it("should route to the next page if there are no errors with the form submission", () => {
    whenIType("42", aircraftMaxCapacitySelector);
    whenIClickContinue();

    thenTheUrlShouldContain(nextPageUrl);
  });

  it("should route to the previous page", () => {
    iCanClickTheBackLinkToGoToPreviousPage(previousPageUrl);
  });

  describe("maximum capacity field", () => {
    it("displays errors if no maximum aircraft capacity is submitted", () => {
      whenIClickContinue();
      thenIShouldSeeAnErrorMessageThatContains(
        "Maximum number of persons",
        requiredFieldErrorMessage
      );

      whenIClickOnTheErrorSummaryLinkContaining("Maximum number of persons");
      thenMyFocusMovesTo(aircraftMaxCapacitySelector);
    });

    it("displays errors if no the value is not a whole number", () => {
      whenIType("1.3", aircraftMaxCapacitySelector);
      whenIClickContinue();
      thenIShouldSeeAnErrorMessageThatContains(
        "Maximum number of persons",
        "whole number"
      );

      whenIClickOnTheErrorSummaryLinkContaining(
        "Maximum number of persons",
        "whole number"
      );
      thenMyFocusMovesTo(aircraftMaxCapacitySelector);
    });
  });

  describe("the beacon position", () => {
    const tooManyCharactersErrorMessageContains = [
      "Where the beacon",
      tooManyCharactersErrorMessage,
    ];

    it("displays errors if more than 100 characters", () => {
      whenIType("a".repeat(101), beaconPositionSelector);
      whenIClickContinue();

      thenIShouldSeeAnErrorMessageThatContains(
        ...tooManyCharactersErrorMessageContains
      );

      whenIClickOnTheErrorSummaryLinkContaining(
        ...tooManyCharactersErrorMessageContains
      );
      thenMyFocusMovesTo(beaconPositionSelector);
    });

    it("submits if less than 100 characters are submitted", () => {
      const requiredFieldValue = "42";
      givenIHaveTyped(requiredFieldValue, aircraftMaxCapacitySelector);

      whenIType("a".repeat(99), beaconPositionSelector);
      whenIClickContinue();
      thenTheUrlShouldContain(nextPageUrl);
    });
  });
});
