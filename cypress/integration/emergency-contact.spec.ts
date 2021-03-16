import {
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

describe("As a beacon owner, I want to submit information about my beacon", () => {
  const thisPageUrl = "/register-a-beacon/emergency-contact";
  const previousPageUrl = "/register-a-beacon/beacon-owner-address";
  const nextPageUrl = "/register-a-beacon/check-your-answers";

  const emergencyContact1FullNameSelector = "#emergencyContact1FullName";
  const emergencyContact1TelephoneNumber = "#emergencyContact1TelephoneNumber";

  beforeEach(() => {
    givenIAmAt(thisPageUrl);
  });

  it("displays errors if no Emergency contact 1 full name is submitted", () => {
    const errorMessage = [
      "Emergency contact full name",
      requiredFieldErrorMessage,
    ];

    whenIType(" ", emergencyContact1FullNameSelector);
    whenIClickContinue();
    thenIShouldSeeAnErrorSummaryLinkThatContains(...errorMessage);
    thenIShouldSeeAnErrorMessageThatContains(...errorMessage);

    whenIClickOnTheErrorSummaryLinkContaining(...errorMessage);
    thenMyFocusMovesTo(emergencyContact1FullNameSelector);
  });

  it("displays errors if no Emergency contact 1 phone number is submitted", () => {
    const errorMessage = ["telephone number", requiredFieldErrorMessage];

    whenIType(" ", emergencyContact1TelephoneNumber);
    whenIClickContinue();
    thenIShouldSeeAnErrorSummaryLinkThatContains(...errorMessage);
    thenIShouldSeeAnErrorMessageThatContains(...errorMessage);

    whenIClickOnTheErrorSummaryLinkContaining(...errorMessage);
    thenMyFocusMovesTo(emergencyContact1TelephoneNumber);
  });

  it("displays errors if the Emergency contact 1 phone number is invalid", () => {
    const errorMessage = [
      "Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192",
    ];

    whenIType("01283 7392018232123123", emergencyContact1TelephoneNumber);
    whenIClickContinue();
    thenIShouldSeeAnErrorSummaryLinkThatContains(...errorMessage);
    thenIShouldSeeAnErrorMessageThatContains(...errorMessage);

    whenIClickOnTheErrorSummaryLinkContaining(...errorMessage);
    thenMyFocusMovesTo(emergencyContact1TelephoneNumber);
  });

  it("routes to the next page if there are no errors with the form submission", () => {
    whenIType("Lady Hamilton", emergencyContact1FullNameSelector);
    whenIType("07873 617283", emergencyContact1TelephoneNumber);
    whenIClickContinue();

    thenTheUrlShouldContain(nextPageUrl);
  });

  it("routes to the previous page if the back button is clicked", () => {
    iCanClickTheBackLinkToGoToPreviousPage(previousPageUrl);
  });
});
