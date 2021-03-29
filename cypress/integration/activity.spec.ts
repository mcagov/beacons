import {
  givenIAmAt,
  givenIHaveSelected,
  iCanClickTheBackLinkToGoToPreviousPage,
  requiredFieldErrorMessage,
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  thenMyFocusMovesTo,
  thenTheUrlShouldContain,
  whenIClickContinue,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenIType,
} from "./common.spec";

describe("As a beacon owner, I want to submit the primary activity for my beacon", () => {
  const thisPageUrl = "/register-a-beacon/activity";
  const previousPageUrl = "/register-a-beacon/beacon-information";

  beforeEach(() => {
    givenIAmAt(thisPageUrl);
  });

  it("allows me to go back a page by following the 'back' button", () => {
    iCanClickTheBackLinkToGoToPreviousPage(previousPageUrl);
  });

  it("displays an error if no activity is selected", () => {
    whenIClickContinue();
    thenIShouldSeeAnErrorMessageThatContains(requiredFieldErrorMessage);
    thenIShouldSeeAnErrorSummaryLinkThatContains(
      "Maritime pleasure use",
      requiredFieldErrorMessage
    );
  });

  xit("focuses me on the first radio button if there is an error", () => {
    // TODO issue #148 (https://github.com/mcagov/beacons-webapp/issues/148)
    whenIClickContinue();
    thenIShouldSeeAnErrorMessageThatContains(requiredFieldErrorMessage);
    thenIShouldSeeAnErrorSummaryLinkThatContains(
      "Maritime pleasure use",
      requiredFieldErrorMessage
    );

    whenIClickOnTheErrorSummaryLinkContaining(requiredFieldErrorMessage);
    thenMyFocusMovesTo("#motor-vessel");
  });

  it("routes to the next page if there are no errors with the selected activity", () => {
    givenIHaveSelected("#motor-vessel");
    whenIClickContinue();

    thenTheUrlShouldContain("/register-a-beacon/about-the-vessel");
  });

  it("displays an error if 'Other pleasure vessel' is selected, but no text is provided", () => {
    givenIHaveSelected("#other-pleasure-vessel");
    whenIClickContinue();
    thenIShouldSeeAnErrorMessageThatContains(
      "Other pleasure vessel",
      requiredFieldErrorMessage
    );
    whenIClickOnTheErrorSummaryLinkContaining(
      "Other pleasure vessel",
      requiredFieldErrorMessage
    );
    thenMyFocusMovesTo("#otherPleasureVesselText");
  });

  it("routes to the next page if there are no errors with Other pleasure vessel selected", () => {
    givenIHaveSelected("#other-pleasure-vessel");
    whenIType("Surfboard", "#otherPleasureVesselText");
    whenIClickContinue();

    thenTheUrlShouldContain("/register-a-beacon/about-the-vessel");
  });
});
