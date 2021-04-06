import { PageURLs } from "../../src/lib/urls";
import {
  andIAmAt,
  andIClickContinue,
  andIHaveSelected,
  givenIHaveACookieSetAndIVisit,
  givenIHaveSelected,
  requiredFieldErrorMessage,
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  thenMyFocusMovesTo,
  thenThereAreNoErrors,
  thenTheUrlShouldContain,
  whenIClickContinue,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenIType,
} from "./common.spec";

describe("As a beacon owner, I want to submit the primary activity for my beacon", () => {
  const thisPageUrl = "/register-a-beacon/activity";
  const previousPageUrl = "/register-a-beacon/purpose";
  const otherActivitySelector = "#other-activity";

  beforeEach(() => {
    givenIHaveACookieSetAndIVisit(PageURLs.environment);
    andIHaveSelected("#maritime");
    andIClickContinue();
    andIHaveSelected("#pleasure");
    andIClickContinue();
    andIAmAt(thisPageUrl);
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

  it("displays an error if 'Other activity' is selected, but no text is provided", () => {
    givenIHaveACookieSetAndIVisit(thisPageUrl);
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

  it("does not show errors if valid input is given to Other activity", () => {
    givenIHaveACookieSetAndIVisit(thisPageUrl);
    givenIHaveSelected(otherActivitySelector);
    whenIType("Surfboard", "#otherActivityText");
    whenIClickContinue();

    thenThereAreNoErrors();
  });

  it("routes to the next page if there are no errors with Other pleasure vessel selected", () => {
    givenIHaveACookieSetAndIVisit(thisPageUrl);
    givenIHaveSelected(otherActivitySelector);
    whenIType("Surfboard", "#otherActivityText");
    whenIClickContinue();

    thenTheUrlShouldContain("/register-a-beacon/about-the-vessel");
  });
});
