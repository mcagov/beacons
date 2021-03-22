import {
  andIClickContinue,
  givenIAmAt,
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

describe("As a beacon owner and maritime pleasure vessel user", () => {
  const thisPageUrl = "/register-a-beacon/about-beacon-owner";
  const nextPageUrl = "/register-a-beacon/beacon-owner-address";
  const previousPageUrl = "/register-a-beacon/more-details";

  const fullNameInputFieldSelector = "#beaconOwnerFullName";
  const emailInputFieldSelector = "#beaconOwnerEmail";

  beforeEach(() => {
    givenIAmAt(thisPageUrl);
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

  it("routes to the next page if there are no errors with the form submission", () => {
    whenIType(
      "Admiral Sir Horatio Nelson Royal Navy",
      fullNameInputFieldSelector
    );
    whenIType("nelson@roylanavy.mod.uk", emailInputFieldSelector);

    whenIClickContinue();

    thenTheUrlShouldContain(nextPageUrl);
  });

  it("links to the previous page via a back button", () => {
    iCanClickTheBackLinkToGoToPreviousPage(previousPageUrl);
  });
});
