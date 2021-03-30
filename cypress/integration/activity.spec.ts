import {
  givenIAmAt,
  givenIHaveSelected,
  iCanClickTheBackLinkToGoToPreviousPage,
  iCanSeeAHeadingThatContains,
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
  const otherActivitySelector = "#other-activity";

  beforeEach(() => {
    givenIAmAt(thisPageUrl);
  });

  it("allows me to go back a page by following the 'back' button", () => {
    iCanClickTheBackLinkToGoToPreviousPage(previousPageUrl);
  });

  //TODO: Once caching is in place, this could be more dynamic and not just hardcoded
  it("displays the environment and purpose of my beacon", () => {
    iCanSeeAHeadingThatContains("pleasure maritime");
  });

  it("displays an error if no activity is selected", () => {
    whenIClickContinue();
    thenIShouldSeeAnErrorMessageThatContains(requiredFieldErrorMessage);
    thenIShouldSeeAnErrorSummaryLinkThatContains(
      "Activity",
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

  it("displays an error if 'Other activity' is selected, but no text is provided", () => {
    givenIHaveSelected(otherActivitySelector);
    whenIClickContinue();
    thenIShouldSeeAnErrorMessageThatContains(
      "Other activity",
      requiredFieldErrorMessage
    );
    whenIClickOnTheErrorSummaryLinkContaining(
      "Other activity",
      requiredFieldErrorMessage
    );
    thenMyFocusMovesTo("#otherActivityText");
  });

  it("routes to the next page if there are no errors with Other pleasure vessel selected", () => {
    givenIHaveSelected(otherActivitySelector);
    whenIType("Surfboard", "#otherActivityText");
    whenIClickContinue();

    thenTheUrlShouldContain("/register-a-beacon/about-the-vessel");
  });
});
