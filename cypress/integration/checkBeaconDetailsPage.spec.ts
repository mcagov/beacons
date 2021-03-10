import {
  andICanClickTheBackLinkToGoToPreviousPage,
  requiredFieldErrorMessage,
  thenIShouldSeeAnErrorMessageThatContains,
  thenTheUrlShouldContain,
  whenIClickContinue,
  whenIType,
} from "./common.spec";

describe("As a beacon owner, I want to enter my initial beacon information", () => {
  const validUkEncodedHexId = "1D0EA08C52FFBFF";
  const validOtherCountryEncodedHexId = "C00F429578002C1";
  const invalidHexId = "ABCDEFGHIJKLMNO";
  const mustBe15CharactersLong = "must be 15 characters long";
  const mustUseHexCharacters = "must use numbers 0 to 9 and letters A to F";
  const mustBeUkEncoded = "UK-encoded";

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

  it("displays an error if no manufacturer is submitted", () => {
    whenIType("Test Model", "model");
    whenIType(validUkEncodedHexId, "hexId");
    whenIClickContinue();
    thenIShouldSeeAnErrorMessageThatContains(requiredFieldErrorMessage);
  });

  it("displays an error if no model is submitted", () => {
    whenIType("Test Manufacturer", "manufacturer");
    whenIType(validUkEncodedHexId, "hexId");
    whenIClickContinue();
    thenIShouldSeeAnErrorMessageThatContains(requiredFieldErrorMessage);
  });

  it("displays an error if no hex Id is submitted", () => {
    whenIType("Test Model", "model");
    whenIType("Test Manufacturer", "manufacturer");
    whenIClickContinue();
    thenIShouldSeeAnErrorMessageThatContains(requiredFieldErrorMessage);
  });

  it("displays an error if non-hex characters are submitted for hexId", () => {
    whenIType("Test Model", "model");
    whenIType("Test Manufacturer", "manufacturer");
    whenIType(invalidHexId, "hexId");
    whenIClickContinue();
    thenIShouldSeeAnErrorMessageThatContains(mustUseHexCharacters);
  });

  it("displays an error if a valid but non-UK encoded beacon is submitted for hexId", () => {
    whenIType("Test Model", "model");
    whenIType("Test Manufacturer", "manufacturer");
    whenIType(validOtherCountryEncodedHexId, "hexId");
    whenIClickContinue();
    thenIShouldSeeAnErrorMessageThatContains(mustBeUkEncoded);
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
