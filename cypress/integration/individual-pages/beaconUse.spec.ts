import {
  givenIHaveACookieSetAndIVisit,
  givenIHaveSelected,
  iCanClickTheBackLinkToGoToPreviousPage,
  iCanSeeAPageHeadingThatContains,
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  thenMyFocusMovesTo,
  thenTheUrlShouldContain,
  whenIClickContinue,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenIType,
} from "../common/selectors-and-assertions.spec";

describe("As a beacon owner, I want to submit uses for my beacon", () => {
  const previousPageUrl = "register-a-beacon/beacon-information";
  const pageUrl = "/register-a-beacon/beacon-use";
  const purposeUrl = "/register-a-beacon/purpose";
  const landOrOtherActivityUrl = "/register-a-beacon/land-other-activity";
  const otherCheckboxSelector = "#other";
  const otherInput = "#environmentOtherInput";

  beforeEach(() => {
    givenIHaveACookieSetAndIVisit(pageUrl);
  });

  it("should route to the previous page", () => {
    iCanClickTheBackLinkToGoToPreviousPage(previousPageUrl);
  });

  it("should route to the purpose page if maritime selected with the correct heading text", () => {
    givenIHaveSelected("#maritime");
    whenIClickContinue();

    iCanSeeAPageHeadingThatContains("maritime use");
    thenTheUrlShouldContain(purposeUrl);
  });

  it("should route to the purpose page if aviation selected", () => {
    givenIHaveSelected("#aviation");
    whenIClickContinue();

    iCanSeeAPageHeadingThatContains("aviation use");
    thenTheUrlShouldContain(purposeUrl);
  });

  it("should route to the activity page if land is selected", () => {
    givenIHaveSelected("#land");
    whenIClickContinue();

    thenTheUrlShouldContain(landOrOtherActivityUrl);
  });

  describe("the Other use option", () => {
    it("should route to the land and other activity page if other is selected and a value is provided", () => {
      givenIHaveSelected(otherCheckboxSelector);
      whenIType("In the sea", otherInput);
      whenIClickContinue();

      thenTheUrlShouldContain(landOrOtherActivityUrl);
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
