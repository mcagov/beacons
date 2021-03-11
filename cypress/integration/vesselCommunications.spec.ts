import { uncheckAllCheckboxes, whenIClickContinue } from "./common.spec";

describe("As a beacon owner, I want to register my communication details so SAR can contact me in an emergency", () => {
  before(() => {
    givenIAmAt("/register-a-beacon/vessel-communications");
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce("submissionId");
    uncheckAllCheckboxes();
  });

  it("requires an MMSI number if the fixed VHF/DSC checkbox is selected", () => {
    givenIHaveSelectedTheFixedVhfRadioOption();
    andIHaveLeftTheRelevantTextInputBlank();
    whenIClickContinue();
    thenISeeAnError();
  });

  it("requires a portable MMSI number if the portable VHF/DSC checkbox is selected", () => {
    givenIHaveSelectedThePortableVhfRadioOption();
    andIHaveLeftTheRelevantTextInputBlank();
    whenIClickContinue();
    thenISeeAnError();
  });

  it("requires a phone number if the satellite telephone checkbox is selected", () => {
    givenIHaveSelectedTheSatelliteTelephoneOption();
    andIHaveLeftTheRelevantTextInputBlank();
    whenIClickContinue();
    thenISeeAnError();
  });

  it("requires a phone number if the mobile telephone checkbox is selected", () => {
    givenIHaveSelectedTheMobileTelephoneOption();
    andIHaveLeftTheRelevantTextInputBlank();
    whenIClickContinue();
    thenISeeAnError();
  });

  const givenIAmAt = (url: string): void => {
    cy.setCookie("submissionId", "testCookie");
    cy.visit(url);
  };

  const givenIHaveSelectedTheFixedVhfRadioOption = () =>
    cy.get("#fixedVhfRadio").click();

  const givenIHaveSelectedThePortableVhfRadioOption = () =>
    cy.get("#portableVhfRadio").click();

  const givenIHaveSelectedTheSatelliteTelephoneOption = () =>
    cy.get("#satelliteTelephone").click();

  const givenIHaveSelectedTheMobileTelephoneOption = () => {
    cy.get("#mobileTelephone").click();
  };

  const andIHaveLeftTheRelevantTextInputBlank = () => null;

  const thenISeeAnError = () => {
    expect(cy.get(".govuk-error-summary"));
    expect(cy.get(".govuk-form-group--error"));
  };
});
