import {
  andIClickContinue,
  givenIHaveACookieSetAndIVisit,
  requiredFieldErrorMessage,
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  thenMyFocusMovesTo,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenIType,
} from "../common/selectors-and-assertions.spec";

describe("As a beacon owner and maritime pleasure vessel user", () => {
  const thisPageUrl = "/register-a-beacon/about-beacon-owner";

  const fullNameInputFieldSelector = "#ownerFullName";
  const emailInputFieldSelector = "#ownerEmail";

  beforeEach(() => {
    givenIHaveACookieSetAndIVisit(thisPageUrl);
  });

  it("requires at least one character in the More details field", () => {
    const expectedErrorMessage = ["Full name", requiredFieldErrorMessage];

    whenIType(" ", fullNameInputFieldSelector);
    andIClickContinue();

    thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
    thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

    whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
    thenMyFocusMovesTo(fullNameInputFieldSelector);
  });

  it("requires the owner's email address to be in the correct format", () => {
    const expectedErrorMessage = ["Email address", "valid"];

    whenIType("not@validemail", emailInputFieldSelector);
    andIClickContinue();

    thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
    thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

    whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
    thenMyFocusMovesTo(emailInputFieldSelector);
  });
});
