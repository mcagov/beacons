import { givenIHaveSelected, whenIClickContinue } from "./common.spec";

describe("As a beacon owner, I want to register my communication details so SAR can contact me in an emergency", () => {
  const pageUrl = "/register-a-beacon/vessel-communications";

  beforeEach(() => {
    givenIAmOnTheVesselCommunicationsPage();
  });

  it("requires an MMSI number if the fixed VHF checkbox is selected", () => {
    givenIHaveSelected("#fixedVhfRadio");
    andIHaveLeftTheRelevantTextInputBlank();

    whenIClickContinue();

    thenISeeAnError();
  });

  it("requires an MMSI number if the portable VHF checkbox is selected", () => {
    givenIHaveSelected("#portableVhfRadio");
    andIHaveLeftTheRelevantTextInputBlank();

    whenIClickContinue();

    thenISeeAnError();
  });

  it("requires a phone number if the satellite telephone checkbox is selected", () => {
    givenIHaveSelected("#satelliteTelephone");
    andIHaveLeftTheRelevantTextInputBlank();

    whenIClickContinue();

    thenISeeAnError();
  });

  it("requires a phone number if the mobile telephone checkbox is selected", () => {
    givenIHaveSelected("#mobileTelephone");
    andIHaveLeftTheRelevantTextInputBlank();

    whenIClickContinue();

    thenISeeAnError();
  });

  const givenIAmOnTheVesselCommunicationsPage = () => {
    cy.visit("/"); // Sets cookie
    cy.visit(pageUrl);
  };

  const andIHaveLeftTheRelevantTextInputBlank = () => null;

  const thenISeeAnError = () => {
    expect(cy.get(".govuk-error-summary"));
    expect(cy.get(".govuk-form-group--error"));
  };
});
