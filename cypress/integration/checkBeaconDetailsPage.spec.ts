import {
  requiredFieldErrorMessage,
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  thenMyCursorMovesTo,
  thenTheUrlShouldContain,
  whenIClickContinue,
  whenIClickOnFirstErrorSummaryLinkContainingText,
  whenIType,
} from "./common.spec";

describe("As a beacon owner, I want to enter my initial beacon information", () => {
  const validUkEncodedHexId = "1D0EA08C52FFBFF";

  before(() => {
    givenIAmAt("/register-a-beacon/check-beacon-details");
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce("submissionId");
  });

  it("displays the Check beacon details page", () => {
    iCanSeeTheCheckBeaconDetailsPage();
  });

  it("displays errors with the manufacturer field", () => {
    whenIType("Test Model", "model");
    whenIType(validUkEncodedHexId, "hexId");
    whenIType(" ", "manufacturer");

    whenIClickContinue();
    thenIShouldSeeAnErrorSummaryLinkThatContains(requiredFieldErrorMessage);
    thenIShouldSeeAnErrorMessageThatContains(requiredFieldErrorMessage);

    whenIClickOnFirstErrorSummaryLinkContainingText(requiredFieldErrorMessage);
    thenMyCursorMovesTo("manufacturer");
  });

  it("displays errors with the model field", () => {
    whenIType(" ", "model");
    whenIType(validUkEncodedHexId, "hexId");
    whenIType("Test Manufacturer", "manufacturer");

    whenIClickContinue();
    thenIShouldSeeAnErrorSummaryLinkThatContains(requiredFieldErrorMessage);
    thenIShouldSeeAnErrorMessageThatContains(requiredFieldErrorMessage);

    whenIClickOnFirstErrorSummaryLinkContainingText(requiredFieldErrorMessage);
    thenMyCursorMovesTo("model");
  });

  it("displays errors with the hexId field", () => {
    whenIType("Test Model", "model");
    whenIType("Test Manufacturer", "manufacturer");
    whenIType(" ", "hexId");

    whenIClickContinue();
    thenIShouldSeeAnErrorSummaryLinkThatContains(requiredFieldErrorMessage);
    thenIShouldSeeAnErrorMessageThatContains(requiredFieldErrorMessage);

    whenIClickOnFirstErrorSummaryLinkContainingText(requiredFieldErrorMessage);
    thenMyCursorMovesTo("hexId");
  });

  it("routes to the next page if there are no errors with the form submission", () => {
    whenIType("Test Manufacturer", "manufacturer");
    whenIType("Test Model", "model");
    whenIType(validUkEncodedHexId, "hexId");

    whenIClickContinue();

    thenTheUrlShouldContain("/register-a-beacon/beacon-information");
  });
});

const givenIAmAt = (url) => {
  cy.setCookie("submissionId", "testForm");
  cy.visit(url);
};

const iCanSeeTheCheckBeaconDetailsPage = () => {
  cy.url().should("include", "/register-a-beacon/check-beacon-details");
  cy.get("h1").contains("Check beacon details");
};
