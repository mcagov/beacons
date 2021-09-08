import {
  andIClickContinue,
  givenIHaveACookieSetAndIVisit,
  givenIHaveSignedIn,
  requiredFieldErrorMessage,
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  thenIShouldSeeFormErrors,
  thenMyFocusMovesTo,
  whenIClickOnTheErrorSummaryLinkContaining,
  whenIType,
} from "../../common/selectors-and-assertions.spec";

describe("As a beacon owner and maritime pleasure vessel user", () => {
  const thisPageUrl = "/register-a-beacon/about-beacon-owner";

  const fullNameInputFieldSelector = "#ownerFullName";
  const emailInputFieldSelector = "#ownerEmail";
  const telephoneNumberInputFieldSelector = "#ownerTelephoneNumber";

  beforeEach(() => {
    givenIHaveSignedIn();
    givenIHaveACookieSetAndIVisit(thisPageUrl);
  });

  it("requires at least one character in the full name field", () => {
    const expectedErrorMessage = ["Full name", requiredFieldErrorMessage];

    whenIType(" ", fullNameInputFieldSelector);
    andIClickContinue();

    thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
    thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

    whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
    thenMyFocusMovesTo(fullNameInputFieldSelector);
  });

  it("displays errors if the telephone number is in an incorrect format", () => {
    const errorMessage = [
      "Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192",
    ];

    whenIType("01283 7392018232123123", telephoneNumberInputFieldSelector);
    andIClickContinue();
    thenIShouldSeeFormErrors(...errorMessage);

    whenIClickOnTheErrorSummaryLinkContaining(...errorMessage);
    thenMyFocusMovesTo(telephoneNumberInputFieldSelector);
  });

  it("requires at least one character in the email address field", () => {
    const expectedErrorMessage = ["Email address", requiredFieldErrorMessage];

    whenIType(" ", emailInputFieldSelector);
    andIClickContinue();

    thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
    thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

    whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
    thenMyFocusMovesTo(emailInputFieldSelector);
  });

  it("requires at least one character in the telephone number field", () => {
    const expectedErrorMessage = [
      "Telephone number",
      requiredFieldErrorMessage,
    ];

    whenIType(" ", telephoneNumberInputFieldSelector);
    andIClickContinue();

    thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
    thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

    whenIClickOnTheErrorSummaryLinkContaining(...expectedErrorMessage);
    thenMyFocusMovesTo(telephoneNumberInputFieldSelector);
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
