import {
  andICanClickTheBackLinkToGoToPreviousPage,
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

  beforeEach(() => {
    givenIAmOnTheCheckBeaconDetailsPage();
  });

  it("displays the Check beacon details page", () => {
    iCanSeeTheCheckBeaconDetailsPage();
    andICanClickTheBackLinkToGoToPreviousPage("/");
  });

  it("routes to the next page if there are no errors with the form submission", () => {
    whenIType("Test Manufacturer", "manufacturer");
    whenIType("Test Model", "model");
    whenIType(validUkEncodedHexId, "hexId");

    whenIClickContinue();

    thenTheUrlShouldContain("/register-a-beacon/beacon-information");
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
});

const givenIAmOnTheCheckBeaconDetailsPage = () => {
  cy.visit("/");
  cy.contains("Start now").click();
};

const iCanSeeTheCheckBeaconDetailsPage = () => {
  cy.url().should("include", "/register-a-beacon/check-beacon-details");
  cy.get("h1").contains("Check beacon details");
};
