import {
  givenIAmAt,
  givenIHaveSelected,
  iCanClickTheBackLinkToGoToPreviousPage,
  iCanSeeAHeadingThatContains,
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  thenMyFocusMovesTo,
  thenTheUrlShouldContain,
  whenIClickContinue,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenIType,
} from "./common.spec";

describe("As a beacon owner, I want to submit uses for my beacon", () => {
  const previousPageUrl = "register-a-beacon/beacon-information";
  const pageUrl = "/register-a-beacon/beacon-use";
  const purposeUrl = "/register-a-beacon/purpose";
  const activityUrl = "/register-a-beacon/activity";
  const otherCheckboxSelector = "#other";
  const otherInput = "#environmentOtherInput";

  beforeEach(() => {
    givenIAmAt(pageUrl);
  });

  it("should route to the previous page", () => {
    iCanClickTheBackLinkToGoToPreviousPage(previousPageUrl);
  });

  it("should route to the purpose page if maritime selected with the correct heading text", () => {
    givenIHaveSelected("#maritime");
    whenIClickContinue();

    iCanSeeAHeadingThatContains("maritime use");
    thenTheUrlShouldContain(purposeUrl);
  });

  it("should route to the purpose page if aviation selected", () => {
    givenIHaveSelected("#aviation");
    whenIClickContinue();

    iCanSeeAHeadingThatContains("aviation use");
    thenTheUrlShouldContain(purposeUrl);
  });

  it("should route to the activity page if land is selected", () => {
    givenIHaveSelected("#land");
    whenIClickContinue();

    thenTheUrlShouldContain(activityUrl);
  });

  describe("the Other use option", () => {
    it("should route to the activity page if other is selected and a value is provided", () => {
      givenIHaveSelected(otherCheckboxSelector);
      whenIType("In the sea", otherInput);
      whenIClickContinue();

      thenTheUrlShouldContain(activityUrl);
    });

    it("should display errors if I have not submitted information for my use", () => {
      const expectedErrorMessage = ["We need", "selected other"];
      givenIHaveSelected(otherCheckboxSelector);
      whenIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);
      whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
      thenMyFocusMovesTo(otherInput);
    });
  });
});
