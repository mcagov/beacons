import {
  thenIShouldSeeAnErrorMessageThatContains,
  thenIShouldSeeAnErrorSummaryLinkThatContains,
  thenMyFocusMovesTo,
  thenTheUrlShouldContain,
  whenIClickContinue,
  whenIClickOnTheErrorSummaryLinkContainingText,
  whenIType,
} from "./common.spec";

describe("As a beacon owner, I want to enter my initial beacon information", () => {
  const pageUrl = "/register-a-beacon/check-beacon-details";
  const validUkEncodedHexId = "1D0EA08C52FFBFF";

  beforeEach(() => {
    givenIAmAt(pageUrl);
  });

  it("shows me the page title", () => {
    iCanSeeTheCheckBeaconDetailsPage();
  });

  it("errors if I submit just whitespace in the manufacturer field", () => {
    whenIType(" ", "manufacturer");

    whenIClickContinue();
    thenIShouldSeeAnErrorSummaryLinkThatContains("manufacturer", "required");
    thenIShouldSeeAnErrorMessageThatContains("manufacturer", "required");

    whenIClickOnTheErrorSummaryLinkContainingText("manufacturer", "required");
    thenMyFocusMovesTo("manufacturer");
  });

  it("errors if I submit just whitespace in the model field", () => {
    whenIType(" ", "model");

    whenIClickContinue();
    thenIShouldSeeAnErrorSummaryLinkThatContains("model", "required");
    thenIShouldSeeAnErrorMessageThatContains("model", "required");

    whenIClickOnTheErrorSummaryLinkContainingText("model", "required");
    thenMyFocusMovesTo("model");
  });

  describe("the HEX ID field", () => {
    const hexIdField = "hexId";

    it("errors if I submit just whitespace string", () => {
      const expectedErrorMessage = ["HEX ID", "required"];

      whenIType(" ", "hexId");
      whenIClickContinue();

      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

      whenIClickOnTheErrorSummaryLinkContainingText(...expectedErrorMessage);
      thenMyFocusMovesTo(hexIdField);
    });

    it("errors if I submit a non-hexadecimal string", () => {
      const expectedErrorMessage = ["HEX ID", "0 to 9", "A to F"];

      whenIType("0123456789ABCDX", "hexId");

      whenIClickContinue();
      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

      whenIClickOnTheErrorSummaryLinkContainingText(...expectedErrorMessage);
      thenMyFocusMovesTo(hexIdField);
    });

    it("errors if I submit a string not exactly 15 characters long", () => {
      const expectedErrorMessage = ["15 characters"];

      whenIType("0123456789ABCDEF", "hexId");

      whenIClickContinue();
      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

      whenIClickOnTheErrorSummaryLinkContainingText(...expectedErrorMessage);
      thenMyFocusMovesTo(hexIdField);
    });

    it("errors if I submit a valid but non-UK HEX ID", () => {
      const expectedErrorMessage = ["UK-encoded"];

      whenIType("C00F429578002C1", "hexId");

      whenIClickContinue();
      thenIShouldSeeAnErrorSummaryLinkThatContains(...expectedErrorMessage);
      thenIShouldSeeAnErrorMessageThatContains(...expectedErrorMessage);

      whenIClickOnTheErrorSummaryLinkContainingText(...expectedErrorMessage);
      thenMyFocusMovesTo(hexIdField);
    });
  });

  it("routes to the next page if there are no errors with the form submission", () => {
    whenIType("Test Manufacturer", "manufacturer");
    whenIType("Test Model", "model");
    whenIType(validUkEncodedHexId, "hexId");

    whenIClickContinue();

    thenTheUrlShouldContain("/register-a-beacon/beacon-information");
  });
});

const givenIAmAt = (url): void => {
  cy.setCookie("submissionId", "testForm");
  if (cy.url().toString() !== url) cy.visit(url);
};

const iCanSeeTheCheckBeaconDetailsPage = (): void => {
  cy.url().should("include", "/register-a-beacon/check-beacon-details");
  cy.get("h1").contains("Check beacon details");
};
