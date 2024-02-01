import {
  andIClickContinue,
  givenIHaveACookieSetAndIVisit,
  givenIHaveSignedIn,
  ICanSeeAFieldContaining,
  thenIShouldSeeAnErrorMessageThatContains,
  thenMyFocusMovesTo,
  thenTheUrlShouldContain,
  tooManyCharactersErrorMessage,
  whenIClearAndType,
  whenIClickContinue,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenIType,
} from "../../common/selectors-and-assertions.spec";

describe("As a beacon owner, I want to submit information about my aircraft", () => {
  const thisPageUrl = "/register-a-beacon/about-the-aircraft";
  const nextPageUrl = "/register-a-beacon/aircraft-communications";

  const aircraftMaxCapacitySelector = "#maxCapacity";
  const beaconPositionSelector = "#beaconPosition";

  beforeEach(() => {
    givenIHaveSignedIn();
    givenIHaveACookieSetAndIVisit(thisPageUrl);
  });

  it("should route to the next page if there are no errors with the form submission", () => {
    whenIClearAndType("42", aircraftMaxCapacitySelector);
    whenIClickContinue();

    thenTheUrlShouldContain(nextPageUrl);
  });

  describe("maximum capacity field", () => {
    it("displays 1 in max capacity field by default", () => {
      ICanSeeAFieldContaining(aircraftMaxCapacitySelector, "1");
      andIClickContinue();

      thenTheUrlShouldContain(nextPageUrl);
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
      whenIClearAndType(requiredFieldValue, aircraftMaxCapacitySelector);

      whenIType("a".repeat(99), beaconPositionSelector);
      whenIClickContinue();
      thenTheUrlShouldContain(nextPageUrl);
    });
  });
});
