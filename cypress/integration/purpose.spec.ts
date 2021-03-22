import {
  givenIAmAt,
  givenIHaveSelected,
  iCanClickTheBackLinkToGoToPreviousPage,
  requiredFieldErrorMessage,
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  thenTheUrlShouldContain,
  whenIClickContinue,
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

  it("displays an error if no beacon use purpose is selected", () => {
    whenIClickContinue();
    thenIShouldSeeAnErrorMessageThatContains(requiredFieldErrorMessage);
    thenIShouldSeeAnErrorSummaryLinkThatContains(
      "purpose",
      requiredFieldErrorMessage
    );
  });

  xit("routes to the next page if there are no errors with the selected primary beacon use", () => {
    givenIHaveSelected("#pleasure");
    whenIClickContinue();

    thenTheUrlShouldContain("/register-a-beacon/activity");
  });
});
