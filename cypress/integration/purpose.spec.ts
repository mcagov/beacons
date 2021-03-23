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
} from "./common.spec";

describe("As a beacon owner, I want to submit the purpose for my beacon", () => {
  const thisPageUrl = "/register-a-beacon/purpose";
  const previousPageUrl = "/register-a-beacon/envionment";

  beforeEach(() => {
    givenIAmAt(thisPageUrl);
  });

  xit("allows me to go back a page by following the 'back' button", () => {
    iCanClickTheBackLinkToGoToPreviousPage(previousPageUrl);
  });

  xit("displays an error if no beacon use purpose is selected", () => {
    whenIClickContinue();
    thenIShouldSeeAnErrorMessageThatContains(requiredFieldErrorMessage);
    thenIShouldSeeAnErrorSummaryLinkThatContains(
      "purpose",
      requiredFieldErrorMessage
    );

    whenIClickOnTheErrorSummaryLinkContaining(
      "purpose",
      requiredFieldErrorMessage
    );
    thenMyFocusMovesTo("#pleasure");
  });

  xit("routes to the next page if there are no errors with the selected primary beacon use", () => {
    givenIHaveSelected("#pleasure");
    whenIClickContinue();

    thenTheUrlShouldContain("/register-a-beacon/activity");
  });
});
